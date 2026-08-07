import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Search, Flame } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { activeWorld, xp } = useGame();

  const isKingdom = activeWorld === 'kingdom';

  // Mock list of global contestants including user
  const contestants = [
    { rank: 1, name: 'Lancelot_Git', role: 'Guild Master', xp: 2150, streak: 12, isSelf: false },
    { rank: 2, name: 'QuantumOperator', role: 'Time Architect', xp: 1950, streak: 8, isSelf: false },
    { rank: 3, name: 'You (Operator)', role: isKingdom ? 'Royal Historian' : 'Starfleet Operative', xp: Math.max(xp, 400), streak: 5, isSelf: true },
    { rank: 4, name: 'Ada_Brancher', role: 'Timeline Fixer', xp: 850, streak: 3, isSelf: false },
    { rank: 5, name: 'GitGud_Knight', role: 'Sentry Sentinel', xp: 620, streak: 2, isSelf: false },
    { rank: 6, name: 'Cosmo_Committer', role: 'Shuttle Pilot', xp: 350, streak: 0, isSelf: false },
  ].sort((a, b) => b.xp - a.xp); // Sort by XP to make it real

  // Adjust rankings after sorting
  contestants.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Overview stats cards */}
      <div className={`rounded-3xl border overflow-hidden p-6 backdrop-blur-xl relative transition-all duration-500 shadow-2xl flex items-center justify-between gap-6
        ${isKingdom ? 'bg-amber-950/10 border-amber-500/10' : 'bg-cyan-950/10 border-cyan-500/10'}
      `}>
        {/* Spotlight aura */}
        <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white border shadow-md
            ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'}
          `}>
            <Trophy size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Weekly Rankings</h2>
            <p className="text-slate-400 text-xs font-light">
              Rankings refresh every Sunday. Keep coding to climb the global chart!
            </p>
          </div>
        </div>

        <div className="text-right relative z-10">
          <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Your Rank</span>
          <span className={`text-2xl font-black
            ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}
          `}>
            #{contestants.find(c => c.isSelf)?.rank || 3}
          </span>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-slate-950/40 rounded-3xl border border-slate-900 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-900 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rankings Board</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-950/60 border border-slate-850 px-3 py-1 rounded-xl">
            <Search size={12} /> Search users...
          </div>
        </div>

        <div className="divide-y divide-slate-900/80">
          {contestants.map((c) => (
            <div 
              key={c.name}
              className={`px-6 py-4 flex items-center justify-between transition-colors duration-200
                ${c.isSelf 
                  ? isKingdom 
                    ? 'bg-amber-500/[0.04]' 
                    : 'bg-cyan-500/[0.04]'
                  : 'hover:bg-slate-900/20'
                }
              `}
            >
              {/* Rank & user info */}
              <div className="flex items-center gap-4">
                {/* Rank Medal / Indicator */}
                <div className="w-8 flex items-center justify-center font-black text-sm">
                  {c.rank === 1 ? (
                    <Medal size={20} className="text-yellow-500" />
                  ) : c.rank === 2 ? (
                    <Medal size={20} className="text-slate-300" />
                  ) : c.rank === 3 ? (
                    <Medal size={20} className="text-amber-600" />
                  ) : (
                    <span className="text-slate-500">{c.rank}</span>
                  )}
                </div>

                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white border shadow-md select-none
                  ${c.isSelf
                    ? isKingdom 
                      ? 'bg-gradient-to-tr from-amber-600 to-amber-500 border-amber-500/20 shadow-amber-500/10'
                      : 'bg-gradient-to-tr from-cyan-600 to-cyan-500 border-cyan-500/20 shadow-cyan-500/10'
                    : 'bg-slate-800 border-slate-700 shadow-slate-900/30'
                  }
                `}>
                  {c.name.substring(0, 2).toUpperCase()}
                </div>

                {/* Name and Role text */}
                <div>
                  <span className={`text-xs font-bold block leading-tight
                    ${c.isSelf ? 'text-white' : 'text-slate-300'}
                  `}>
                    {c.name} {c.isSelf && <span className="text-[9px] font-normal text-slate-500">(You)</span>}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{c.role}</span>
                </div>
              </div>

              {/* Contestant metrics (XP, Streak) */}
              <div className="flex items-center gap-6">
                {c.streak > 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-orange-400/80 bg-orange-500/5 px-2 py-0.5 rounded-full border border-orange-500/10">
                    <Flame size={10} /> {c.streak}d
                  </div>
                )}
                <div className="text-right w-20">
                  <span className="text-xs font-black text-slate-200">{c.xp}</span>
                  <span className="text-[9px] font-semibold text-slate-500 block uppercase leading-none">XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
