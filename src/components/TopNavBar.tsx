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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Quest Arena', icon: Terminal },
    { id: 'shop', label: 'Item Shop', icon: ShoppingBag },
    { id: 'leaderboard', label: 'Leaderboards', icon: Trophy },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  // Calculate XP threshold for next level (100 * level)
  const xpNeeded = userProfile.level * 150;
  const xpPercentage = Math.min(100, Math.floor((userProfile.xp / xpNeeded) * 100));

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-panel border-b border-brand-border backdrop-blur-md px-6 py-3 flex items-center justify-between text-brand-text">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-900/30 text-white">
          G
        </div>
        <div>
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            GitQuest
          </span>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold leading-tight">
            Terminal simulator
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-950/40 p-1 rounded-xl border border-slate-800/80">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile HUD Stats */}
      <div className="flex items-center gap-4">
        {/* Streak HUD */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold">
          <Flame size={16} className="fill-orange-400/25 animate-pulse" />
          <span>{userProfile.streak}d</span>
        </div>

        {/* Coins HUD */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
          <Coins size={16} className="fill-amber-400/25" />
          <span>{userProfile.coins}</span>
        </div>

        {/* Level and XP bar */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="text-xs font-bold flex items-center gap-1.5">
            <span className="text-purple-400">LVL {userProfile.level}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">{userProfile.xp} / {xpNeeded} XP</span>
          </div>
          <div className="w-28 h-1.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
            <div
              style={{ width: `${xpPercentage}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            ></div>
          </div>
        </div>

        {/* User Badge/Avatar */}
        <div className="flex items-center gap-2.5 border-l border-brand-border pl-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-lg border border-purple-500/30">
            {getAvatarEmoji(userProfile.avatar)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-sm font-bold leading-tight">{userProfile.name}</div>
            <div className="text-[10px] text-purple-400 font-semibold">{userProfile.avatar}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
