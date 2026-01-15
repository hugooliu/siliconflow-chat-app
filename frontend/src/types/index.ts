export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  model: string;
  stream?: boolean;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    id: string;
    choices: Array<{
      message: {
        role: string;
        content: string;
      };
    }>;
  };
  error?: string;
  timestamp: string;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
}
