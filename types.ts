
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface EmotionalProfile {
  empathy: number;    // 共情度
  rationality: number;// 理性度
  humor: number;      // 幽默感
  intimacy: number;   // 亲密倾向
  narrative: number;  // 叙事风格
}

export const INITIAL_PROFILE: EmotionalProfile = {
  empathy: 50,
  rationality: 50,
  humor: 30,
  intimacy: 20,
  narrative: 40,
};

export enum ViewMode {
  CHAT = 'CHAT',
  SANDBOX = 'SANDBOX',
}

export interface ScenarioResult {
  prompt: string;
  response: string;
  profileSnapshot: EmotionalProfile;
}

export type Language = 'en' | 'zh';
