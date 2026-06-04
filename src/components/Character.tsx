import type { Avatar, Mood } from '@/types';
import { SHOP_ITEMS } from '@/lib/game';

type CharacterProps = {
  avatar: Avatar;
  equippedIds?: string[];
  mood?: Mood;
  size?: number;
};

export default function Character({ avatar, equippedIds = [], mood = 'neutral', size = 180 }: CharacterProps) {
  const equippedHat = equippedIds.find((id) => {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    return item && (id.startsWith('hat-') || id === 'crown');
  });
  const equippedAccessory = equippedIds.find((id) => {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    return item && item.category === 'accessory';
  });
  const equippedGlasses = equippedIds.includes('glasses');
  const equippedScarf = equippedIds.includes('scarf');

  const hatItem = equippedHat ? SHOP_ITEMS.find((i) => i.id === equippedHat) : null;
  const accessoryItem = equippedAccessory ? SHOP_ITEMS.find((i) => i.id === equippedAccessory) : null;

  // Mood expression — eye/mouth tweaks
  const eyeY = mood === 'sleepy' ? 70 : 65;
  const eyeShape = mood === 'sleepy'
    ? <><line x1="40" y1={eyeY} x2="48" y2={eyeY} stroke="#3a2e22" strokeWidth="3" strokeLinecap="round" /><line x1="72" y1={eyeY} x2="80" y2={eyeY} stroke="#3a2e22" strokeWidth="3" strokeLinecap="round" /></>
    : mood === 'excited' || mood === 'happy'
    ? <><path d={`M 38 ${eyeY+2} Q 44 ${eyeY-4} 50 ${eyeY+2}`} stroke="#3a2e22" strokeWidth="3" fill="none" strokeLinecap="round" /><path d={`M 70 ${eyeY+2} Q 76 ${eyeY-4} 82 ${eyeY+2}`} stroke="#3a2e22" strokeWidth="3" fill="none" strokeLinecap="round" /></>
    : <><circle cx="44" cy={eyeY} r="3.2" fill="#3a2e22" /><circle cx="76" cy={eyeY} r="3.2" fill="#3a2e22" /></>;

  const mouth = mood === 'excited'
    ? <path d="M 50 88 Q 60 100 70 88" stroke="#3a2e22" strokeWidth="3" fill="#E07A8B" strokeLinecap="round" />
    : mood === 'sleepy'
    ? <path d="M 54 88 Q 60 92 66 88" stroke="#3a2e22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    : mood === 'proud' || mood === 'encouraging'
    ? <path d="M 52 86 Q 60 94 68 86" stroke="#3a2e22" strokeWidth="3" fill="none" strokeLinecap="round" />
    : <path d="M 53 87 Q 60 92 67 87" stroke="#3a2e22" strokeWidth="2.8" fill="none" strokeLinecap="round" />;

  // Hair path varies by style
  const hair = (() => {
    switch (avatar.hairStyle) {
      case 'curls':
        return <path d="M 25 55 Q 20 30 50 22 Q 60 18 70 22 Q 100 30 95 55 Q 92 48 85 50 Q 82 42 75 45 Q 70 38 60 40 Q 50 38 45 45 Q 38 42 35 50 Q 28 48 25 55 Z" fill={avatar.hairColor} />;
      case 'bob':
        return <path d="M 22 60 Q 18 28 60 22 Q 102 28 98 60 L 92 58 L 88 50 L 82 46 L 60 42 L 38 46 L 32 50 L 28 58 Z" fill={avatar.hairColor} />;
      case 'long':
        return <><path d="M 22 80 Q 18 28 60 22 Q 102 28 98 80 L 90 75 L 88 55 L 60 45 L 32 55 L 30 75 Z" fill={avatar.hairColor} /></>;
      case 'bun':
        return <><circle cx="60" cy="22" r="12" fill={avatar.hairColor} /><path d="M 28 55 Q 30 35 60 32 Q 90 35 92 55 L 88 50 L 60 45 L 32 50 Z" fill={avatar.hairColor} /></>;
      case 'short':
      default:
        return <path d="M 28 55 Q 25 32 60 26 Q 95 32 92 55 L 88 52 L 60 45 L 32 52 Z" fill={avatar.hairColor} />;
    }
  })();

  const bodyWidth = avatar.bodyType === 'small' ? 50 : avatar.bodyType === 'tall' ? 64 : 58;
  const bodyHeight = avatar.bodyType === 'tall' ? 70 : 58;

  return (
    <div className="cozy-bob inline-block relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 180" width={size} height={size}>
        {/* Body / shirt */}
        <rect
          x={60 - bodyWidth / 2}
          y={110}
          width={bodyWidth}
          height={bodyHeight}
          rx="22"
          fill={avatar.shirtColor}
        />
        {/* Neck */}
        <rect x="54" y="104" width="12" height="10" fill={avatar.skinTone} />
        {/* Head */}
        <circle cx="60" cy="65" r="38" fill={avatar.skinTone} />
        {/* Hair */}
        {hair}
        {/* Cheeks */}
        <circle cx="38" cy="78" r="5" fill="#F5A8B0" opacity="0.5" />
        <circle cx="82" cy="78" r="5" fill="#F5A8B0" opacity="0.5" />
        {/* Eyes */}
        {eyeShape}
        {/* Mouth */}
        {mouth}
        {/* Glasses */}
        {equippedGlasses && (
          <g stroke="#3a2e22" strokeWidth="2.5" fill="none">
            <circle cx="44" cy="68" r="8" />
            <circle cx="76" cy="68" r="8" />
            <line x1="52" y1="68" x2="68" y2="68" />
          </g>
        )}
        {/* Scarf */}
        {equippedScarf && (
          <g>
            <rect x="40" y="100" width="40" height="14" rx="6" fill="#E07A8B" />
            <rect x="68" y="108" width="10" height="22" rx="3" fill="#E07A8B" />
          </g>
        )}
        {/* Arms */}
        <circle cx={60 - bodyWidth / 2} cy="125" r="10" fill={avatar.shirtColor} />
        <circle cx={60 + bodyWidth / 2} cy="125" r="10" fill={avatar.shirtColor} />
      </svg>

      {/* Hat as emoji overlay */}
      {hatItem && (
        <div
          className="absolute text-4xl"
          style={{ top: -6, left: '50%', transform: 'translateX(-50%) rotate(-6deg)' }}
        >
          {hatItem.emoji}
        </div>
      )}

      {/* Accessory pet/companion */}
      {accessoryItem && (
        <div className="absolute text-3xl drift" style={{ bottom: 0, right: -8 }}>
          {accessoryItem.emoji}
        </div>
      )}

      {/* Mood sparkle */}
      {(mood === 'excited' || mood === 'happy' || mood === 'proud') && (
        <>
          <span className="absolute text-xl sparkle" style={{ top: 8, left: -4 }}>✨</span>
          <span className="absolute text-lg sparkle" style={{ top: 30, right: -4, animationDelay: '0.8s' }}>🌟</span>
        </>
      )}
    </div>
  );
}
