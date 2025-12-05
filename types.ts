
export enum UserRole {
  ADMIN = 'Admin',
  DESIGNER = 'Designer',
  ANALYST = 'Analyst',
  VIEWER = 'Viewer'
}

export enum AIModelId {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-3-pro-preview',
  CLAUDE_SONNET = 'claude-3-5-sonnet',
  GPT_4O = 'gpt-4o'
}

export interface ModelMetadata {
  id: AIModelId;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI';
  description: string;
  latency: 'Low' | 'Medium' | 'High';
  costPerToken: number; // Normalized scale
}

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'chart' | 'video';
  content: string;
  x: number;
  y: number;
  w: number;
  h: number;
  style?: Record<string, string | number>;
}

export interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  notes?: string;
  theme?: string;
}

export interface Project {
  id: string;
  title: string;
  updatedAt: Date;
  status: 'Draft' | 'Review' | 'Published';
  thumbnailUrl: string;
  slides: Slide[];
  modelPreference: AIModelId;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  modelId?: AIModelId;
  metadata?: {
    type: 'deck_generated';
    slideCount: number;
  };
}

export interface AnalyticsData {
  views: number;
  clicks: number;
  conversions: number;
  avgTimePerSlide: number;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnailColor: string;
  slideCount: number;
}
