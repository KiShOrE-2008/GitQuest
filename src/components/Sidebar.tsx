import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Home, BookOpen, ShieldAlert, Award, Users, User, Settings, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const { activeWorld, setWorld } = useGame();
  const [isHovered, setIsHovered] = useState(false);

  const isKingdom = activeWorld === 'kingdom';

  const handleToggleUniverse = () => {
    setWorld(isKingdom ? 'space' : 'kingdom');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn Map', icon: BookOpen },
    { id: 'mission', label: 'Missions', icon: ShieldAlert },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="hidden md:block w-20 flex-shrink-0 relative z-30 min-h-screen"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <aside 
        className={`fixed top-0 left-0 bottom-0 flex flex-col justify-between p-4 transition-all duration-500 ease-out min-h-screen border-r overflow-hidden z-40
          backdrop-blur-2xl bg-slate-950/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
          ${isHovered ? 'w-64 border-white/20' : 'w-20 border-white/10'}
          ${isKingdom 
            ? isHovered 
              ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/40 via-slate-950/70 to-slate-950/90 shadow-[0_0_40px_rgba(245,158,11,0.2)]' 
              : '' 
            : isHovered 
              ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 via-slate-950/70 to-slate-950/90 shadow-[0_0_40px_rgba(6,182,212,0.2)]' 
              : ''
          }
        `}
      >
        {/* Top ambient glass spotlight reflect */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-all duration-500
          ${isHovered ? 'opacity-40 scale-125' : 'opacity-15 scale-100'}
          ${isKingdom ? 'bg-amber-400' : 'bg-cyan-400'}
        `} />

        <div className="relative z-10">
          {/* Brand logo */}
          <div className="flex items-center gap-3.5 mb-8 h-10 px-1">
            <div className={`w-10 h-10 min-w-[2.5rem] rounded-xl flex items-center justify-center font-black text-slate-950 text-sm shadow-xl transition-all duration-300 ring-1 ring-white/30 group-hover:scale-105
              ${isKingdom 
                ? 'bg-gradient-to-tr from-amber-500 to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                : 'bg-gradient-to-tr from-cyan-500 to-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }
            `}>
              GV
            </div>
            <div className={`flex flex-col whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
              <span className="font-extrabold text-lg leading-tight tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">GitVerse</span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isKingdom ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'}`}>
                {isKingdom ? '🏰 Kingdom Edition' : '🚀 Space Edition'}
              </span>
            </div>
          </div>

          {/* Menu list */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative backdrop-blur-md
                    ${isActive 
                      ? isKingdom 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                      : isKingdom
                        ? 'text-slate-400 border border-transparent hover:text-amber-200 hover:bg-amber-500/10 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'text-slate-400 border border-transparent hover:text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`min-w-[20px] transition-all duration-300 group-hover:scale-115 
                      ${isActive 
                        ? (isKingdom ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]') 
                        : (isKingdom ? 'text-slate-400 group-hover:text-amber-300 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-slate-400 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]')
                      }
                    `} 
                  />
                  
                  <span className={`whitespace-nowrap transition-all duration-300 font-medium ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                    {item.label}
                  </span>

                  {/* Frosted Glowing Tooltip on hover when collapsed */}
                  {!isHovered && (
                    <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-2xl text-xs font-semibold border shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50
                      ${isKingdom 
                        ? 'text-amber-200 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                        : 'text-cyan-200 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      }
                    `}>
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Switch universe shortcut widget */}
        <div className={`relative z-10 rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-lg group/widget
          ${isHovered ? 'p-4' : 'p-2.5 flex justify-center'}
          ${isKingdom 
            ? 'bg-gradient-to-b from-amber-500/10 to-amber-950/20 border-amber-500/30 text-amber-200/90 hover:border-amber-500/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]' 
            : 'bg-gradient-to-b from-cyan-500/10 to-cyan-950/20 border-cyan-500/30 text-cyan-200/90 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]'
          }
        `}>
          {isHovered ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className={`${isKingdom ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">Jump Universe</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Progress and levels are preserved. Switch universe below:
              </p>
              <button
                onClick={handleToggleUniverse}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center border backdrop-blur-md transition-all duration-300 shadow-md
                  ${isKingdom
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/35 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/35 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  }
                `}
              >
                {isKingdom ? 'Enter Space Odyssey' : 'Enter Kingdom Chronicles'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleToggleUniverse}
              title={`Switch to ${isKingdom ? 'Space Odyssey' : 'Kingdom Chronicles'}`}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300
                ${isKingdom
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                }
              `}
            >
              <Sparkles size={18} className="animate-pulse" />
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
