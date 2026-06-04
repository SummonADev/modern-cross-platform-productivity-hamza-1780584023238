import type { GameState } from '@/types';

const KEY = 'cozy-quest-state-v1';

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (e: any) {
    console.warn('Failed to load state', e.message);
    return null;
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e: any) {
    console.warn('Failed to save state', e.message);
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}
