import React from 'react';
import { Award, Flame, Coins, ShieldCheck } from 'lucide-react';
import { translateMarkdown, type WorldTheme } from '../utils/themeTranslator';

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
  activeTheme?: string;
}

interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  colorKingdom: string;
  colorSpace: string;
  description: string;
}

const BADGES: BadgeDef[] = [
  { id: 'first-commit', name: 'First Commit', emoji: '📁', colorKingdom: 'bg-amber-950/40 border-amber-500/50 text-amber-400', colorSpace: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400', description: 'Created your first commit on GitQuest' },
  { id: 'branch-master', name: 'Branch Master', emoji: '🌱', colorKingdom: 'bg-amber-950/40 border-amber-500/50 text-amber-400', colorSpace: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400', description: 'Created parallel development branches' },
  { id: 'merge-wizard', name: 'Merge Wizard', emoji: '🧙‍♂️', colorKingdom: 'bg-amber-950/40 border-amber-500/50 text-amber-400', colorSpace: 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400', description: 'Merged feature branches together' },
  { id: 'conflict-solver', name: 'Conflict Solver', emoji: '⚔️', colorKingdom: 'bg-amber-950/40 border-amber-500/50 text-amber-400', colorSpace: 'bg-pink-950/40 border-pink-500/50 text-pink-400', description: 'Successfully resolved a merge conflict file' },
  { id: 'git-hero', name: 'Git Hero', emoji: '🦸‍♂️', colorKingdom: 'bg-amber-950/40 border-amber-500/50 text-amber-400', colorSpace: 'bg-amber-950/40 border-yellow-500/50 text-yellow-400', description: 'Defeated the VCS Guard and intermediate battles' },
  { id: 'git-guru', name: 'Git Guru', emoji: '🎓', colorKingdom: 'bg-amber-950/40 border-amber-500/50 text-amber-400', colorSpace: 'bg-teal-950/40 border-cyan-500/50 text-teal-400', description: 'Purchased from the Shop or completed advanced world' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, activeTheme = 'kingdom' }) => {
  const isKingdom = activeTheme === 'kingdom';
  const world = activeTheme as WorldTheme;

  // Dynamic styling selectors
  const accentText = isKingdom ? 'text-amber-400' : 'text-cyan-400';
  const cardBorder = isKingdom ? 'border-amber-800' : 'border-cyan-800';
  const cardBg = isKingdom ? 'bg-amber-950/10' : 'bg-slate-950';

  const getAvatarEmoji = (avatarName: string) => {
    if (avatarName.includes('King')) return '👑';
    if (avatarName.includes('Queen')) return '👸';
    if (avatarName.includes('Wizard')) return '🧙';
    if (avatarName.includes('Robot')) return '🤖';
    if (avatarName.includes('Astronaut')) return '👨‍🚀';
    if (avatarName.includes('Scientist')) return '👩‍🔬';
    return '💻';
  };

  const xpNeeded = userProfile.level * 150;
  const xpPercentage = Math.min(100, Math.floor((userProfile.xp / xpNeeded) * 100));

  return (
    <div className={`max-w-4xl mx-auto space-y-8 ${isKingdom ? 'text-amber-100' : 'text-cyan-100'}`}>
      
      {/* Profile Card Header */}
      <div className={`arcade-panel rounded-none p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden ${
        isKingdom ? 'border-amber-500' : 'border-pink-500'
      }`}>
        {/* Profile Avatar Large */}
        <div className={`w-20 h-20 bg-slate-950 border-4 flex items-center justify-center text-4xl shadow-xl shrink-0 ${
          isKingdom ? 'border-amber-500' : 'border-cyan-500'
        }`}>
          {getAvatarEmoji(userProfile.avatar)}
        </div>

        {/* Profile User Info */}
        <div className="text-center md:text-left flex-grow space-y-3 font-arcade">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-widest">{userProfile.name}</h2>
            <span className={`self-center bg-slate-950/60 border text-[8px] font-semibold px-3 py-1 uppercase tracking-widest block glow-text ${
              isKingdom ? 'border-amber-500 text-amber-400' : 'border-pink-500 text-pink-400'
            }`}>
              {userProfile.avatar.toUpperCase()}
            </span>
          </div>
          <p className={`${accentText} font-pixel text-[16px] leading-relaxed normal-case`}>
            {isKingdom
              ? 'Honored sentinel of the royal records guild. Chronicle entries cataloged under active reign.'
              : 'Registered technician of spacetime chronometer nodes. Buffering simulation data directories daily.'}
          </p>

          {/* Level stats */}
          <div className="flex items-center justify-center md:justify-start gap-4 pt-1 text-[8px]">
            <span className={`font-bold ${isKingdom ? 'text-amber-400' : 'text-pink-400'}`}>
              STAGE {userProfile.level}
            </span>
            <div className="w-40 h-2.5 bg-slate-950 border border-slate-800">
              <div
                style={{ width: `${xpPercentage}%` }}
                className={`h-full ${isKingdom ? 'bg-amber-500' : 'bg-pink-500'}`}
              ></div>
            </div>
            <span className="text-gray-500">XP: {userProfile.xp} / {xpNeeded}</span>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-arcade text-[9px]">
        <div className={`border-2 p-4 flex flex-col items-center justify-center text-center ${cardBorder} ${cardBg}`}>
          <Flame className="text-orange-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.streak} COMBO</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">STREAK</span>
        </div>

        <div className={`border-2 p-4 flex flex-col items-center justify-center text-center ${cardBorder} ${cardBg}`}>
          <Coins className="text-amber-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.coins} CREDITS</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">BALANCE</span>
        </div>

        <div className={`border-2 p-4 flex flex-col items-center justify-center text-center ${cardBorder} ${cardBg}`}>
          <Award className="text-purple-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.badges.length} / {BADGES.length}</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">BADGES</span>
        </div>

        <div className={`border-2 p-4 flex flex-col items-center justify-center text-center ${cardBorder} ${cardBg}`}>
          <ShieldCheck className="text-emerald-500 w-6 h-6 mb-2" />
          <span className="text-sm font-bold text-white">{userProfile.level * 15}</span>
          <span className="text-gray-500 uppercase tracking-wider mt-1.5 block">CLEARS</span>
        </div>
      </div>

      {/* Achievement Badges Collection */}
      <div className="space-y-4">
        <div className="font-arcade">
          <h3 className={`text-base font-bold flex items-center gap-2 ${isKingdom ? 'text-amber-400' : 'text-pink-400'}`}>
            <Award />
            <span>ACHIEVEMENTS CABINET</span>
          </h3>
          <p className={`${accentText} font-pixel text-[16px] mt-1`}>
            {isKingdom
              ? 'Complete royal chronicles campaigns and acquire badges to showcase achievements.'
              : 'Execute station simulation levels and secure badges to expand your metrics card.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = userProfile.badges.includes(badge.id);
            const badgeColor = isKingdom ? badge.colorKingdom : badge.colorSpace;

            return (
              <div
                key={badge.id}
                className={`border-2 p-5 flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? `${badgeColor} ${isKingdom ? 'border-amber-500' : 'border-pink-500'}`
                    : 'bg-slate-950/20 border-slate-900 opacity-30'
                }`}
              >
                <div className="w-12 h-12 bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  {badge.emoji}
                </div>
                <h4 className="font-arcade text-[9px] text-white mb-2">
                  {translateMarkdown(badge.name, world).toUpperCase()}
                </h4>
                <p className="text-xs text-gray-400 font-pixel text-[15px] leading-normal px-2">
                  {translateMarkdown(badge.description, world)}
                </p>
                {isUnlocked ? (
                  <span className={`text-[6px] font-arcade font-extrabold uppercase tracking-widest px-2.5 py-1.5 border mt-4 block glow-text ${
                    isKingdom ? 'bg-amber-900/30 border-amber-500/30 text-amber-400' : 'bg-pink-900/30 border-pink-500/30 text-pink-400'
                  }`}>
                    ★ UNLOCKED
                  </span>
                ) : (
                  <span className="text-[6px] font-arcade bg-slate-950 text-gray-600 font-bold uppercase tracking-widest px-2.5 py-1.5 border border-slate-900 mt-4 block">
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
