import React from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import { Flame, Play, CheckCircle2, Lock, BookOpen } from 'lucide-react';

interface DashboardProps {
  setTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setTab }) => {
  const { 
    activeWorld, 
    streak, 
    completedChapters, 
    currentChapterIndex, 
    setChapterIndex 
  } = useGame();

  const isKingdom = activeWorld === 'kingdom';
  const currentChapter = chapters[currentChapterIndex];

  // Calculations for progress ring
  const totalChapters = chapters.length;
  const numCompleted = completedChapters.length;
  const overallProgressPercent = Math.round((numCompleted / totalChapters) * 100);

  // Resume clicking handler
  const handleResume = () => {
    setTab('mission');
  };

  const handleSelectChapter = (idx: number) => {
    // Enable selection if it's completed or is the next uncompleted one
    const ch = chapters[idx];
    const isCompleted = completedChapters.includes(ch.id);
    const isNextAvailable = idx === 0 || completedChapters.includes(chapters[idx - 1].id);
    
    if (isCompleted || isNextAvailable || idx <= numCompleted) {
      setChapterIndex(idx);
      setTab('mission');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Resume learning banner card */}
      <div className={`relative rounded-3xl border overflow-hidden p-8 backdrop-blur-xl transition-all duration-500 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8
        ${isKingdom
          ? 'bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-transparent border-amber-500/10'
          : 'bg-gradient-to-r from-cyan-950/20 via-cyan-900/10 to-transparent border-cyan-500/10'
        }
      `}>
        {/* Glow spotlight background */}
        <div className={`absolute -top-12 -left-12 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-40
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border
              ${isKingdom
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              }
            `}>
              Adventure Resume
            </span>
            <div className="flex items-center gap-1 text-xs text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              <Flame size={12} /> {streak} Day Streak
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Ch {currentChapter.id}: {currentChapter.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {isKingdom ? currentChapter.story.kingdom : currentChapter.story.space}
          </p>
          <button 
            onClick={handleResume}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
              ${isKingdom
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/15'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/15'
              }
            `}
          >
            <Play size={16} className="fill-current" /> Resume Chapter {currentChapter.id}
          </button>
        </div>

        {/* Progress Circular Indicator */}
        <div className="relative z-10 flex flex-col items-center justify-center bg-slate-950/40 border border-slate-800/40 rounded-2xl p-6 w-48 text-center backdrop-blur-md">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
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
            <span className="text-xl font-black text-white relative z-10">{overallProgressPercent}%</span>
          </div>
          <span className="text-xs font-bold text-slate-400 mt-4 block">Total Curriculum</span>
          <span className="text-[10px] text-slate-500">{numCompleted}/{totalChapters} Chapters Done</span>
        </div>
      </div>

      {/* Chapters roadmap section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
            <h3 className="text-xl font-bold text-slate-200">Curriculum Story Roadmap</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Select any unlocked chapter node to begin</span>
        </div>

        {/* Path Roadmap Node List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chapters.map((ch, idx) => {
            const isCompleted = completedChapters.includes(ch.id);
            const isActive = currentChapterIndex === idx;
            // A node is unlocked if it is first, or it has been completed, or the previous node is completed
            const isUnlocked = idx === 0 || completedChapters.includes(chapters[idx - 1].id) || idx <= numCompleted;

            return (
              <div 
                key={ch.id}
                onClick={() => isUnlocked && handleSelectChapter(idx)}
                className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between h-44 select-none
                  ${isUnlocked 
                    ? 'cursor-pointer hover:-translate-y-1' 
                    : 'cursor-not-allowed opacity-50'
                  }
                  ${isActive
                    ? isKingdom 
                      ? 'bg-amber-500/[0.08] border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : 'bg-cyan-500/[0.08] border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                    : isCompleted
                      ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/20 border-slate-900'
                  }
                `}
              >
                {/* Node Status Banner */}
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded
                    ${isActive
                      ? isKingdom ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                      : isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-850 text-slate-400'
                    }
                  `}>
                    Chapter {ch.id}
                  </span>
                  
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : !isUnlocked ? (
                    <Lock size={16} className="text-slate-700" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'animate-ping' : ''} ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}`} />
                  )}
                </div>

                {/* Node Text Info */}
                <div className="mt-3">
                  <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{ch.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 block">Concept: {ch.conceptTerm}</p>
                </div>

                {/* Node Bottom equivalent banner */}
                <div className="border-t border-slate-900 mt-3 pt-3 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-semibold uppercase">{isKingdom ? 'Kingdom Map' : 'Space Core'}</span>
                  <code className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850
                    ${isKingdom ? 'text-amber-500/80' : 'text-cyan-500/80'}
                  `}>
                    {ch.conceptMapping[activeWorld]}
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
