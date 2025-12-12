

export enum UserRole {
  ADMIN = 'Admin',
  DESIGNER = 'Designer',
  ANALYST = 'Analyst',
  VIEWER = 'Viewer'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  workspaceName: string;
}

export enum AIModelId {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_FLASH_LITE = 'gemini-2.5-flash-lite',
  GEMINI_PRO = 'gemini-3-pro-preview',
  GEMINI_IMAGE = 'gemini-2.5-flash-image', // Nano Banana or 3 Pro Image
  VEO = 'veo-3.1-fast-generate-preview',   // Veo
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

export interface ElementStyle {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  color?: string;
  backgroundColor?: string;
  letterSpacing?: number; // Kerning
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  opacity?: number;
  borderRadius?: number;
  zIndex?: number;
  boxShadow?: string;
}

export interface AnimationSettings {
  type: 'none' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'zoom-in' | 'pop';
  duration: number;
  delay: number;
}

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'chart';
  content: string; // URL for media, Text for text
  x: number;
  y: number;
  w: number;
  h: number;
  style?: ElementStyle;
  animation?: AnimationSettings;
}

export interface SlideTransition {
    type: 'none' | 'fade' | 'slide-left' | 'slide-right' | 'zoom';
    duration: number;
}

export interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  notes?: string;
  theme?: string;
  background?: string;
  transition?: SlideTransition;
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
    type: 'deck_generated' | 'image_generated' | 'video_generated';
    slideCount?: number;
    assetUrl?: string;
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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

export interface Collaborator {
  id: string;
  initials: string;
  name: string;
  role: string;
  isOnline: boolean;
  color: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}
