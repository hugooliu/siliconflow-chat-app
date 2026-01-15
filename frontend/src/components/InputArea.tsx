import React, { useState, FormEvent } from 'react';
import { useApp } from '../contexts/AppContext';
import { chatApi } from '../services/api';

export const InputArea: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, addMessage, setLoading, setError, sessionId } = useApp();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const requestMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      requestMessages.push({
        role: 'user',
        content: userMessage.content,
      });

      const response = await chatApi.sendMessage({
        messages: requestMessages,
        model: 'deepseek-ai/DeepSeek-V3',
        stream: false,
      });

      if (response.success && response.data) {
        const assistantMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant' as const,
          content: response.data.choices[0].message.content,
          timestamp: new Date(),
        };
        addMessage(assistantMessage);
      } else {
        setError(response.error || '获取回答失败');
      }
    } catch (error) {
      setError('网络错误,请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您的问题..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {input.length}/2000 字符
      </p>
    </form>
  );
};
