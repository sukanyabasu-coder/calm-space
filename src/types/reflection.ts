export type Emotion = 'anxious' | 'sad' | 'angry' | 'overwhelmed' | 'guilty' | 'calm' | 'other';

export interface Reflection {
  id: string;
  createdAt: string;
  updatedAt: string;
  situation: string;
  thought: string;
  emotions: Emotion[];
  reframe: string;
  action: string;
  completed: boolean;
}

export interface MoodEntry {
  date: string;
  emotions: Emotion[];
  intensity: number; // 1-5
}

export type CBTStep = 'situation' | 'thought' | 'emotion' | 'reframe' | 'action';

export interface CBTFlowState {
  currentStep: CBTStep;
  situation: string;
  thought: string;
  emotions: Emotion[];
  reframe: string;
  action: string;
}
