import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Search, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Contestant {
  id?: string;
  rank: number;
  name: string;
  role: string;
  xp: number;
  streak: number;
  isSelf: boolean;
}

export const Leaderboard: React.FC = () => {
  const { activeWorld, xp, streak, user } = useGame();
  const [dbContestants, setDbContestants] = useState<Contestant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const isKingdom = activeWorld === 'kingdom';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('xp', { ascending: false })
          .limit(20);

        if (error || !data) return;

        const mapped: Contestant[] = data.map((item, idx) => ({
          id: item.id,
          rank: idx + 1,
          name: item.username || item.email?.split('@')[0] || 'Anonymous',
          role: item.college_name || (isKingdom ? 'Royal Historian' : 'Starfleet Operative'),
          xp: item.xp ?? 0,
          streak: item.streak ?? 1,
          isSelf: user?.email ? item.email?.toLowerCase() === user.email.toLowerCase() : false
        }));

        setDbContestants(mapped);
      } catch (err) {
        console.warn('Could not fetch Supabase leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, [user, xp, streak, isKingdom]);

  // Default bot contestants to ensure a full, competitive leaderboard experience
  const botContestants: Contestant[] = [
    { rank: 1, name: 'Lancelot_Git', role: 'Guild Master', xp: 2150, streak: 14, isSelf: false },
    { rank: 2, name: 'QuantumOperator', role: 'Time Architect', xp: 1850, streak: 9, isSelf: false },
    { rank: 3, name: 'Ada_Brancher', role: 'Timeline Fixer', xp: 1200, streak: 6, isSelf: false },
    { rank: 4, name: 'GitGud_Knight', role: 'Sentry Sentinel', xp: 620, streak: 3, isSelf: false },
    { rank: 5, name: 'Cosmo_Committer', role: 'Shuttle Pilot', xp: 350, streak: 2, isSelf: false },
  ];

  // Self user object constructed from current live context state
  const selfContestant: Contestant = {
    rank: 0,
    name: user?.username || 'You (Operator)',
    role: user?.collegeName || (isKingdom ? 'Royal Historian' : 'Starfleet Operative'),
    xp: xp,
    streak: streak,
    isSelf: true
  };

  // Build combined list
  let combinedList: Contestant[] = [];

  if (dbContestants.length > 0) {
    // If DB has records, use DB profiles
    combinedList = [...dbContestants];
    // If self user is not found in DB list (e.g. newly signed up or guest), insert self user
    const hasSelfInDb = combinedList.some(c => c.isSelf);
    if (!hasSelfInDb) {
      combinedList.push(selfContestant);
    } else {
      // Ensure self profile in DB list displays live local state if fresher
      combinedList = combinedList.map(c => c.isSelf ? { ...c, xp: Math.max(c.xp, xp), streak: Math.max(c.streak, streak), name: user?.username || c.name } : c);
    }
    // Fill up with bot contestants if DB has fewer than 5 rows
    botContestants.forEach(bot => {
      if (combinedList.length < 6 && !combinedList.some(c => c.name === bot.name)) {
        combinedList.push(bot);
      }
    });
  } else {
    // If DB is offline or empty, use bot contestants + self user
    const filteredBots = botContestants.filter(b => b.name !== selfContestant.name);
    combinedList = [selfContestant, ...filteredBots];
  }

  // Sort by XP descending
  combinedList.sort((a, b) => b.xp - a.xp);

  // Re-calculate ranks
  combinedList.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  // Filter search
  const filteredContestants = combinedList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selfRank = combinedList.find(c => c.isSelf)?.rank || 1;

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
            <h2 className="text-xl font-black text-white tracking-tight">Global Leaderboard</h2>
            <p className="text-slate-400 text-xs font-light">
              Real-time rankings synced with Supabase. Keep completing chapters to earn XP & streaks!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Your Streak</span>
            <div className="flex items-center gap-1 justify-end text-orange-400 font-black text-lg">
              <Flame size={16} className="fill-orange-400/20" /> {streak} {streak === 1 ? 'day' : 'days'}
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Your Rank</span>
            <span className={`text-2xl font-black
              ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}
            `}>
              #{selfRank}
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-slate-950/40 rounded-3xl border border-slate-900 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-900 flex justify-between items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rankings Board</span>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl w-60">
            <Search size={14} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs w-full placeholder-slate-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-900/80">
          {filteredContestants.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No coders found matching "{searchQuery}"
            </div>
          ) : (
            filteredContestants.map((c) => (
              <div 
                key={`${c.name}-${c.rank}`}
                className={`px-6 py-4 flex items-center justify-between transition-colors duration-200
                  ${c.isSelf 
                    ? isKingdom 
                      ? 'bg-amber-500/[0.06] border-l-4 border-l-amber-500' 
                      : 'bg-cyan-500/[0.06] border-l-4 border-l-cyan-500'
                    : 'hover:bg-slate-900/30'
                  }
                `}
              >
                {/* Rank & user info */}
                <div className="flex items-center gap-4">
                  {/* Rank Medal / Indicator */}
                  <div className="w-8 flex items-center justify-center font-black text-sm">
                    {c.rank === 1 ? (
                      <Medal size={22} className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                    ) : c.rank === 2 ? (
                      <Medal size={22} className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.3)]" />
                    ) : c.rank === 3 ? (
                      <Medal size={22} className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]" />
                    ) : (
                      <span className="text-slate-500 font-bold">{c.rank}</span>
                    )}
                  </div>

                  {/* Avatar Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white border shadow-md select-none
                    ${c.isSelf
                      ? isKingdom 
                        ? 'bg-gradient-to-tr from-amber-600 to-amber-500 border-amber-500/30 shadow-amber-500/20'
                        : 'bg-gradient-to-tr from-cyan-600 to-cyan-500 border-cyan-500/30 shadow-cyan-500/20'
                      : 'bg-slate-800 border-slate-700 shadow-slate-900/30'
                    }
                  `}>
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Name and Role text */}
                  <div>
                    <span className={`text-xs font-bold block leading-tight flex items-center gap-1.5
                      ${c.isSelf ? 'text-white font-extrabold' : 'text-slate-300'}
                    `}>
                      {c.name} {c.isSelf && <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">YOU</span>}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{c.role}</span>
                  </div>
                </div>

                {/* Contestant metrics (XP, Streak) */}
                <div className="flex items-center gap-6">
                  {c.streak > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 shadow-sm">
                      <Flame size={12} className="fill-orange-400/20" /> {c.streak} {c.streak === 1 ? 'day' : 'days'}
                    </div>
                  )}
                  <div className="text-right w-20">
                    <span className="text-xs font-black text-slate-200">{c.xp.toLocaleString()}</span>
                    <span className="text-[9px] font-semibold text-slate-500 block uppercase leading-none">XP</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

