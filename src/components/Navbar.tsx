import React from 'react';
import { useGame } from '../context/GameContext';
import { Sun, Moon, Flame } from 'lucide-react';
import { chapters } from '../data/chapters';

export const Navbar: React.FC = () => {
  const { 
    activeWorld, 
    themeMode, 
    toggleThemeMode, 
    xp, 
    level, 
    streak, 
    currentChapterIndex,
    user
  } = useGame();

  const isKingdom = activeWorld === 'kingdom';
  const currentChapter = chapters[currentChapterIndex];

  // Target XP for current level
  const baseLevelXp = (level - 1) * 300;
  const currentLevelProgress = xp - baseLevelXp;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / 300) * 100));

  return (
    <header className={`h-14 sm:h-16 shrink-0 border-b backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0 transition-colors duration-500
      ${isKingdom 
        ? 'bg-amber-950/10 border-amber-500/10' 
        : 'bg-cyan-950/10 border-cyan-500/10'
      }
    `}>
      {/* Current active mission preview */}
      <div className="flex items-center gap-2.5 min-w-0 pr-3">
        <div className={`hidden sm:flex items-center justify-center w-2 h-2 rounded-full shrink-0 animate-ping
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />
        <div className="min-w-0">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block leading-none mb-0.5">Active Mission</span>
          <h4 className="text-xs font-bold text-slate-200 truncate">
            Ch {currentChapter.id}: {currentChapter.title}
          </h4>
        </div>
      </div>

      {/* Progress metrics and Settings */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Streak indicator */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-400 shrink-0">
          <Flame size={13} className="fill-orange-500/20 animate-pulse" />
          <span className="text-[11px] font-black tracking-tight">{streak}d</span>
        </div>

        {/* Level / XP Progress bar */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">Player Level</span>
            <span className="text-[11px] font-extrabold text-slate-300">Level {level}</span>
          </div>
          <div className="w-20 md:w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/30 shrink-0">
            <div 
              className={`h-full transition-all duration-500 ease-out
                ${isKingdom 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-400' 
                  : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
                }
              `}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-black text-slate-400 shrink-0">
            {currentLevelProgress}/300 <span className="text-[9px] text-slate-500 font-normal">XP</span>
          </span>
        </div>

        {/* Separator line */}
        <span className="w-px h-4 bg-slate-800 shrink-0 hidden sm:block" />

        {/* UI Theme switcher (Light/Dark) */}
        <button 
          onClick={toggleThemeMode}
          className={`p-1.5 sm:p-2 rounded-lg border shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center
            ${isKingdom
              ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
            }
          `}
          title="Toggle UI Mode"
        >
          {themeMode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User avatar badge */}
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs tracking-tight text-white border shadow-md shrink-0
          ${isKingdom 
            ? 'bg-gradient-to-tr from-amber-700 to-amber-500 border-amber-500/30 shadow-amber-500/10' 
            : 'bg-gradient-to-tr from-cyan-700 to-cyan-500 border-cyan-500/30 shadow-cyan-500/10'
          }
        `}>
          {(user?.username || 'OP').substring(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
