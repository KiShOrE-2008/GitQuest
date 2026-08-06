import React from 'react';
import { Award, Flame, Coins, ShieldCheck } from 'lucide-react';

interface ProfileViewProps {
  userProfile: {
    name: string;
    avatar: string;
    coins: number;
    xp: number;
    level: number;
    streak: number;
    badges: string[];
  };
}

interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const BADGES: BadgeDef[] = [
  { id: 'first-commit', name: 'First Commit', emoji: '📁', color: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400', description: 'Created your first commit on GitQuest' },
  { id: 'branch-master', name: 'Branch Master', emoji: '🌱', color: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400', description: 'Created parallel development branches' },
  { id: 'merge-wizard', name: 'Merge Wizard', emoji: '🧙‍♂️', color: 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400', description: 'Merged feature branches together' },
  { id: 'conflict-solver', name: 'Conflict Solver', emoji: '⚔️', color: 'bg-pink-950/40 border-pink-500/50 text-pink-400', description: 'Successfully resolved a merge conflict file' },
  { id: 'git-hero', name: 'Git Hero', emoji: '🦸‍♂️', color: 'bg-amber-950/40 border-yellow-500/50 text-yellow-400', description: 'Defeated the VCS Guard and intermediate battles' },
  { id: 'git-guru', name: 'Git Guru', emoji: '🎓', color: 'bg-teal-950/40 border-cyan-500/50 text-teal-400', description: 'Purchased from the Shop or completed advanced world' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile }) => {
  const getAvatarEmoji = (avatarName: string) => {
    switch (avatarName) {
      case 'Code Cadet': return '🧑‍💻';
      case 'Rebase Ninja': return '🥷';
      case 'Merge Wizard': return '🧙‍♂️';
      case 'Git Master': return '👑';
      default: return '💻';
    }
  };

  const xpNeeded = userProfile.level * 150;
  const xpPercentage = Math.min(100, Math.floor((userProfile.xp / xpNeeded) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-brand-text">
      {/* Profile Card Header */}
      <div className="arcade-panel rounded-none p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        {/* Profile Avatar Large */}
        <div className="w-20 h-20 bg-slate-950 border-4 border-cyan-500 flex items-center justify-center text-4xl shadow-xl shrink-0">
          {getAvatarEmoji(userProfile.avatar)}
        </div>

        {/* Profile User Info */}
        <div className="text-center md:text-left flex-grow space-y-3 font-arcade">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-widest">{userProfile.name}</h2>
            <span className="self-center bg-pink-950/40 border border-pink-500 text-pink-400 text-[8px] font-semibold px-3 py-1 uppercase tracking-widest block glow-pink-text">
              {userProfile.avatar.toUpperCase()}
            </span>
          </div>
          <p className="text-cyan-400 font-pixel text-[16px] leading-relaxed normal-case">
            Registered pilot of revision controls. Running terminal diagnostics on workspace repos daily.
          </p>

          {/* Level stats */}
          <div className="flex items-center justify-center md:justify-start gap-4 pt-1 text-[8px]">
            <span className="font-bold text-pink-400">STAGE {userProfile.level}</span>
            <div className="w-40 h-2.5 bg-slate-950 border border-slate-800">
              <div style={{ width: `${xpPercentage}%` }} className="h-full bg-pink-500"></div>
            </div>
            <span className="text-gray-500">SCORE: {userProfile.xp} / {xpNeeded}</span>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-arcade text-[9px]">
        <div className="bg-slate-950 border-2 border-cyan-800 p-4 flex flex-col items-center justify-center text-center">
          <Flame className="text-orange-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.streak} COMBO</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">STREAK</span>
        </div>

        <div className="bg-slate-950 border-2 border-cyan-800 p-4 flex flex-col items-center justify-center text-center">
          <Coins className="text-amber-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.coins} CREDITS</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">BALANCE</span>
        </div>

        <div className="bg-slate-950 border-2 border-cyan-800 p-4 flex flex-col items-center justify-center text-center">
          <Award className="text-purple-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.badges.length} / {BADGES.length}</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">BADGES</span>
        </div>

        <div className="bg-slate-950 border-2 border-cyan-800 p-4 flex flex-col items-center justify-center text-center">
          <ShieldCheck className="text-emerald-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.level * 15}</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">CLEARS</span>
        </div>
      </div>

      {/* Achievement Badges Collection */}
      <div className="space-y-4">
        <div className="font-arcade">
          <h3 className="text-base font-bold text-pink-400 flex items-center gap-2">
            <Award className="text-pink-500" />
            <span>ACHIEVEMENTS RACK</span>
          </h3>
          <p className="text-cyan-400 font-pixel text-[16px] mt-1">
            Complete quest arena stages and purchase badges to unlock game trophies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = userProfile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`border-2 p-5 flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? `${badge.color} border-pink-500`
                    : 'bg-slate-950/20 border-slate-900 opacity-30'
                }`}
              >
                <div className="w-12 h-12 bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  {badge.emoji}
                </div>
                <h4 className="font-arcade text-[10px] text-white mb-2">{badge.name.toUpperCase()}</h4>
                <p className="text-xs text-gray-400 font-pixel text-[15px] leading-normal px-2">
                  {badge.description}
                </p>
                {isUnlocked ? (
                  <span className="text-[7px] font-arcade bg-pink-900/30 text-pink-400 font-extrabold uppercase tracking-widest px-2.5 py-1.5 border border-pink-500/30 mt-4 block glow-pink-text">
                    ★ UNLOCKED
                  </span>
                ) : (
                  <span className="text-[7px] font-arcade bg-slate-950 text-gray-600 font-bold uppercase tracking-widest px-2.5 py-1.5 border border-slate-900 mt-4 block">
                    LOCKED
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
