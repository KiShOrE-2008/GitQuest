import React from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import { 
  Play, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Users, 
  BarChart2, 
  Lightbulb, 
  ChevronRight, 
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface HomeProps {
  setTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setTab }) => {
  const { 
    activeWorld, 
    user, 
    streak, 
    completedChapters, 
    currentChapterIndex,
    setChapterIndex
  } = useGame();

  const isKingdom = activeWorld === 'kingdom';
  const currentChapter = chapters[currentChapterIndex];

  const totalChapters = chapters.length;
  const numCompleted = completedChapters.length;
  const overallProgressPercent = Math.round((numCompleted / totalChapters) * 100);

  // Dynamic Git Tips array
  const gitTips = [
    { cmd: "git status", tip: "Check working directory status to see staged vs untracked changes." },
    { cmd: "git log --oneline", tip: "View a compact 1-line timeline history of all recent commits." },
    { cmd: "git stash", tip: "Temporarily shelve uncommitted work to quickly switch branches." },
    { cmd: "git branch -a", tip: "List all local and remote tracking branches in your repository." },
    { cmd: "git checkout -b <name>", tip: "Create and immediately switch to a new development branch." }
  ];

  // Pick tip based on current chapter
  const currentTip = gitTips[currentChapterIndex % gitTips.length];

  const handleResumeMission = () => {
    setTab('mission');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Welcome Hero Command Center Card */}
      <div className={`relative rounded-3xl border overflow-hidden p-8 backdrop-blur-2xl transition-all duration-500 shadow-2xl group/hero
        ${isKingdom 
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-950/70 to-amber-950/30 border-amber-500/30 hover:border-amber-500/50 hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]' 
          : 'bg-gradient-to-r from-cyan-950/40 via-slate-950/70 to-cyan-950/30 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]'
        }
      `}>
        {/* Glow spotlight background */}
        <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[100px] pointer-events-none transition-all duration-500 group-hover/hero:scale-125
          ${isKingdom ? 'bg-amber-500/40' : 'bg-cyan-500/40'}
        `} />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md shadow-sm
                ${isKingdom
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-amber-500/10'
                  : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10'
                }
              `}>
                <Sparkles size={12} /> Command Center
              </span>
              <div className="flex items-center gap-1 text-xs text-orange-400 font-extrabold bg-orange-500/15 px-3 py-0.5 rounded-full border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.25)]">
                <Flame size={13} className="animate-pulse text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" /> {streak} Day Streak
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                Welcome back, {user?.username || 'Operator'}!
              </h1>
              <p className="text-slate-300 text-sm mt-1 font-light">
                You are on <span className="font-bold text-white">Chapter {currentChapter.id}: {currentChapter.title}</span>. Ready to advance history?
              </p>
            </div>

            {/* Active Mission Snippet Box */}
            <div className="p-4 rounded-2xl bg-slate-950/50 backdrop-blur-md border border-white/10 space-y-2 text-xs shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Mission Goal</span>
                <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-900 border backdrop-blur-md shadow-sm
                  ${isKingdom ? 'border-amber-500/40 text-amber-300 shadow-amber-500/10' : 'border-cyan-500/40 text-cyan-300 shadow-cyan-500/10'}
                `}>
                  {currentChapter.realGitCommand}
                </span>
              </div>
              <p className="text-slate-200 font-normal leading-relaxed">
                {isKingdom ? currentChapter.story.kingdom : currentChapter.story.space}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <button 
                onClick={handleResumeMission}
                className={`px-7 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl
                  ${isKingdom
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                  }
                `}
              >
                <Play size={16} className="fill-current" /> Resume Chapter {currentChapter.id}
              </button>

              <button 
                onClick={() => setTab('learn')}
                className="px-5 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/15 bg-slate-900/60 backdrop-blur-md hover:bg-white/10 hover:border-white/25 text-slate-200 hover:text-white transition-all hover:scale-105 shadow-md"
              >
                <BookOpen size={16} /> View Roadmap
              </button>
            </div>
          </div>

          {/* Right side circular progress indicator card */}
          <div className={`relative z-10 flex flex-col items-center justify-center bg-slate-950/60 border rounded-3xl p-6 w-56 text-center backdrop-blur-2xl shadow-2xl shrink-0 transition-all duration-300
            ${isKingdom ? 'border-amber-500/30 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]'}
          `}>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke={isKingdom ? '#f59e0b' : '#06b6d4'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * overallProgressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                />
              </svg>
              <span className="text-2xl font-black text-white relative z-10 drop-shadow-md">{overallProgressPercent}%</span>
            </div>
            <span className="text-xs font-bold text-slate-200 mt-4 block">Curriculum Progress</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{numCompleted} of {totalChapters} Chapters Mastered</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Launchpads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mission Console */}
        <div 
          onClick={() => setTab('mission')}
          className={`p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer group shadow-xl flex items-center justify-between
            ${isKingdom
              ? 'bg-slate-950/40 border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
              : 'bg-slate-950/40 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]'
            }
          `}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110
              ${isKingdom 
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              }
            `}>
              <Terminal size={20} className={isKingdom ? 'drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'} />
            </div>
            <div>
              <span className={`text-xs font-bold block transition-colors ${isKingdom ? 'text-slate-200 group-hover:text-amber-300' : 'text-slate-200 group-hover:text-cyan-300'}`}>Mission Console</span>
              <span className="text-[10px] text-slate-400 block font-light">Interactive Git terminal</span>
            </div>
          </div>
          <ChevronRight size={18} className={`text-slate-500 transition-all duration-300 group-hover:translate-x-1 ${isKingdom ? 'group-hover:text-amber-400' : 'group-hover:text-cyan-400'}`} />
        </div>

        {/* Learn Map */}
        <div 
          onClick={() => setTab('learn')}
          className="p-5 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 cursor-pointer group shadow-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <BookOpen size={20} className="drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors block">Learn Map</span>
              <span className="text-[10px] text-slate-400 block font-light">20-Chapter Roadmap</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Skillset Matrix */}
        <div 
          onClick={() => setTab('profile')}
          className="p-5 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-pointer group shadow-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <BarChart2 size={20} className="drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors block">Skillset Matrix</span>
              <span className="text-[10px] text-slate-400 block font-light">Competency analytics</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Leaderboard */}
        <div 
          onClick={() => setTab('leaderboard')}
          className="p-5 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-300 cursor-pointer group shadow-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              <Users size={20} className="drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-orange-300 transition-colors block">Leaderboard</span>
              <span className="text-[10px] text-slate-400 block font-light">Global player rankings</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>

      {/* Grid: Pro Git Tip (Left 7 cols) & Recent History (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pro Tip Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`bg-slate-950/40 rounded-3xl border backdrop-blur-2xl p-6 space-y-4 shadow-2xl transition-all duration-300
            ${isKingdom 
              ? 'border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]' 
              : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]'
            }
          `}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Lightbulb size={18} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Git Tip of the Day</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Knowledge Base</span>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-inner">
              <code className="text-xs font-mono font-bold text-emerald-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] inline-block">
                $ {currentTip.cmd}
              </code>
              <p className="text-xs text-slate-200 leading-relaxed font-light">
                {currentTip.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Chapters Progress */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`bg-slate-950/40 rounded-3xl border backdrop-blur-2xl p-6 space-y-4 shadow-2xl transition-all duration-300
            ${isKingdom 
              ? 'border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]' 
              : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]'
            }
          `}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className={isKingdom ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'} />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Progress</h3>
              </div>
              <span className="text-xs font-bold text-slate-300">{numCompleted} Completed</span>
            </div>

            <div className="space-y-2">
              {completedChapters.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-light">
                  No chapters completed yet. Click Resume Chapter to start your first mission!
                </div>
              ) : (
                completedChapters.slice(-3).map((id) => {
                  const ch = chapters.find(c => c.id === id);
                  if (!ch) return null;
                  return (
                    <div 
                      key={id}
                      onClick={() => setChapterIndex(ch.id - 1)}
                      className={`flex items-center justify-between text-xs p-3 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer group
                        ${isKingdom
                          ? 'bg-slate-900/50 border-white/10 hover:border-amber-500/40 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-900/50 border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-300 font-bold shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                          ✓
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 group-hover:text-white transition-colors block">Ch {ch.id}: {ch.title}</span>
                          <span className="text-[9px] font-mono text-slate-400 block">{ch.realGitCommand}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                        +{ch.xpReward} XP
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
