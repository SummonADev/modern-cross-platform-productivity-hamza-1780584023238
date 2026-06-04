import type { Achievement, Avatar, GameState, ShopItem, WorldArea } from '@/types';

export const XP_PER_LEVEL = 100;

export function xpForLevel(level: number): number {
  return level * XP_PER_LEVEL;
}

export function levelFromXp(xp: number): { level: number; progress: number; needed: number } {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, progress: remaining, needed: xpForLevel(level) };
}

export const ENCOURAGEMENTS: string[] = [
  'You made progress today. ✨',
  'Every little step counts.',
  'Your future self appreciates this. 🌱',
  'Welcome back. We missed you.',
  'Look how far you have come!',
  'A gentle breeze of progress. 🍃',
  'Tiny wins build big worlds.',
  'You are doing wonderfully.',
];

export function randomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

export const DEFAULT_AVATAR: Avatar = {
  bodyType: 'soft',
  hairStyle: 'curls',
  hairColor: '#8B5A3C',
  skinTone: '#F5D5B5',
  shirtColor: '#7BA585',
};

export const WORLD_AREAS: WorldArea[] = [
  { id: 'cottage', name: 'Starter Cottage', emoji: '🏡', unlockLevel: 1, description: 'Your cozy little home where every journey begins.' },
  { id: 'garden', name: 'Garden', emoji: '🌷', unlockLevel: 2, description: 'A sunny patch where habits bloom into flowers.' },
  { id: 'forest', name: 'Whisper Forest', emoji: '🌲', unlockLevel: 4, description: 'Mossy paths and old friendly trees.' },
  { id: 'beach', name: 'Driftwood Beach', emoji: '🏖️', unlockLevel: 6, description: 'Gentle waves and shell collecting.' },
  { id: 'mountain', name: 'Quiet Peak', emoji: '⛰️', unlockLevel: 9, description: 'Where epic quests reach the clouds.' },
  { id: 'town', name: 'Town Square', emoji: '🏘️', unlockLevel: 12, description: 'Friendly faces and seasonal festivals.' },
  { id: 'observatory', name: 'Observatory', emoji: '🔭', unlockLevel: 16, description: 'Stargaze and reflect on your growth.' },
  { id: 'festival', name: 'Festival Grounds', emoji: '🎪', unlockLevel: 20, description: 'Lanterns, music, and seasonal joy.' },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hat-straw', name: 'Straw Hat', emoji: '👒', category: 'clothing', price: 50, description: 'For sunny garden days.' },
  { id: 'hat-beanie', name: 'Cozy Beanie', emoji: '🧢', category: 'clothing', price: 60, description: 'Warm and snug.' },
  { id: 'scarf', name: 'Wool Scarf', emoji: '🧣', category: 'clothing', price: 75, description: 'Hand-knit comfort.' },
  { id: 'glasses', name: 'Reading Glasses', emoji: '👓', category: 'clothing', price: 40, description: 'For epic quests.' },
  { id: 'crown', name: 'Flower Crown', emoji: '🌸', category: 'clothing', price: 120, description: 'Spring festival exclusive.' },
  { id: 'pet-cat', name: 'Sleepy Cat', emoji: '🐈', category: 'accessory', price: 200, description: 'Naps beside you while you work.' },
  { id: 'pet-fox', name: 'Forest Fox', emoji: '🦊', category: 'accessory', price: 250, description: 'A clever little companion.' },
  { id: 'pet-frog', name: 'Pond Frog', emoji: '🐸', category: 'accessory', price: 150, description: 'Ribbits encouragement.' },
  { id: 'wings', name: 'Paper Wings', emoji: '🦋', category: 'accessory', price: 300, description: 'For reaching big dreams.' },
  { id: 'lute', name: 'Tiny Lute', emoji: '🎻', category: 'accessory', price: 180, description: 'Hum a working tune.' },
  { id: 'plant-1', name: 'Pothos Plant', emoji: '🪴', category: 'room', price: 30, description: 'Easy to care for.' },
  { id: 'plant-2', name: 'Bonsai Tree', emoji: '🎋', category: 'room', price: 90, description: 'Patient and ancient.' },
  { id: 'lamp', name: 'Warm Lamp', emoji: '💡', category: 'room', price: 45, description: 'Soft glow for late evenings.' },
  { id: 'bookshelf', name: 'Bookshelf', emoji: '📚', category: 'room', price: 110, description: 'Holds all your favorite stories.' },
  { id: 'rug', name: 'Patchwork Rug', emoji: '🟫', category: 'room', price: 70, description: 'Soft underfoot.' },
  { id: 'fireplace', name: 'Stone Fireplace', emoji: '🔥', category: 'room', price: 220, description: 'The heart of any cottage.' },
  { id: 'tea', name: 'Tea Set', emoji: '🍵', category: 'room', price: 55, description: 'For thoughtful breaks.' },
  { id: 'window', name: 'Garden Window', emoji: '🪟', category: 'room', price: 130, description: 'A view of your blooming world.' },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: 'First Steps', description: 'Complete your very first task.', category: 'productivity', unlocked: false, emoji: '🌱' },
  { id: 'ten-tasks', title: 'Gentle Momentum', description: 'Complete 10 tasks.', category: 'productivity', unlocked: false, emoji: '🍀' },
  { id: 'hundred-tasks', title: 'Quiet Mastery', description: 'Complete 100 tasks.', category: 'productivity', unlocked: false, emoji: '🌳' },
  { id: 'streak-7', title: '7-Day Glow', description: 'Maintain a 7-day streak.', category: 'consistency', unlocked: false, emoji: '✨' },
  { id: 'streak-30', title: 'Moon Cycle', description: 'Maintain a 30-day streak.', category: 'consistency', unlocked: false, emoji: '🌙' },
  { id: 'streak-100', title: 'Centennial Bloom', description: 'Maintain a 100-day streak.', category: 'consistency', unlocked: false, emoji: '🌺' },
  { id: 'explore-garden', title: 'Garden Unlocked', description: 'Reach the Garden area.', category: 'exploration', unlocked: false, emoji: '🌷' },
  { id: 'first-decoration', title: 'Cozy Touches', description: 'Place your first room decoration.', category: 'exploration', unlocked: false, emoji: '🪴' },
  { id: 'collector', title: 'Little Collector', description: 'Own 5 shop items.', category: 'exploration', unlocked: false, emoji: '🎁' },
];

export function createInitialState(name: string): GameState {
  return {
    name,
    level: 1,
    xp: 0,
    coins: 30,
    streak: 0,
    avatar: { ...DEFAULT_AVATAR },
    ownedItems: [],
    equippedItems: [],
    roomItems: [],
    tasks: [],
    projects: [],
    habits: [],
    achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
    totalTasksCompleted: 0,
    tasksHistory: [],
  };
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}
