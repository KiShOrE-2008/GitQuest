import React from 'react';
import { useGame } from '../context/GameContext';
import { Home, Award, Users, User, Terminal } from 'lucide-react';
import { audio } from '../utils/audio';

interface MobileNavBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ currentTab, setTab }) => {
  const { activeWorld } = useGame();
  const isKingdom = activeWorld === 'kingdom';

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'mission', label: 'Missions', icon: Terminal },
    { id: 'achievements', label: 'Lore', icon: Award },
    { id: 'leaderboard', label: 'Rankings', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    audio.playClick();
    setTab(tabId);
  };

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t backdrop-blur-lg flex items-center justify-around px-4 z-50 transition-colors duration-500
      ${isKingdom 
        ? 'bg-amber-950/80 border-amber-500/10' 
        : 'bg-cyan-950/80 border-cyan-500/10'
      }
    `}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className="flex flex-col items-center justify-center flex-grow h-full gap-1 transition-all"
          >
            <div className={`p-1.5 rounded-xl transition-all duration-350
              ${isActive 
                ? isKingdom 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}>
              <Icon size={18} />
            </div>
            <span className={`text-[9px] font-bold tracking-tight
              ${isActive
                ? isKingdom ? 'text-amber-400' : 'text-cyan-400'
                : 'text-slate-500'
              }
            `}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
