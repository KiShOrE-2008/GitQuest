import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import { GitTimeline } from './GitTimeline';
import { Terminal } from './Terminal';
import { StoryWorld } from './StoryWorld';
import { Shield, Rocket, CheckSquare, ChevronRight, BookOpen } from 'lucide-react';

export const LearningScreen: React.FC = () => {
  const { activeWorld, currentChapterIndex, gitState } = useGame();
  const [activeMobileTab, setActiveMobileTab] = useState<'story' | 'timeline' | 'terminal'>('story');
  
  const currentChapter = chapters[currentChapterIndex];
  const isKingdom = activeWorld === 'kingdom';

  const storyText = isKingdom ? currentChapter.story.kingdom : currentChapter.story.space;
  const missionText = isKingdom ? currentChapter.mission.kingdom : currentChapter.mission.space;

  return (
    <div className="flex flex-col gap-3 max-w-7xl mx-auto lg:h-[calc(100vh-5.5rem)] min-h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-hidden items-stretch pb-20 lg:pb-0">

      {/* ── Story World Animation Panel — Compact Full Width ────────── */}
      <StoryWorld />

      {/* Mobile view Tab Selector */}
      <div className="flex lg:hidden w-full p-1 rounded-xl bg-slate-900/50 border border-slate-900/60 gap-1 shrink-0">
        <button
          onClick={() => setActiveMobileTab('story')}
          className={`flex-grow py-2 text-center text-xs font-bold rounded-lg transition-all
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
          className={`flex-grow py-2 text-center text-xs font-bold rounded-lg transition-all
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
          className={`flex-grow py-2 text-center text-xs font-bold rounded-lg transition-all
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

      {/* ── 2-Column Main Workspace (Fits strictly inside 100vh) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-grow min-h-0 overflow-hidden">
        
        {/* Left Column: Story Narrations & Checklist (5 Cols) */}
        <div className={`lg:col-span-5 flex flex-col h-full overflow-hidden ${activeMobileTab === 'story' ? 'block' : 'hidden lg:flex'}`}>
          <div className={`h-full rounded-2xl border p-4 flex flex-col justify-between backdrop-blur-2xl shadow-xl relative overflow-y-auto custom-scrollbar transition-colors duration-500
            ${isKingdom
              ? 'bg-amber-950/[0.04] border-amber-500/15'
              : 'bg-cyan-950/[0.04] border-cyan-500/15'
            }
          `}>
            {/* Spotlight aura */}
            <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20
              ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
            `} />

            <div className="space-y-3.5 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isKingdom ? (
                    <Shield size={16} className="text-amber-500" />
                  ) : (
                    <Rocket size={16} className="text-cyan-500" />
                  )}
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Mission Storytelling</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border
                  ${isKingdom ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'}
                `}>
                  Chapter {currentChapter.id} / 20
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight text-white select-none">
                {currentChapter.title}
              </h3>

              {/* Curriculum description */}
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {storyText}
              </p>

              {/* Concepts Mapping */}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Concepts Mapping</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/50 p-2 rounded-xl border border-white/10">
                    <span className="text-slate-500 block text-[8px] uppercase font-bold">Standard Git</span>
                    <span className="text-white font-mono text-[11px] font-semibold">{currentChapter.conceptTerm}</span>
                  </div>
                  <div className={`bg-slate-950/50 p-2 rounded-xl border
                    ${isKingdom ? 'border-amber-500/20' : 'border-cyan-500/20'}
                  `}>
                    <span className="text-slate-500 block text-[8px] uppercase font-bold">In-Game Metaphor</span>
                    <span className={`font-mono text-[11px] font-bold ${isKingdom ? 'text-amber-300' : 'text-cyan-300'}`}>
                      {currentChapter.conceptMapping[activeWorld]}
                    </span>
                  </div>
                </div>

                {/* Educational Loop Reality Card */}
                <div className={`p-3 rounded-xl border backdrop-blur-md space-y-1.5 text-xs mt-2
                  ${isKingdom ? 'bg-amber-500/[0.04] border-amber-500/20' : 'bg-cyan-500/[0.04] border-cyan-500/20'}
                `}>
                  <div className="flex items-center justify-between text-[8px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Educational Loop</span>
                    <span className={isKingdom ? 'text-amber-400' : 'text-cyan-400'}>Concept Reality</span>
                  </div>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">🎮 Story:</span>
                      <span className="text-slate-200 font-semibold truncate">{currentChapter.realityMode.gameAction}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">💻 Command:</span>
                      <code className={`px-2 py-0.5 rounded font-bold bg-slate-900 border
                        ${isKingdom ? 'border-amber-500/30 text-amber-300' : 'border-cyan-500/30 text-cyan-300'}
                      `}>
                        $ {currentChapter.realityMode.gitCommand}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Command Deep-Dive Card */}
                {currentChapter.detailedDescription && (
                  <div className={`p-3 rounded-xl border backdrop-blur-md space-y-2 text-xs mt-2
                    ${isKingdom ? 'bg-amber-950/30 border-amber-500/20' : 'bg-cyan-950/30 border-cyan-500/20'}
                  `}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={13} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                        <span className="text-[9px] uppercase font-extrabold text-slate-300 tracking-wider">Command Deep-Dive</span>
                      </div>
                      <code className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-900 border ${isKingdom ? 'border-amber-500/40 text-amber-300' : 'border-cyan-500/40 text-cyan-300'}`}>
                        $ {currentChapter.detailedDescription.command}
                      </code>
                    </div>

                    <div className="space-y-1.5 text-[10px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[8px] uppercase tracking-wider">Purpose:</span>
                        <p className="text-slate-200 font-normal">{currentChapter.detailedDescription.purpose}</p>
                      </div>

                      <div className="border-t border-white/10 pt-1.5">
                        <span className="text-slate-400 font-semibold block text-[8px] uppercase tracking-wider">Under the Hood:</span>
                        <p className="text-slate-300 font-light leading-relaxed">{currentChapter.detailedDescription.whatItDoes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Goal checklist tasks */}
            <div className="border-t border-white/10 pt-3 mt-3 space-y-2 relative z-10">
              <div className="flex items-center gap-1.5">
                <CheckSquare size={15} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Mission Tasks</span>
              </div>
              
              <p className="text-[11px] text-slate-300 leading-normal bg-slate-950/40 p-2.5 rounded-xl border border-white/10">
                <span className="font-bold block text-slate-200 text-[10px] uppercase mb-0.5">Goal Objective:</span>
                {missionText}
              </p>

              {/* Dynamic steps indicator checklist */}
              <div className="space-y-1.5">
                {currentChapter.validationSteps.map((step, idx) => {
                  const isStepCompleted = gitState.currentStepIndex > idx;
                  const isStepActive = gitState.currentStepIndex === idx;

                  return (
                    <div 
                      key={idx}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-300
                        ${isStepCompleted 
                          ? 'bg-emerald-500/[0.05] border-emerald-500/20 text-emerald-300'
                          : isStepActive
                            ? isKingdom
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-950/30 border-white/5 text-slate-500'
                        }
                      `}
                    >
                      {isStepCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px] shrink-0">
                          ✓
                        </div>
                      ) : (
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] shrink-0
                          ${isStepActive 
                            ? isKingdom ? 'border-amber-500/50 text-amber-300' : 'border-cyan-500/50 text-cyan-300' 
                            : 'border-slate-800 text-slate-600'
                          }
                        `}>
                          {idx + 1}
                        </div>
                      )}
                      <span className="flex-grow text-[11px] truncate">{step.description}</span>
                      {isStepActive && (
                        <ChevronRight size={13} className="animate-pulse shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Terminal Shell (7 Cols) */}
        <div className={`lg:col-span-7 flex flex-col gap-3 h-full min-h-0 overflow-hidden ${activeMobileTab !== 'story' ? 'block' : 'hidden lg:flex'}`}>
          {/* Timeline (top - takes remaining flex height) */}
          <div className={`flex-grow min-h-0 overflow-hidden ${activeMobileTab === 'timeline' ? 'block' : 'hidden lg:block'}`}>
            <GitTimeline />
          </div>

          {/* Terminal (bottom - fixed height so console CLI is always 100% visible) */}
          <div className={`h-[280px] sm:h-[310px] shrink-0 overflow-hidden ${activeMobileTab === 'terminal' ? 'block' : 'hidden lg:block'}`}>
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};
