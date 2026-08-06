import React, { useState } from 'react';
import { Trophy, School, Sparkles, UserCheck } from 'lucide-react';

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
  { rank: 1, name: 'LinusMaster', avatarEmoji: '🧙‍♂️', avatarTitle: 'Merge Wizard', xp: 4850, level: 12 },
  { rank: 2, name: 'Alice_git', avatarEmoji: '🥷', avatarTitle: 'Rebase Ninja', xp: 3900, level: 10 },
  { rank: 3, name: 'CommitKing', avatarEmoji: '👑', avatarTitle: 'Git Master', xp: 3250, level: 8 },
  { rank: 4, name: 'DevOps_Pro', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 2600, level: 7 },
  { rank: 5, name: 'Branching_Queen', avatarEmoji: '🥷', avatarTitle: 'Rebase Ninja', xp: 2150, level: 6 },
  { rank: 6, name: 'MergeWizard99', avatarEmoji: '🧙‍♂️', avatarTitle: 'Merge Wizard', xp: 1800, level: 5 },
];

const COLLEGE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'CampusCoder', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 2200, level: 6 },
  { rank: 2, name: 'Prof_Git', avatarEmoji: '👑', avatarTitle: 'Git Master', xp: 1950, level: 5 },
  { rank: 3, name: 'Hackathon_Beast', avatarEmoji: '🥷', avatarTitle: 'Rebase Ninja', xp: 1750, level: 5 },
  { rank: 4, name: 'CodeSlayer', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 1400, level: 4 },
  { rank: 5, name: 'VCS_Newbie', avatarEmoji: '🧑‍💻', avatarTitle: 'Code Cadet', xp: 850, level: 3 },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'college'>('global');

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-500/10 border-amber-500 text-amber-500';
      case 2: return 'bg-slate-400/10 border-slate-400 text-slate-400';
      case 3: return 'bg-amber-700/10 border-amber-700 text-amber-700';
      default: return 'bg-slate-900 border-slate-800 text-gray-400';
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

  // Compile full leaderboard, inserting user
  const rawLeaderboard = activeTab === 'global' ? GLOBAL_LEADERBOARD : COLLEGE_LEADERBOARD;
  
  // Find where user fits in
  const userEntry: LeaderboardEntry = {
    rank: 0, // calculated later
    name: `${userProfile.name} (You)`,
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
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-500" />
            <span>Leaderboards</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Compare your scores and rank with developers around the globe and in your college.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'global'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles size={16} />
            <span>Global Ranks</span>
          </button>
          <button
            onClick={() => setActiveTab('college')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'college'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <School size={16} />
            <span>College Campus</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-brand-panel border border-brand-border rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-brand-border bg-slate-950/20 flex items-center justify-between">
          <span className="font-bold">Ranks Ladder</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Resets Weekly
          </span>
        </div>

        <div className="divide-y divide-brand-border">
          {completeLeaderboard.map((player) => (
            <div
              key={player.name}
              className={`flex items-center justify-between p-4 px-6 transition-all ${
                player.isCurrentUser
                  ? 'bg-purple-950/25 border-l-4 border-l-purple-500'
                  : 'hover:bg-slate-900/10'
              }`}
            >
              {/* Left Rank & User details */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm leading-none ${getRankBadgeColor(
                    player.rank
                  )}`}
                >
                  {player.rank}
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                  {player.avatarEmoji}
                </div>

                <div className="text-left">
                  <div className="font-bold flex items-center gap-2 text-sm md:text-base">
                    <span>{player.name}</span>
                    {player.isCurrentUser && (
                      <span className="text-[10px] bg-purple-500/25 border border-purple-500/40 text-purple-400 px-2 py-0.5 rounded font-semibold uppercase tracking-widest flex items-center gap-1">
                        <UserCheck size={8} /> You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{player.avatarTitle}</div>
                </div>
              </div>

              {/* Right Level & XP details */}
              <div className="flex items-center gap-8">
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest block">
                    Level
                  </span>
                  <span className="font-bold text-purple-400">{player.level}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest block">
                    Score
                  </span>
                  <span className="font-extrabold text-brand-text tracking-wide">
                    {player.xp} <span className="text-purple-400 text-xs font-bold">XP</span>
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
