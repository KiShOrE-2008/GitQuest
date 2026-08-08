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
      <div className={`relative rounded-3xl border overflow-hidden p-8 backdrop-blur-2xl transition-all duration-500 shadow-2xl
        ${isKingdom 
          ? 'bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-amber-950/20 border-amber-500/20 shadow-amber-500/5' 
          : 'bg-gradient-to-r from-cyan-950/30 via-slate-950/80 to-cyan-950/20 border-cyan-500/20 shadow-cyan-500/5'
        }
      `}>
        {/* Glow spotlight background */}
        <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-30
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5
                ${isKingdom
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                }
              `}>
                <Sparkles size={12} /> Command Center
              </span>
              <div className="flex items-center gap-1 text-xs text-orange-400 font-extrabold bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20">
                <Flame size={13} className="animate-pulse" /> {streak} Day Streak
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome back, {user?.username || 'Operator'}!
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                You are on <span className="font-bold text-slate-200">Chapter {currentChapter.id}: {currentChapter.title}</span>. Ready to advance history?
              </p>
            </div>

            {/* Active Mission Snippet Box */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-500">Mission Goal</span>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border
                  ${isKingdom ? 'border-amber-500/20 text-amber-400' : 'border-cyan-500/20 text-cyan-400'}
                `}>
                  {currentChapter.realGitCommand}
                </span>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed">
                {isKingdom ? currentChapter.story.kingdom : currentChapter.story.space}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <button 
                onClick={handleResumeMission}
                className={`px-7 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl
                  ${isKingdom
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                  }
                `}
              >
                <Play size={16} className="fill-current" /> Resume Chapter {currentChapter.id}
              </button>

              <button 
                onClick={() => setTab('learn')}
                className="px-5 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-200 transition-all hover:scale-105"
              >
                <BookOpen size={16} /> View Roadmap
              </button>
            </div>
          </div>

          {/* Right side circular progress indicator card */}
          <div className="relative z-10 flex flex-col items-center justify-center bg-slate-950/50 border border-slate-800 rounded-3xl p-6 w-56 text-center backdrop-blur-xl shadow-2xl shrink-0">
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
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="text-2xl font-black text-white relative z-10">{overallProgressPercent}%</span>
            </div>
            <span className="text-xs font-bold text-slate-300 mt-4 block">Curriculum Progress</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{numCompleted} of {totalChapters} Chapters Mastered</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Launchpads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setTab('mission')}
          className="p-5 rounded-2xl bg-slate-950/50 border border-slate-850 hover:border-slate-750 transition-all cursor-pointer group shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl ${isKingdom ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
              <Terminal size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block group-hover:text-white transition-colors">Mission Console</span>
              <span className="text-[10px] text-slate-500 block">Interactive Git terminal</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
        </div>

        <div 
          onClick={() => setTab('learn')}
          className="p-5 rounded-2xl bg-slate-950/50 border border-slate-850 hover:border-slate-750 transition-all cursor-pointer group shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block group-hover:text-white transition-colors">Learn Map</span>
              <span className="text-[10px] text-slate-500 block">20-Chapter Roadmap</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
        </div>

        <div 
          onClick={() => setTab('profile')}
          className="p-5 rounded-2xl bg-slate-950/50 border border-slate-850 hover:border-slate-750 transition-all cursor-pointer group shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart2 size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block group-hover:text-white transition-colors">Skillset Matrix</span>
              <span className="text-[10px] text-slate-500 block">Competency analytics</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
        </div>

        <div 
          onClick={() => setTab('leaderboard')}
          className="p-5 rounded-2xl bg-slate-950/50 border border-slate-850 hover:border-slate-750 transition-all cursor-pointer group shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
              <Users size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block group-hover:text-white transition-colors">Leaderboard</span>
              <span className="text-[10px] text-slate-500 block">Global player rankings</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>

      {/* Grid: Pro Git Tip (Left 7 cols) & Recent History (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pro Tip Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950/50 rounded-3xl border border-slate-850 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Lightbulb size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Git Tip of the Day</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Knowledge Base</span>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-850">
              <code className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block">
                $ {currentTip.cmd}
              </code>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {currentTip.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Chapters Progress */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950/50 rounded-3xl border border-slate-850 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Progress</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{numCompleted} Completed</span>
            </div>

            <div className="space-y-2">
              {completedChapters.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
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
                      className="flex items-center justify-between text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-bold shrink-0">
                          ✓
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 group-hover:text-white transition-colors block">Ch {ch.id}: {ch.title}</span>
                          <span className="text-[9px] font-mono text-slate-500 block">{ch.realGitCommand}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
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
