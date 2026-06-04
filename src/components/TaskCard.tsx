import type { Task } from '@/types';
import { Check, Trash2, Calendar, Sparkles } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatDate(iso?: string): string {
  if (!iso) return 'No deadline';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function finalDeadline(iso?: string, grace?: number): string {
  if (!iso) return '—';
  const d = new Date(iso);
  d.setDate(d.getDate() + (grace ?? 0));
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const questBadge: Record<Task['questType'], { label: string; color: string }> = {
  daily: { label: 'Daily', color: 'bg-leaf text-moss-deep' },
  weekly: { label: 'Weekly', color: 'bg-sky text-bark' },
  epic: { label: 'Epic', color: 'bg-lavender text-bark' },
};

const diffBadge: Record<Task['difficulty'], string> = {
  easy: '🌱',
  medium: '🌳',
  hard: '⛰️',
};

export default function TaskCard({ task, onComplete, onDelete }: Props) {
  return (
    <div className={clsx('cozy-card p-4 transition', task.completed && 'opacity-60')}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(task.id)}
          disabled={task.completed}
          className={clsx(
            'mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition flex-shrink-0',
            task.completed
              ? 'bg-moss border-moss text-white'
              : 'border-bark-soft hover:border-moss hover:bg-leaf'
          )}
        >
          {task.completed && <Check size={18} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase', questBadge[task.questType].color)}>
              {questBadge[task.questType].label}
            </span>
            <span className="text-sm">{diffBadge[task.difficulty]}</span>
          </div>
          <div className={clsx('font-bold text-bark', task.completed && 'line-through')}>
            {task.title}
          </div>
          {task.notes && <div className="text-sm text-bark-soft mt-1">{task.notes}</div>}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-bark-soft">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Target: <strong className="text-bark">{formatDate(task.targetDate)}</strong>
            </span>
            {task.targetDate && (task.graceDays ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Sparkles size={12} />
                Final: <strong className="text-bark">{finalDeadline(task.targetDate, task.graceDays)}</strong>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-bark-soft hover:text-berry p-1"
          aria-label="delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
