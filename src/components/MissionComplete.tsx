import React from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import { Zap, ChevronRight, CheckCircle } from 'lucide-react';

interface MissionCompleteProps {
  onClose: () => void;
  onNextChapter: () => void;
}

export const MissionComplete: React.FC<MissionCompleteProps> = ({ onClose, onNextChapter }) => {
  const { activeWorld, currentChapterIndex } = useGame();

  const currentChapter = chapters[currentChapterIndex];
  const isKingdom = activeWorld === 'kingdom';

  const isLastChapter = currentChapterIndex >= chapters.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fade-in_0.3s_ease-out]">
      {/* Container Card */}
      <div className={`relative w-full max-w-xl rounded-3xl border p-8 bg-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between space-y-6 relative transition-colors duration-500
        ${isKingdom ? 'border-amber-500/20 shadow-amber-500/5' : 'border-cyan-500/20 shadow-cyan-500/5'}
      `}>
        {/* Glow */}
        <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-30 animate-pulse
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        {/* Celebration Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 animate-[bounce_1.5s_infinite]">
            <CheckCircle size={28} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Mission Accomplished!</h2>
          <p className={`text-xs font-bold uppercase tracking-wider
            ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}
          `}>
            Chapter {currentChapter.id} Completed
          </p>
        </div>

        {/* Reward indicators */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-slate-950/50 rounded-2xl border border-slate-850 p-4 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">XP Reward</span>
            <span className="text-xl font-black text-emerald-400 flex items-center gap-1">
              <Zap size={16} className="fill-current" /> +{currentChapter.xpReward} XP
            </span>
          </div>
          <div className="bg-slate-950/50 rounded-2xl border border-slate-850 p-4 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status Code</span>
            <span className="text-xl font-black text-slate-200 uppercase tracking-tighter font-mono">
              SUCCESS
            </span>
          </div>
        </div>

        {/* Reality Mode Transition Box */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-5 space-y-4 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Reality Mode Map</span>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
              Metaphor vs Production
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs font-semibold">
            {/* Game Action representation */}
            <div className="space-y-1">
              <span className="text-slate-500 text-[9px] uppercase block">In-Game Accomplishment:</span>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-lg">
                  {isKingdom ? '🏰' : '🚀'}
                </span>
                <span>{currentChapter.realityMode.gameAction}</span>
              </div>
            </div>

            {/* Equivalent command */}
            <div className="space-y-1">
              <span className="text-slate-500 text-[9px] uppercase block">Equivalent Git Command:</span>
              <code className="block font-mono text-[11px] font-bold text-emerald-400 bg-slate-950/80 border border-slate-900 p-2.5 rounded-lg select-all">
                {currentChapter.realityMode.gitCommand}
              </code>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex gap-3 relative z-10">
          {isLastChapter ? (
            <button
              onClick={onClose}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-center text-slate-950 transition-all duration-200 hover:scale-105 active:scale-97
                ${isKingdom ? 'bg-amber-500 hover:bg-amber-400' : 'bg-cyan-500 hover:bg-cyan-400'}
              `}
            >
              Finish Chronicles & Graduate 🎉
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-grow py-3.5 rounded-xl font-bold text-xs text-center border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all"
              >
                Review Workspace
              </button>
              <button
                onClick={onNextChapter}
                className={`flex-grow py-3.5 rounded-xl font-bold text-xs text-slate-950 flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-97
                  ${isKingdom
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/10'
                  }
                `}
              >
                Next Chapter <ChevronRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
