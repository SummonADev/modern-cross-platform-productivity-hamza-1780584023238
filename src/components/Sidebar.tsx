import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Home, ListChecks, FolderHeart, Sparkles, Trees, ShoppingBag, Award, BarChart3, UserCircle2 } from 'lucide-react';

type NavItem = { to: string; label: string; icon: any };

const items: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/quests', label: 'Quests', icon: ListChecks },
  { to: '/projects', label: 'Projects', icon: FolderHeart },
  { to: '/habits', label: 'Habits', icon: Sparkles },
  { to: '/world', label: 'World', icon: Trees },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/character', label: 'Character', icon: UserCircle2 },
];

export default function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 p-5 gap-2 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-3 mb-4">
          <span className="text-3xl">🌱</span>
          <div>
            <div className="font-bold text-lg text-bark leading-none">Cozy Quest</div>
            <div className="text-xs text-bark-soft">gentle productivity</div>
          </div>
        </div>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold transition',
                isActive
                  ? 'bg-moss text-white shadow-md'
                  : 'text-bark hover:bg-cream-deep'
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className="mt-auto text-xs text-bark-soft px-3 text-center">
          made with 🌿 for cozy days
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t-2 border-cream-deep">
        <div className="flex justify-around items-center py-2 overflow-x-auto">
          {items.slice(0, 6).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center px-2 py-1 rounded-xl min-w-[58px]',
                  isActive ? 'text-moss-deep' : 'text-bark-soft'
                )
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold mt-0.5">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
