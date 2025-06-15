export enum SenderType {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: string;
  images?: {
    base64Data: string;
    mimeType: string;
    name?: string;
  }[];
  isError?: boolean;
}

export enum AuthView {
  LOGIN = 'login',
  REGISTER = 'register',
  CHAT = 'chat',
}

export enum ActiveView {
  HOME = 'home',
  ABOUT = 'about',
  CHAT_APP = 'chat_app',
  PRICING = 'pricing', // Added PRICING view
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
