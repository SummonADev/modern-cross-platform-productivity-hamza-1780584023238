import { useState } from 'react';
import type { QuestType, Task } from '@/types';
import { Plus, X } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  onAdd: (data: Partial<Task> & { title: string }) => void;
  projectId?: string;
};

export default function AddTaskForm({ onAdd, projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [questType, setQuestType] = useState<QuestType>('daily');
  const [difficulty, setDifficulty] = useState<Task['difficulty']>('easy');
  const [targetDate, setTargetDate] = useState('');
  const [graceDays, setGraceDays] = useState(0);

  function reset() {
    setTitle(''); setNotes(''); setQuestType('daily'); setDifficulty('easy');
    setTargetDate(''); setGraceDays(0);
  }

  function submit() {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      notes: notes.trim() || undefined,
      questType,
      difficulty,
      targetDate: targetDate || undefined,
      graceDays,
      projectId,
    });
    reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="cozy-btn flex items-center gap-2">
        <Plus size={18} /> Plant a new quest
      </button>
    );
  }

  return (
    <div className="cozy-card p-5 cozy-pop">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-bark text-lg">🌱 New quest</h3>
        <button onClick={() => setOpen(false)} className="text-bark-soft hover:text-bark"><X size={18} /></button>
      </div>
      <input
        type="text"
        placeholder="What would you like to grow?"
        value={title}
        onChange={(e: any) => setTitle(e.target.value)}
        className="w-full px-4 py-2.5 rounded-2xl border-2 border-cream-deep focus:border-moss outline-none bg-white text-bark mb-2"
      />
      <textarea
        placeholder="A gentle note (optional)"
        value={notes}
        onChange={(e: any) => setNotes(e.target.value)}
        rows={2}
        className="w-full px-4 py-2.5 rounded-2xl border-2 border-cream-deep focus:border-moss outline-none bg-white text-bark mb-3 resize-none"
      />

      <div className="mb-3">
        <div className="text-sm font-semibold text-bark mb-1">Quest type</div>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'epic'] as QuestType[]).map((q) => (
            <button
              key={q}
              onClick={() => setQuestType(q)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm font-semibold capitalize',
                questType === q ? 'bg-moss text-white' : 'bg-cream-deep text-bark'
              )}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold text-bark mb-1">Effort</div>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as Task['difficulty'][]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm font-semibold capitalize',
                difficulty === d ? 'bg-sunset text-white' : 'bg-cream-deep text-bark'
              )}
            >
              {d === 'easy' ? '🌱 easy' : d === 'medium' ? '🌳 medium' : '⛰️ hard'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-sm font-semibold text-bark mb-1">Target date</div>
          <input
            type="date"
            value={targetDate}
            onChange={(e: any) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border-2 border-cream-deep bg-white text-bark"
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-bark mb-1">Grace days</div>
          <input
            type="number"
            min={0}
            max={30}
            value={graceDays}
            onChange={(e: any) => setGraceDays(Number(e.target.value) || 0)}
            className="w-full px-4 py-2 rounded-2xl border-2 border-cream-deep bg-white text-bark"
          />
        </div>
      </div>

      <div className="text-xs text-bark-soft mb-3">
        🌿 No pressure — grace days give you a kind buffer. Complete after the target and you'll still earn rewards.
      </div>

      <button onClick={submit} className="cozy-btn w-full">Plant it 🌱</button>
    </div>
  );
}
