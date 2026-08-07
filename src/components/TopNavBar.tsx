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
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  userProfile,
  activeView,
  setActiveView,
  activeTheme,
  setActiveTheme,
}) => {
  const getAvatarEmoji = (avatarName: string) => {
    if (avatarName.includes('King')) return '👑';
    if (avatarName.includes('Queen')) return '👸';
    if (avatarName.includes('Wizard')) return '🧙';
    if (avatarName.includes('Robot')) return '🤖';
    if (avatarName.includes('Astronaut')) return '👨‍🚀';
    if (avatarName.includes('Scientist')) return '👩‍🔬';
    return '💻';
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

  const isKingdom = activeTheme === 'kingdom';

  const handleToggleTheme = () => {
    const nextTheme = isKingdom ? 'space' : 'kingdom';
    setActiveTheme(nextTheme);
    localStorage.setItem('gitquest_theme', nextTheme);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b-4 px-6 py-3 flex flex-wrap items-center justify-between transition-colors duration-300 ${
      isKingdom
        ? 'bg-[#180e05] border-amber-500/80 text-amber-300'
        : 'bg-[#040618] border-cyan-500/80 text-cyan-300'
    }`}>
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
        <div className={`w-9 h-9 border-2 flex items-center justify-center font-arcade text-lg font-bold text-white transition-all ${
          isKingdom
            ? 'border-amber-400 bg-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
            : 'border-cyan-400 bg-cyan-600 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
        }`}>
          GQ
        </div>
        <div className="text-left font-arcade">
          <span className={`text-sm font-bold tracking-widest block transition-colors ${
            isKingdom ? 'text-amber-400 glow-amber-text' : 'text-cyan-400 glow-cyan-text'
          }`}>
            GITVERSE
          </span>
          <span className="text-[7px] text-gray-500 font-semibold uppercase tracking-widest leading-none">
            {isKingdom ? 'Parachronic Realm' : 'Timeline Sector'}
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
                  ? isKingdom
                    ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-950/60 border-slate-800 text-gray-500 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme Swap Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 border-2 text-[9px] font-arcade transition-all hover:scale-[1.03] select-none ${
            isKingdom
              ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.15)]'
              : 'bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.15)]'
          }`}
          title="Switch learning world theme - preserves all progress"
        >
          <span>WORLD:</span>
          <span>{isKingdom ? '🏰 PARCHMENT' : '🚀 COSMOS'}</span>
          <span className="text-[12px]">{isKingdom ? '🏰 ➜ 🚀' : '🚀 ➜ 🏰'}</span>
        </button>

        {/* Profile HUD Stats */}
        <div className="flex items-center gap-3 font-arcade text-[10px]">
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
              <span className={isKingdom ? 'text-amber-400' : 'text-cyan-400'}>STAGE {userProfile.level}</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-400">XP: {userProfile.xp}/{xpNeeded}</span>
            </div>
            <div className="w-24 h-2 bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                style={{ width: `${xpPercentage}%` }}
                className={`h-full transition-all duration-500 ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}`}
              ></div>
            </div>
          </div>

          {/* User Badge/Avatar */}
          <div className="flex items-center gap-2.5 border-l-2 border-slate-800 pl-3">
            <div className={`w-8 h-8 rounded-full bg-slate-950 border-2 flex items-center justify-center text-lg ${
              isKingdom ? 'border-amber-500' : 'border-cyan-500'
            }`}>
              {getAvatarEmoji(userProfile.avatar)}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-[9px] font-bold text-white leading-tight truncate max-w-[80px]">{userProfile.name}</div>
              <div className={`text-[7px] uppercase tracking-widest font-bold ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}`}>
                {userProfile.avatar.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
