import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import TaskCard from '@/components/TaskCard';
import AddTaskForm from '@/components/AddTaskForm';
import clsx from 'clsx';
import type { QuestType } from '@/types';

type Filter = 'all' | QuestType | 'done';

export default function QuestsPage() {
  const { state, addTask, completeTask, removeTask } = useGameContext();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = state.tasks.filter((t) => {
    if (filter === 'all') return !t.completed;
    if (filter === 'done') return t.completed;
    return t.questType === filter && !t.completed;
  });

  const filters: { id: Filter; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '🌿' },
    { id: 'daily', label: 'Daily', emoji: '🌱' },
    { id: 'weekly', label: 'Weekly', emoji: '🌳' },
    { id: 'epic', label: 'Epic', emoji: '⛰️' },
    { id: 'done', label: 'Bloomed', emoji: '🌸' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-bark">Your Quests 🗺️</h1>
          <p className="text-bark-soft">Each one is a tiny step worth celebrating.</p>
        </div>
        <AddTaskForm onAdd={addTask} />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-semibold transition',
              filter === f.id ? 'bg-moss text-white shadow-md' : 'bg-white text-bark border-2 border-cream-deep'
            )}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="cozy-card p-10 text-center">
          <div className="text-5xl mb-3">🌾</div>
          <p className="text-bark-soft">Nothing here yet. That's perfectly okay.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} onComplete={completeTask} onDelete={removeTask} />
          ))}
        </div>
      )}
    </div>
  );
}
