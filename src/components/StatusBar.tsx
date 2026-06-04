import { useGameContext } from '@/context/GameContext';
import { Flame, Star } from 'lucide-react';

export default function StatusBar() {
  const { state, levelInfo } = useGameContext();
  const pct = Math.min(100, Math.round((levelInfo.progress / levelInfo.needed) * 100));

  return (
    <div className="cozy-card px-4 py-3 flex flex-wrap items-center gap-3 md:gap-5">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-moss flex items-center justify-center text-white font-bold shadow-md">
          {levelInfo.level}
        </div>
        <div>
          <div className="text-xs text-bark-soft">Hello,</div>
          <div className="font-bold text-bark leading-none">{state.name}</div>
        </div>
      </div>

      <div className="flex-1 min-w-[140px]">
        <div className="flex justify-between text-xs text-bark-soft mb-1">
          <span>Level {levelInfo.level}</span>
          <span>{levelInfo.progress} / {levelInfo.needed} XP</span>
        </div>
        <div className="h-3 bg-cream-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-moss to-leaf rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 cozy-btn-soft">
        <span className="text-lg">🌰</span>
        <span className="font-bold text-bark">{state.coins}</span>
      </div>
      <div className="flex items-center gap-1 cozy-btn-soft">
        <Flame size={16} className="text-sunset" />
        <span className="font-bold text-bark">{state.streak}</span>
      </div>
      <div className="flex items-center gap-1 cozy-btn-soft">
        <Star size={16} className="text-acorn" />
        <span className="font-bold text-bark">{state.xp}</span>
      </div>
    </div>
  );
}
