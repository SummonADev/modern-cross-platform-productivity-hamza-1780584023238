import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameState, Task, Project, Habit, CompletionState, QuestType, Mood } from '@/types';
import { loadState, saveState } from '@/lib/storage';
import { createInitialState, levelFromXp, todayISO, daysBetween, SHOP_ITEMS, WORLD_AREAS } from '@/lib/game';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function computeCompletionState(task: Task, completedAt: string): CompletionState {
  if (!task.targetDate) return 'ontime';
  const grace = task.graceDays ?? 0;
  const diff = daysBetween(completedAt, task.targetDate); // positive if target in future
  if (diff > 1) return 'early';
  if (diff >= 0) return 'ontime';
  if (-diff <= grace) return 'grace';
  return 'missed';
}

function rewardsFor(state: CompletionState, difficulty: Task['difficulty'], questType: QuestType): { xp: number; coins: number } {
  const baseXp = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 35;
  const baseCoins = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 18;
  const typeMul = questType === 'daily' ? 1 : questType === 'weekly' ? 1.3 : 1.8;
  let mul = 1;
  switch (state) {
    case 'early': mul = 1.5; break;
    case 'ontime': mul = 1.0; break;
    case 'grace': mul = 0.6; break;
    case 'missed': mul = 0.25; break;
    default: mul = 1;
  }
  return {
    xp: Math.round(baseXp * mul * typeMul),
    coins: Math.round(baseCoins * mul * typeMul),
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => loadState() ?? createInitialState('Friend'));
  const [toast, setToast] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>('neutral');

  useEffect(() => { saveState(state); }, [state]);

  // Streak management
  useEffect(() => {
    const today = todayISO();
    if (state.lastActiveDate !== today) {
      setState((prev) => {
        if (!prev.lastActiveDate) return { ...prev, lastActiveDate: today };
        const diff = -daysBetween(today, prev.lastActiveDate);
        if (diff === 1) return prev; // same day update happens when tasks complete
        if (diff > 1) return { ...prev, streak: 0, lastActiveDate: today };
        return prev;
      });
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const setMoodTemp = useCallback((m: Mood, ms = 3000) => {
    setMood(m);
    setTimeout(() => setMood('neutral'), ms);
  }, []);

  const levelInfo = useMemo(() => levelFromXp(state.xp), [state.xp]);

  // ---- Tasks ----
  const addTask = useCallback((data: Partial<Task> & { title: string }) => {
    const t: Task = {
      id: uid(),
      title: data.title,
      notes: data.notes,
      questType: data.questType ?? 'daily',
      targetDate: data.targetDate,
      graceDays: data.graceDays ?? 0,
      completed: false,
      projectId: data.projectId,
      difficulty: data.difficulty ?? 'easy',
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, tasks: [t, ...s.tasks] }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task || task.completed) return prev;
      const today = todayISO();
      const completedAt = new Date().toISOString();
      const cstate = computeCompletionState(task, completedAt);
      const rewards = rewardsFor(cstate, task.difficulty, task.questType);

      const newXp = prev.xp + rewards.xp;
      const newCoins = prev.coins + rewards.coins;
      const totalCompleted = prev.totalTasksCompleted + 1;

      // Streak
      let streak = prev.streak;
      if (prev.lastActiveDate !== today) {
        if (prev.lastActiveDate) {
          const diff = -daysBetween(today, prev.lastActiveDate);
          if (diff === 1) streak = prev.streak + 1;
          else if (diff > 1) streak = 1;
          else streak = Math.max(1, prev.streak);
        } else {
          streak = 1;
        }
      } else {
        streak = Math.max(1, prev.streak);
      }

      // History
      const history = [...prev.tasksHistory];
      const idx = history.findIndex((h) => h.date === today);
      if (idx >= 0) history[idx] = { ...history[idx], count: history[idx].count + 1 };
      else history.push({ date: today, count: 1 });

      // Achievements
      const achievements = prev.achievements.map((a) => {
        if (a.unlocked) return a;
        if (a.id === 'first-task' && totalCompleted >= 1) return { ...a, unlocked: true };
        if (a.id === 'ten-tasks' && totalCompleted >= 10) return { ...a, unlocked: true };
        if (a.id === 'hundred-tasks' && totalCompleted >= 100) return { ...a, unlocked: true };
        if (a.id === 'streak-7' && streak >= 7) return { ...a, unlocked: true };
        if (a.id === 'streak-30' && streak >= 30) return { ...a, unlocked: true };
        if (a.id === 'streak-100' && streak >= 100) return { ...a, unlocked: true };
        const newLevel = levelFromXp(newXp).level;
        if (a.id === 'explore-garden' && newLevel >= 2) return { ...a, unlocked: true };
        return a;
      });

      const tasks = prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: true, completedAt } : t));

      const messages: Record<CompletionState, string> = {
        early: `Early bird! +${rewards.xp} XP, +${rewards.coins} 🌰`,
        ontime: `Lovely work! +${rewards.xp} XP, +${rewards.coins} 🌰`,
        grace: `Done! +${rewards.xp} XP, +${rewards.coins} 🌰`,
        missed: `Welcome back. +${rewards.xp} XP, +${rewards.coins} 🌰`,
        pending: '',
      };
      showToast(messages[cstate]);
      setMoodTemp(cstate === 'early' ? 'excited' : cstate === 'missed' ? 'encouraging' : 'happy');

      return {
        ...prev,
        xp: newXp,
        coins: newCoins,
        streak,
        lastActiveDate: today,
        totalTasksCompleted: totalCompleted,
        tasks,
        tasksHistory: history,
        achievements,
      };
    });
  }, [showToast, setMoodTemp]);

  const removeTask = useCallback((taskId: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }));
  }, []);

  // ---- Projects ----
  const addProject = useCallback((p: Omit<Project, 'id' | 'milestones' | 'createdAt'> & { milestones?: { title: string }[] }) => {
    const proj: Project = {
      id: uid(),
      name: p.name,
      emoji: p.emoji,
      description: p.description,
      milestones: (p.milestones ?? []).map((m) => ({ id: uid(), title: m.title, done: false })),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, projects: [proj, ...s.projects] }));
  }, []);

  const toggleMilestone = useCallback((projectId: string, milestoneId: string) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, milestones: p.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m)) }
          : p
      ),
    }));
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setState((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== projectId), tasks: s.tasks.filter((t) => t.projectId !== projectId) }));
  }, []);

  // ---- Habits ----
  const addHabit = useCallback((h: { title: string; emoji: string; frequency: Habit['frequency'] }) => {
    const habit: Habit = {
      id: uid(),
      title: h.title,
      emoji: h.emoji,
      frequency: h.frequency,
      streak: 0,
      bestStreak: 0,
      history: [],
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, habits: [habit, ...s.habits] }));
  }, []);

  const checkHabit = useCallback((habitId: string) => {
    setState((prev) => {
      const today = todayISO();
      const habits = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        if (h.lastCheckedDate === today) return h;
        let streak = h.streak;
        if (h.lastCheckedDate) {
          const diff = -daysBetween(today, h.lastCheckedDate);
          if (diff === 1) streak = h.streak + 1;
          else streak = 1;
        } else {
          streak = 1;
        }
        return {
          ...h,
          streak,
          bestStreak: Math.max(h.bestStreak, streak),
          lastCheckedDate: today,
          history: [...h.history, today],
        };
      });
      showToast(`Habit kept! +8 XP, +4 🌰`);
      setMoodTemp('proud');
      return { ...prev, habits, xp: prev.xp + 8, coins: prev.coins + 4 };
    });
  }, [showToast, setMoodTemp]);

  const removeHabit = useCallback((habitId: string) => {
    setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== habitId) }));
  }, []);

  // ---- Shop ----
  const buyItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    setState((prev) => {
      if (prev.coins < item.price) {
        showToast('Not enough acorns yet — keep growing! 🌰');
        return prev;
      }
      if (prev.ownedItems.includes(itemId)) {
        showToast('You already own this lovely thing.');
        return prev;
      }
      const newOwned = [...prev.ownedItems, itemId];
      const achievements = prev.achievements.map((a) => {
        if (a.id === 'collector' && !a.unlocked && newOwned.length >= 5) return { ...a, unlocked: true };
        return a;
      });
      showToast(`Welcome home, ${item.name}! ${item.emoji}`);
      setMoodTemp('excited');
      return { ...prev, coins: prev.coins - item.price, ownedItems: newOwned, achievements };
    });
  }, [showToast, setMoodTemp]);

  const toggleEquip = useCallback((itemId: string) => {
    setState((prev) => {
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return prev;
      if (item.category === 'room') {
        const inRoom = prev.roomItems.includes(itemId);
        const roomItems = inRoom ? prev.roomItems.filter((i) => i !== itemId) : [...prev.roomItems, itemId];
        const achievements = prev.achievements.map((a) => {
          if (a.id === 'first-decoration' && !a.unlocked && roomItems.length >= 1) return { ...a, unlocked: true };
          return a;
        });
        return { ...prev, roomItems, achievements };
      } else {
        const equipped = prev.equippedItems.includes(itemId);
        return {
          ...prev,
          equippedItems: equipped ? prev.equippedItems.filter((i) => i !== itemId) : [...prev.equippedItems, itemId],
        };
      }
    });
  }, []);

  const updateAvatar = useCallback((patch: Partial<GameState['avatar']>) => {
    setState((s) => ({ ...s, avatar: { ...s.avatar, ...patch } }));
  }, []);

  const setName = useCallback((name: string) => {
    setState((s) => ({ ...s, name }));
  }, []);

  const unlockedAreas = useMemo(() => WORLD_AREAS.filter((a) => a.unlockLevel <= levelInfo.level), [levelInfo.level]);

  return {
    state,
    levelInfo,
    mood,
    toast,
    unlockedAreas,
    addTask,
    completeTask,
    removeTask,
    addProject,
    toggleMilestone,
    removeProject,
    addHabit,
    checkHabit,
    removeHabit,
    buyItem,
    toggleEquip,
    updateAvatar,
    setName,
    showToast,
  };
}

export type UseGameReturn = ReturnType<typeof useGame>;
