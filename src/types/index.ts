export type Mood = 'happy' | 'excited' | 'sleepy' | 'proud' | 'encouraging' | 'neutral';

export type QuestType = 'daily' | 'weekly' | 'epic';

export type CompletionState = 'early' | 'ontime' | 'grace' | 'missed' | 'pending';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  questType: QuestType;
  targetDate?: string; // ISO
  graceDays?: number;
  completed: boolean;
  completedAt?: string;
  projectId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
  milestones: Milestone[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  bestStreak: number;
  lastCheckedDate?: string; // YYYY-MM-DD
  history: string[]; // dates checked
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'productivity' | 'consistency' | 'exploration';
  unlocked: boolean;
  emoji: string;
}

export interface WorldArea {
  id: string;
  name: string;
  emoji: string;
  unlockLevel: number;
  description: string;
}

export interface Avatar {
  bodyType: 'soft' | 'tall' | 'small';
  hairStyle: 'curls' | 'bob' | 'long' | 'short' | 'bun';
  hairColor: string;
  skinTone: string;
  shirtColor: string;
  hat?: string;
  accessory?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  category: 'clothing' | 'accessory' | 'room';
  price: number;
  description: string;
}

export interface GameState {
  name: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate?: string;
  avatar: Avatar;
  ownedItems: string[];
  equippedItems: string[];
  roomItems: string[];
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  achievements: Achievement[];
  totalTasksCompleted: number;
  tasksHistory: { date: string; count: number }[];
}
