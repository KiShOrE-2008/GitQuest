import React from 'react';
import { LayoutDashboard, Terminal, ShoppingBag, Trophy, User, Flame, Coins } from 'lucide-react';

interface TopNavBarProps {
  userProfile: {
    name: string;
    avatar: string;
    coins: number;
    xp: number;
    level: number;
    streak: number;
  };
  activeView: string;
  setActiveView: (view: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ userProfile, activeView, setActiveView }) => {
  const getAvatarEmoji = (avatarName: string) => {
    switch (avatarName) {
      case 'Code Cadet': return '🧑‍💻';
      case 'Rebase Ninja': return '🥷';
      case 'Merge Wizard': return '🧙‍♂️';
      case 'Git Master': return '👑';
      default: return '💻';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'MAP', icon: LayoutDashboard },
    { id: 'simulator', label: 'ARENA', icon: Terminal },
    { id: 'shop', label: 'SHOP', icon: ShoppingBag },
    { id: 'leaderboard', label: 'HI-SCORES', icon: Trophy },
    { id: 'profile', label: 'STATS', icon: User },
  ];

  const xpNeeded = userProfile.level * 150;
  const xpPercentage = Math.min(100, Math.floor((userProfile.xp / xpNeeded) * 100));

  return (
    <header className="sticky top-0 z-50 w-full bg-[#120727] border-b-4 border-pink-500/80 px-6 py-3 flex items-center justify-between text-brand-text">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
        <div className="w-9 h-9 border-2 border-pink-500 bg-pink-600 flex items-center justify-center font-arcade text-lg font-bold text-white shadow-[0_0_8px_rgba(236,72,153,0.4)]">
          GQ
        </div>
        <div className="text-left font-arcade">
          <span className="text-sm font-bold tracking-widest text-pink-400 glow-pink-text block">
            GITQUEST
          </span>
          <span className="text-[7px] text-cyan-400 font-semibold uppercase tracking-widest leading-none">
            STAGE SELECTOR
          </span>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="hidden md:flex items-center gap-1.5">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-2 text-[9px] font-arcade transition-all ${
                isActive
                  ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_8px_rgba(236,72,153,0.3)]'
                  : 'bg-slate-950/60 border-slate-800 text-cyan-600 hover:text-cyan-400 hover:border-slate-700'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile HUD Stats */}
      <div className="flex items-center gap-4 font-arcade text-[10px]">
        {/* Streak HUD */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-orange-500/30 bg-orange-950/20 text-orange-400">
          <Flame size={12} className="fill-orange-400/25" />
          <span>{userProfile.streak}D</span>
        </div>

        {/* Coins (CREDITS) HUD */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-amber-500/30 bg-amber-950/20 text-amber-400">
          <Coins size={12} className="fill-amber-400/25" />
          <span>{userProfile.coins} C</span>
        </div>

        {/* Level (STAGE) & XP (SCORE) HUD */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-pink-400">STAGE {userProfile.level}</span>
            <span className="text-gray-600">|</span>
            <span className="text-cyan-400">SCORE: {userProfile.xp}/{xpNeeded}</span>
          </div>
          <div className="w-24 h-2 bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              style={{ width: `${xpPercentage}%` }}
              className="h-full bg-pink-500 transition-all duration-500"
            ></div>
          </div>
        </div>

        {/* User Badge/Avatar */}
        <div className="flex items-center gap-2.5 border-l-2 border-pink-500/30 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-500/40 flex items-center justify-center text-lg">
            {getAvatarEmoji(userProfile.avatar)}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-[9px] font-bold text-white leading-tight truncate max-w-[80px]">{userProfile.name}</div>
            <div className="text-[7px] text-pink-400 uppercase tracking-widest">{userProfile.avatar.split(' ')[0]}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
