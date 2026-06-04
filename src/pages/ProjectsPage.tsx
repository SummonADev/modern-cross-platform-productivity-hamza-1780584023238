import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Plus, Trash2, Check } from 'lucide-react';
import clsx from 'clsx';

export default function ProjectsPage() {
  const { state, addProject, toggleMilestone, removeProject } = useGameContext();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🚀');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['']);

  function submit() {
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      emoji,
      description: description.trim(),
      milestones: milestones.filter((m) => m.trim()).map((title) => ({ title: title.trim() })),
    });
    setName(''); setDescription(''); setEmoji('🚀'); setMilestones(['']); setShowForm(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-bark">Epic Quests 🗺️</h1>
          <p className="text-bark-soft">Big dreams broken into gentle milestones.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cozy-btn flex items-center gap-2">
          <Plus size={18} /> {showForm ? 'Close' : 'New project'}
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
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              placeholder="Project name (e.g. Learn watercolor)"
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-cream-deep focus:border-moss outline-none bg-white text-bark"
            />
          </div>
          <textarea
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="What does this dream look like?"
            rows={2}
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-cream-deep focus:border-moss outline-none bg-white text-bark resize-none"
          />
          <div>
            <div className="font-semibold text-bark mb-1">Milestones</div>
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={m}
                  onChange={(e: any) => {
                    const next = [...milestones]; next[i] = e.target.value; setMilestones(next);
                  }}
                  placeholder={`Milestone ${i + 1}`}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-cream-deep bg-white text-bark"
                />
                {milestones.length > 1 && (
                  <button
                    onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))}
                    className="px-3 text-berry hover:bg-cream-deep rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setMilestones([...milestones, ''])} className="text-moss-deep font-semibold text-sm">
              + add milestone
            </button>
          </div>
          <button onClick={submit} className="cozy-btn w-full">Begin this quest 🌟</button>
        </div>
      )}

      {state.projects.length === 0 ? (
        <div className="cozy-card p-10 text-center">
          <div className="text-5xl mb-3">📜</div>
          <p className="text-bark-soft">No epic quests yet. Big or small — every dream starts somewhere.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.projects.map((p) => {
            const total = p.milestones.length;
            const done = p.milestones.filter((m) => m.done).length;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return (
              <div key={p.id} className="cozy-card p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{p.emoji}</span>
                    <div>
                      <h3 className="font-bold text-bark text-lg leading-tight">{p.name}</h3>
                      {p.description && <p className="text-xs text-bark-soft">{p.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => removeProject(p.id)} className="text-bark-soft hover:text-berry">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between text-xs text-bark-soft mb-1">
                  <span>{done} of {total} milestones</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2.5 bg-cream-deep rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-moss to-leaf rounded-full" style={{ width: `${pct}%` }} />
                </div>

                <div className="space-y-1.5">
                  {p.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleMilestone(p.id, m.id)}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl hover:bg-cream-deep transition"
                    >
                      <span className={clsx(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        m.done ? 'bg-moss border-moss text-white' : 'border-bark-soft'
                      )}>
                        {m.done && <Check size={12} />}
                      </span>
                      <span className={clsx('text-sm text-bark', m.done && 'line-through opacity-60')}>{m.title}</span>
                    </button>
                  ))}
                  {p.milestones.length === 0 && <p className="text-xs text-bark-soft">No milestones yet.</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
