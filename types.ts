export enum AppState {
  TITLE = 'TITLE',
  STORY = 'STORY',
  QUIZ = 'QUIZ'
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

// A scene where fate decides the outcome with a coin flip
export interface ChanceEvent {
  headsNodeId: string;
  tailsNodeId: string;
  headsText: string; // What happens on heads
  tailsText: string; // What happens on tails
}

export interface StoryNode {
  id: string;
  title: string;
  content: string; // The narrative text
  imagePrompt: string; // Prompt for Gemini
  imagePath?: string; // Path to static image in /public/images/
  choices: Choice[];
  chance?: ChanceEvent;
  hotspots?: Hotspot[];
  isEnd?: boolean;
  badge?: string; // Badge earned for reaching this ending
  historicalNote?: string; // "What really happened" educational note for endings
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface GameProgress {
  endingsFound: string[]; // Story node ids of endings reached
  factsFound: string[]; // Hotspot ids discovered
  bestQuizScore: number;
}

export interface GeneratedImage {
  nodeId: string;
  imageUrl: string;
}
