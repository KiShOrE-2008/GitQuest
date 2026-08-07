import React from 'react';
import { useGame } from '../context/GameContext';
import { Home, BookOpen, ShieldAlert, Award, Users, User, Settings, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const { activeWorld } = useGame();

  const isKingdom = activeWorld === 'kingdom';

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn Map', icon: BookOpen },
    { id: 'mission', label: 'Missions', icon: ShieldAlert },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setTab(tabId);
  };

  return (
    <aside className={`hidden md:flex w-64 border-r backdrop-blur-xl flex-col justify-between p-6 transition-colors duration-500 min-h-screen
      ${isKingdom 
        ? 'bg-amber-950/20 border-amber-500/10 text-amber-100' 
        : 'bg-cyan-950/20 border-cyan-500/10 text-cyan-100'
      }
    `}>
      <div>
        {/* Brand logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm shadow-md
            ${isKingdom 
              ? 'bg-gradient-to-tr from-amber-500 to-amber-300 shadow-amber-500/10' 
              : 'bg-gradient-to-tr from-cyan-500 to-cyan-300 shadow-cyan-500/10'
            }
          `}>
            GV
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight text-white">GitVerse</span>
            <span className={`text-[10px] uppercase font-bold tracking-wider
              ${isKingdom ? 'text-amber-500/60' : 'text-cyan-500/60'}
            `}>
              {isKingdom ? '🏰 Kingdom Edition' : '🚀 Space Edition'}
            </span>
          </div>
        </div>

        {/* Menu list */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                  ${isActive 
                    ? isKingdom 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-lg shadow-amber-500/5'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                  }
                `}
              >
                <Icon size={18} className={isActive ? (isKingdom ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Switch universe shortcut widget */}
      <div className={`mt-auto rounded-2xl p-4 border backdrop-blur-md transition-all duration-300
        ${isKingdom 
          ? 'bg-amber-500/[0.03] border-amber-500/15 text-amber-200/80 hover:border-amber-500/30' 
          : 'bg-cyan-500/[0.03] border-cyan-500/15 text-cyan-200/80 hover:border-cyan-500/30'
        }
      `}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jump Universe</span>
        </div>
        <p className="text-xs text-slate-400 leading-normal mb-3">
          Progress and levels are preserved. Switch universe below:
        </p>
        <button
          onClick={() => handleTabClick('settings')}
          className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-center border transition-all duration-200
            ${isKingdom
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20'
            }
          `}
        >
          {isKingdom ? 'Enter Space Odyssey' : 'Enter Kingdom Chronicles'}
        </button>
      </div>
    </aside>
  );
};
