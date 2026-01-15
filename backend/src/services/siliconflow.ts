import axios from 'axios';
import logger from '../utils/logger';

const SILICONFLOW_API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.com/v1';
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;

if (!SILICONFLOW_API_KEY) {
  throw new Error('SILICONFLOW_API_KEY is not set in environment variables');
}

export interface SiliconFlowRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  model: string;
  stream?: boolean;
}

export interface SiliconFlowResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class SiliconFlowService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: SILICONFLOW_API_URL,
      headers: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async chatCompletions(request: SiliconFlowRequest): Promise<SiliconFlowResponse> {
    try {
      logger.info('Calling SiliconFlow API', {
        model: request.model,
        messageCount: request.messages.length,
      });

      const response = await this.axiosInstance.post<SiliconFlowResponse>(
        '/chat/completions',
        request
      );

      logger.info('SiliconFlow API response received', {
        id: response.data.id,
        usage: response.data.usage,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        logger.error('SiliconFlow API error', {
          status: error.response?.status,
          message: errorMessage,
        });
        throw new Error(`硅基流动API调用失败: ${errorMessage}`);
      }
      logger.error('Unknown error calling SiliconFlow API', error);
      throw new Error('调用硅基流动API时发生未知错误');
    }
  }

  async getAvailableModels(): Promise<string[]> {
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
}

export default new SiliconFlowService();
