import axios from 'axios';
import { ChatRequest, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(
        `${API_BASE_URL}/chat/completions`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || error.message || '请求失败',
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: '未知错误',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getHealth(): Promise<{ status: string }> {
    try {
      const response = await axios.get<{ status: string }>(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      return { status: 'error' };
    }
  },

  async getModels(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${API_BASE_URL}/models`);
      return response.data;
    } catch (error) {
      return [
        'deepseek-ai/DeepSeek-V3',
        'deepseek-ai/DeepSeek-R1',
        'deepseek-ai/DeepSeek-V2.5',
        'Qwen/Qwen2.5-7B-Instruct',
        'Qwen/Qwen2.5-72B-Instruct',
        'meta-llama/Llama-3.1-8B-Instruct',
        'meta-llama/Llama-3.1-70B-Instruct'
      ];
    }
  },
};
