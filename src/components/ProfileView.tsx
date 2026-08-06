import React from 'react';
import { Award, Sparkles, Flame, Coins, ShieldCheck } from 'lucide-react';

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
  { id: 'first-commit', name: 'First Commit', emoji: '📁', color: 'from-green-500/20 to-emerald-500/20 border-emerald-500/50 text-emerald-400', description: 'Created your first commit on GitQuest' },
  { id: 'branch-master', name: 'Branch Master', emoji: '🌱', color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/50 text-cyan-400', description: 'Created parallel development branches' },
  { id: 'merge-wizard', name: 'Merge Wizard', emoji: '🧙‍♂️', color: 'from-purple-500/20 to-indigo-500/20 border-indigo-500/50 text-indigo-400', description: 'Merged feature branches together' },
  { id: 'conflict-solver', name: 'Conflict Solver', emoji: '⚔️', color: 'from-red-500/20 to-pink-500/20 border-pink-500/50 text-pink-400', description: 'Successfully resolved a merge conflict file' },
  { id: 'git-hero', name: 'Git Hero', emoji: '🦸‍♂️', color: 'from-amber-500/20 to-yellow-500/20 border-yellow-500/50 text-yellow-400', description: 'Defeated the VCS Guard and intermediate battles' },
  { id: 'git-guru', name: 'Git Guru', emoji: '🎓', color: 'from-teal-500/20 to-cyan-500/20 border-cyan-500/50 text-teal-400', description: 'Purchased from the Shop or completed advanced world' },
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
      <div className="bg-brand-panel border border-brand-border rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Profile Avatar Large */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-5xl shadow-xl border border-white/10 shrink-0">
          {getAvatarEmoji(userProfile.avatar)}
        </div>

        {/* Profile User Info */}
        <div className="text-center md:text-left flex-grow space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-3xl font-extrabold">{userProfile.name}</h2>
            <span className="self-center bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {userProfile.avatar}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            GitQuest explorer tracking repositories since today. Keep pushing commits!
          </p>

          {/* Level stats */}
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <span className="font-bold text-sm text-purple-400">LVL {userProfile.level}</span>
            <div className="w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div style={{ width: `${xpPercentage}%` }} className="h-full bg-purple-500 rounded-full transition-all duration-500"></div>
            </div>
            <span className="text-xs text-gray-500">{userProfile.xp} / {xpNeeded} XP</span>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-brand-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Flame className="text-orange-500 w-8 h-8 mb-1 fill-orange-500/10" />
          <span className="text-2xl font-bold">{userProfile.streak} Days</span>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Daily Streak</span>
        </div>

        <div className="bg-slate-900/40 border border-brand-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Coins className="text-amber-500 w-8 h-8 mb-1 fill-amber-500/10" />
          <span className="text-2xl font-bold">{userProfile.coins}</span>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Total Coins</span>
        </div>

        <div className="bg-slate-900/40 border border-brand-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Award className="text-purple-500 w-8 h-8 mb-1" />
          <span className="text-2xl font-bold">{userProfile.badges.length} / {BADGES.length}</span>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Unlocked Badges</span>
        </div>

        <div className="bg-slate-900/40 border border-brand-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <ShieldCheck className="text-emerald-500 w-8 h-8 mb-1" />
          <span className="text-2xl font-bold">{userProfile.level * 15}</span>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Missions Solved</span>
        </div>
      </div>

      {/* Achievement Badges Collection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Award className="text-purple-500" />
            <span>Achievement Badges</span>
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Complete simulator battles and purchase items to unlock custom achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = userProfile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`border rounded-2xl p-5 flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? `bg-gradient-to-br ${badge.color} shadow-lg shadow-purple-900/5`
                    : 'bg-slate-950/20 border-slate-900/60 opacity-40'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  {badge.emoji}
                </div>
                <h4 className="font-bold text-base mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-400 leading-normal px-2">
                  {badge.description}
                </p>
                {isUnlocked ? (
                  <span className="text-[9px] bg-purple-500/20 text-purple-400 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full mt-3 flex items-center gap-1.5 border border-purple-500/20">
                    <Sparkles size={8} /> Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] bg-slate-800/40 text-gray-500 font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-3 border border-slate-800">
                    Locked
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
