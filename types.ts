export enum AppState {
  LOADING = 'LOADING',
  STORY = 'STORY',
  QUIZ = 'QUIZ',
  VICTORY = 'VICTORY'
}

export interface Hotspot {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  description: string;
}

export interface Choice {
  text: string;
  nextNodeId: string;
}

export interface StoryNode {
  id: string;
  title: string;
  content: string; // The narrative text
  imagePrompt: string; // Prompt for Gemini
  imagePath?: string; // Path to static image in /public/images/
  choices: Choice[];
  hotspots?: Hotspot[];
  isEnd?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface GeneratedImage {
  nodeId: string;
  imageUrl: string;
}