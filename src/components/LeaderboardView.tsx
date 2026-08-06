import React, { useState } from 'react';
import { Trophy, School, Sparkles } from 'lucide-react';

interface LeaderboardViewProps {
  userProfile: {
    name: string;
    avatar: string;
    xp: number;
    level: number;
  };
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarEmoji: string;
  avatarTitle: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
}

const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'LINUS_MASTER', avatarEmoji: '🧙‍♂️', avatarTitle: 'Merge Wizard', xp: 4850, level: 12 },
  { rank: 2, name: 'ALICE_GIT', avatarEmoji: '🥷', avatarTitle: 'Rebase Ninja', xp: 3900, level: 10 },
  { rank: 3, name: 'COMMIT_KING', avatarEmoji: '👑', avatarTitle: 'Git Master', xp: 3250, level: 8 },
  { rank: 4, name: 'DEVOPS_PRO', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 2600, level: 7 },
  { rank: 5, name: 'BRANCH_QUEEN', avatarEmoji: '🥷', avatarTitle: 'Rebase Ninja', xp: 2150, level: 6 },
  { rank: 6, name: 'MERGE_WIZ_99', avatarEmoji: '🧙‍♂️', avatarTitle: 'Merge Wizard', xp: 1800, level: 5 },
];

const COLLEGE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'CAMPUS_CODER', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 2200, level: 6 },
  { rank: 2, name: 'PROF_GIT', avatarEmoji: '👑', avatarTitle: 'Git Master', xp: 1950, level: 5 },
  { rank: 3, name: 'HACK_BEAST', avatarEmoji: '🥷', avatarTitle: 'Rebase Ninja', xp: 1750, level: 5 },
  { rank: 4, name: 'CODE_SLAYER', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 1400, level: 4 },
  { rank: 5, name: 'VCS_NEWBIE', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 850, level: 3 },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'college'>('global');

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'border-amber-500 text-amber-500 bg-amber-950/20';
      case 2: return 'border-slate-400 text-slate-400 bg-slate-900/40';
      case 3: return 'border-amber-700 text-amber-700 bg-amber-950/10';
      default: return 'border-slate-800 text-gray-500 bg-slate-950';
    }
  };

  const getAvatarEmoji = (avatarName: string) => {
    switch (avatarName) {
      case 'Code Cadet': return '🧑‍💻';
      case 'Rebase Ninja': return '🥷';
      case 'Merge Wizard': return '🧙‍♂️';
      case 'Git Master': return '👑';
      default: return '💻';
    }
  };

  const rawLeaderboard = activeTab === 'global' ? GLOBAL_LEADERBOARD : COLLEGE_LEADERBOARD;
  
  const userEntry: LeaderboardEntry = {
    rank: 0,
    name: `${userProfile.name.toUpperCase()} (YOU)`,
    avatarEmoji: getAvatarEmoji(userProfile.avatar),
    avatarTitle: userProfile.avatar,
    xp: userProfile.xp,
    level: userProfile.level,
    isCurrentUser: true,
  };

  const completeLeaderboard = [...rawLeaderboard, userEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-brand-text">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-arcade text-left">
          <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
            <Trophy className="text-pink-500" />
            <span>HI-SCORES HALL OF FAME</span>
          </h2>
          <p className="text-cyan-400 font-pixel text-[16px] mt-1 normal-case">
            Verify who is dominating the local and campus repository rankings.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 border-2 border-slate-900 self-start font-arcade text-[8px]">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
              activeTab === 'global'
                ? 'bg-pink-600 border-pink-400 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <Sparkles size={10} />
            <span>GLOBAL</span>
          </button>
          <button
            onClick={() => setActiveTab('college')}
            className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
              activeTab === 'college'
                ? 'bg-pink-600 border-pink-400 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <School size={10} />
            <span>CAMPUS</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="arcade-panel rounded-none overflow-hidden shadow-2xl">
        <div className="p-4 border-b-2 border-pink-500/20 bg-slate-950/40 flex items-center justify-between font-arcade text-[10px]">
          <span className="font-bold text-cyan-400">HI-SCORE LADDER</span>
          <span className="text-[7px] text-pink-500 uppercase tracking-widest font-extrabold arcade-blink">
            LIVE SYNCING
          </span>
        </div>

        <div className="divide-y-2 divide-pink-500/10 font-arcade text-[10px]">
          {completeLeaderboard.map((player) => (
            <div
              key={player.name}
              className={`flex items-center justify-between p-4 px-6 transition-all ${
                player.isCurrentUser
                  ? 'bg-pink-950/20 border-l-4 border-l-pink-500'
                  : 'hover:bg-slate-900/10'
              }`}
            >
              {/* Left Rank & User details */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-7 h-7 border-2 flex items-center justify-center font-bold text-[9px] leading-none ${getRankBadgeColor(
                    player.rank
                  )}`}
                >
                  {player.rank}
                </div>

                <div className="w-9 h-9 bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                  {player.avatarEmoji}
                </div>

                <div className="text-left">
                  <div className="font-bold flex items-center gap-2 text-xs md:text-sm text-white">
                    <span>{player.name}</span>
                    {player.isCurrentUser && (
                      <span className="text-[6px] bg-pink-950/40 border border-pink-500 text-pink-400 px-1.5 py-0.5 rounded-none font-bold tracking-wider">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[8px] text-cyan-700 tracking-wider uppercase mt-0.5">{player.avatarTitle}</div>
                </div>
              </div>

              {/* Right Level & XP details */}
              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wider block">
                    STAGE
                  </span>
                  <span className="font-bold text-pink-400">{player.level}</span>
                </div>
                <div className="text-right">
                  <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wider block">
                    SCORE
                  </span>
                  <span className="font-extrabold text-cyan-400">
                    {player.xp} <span className="text-[8px] font-bold text-pink-500">PTS</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
