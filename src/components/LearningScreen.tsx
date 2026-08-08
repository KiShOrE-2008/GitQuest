import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import { GitTimeline } from './GitTimeline';
import { Terminal } from './Terminal';
import { StoryWorld } from './StoryWorld';
import { Shield, Rocket, CheckSquare, ChevronRight } from 'lucide-react';

export const LearningScreen: React.FC = () => {
  const { activeWorld, currentChapterIndex, gitState } = useGame();
  const [activeMobileTab, setActiveMobileTab] = useState<'story' | 'timeline' | 'terminal'>('story');
  
  const currentChapter = chapters[currentChapterIndex];
  const isKingdom = activeWorld === 'kingdom';

  const storyText = isKingdom ? currentChapter.story.kingdom : currentChapter.story.space;
  const missionText = isKingdom ? currentChapter.mission.kingdom : currentChapter.mission.space;

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 items-stretch min-h-[calc(100vh-10rem)]">

      {/* ── Story World Animation Panel — Full Width ────────── */}
      <StoryWorld />

      {/* Mobile view Tab Selector */}
      <div className="flex lg:hidden w-full p-1 rounded-xl bg-slate-900/50 border border-slate-900/60 gap-1">
        <button
          onClick={() => setActiveMobileTab('story')}
          className={`flex-grow py-2.5 text-center text-xs font-bold rounded-lg transition-all
            ${activeMobileTab === 'story'
              ? isKingdom 
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              : 'text-slate-400'
            }
          `}
        >
          Story & Tasks
        </button>
        <button
          onClick={() => setActiveMobileTab('timeline')}
          className={`flex-grow py-2.5 text-center text-xs font-bold rounded-lg transition-all
            ${activeMobileTab === 'timeline'
              ? isKingdom 
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              : 'text-slate-400'
            }
          `}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveMobileTab('terminal')}
          className={`flex-grow py-2.5 text-center text-xs font-bold rounded-lg transition-all
            ${activeMobileTab === 'terminal'
              ? isKingdom 
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              : 'text-slate-400'
            }
          `}
        >
          Console
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Story Narrations & Checklist (5 Cols) */}
        <div className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${activeMobileTab === 'story' ? 'block' : 'hidden lg:flex'}`}>
        <div className={`flex-grow rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors duration-500
          ${isKingdom
            ? 'bg-amber-950/[0.03] border-amber-500/10'
            : 'bg-cyan-950/[0.03] border-cyan-500/10'
          }
        `}>
          {/* Spotlight aura */}
          <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20
            ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
          `} />

          {/* Story Context details */}
          <div className="space-y-5 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isKingdom ? (
                  <Shield size={18} className="text-amber-500" />
                ) : (
                  <Rocket size={18} className="text-cyan-500" />
                )}
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Mission Storytelling</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                ${isKingdom ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}
              `}>
                Chapter {currentChapter.id} / 20
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white select-none">
              {currentChapter.title}
            </h3>

            {/* Curriculum description */}
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {storyText}
            </p>

            <div className="border-t border-slate-900/60 pt-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Concepts Mapping</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Standard Git</span>
                  <span className="text-white font-mono font-semibold">{currentChapter.conceptTerm}</span>
                </div>
                <div className={`bg-slate-950/40 p-2.5 rounded-xl border
                  ${isKingdom ? 'border-amber-500/10' : 'border-cyan-500/10'}
                `}>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">In-Game Metaphor</span>
                  <span className={`font-mono font-bold ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {currentChapter.conceptMapping[activeWorld]}
                  </span>
                </div>
              </div>

              {/* 3-Step Educational Loop Reality Card */}
              <div className={`p-3.5 rounded-2xl border backdrop-blur-md space-y-2 text-xs mt-3
                ${isKingdom ? 'bg-amber-500/[0.04] border-amber-500/20' : 'bg-cyan-500/[0.04] border-cyan-500/20'}
              `}>
                <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Educational Loop</span>
                  <span className={isKingdom ? 'text-amber-400' : 'text-cyan-400'}>Concept Reality</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] font-bold">🎮 Story Action:</span>
                    <span className="text-slate-200 font-semibold text-[10px]">{currentChapter.realityMode.gameAction}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] font-bold">💻 Real Command:</span>
                    <code className={`px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border
                      ${isKingdom ? 'border-amber-500/30 text-amber-300' : 'border-cyan-500/30 text-cyan-300'}
                    `}>
                      $ {currentChapter.realityMode.gitCommand}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goal checklist tasks */}
          <div className="border-t border-slate-900/60 pt-5 mt-6 space-y-4 relative z-10">
            <div className="flex items-center gap-1.5">
              <CheckSquare size={16} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Mission Tasks</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-normal bg-slate-950/20 p-3 rounded-xl border border-slate-900/50">
              <span className="font-bold block mb-1 text-slate-300">Goal Objective:</span>
              {missionText}
            </p>

            {/* Dynamic steps indicator checklist */}
            <div className="space-y-2">
              {currentChapter.validationSteps.map((step, idx) => {
                const isStepCompleted = gitState.currentStepIndex > idx;
                const isStepActive = gitState.currentStepIndex === idx;

                return (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold transition-all duration-300
                      ${isStepCompleted 
                        ? 'bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-400/90'
                        : isStepActive
                          ? isKingdom
                            ? 'bg-amber-500/[0.05] border-amber-500/30 text-amber-300'
                            : 'bg-cyan-500/[0.05] border-cyan-500/30 text-cyan-300'
                          : 'bg-slate-950/10 border-slate-950 text-slate-600'
                      }
                    `}
                  >
                    {isStepCompleted ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        ✓
                      </div>
                    ) : (
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px]
                        ${isStepActive 
                          ? isKingdom ? 'border-amber-500/50 text-amber-400' : 'border-cyan-500/50 text-cyan-400' 
                          : 'border-slate-800 text-slate-700'
                        }
                      `}>
                        {idx + 1}
                      </div>
                    )}
                    <span className="flex-grow">{step.description}</span>
                    {isStepActive && (
                      <ChevronRight size={14} className="animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visualization & Terminal Shell (7 Cols) */}
      <div className={`lg:col-span-7 flex flex-col justify-between space-y-6 ${activeMobileTab !== 'story' ? 'block' : 'hidden lg:flex'}`}>
        {/* Timeline (top) */}
        <div className={`flex-grow ${activeMobileTab === 'timeline' ? 'block' : 'hidden lg:block'}`}>
          <GitTimeline />
        </div>

        {/* Terminal (bottom) */}
        <div className={`h-[360px] shrink-0 ${activeMobileTab === 'terminal' ? 'block' : 'hidden lg:block'}`}>
          <Terminal />
        </div>
      </div>
    </div>
    </div>
  );
};
