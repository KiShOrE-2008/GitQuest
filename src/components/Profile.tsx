import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, BarChart2, CheckCircle, LogOut } from 'lucide-react';
import { chapters } from '../data/chapters';

export const Profile: React.FC = () => {
  const { activeWorld, xp, level, streak, completedChapters, achievements, user, logout } = useGame();

  const isKingdom = activeWorld === 'kingdom';

  const skillSets = [
    { name: 'Core Foundations (init, status)', val: Math.min(100, Math.round((completedChapters.filter(id => id <= 3).length / 3) * 100)) },
    { name: 'Snapshots (add, commit, log)', val: Math.min(100, Math.round((completedChapters.filter(id => id >= 3 && id <= 5).length / 3) * 100)) },
    { name: 'Branching Mechanics (branch, checkout)', val: Math.min(100, Math.round((completedChapters.filter(id => id >= 6 && id <= 7).length / 2) * 100)) },
    { name: 'Integrations (merge, conflicts)', val: Math.min(100, Math.round((completedChapters.filter(id => id >= 8 && id <= 9).length / 2) * 100)) },
    { name: 'Collaborations (push, pull, clone)', val: Math.min(100, Math.round((completedChapters.filter(id => id >= 10 && id <= 12).length / 3) * 100)) },
    { name: 'History Rewriting (reset, revert, rebase)', val: Math.min(100, Math.round((completedChapters.filter(id => id >= 13 && id <= 16).length / 4) * 100)) },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Profile Header Cards */}
      <div className={`rounded-3xl border overflow-hidden p-8 backdrop-blur-xl relative transition-all duration-500 shadow-2xl flex flex-col sm:flex-row items-center gap-8
        ${isKingdom ? 'bg-amber-950/10 border-amber-500/10' : 'bg-cyan-950/10 border-cyan-500/10'}
      `}>
        {/* Glow */}
        <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        {/* Big Avatar */}
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center font-black text-4xl text-white relative z-10 border shadow-2xl
          ${isKingdom 
            ? 'bg-gradient-to-tr from-amber-600 to-amber-400 border-amber-500/30 shadow-amber-500/20' 
            : 'bg-gradient-to-tr from-cyan-600 to-cyan-400 border-cyan-500/30 shadow-cyan-500/20'
          }
        `}>
          {(user?.username || 'OP').substring(0, 2).toUpperCase()}
        </div>

        <div className="relative z-10 space-y-4 text-center sm:text-left flex-grow w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-3xl font-black text-white tracking-tight">{user?.username || 'Operator'}</h2>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border self-center
                  ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}
                `}>
                  {isKingdom ? 'Royal Chronologer' : 'Starfleet Operator'}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-light">
                Email: {user?.email || 'offline@gitverse.com'} • Authenticated: {user?.provider || 'Local'}
              </p>
            </div>

            <button 
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto sm:mx-0">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Level</span>
              <span className="text-xl font-black text-white">{level}</span>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total XP</span>
              <span className="text-xl font-black text-white">{xp}</span>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Streak</span>
              <span className="text-xl font-black text-white">{streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout divide */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left column: Git Skill progress indicators (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <BarChart2 size={18} className={isKingdom ? 'text-amber-500' : 'text-cyan-500'} />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Git Skillset Matrix</h3>
            </div>

            <div className="space-y-4">
              {skillSets.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className={isKingdom ? 'text-amber-400' : 'text-cyan-400'}>{skill.val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative border border-slate-850">
                    <div 
                      className={`h-full transition-all duration-700 ease-out
                        ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
                      `}
                      style={{ width: `${skill.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Achievements & Completed list (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Award size={18} className={isKingdom ? 'text-amber-500' : 'text-cyan-500'} />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Unlocked Badges ({achievements.length})</h3>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-medium">
                No badges unlocked yet. Complete missions to earn achievements!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((badge) => (
                  <div 
                    key={badge}
                    className={`rounded-xl border p-3 flex flex-col items-center justify-center text-center gap-1.5 backdrop-blur-md
                      ${isKingdom ? 'bg-amber-500/[0.02] border-amber-500/10' : 'bg-cyan-500/[0.02] border-cyan-500/10'}
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow
                      ${isKingdom ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}
                    `}>
                      ⭐
                    </div>
                    <span className="text-[10px] font-black text-slate-200">{badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <CheckCircle size={18} className={isKingdom ? 'text-amber-500' : 'text-cyan-500'} />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Completed Timeline Chapters</h3>
            </div>

            <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2">
              {completedChapters.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500 font-medium">
                  No chapters completed yet.
                </div>
              ) : (
                completedChapters.map((id) => {
                  const ch = chapters.find(c => c.id === id);
                  return ch ? (
                    <div key={id} className="flex items-center justify-between text-xs bg-slate-950/30 p-2.5 rounded-xl border border-slate-900">
                      <span className="font-semibold text-slate-300">Ch {ch.id}: {ch.title}</span>
                      <span className="text-[10px] font-black text-emerald-400">+100 XP</span>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
