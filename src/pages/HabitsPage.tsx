import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Plus, Trash2, Flame, X } from 'lucide-react';
import clsx from 'clsx';
import { todayISO } from '@/lib/game';
import type { Habit } from '@/types';

export default function HabitsPage() {
  const { state, addHabit, checkHabit, removeHabit } = useGameContext();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🌿');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');

  function submit() {
    if (!title.trim()) return;
    addHabit({ title: title.trim(), emoji, frequency });
    setTitle(''); setEmoji('🌿'); setFrequency('daily'); setShowForm(false);
  }

  const today = todayISO();

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-bark">Daily Rituals 🌿</h1>
          <p className="text-bark-soft">Small consistent acts grow into great forests.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cozy-btn flex items-center gap-2">
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Close' : 'New habit'}
        </button>
      </div>

      {showForm && (
        <div className="cozy-card p-5 cozy-pop space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={emoji}
              onChange={(e: any) => setEmoji(e.target.value)}
              className="w-16 text-3xl text-center rounded-2xl border-2 border-cream-deep bg-white"
            />
            <input
              type="text"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              placeholder="e.g. Drink water, Read 10 pages"
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-cream-deep focus:border-moss outline-none bg-white text-bark"
            />
          </div>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as Habit['frequency'][]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-sm font-semibold capitalize',
                  frequency === f ? 'bg-moss text-white' : 'bg-cream-deep text-bark'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={submit} className="cozy-btn w-full">Plant this ritual 🌱</button>
        </div>
      )}

      {state.habits.length === 0 ? (
        <div className="cozy-card p-10 text-center">
          <div className="text-5xl mb-3">🍃</div>
          <p className="text-bark-soft">No rituals yet. Tiny daily things lead to the biggest changes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.habits.map((h) => {
            const doneToday = h.lastCheckedDate === today;
            return (
              <div key={h.id} className={clsx('cozy-card p-4 flex items-center gap-4', doneToday && 'bg-leaf/30')}>
                <button
                  onClick={() => checkHabit(h.id)}
                  disabled={doneToday}
                  className={clsx(
                    'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition shadow',
                    doneToday ? 'bg-moss text-white' : 'bg-cream-deep hover:bg-leaf hover:scale-105'
                  )}
                >
                  {doneToday ? '✓' : h.emoji}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-bark">{h.title}</div>
                  <div className="text-xs text-bark-soft capitalize">{h.frequency} ritual</div>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-sunset font-bold">
                      <Flame size={14} /> {h.streak}
                    </span>
                    <span className="text-bark-soft text-xs">best: {h.bestStreak}</span>
                  </div>
                </div>
                <button onClick={() => removeHabit(h.id)} className="text-bark-soft hover:text-berry">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
