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
    <header className={`h-20 border-b backdrop-blur-xl flex items-center justify-between px-8 z-20 sticky top-0 transition-colors duration-500
      ${isKingdom 
        ? 'bg-amber-950/10 border-amber-500/10' 
        : 'bg-cyan-950/10 border-cyan-500/10'
      }
    `}>
      {/* Current active mission preview */}
      <div className="flex items-center gap-3">
        <div className={`hidden sm:flex items-center justify-center w-2.5 h-2.5 rounded-full animate-ping
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Mission</span>
          <h4 className="text-sm font-bold text-slate-200">
            Ch {currentChapter.id}: {currentChapter.title}
          </h4>
        </div>
      </div>

      {/* Progress metrics and Settings */}
      <div className="flex items-center gap-6">
        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400">
          <Flame size={16} className="fill-orange-500/20 animate-pulse" />
          <span className="text-xs font-black tracking-tight">{streak}d</span>
        </div>

        {/* Level / XP Progress bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Player Level</span>
            <span className="text-xs font-extrabold text-slate-300">Level {level}</span>
          </div>
          <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/30">
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
          <span className="text-xs font-black text-slate-400">{currentLevelProgress}/300 <span className="text-[10px] text-slate-500 font-normal">XP</span></span>
        </div>

        {/* Separator line */}
        <span className="w-px h-6 bg-slate-800" />

        {/* UI Theme switcher (Light/Dark) */}
        <button 
          onClick={toggleThemeMode}
          className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95
            ${isKingdom
              ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
            }
          `}
          title="Toggle UI Mode"
        >
          {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm tracking-tight text-white border shadow-md
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
