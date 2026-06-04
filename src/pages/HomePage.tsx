import { useMemo } from 'react';
import { useGameContext } from '@/context/GameContext';
import Character from '@/components/Character';
import TaskCard from '@/components/TaskCard';
import { randomEncouragement, WORLD_AREAS } from '@/lib/game';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { state, mood, levelInfo, completeTask, removeTask } = useGameContext();

  const message = useMemo(() => randomEncouragement(), [state.totalTasksCompleted]);
  const todaysTasks = state.tasks.filter((t) => !t.completed).slice(0, 4);
  const nextArea = WORLD_AREAS.find((a) => a.unlockLevel > levelInfo.level);
  const hour = new Date().getHours();
  const greeting = hour < 6 ? 'Quiet night' : hour < 12 ? 'Good morning' : hour < 18 ? 'Lovely afternoon' : 'Cozy evening';

  return (
    <div className="space-y-6">
      <section className="cozy-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-3xl drift opacity-60">☁️</div>
        <div className="absolute bottom-4 left-4 text-2xl">🌸</div>

        <Character avatar={state.avatar} equippedIds={state.equippedItems} mood={mood} size={200} />
        <div className="flex-1 text-center md:text-left">
          <div className="text-bark-soft text-sm uppercase tracking-wide">{greeting}, {state.name}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-bark mt-1 mb-2">{message}</h1>
          <p className="text-bark-soft">
            You've grown {state.totalTasksCompleted} {state.totalTasksCompleted === 1 ? 'sprout' : 'sprouts'} so far.
            {state.streak > 0 && ` Your streak is glowing at ${state.streak} ${state.streak === 1 ? 'day' : 'days'} 🔥`}
          </p>
          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <Link to="/quests" className="cozy-btn flex items-center gap-2">Today's Quests <ArrowRight size={16} /></Link>
            <Link to="/world" className="cozy-btn-soft">Visit your world</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-bark">🌿 Gentle quests for today</h2>
          <Link to="/quests" className="text-moss-deep font-semibold text-sm hover:underline">See all →</Link>
        </div>
        {todaysTasks.length === 0 ? (
          <div className="cozy-card p-6 text-center text-bark-soft">
            <div className="text-4xl mb-2">🍵</div>
            All quiet here. Plant a new quest when you're ready — no rush.
          </div>
        ) : (
          <div className="space-y-3">
            {todaysTasks.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={completeTask} onDelete={removeTask} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="cozy-card p-5">
          <div className="text-bark-soft text-sm uppercase tracking-wide">Next horizon</div>
          <h3 className="text-xl font-bold text-bark mt-1">
            {nextArea ? `${nextArea.emoji} ${nextArea.name}` : '🌟 You\'ve seen it all!'}
          </h3>
          <p className="text-bark-soft text-sm mt-1">
            {nextArea ? `Unlocks at level ${nextArea.unlockLevel}. ${nextArea.description}` : 'Every area of your world has bloomed.'}
          </p>
        </div>
        <div className="cozy-card p-5">
          <div className="text-bark-soft text-sm uppercase tracking-wide">Your habits</div>
          <h3 className="text-xl font-bold text-bark mt-1">
            {state.habits.length === 0 ? 'No habits yet 🌱' : `${state.habits.length} growing daily`}
          </h3>
          <p className="text-bark-soft text-sm mt-1">
            <Link to="/habits" className="text-moss-deep font-semibold hover:underline">
              {state.habits.length === 0 ? 'Plant your first one' : 'Tend to your habits'} →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
