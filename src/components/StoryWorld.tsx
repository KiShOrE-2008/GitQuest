import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import type { SceneProps } from './scenes/SceneFoundations';
import { Ch1Scene, Ch2Scene, Ch3Scene, Ch4Scene, Ch5Scene } from './scenes/SceneFoundations';
import { Ch6Scene, Ch7Scene, Ch8Scene, Ch9Scene } from './scenes/SceneBranching';
import { Ch10Scene, Ch11Scene, Ch12Scene } from './scenes/SceneRemotes';
import { Ch13Scene, Ch14Scene, Ch15Scene, Ch16Scene, Ch17Scene } from './scenes/SceneHistory';
import { Ch18Scene, Ch19Scene, Ch20Scene } from './scenes/SceneCollabFinal';

const SCENE_MAP: Record<number, React.FC<SceneProps>> = {
  1: Ch1Scene,   2: Ch2Scene,   3: Ch3Scene,   4: Ch4Scene,   5: Ch5Scene,
  6: Ch6Scene,   7: Ch7Scene,   8: Ch8Scene,   9: Ch9Scene,
  10: Ch10Scene, 11: Ch11Scene, 12: Ch12Scene,
  13: Ch13Scene, 14: Ch14Scene, 15: Ch15Scene, 16: Ch16Scene, 17: Ch17Scene,
  18: Ch18Scene, 19: Ch19Scene, 20: Ch20Scene,
};

export const StoryWorld: React.FC = () => {
  const { activeWorld, currentChapterIndex, gitState, completedChapters } = useGame();
  const isKingdom = activeWorld === 'kingdom';
  const chapter = chapters[currentChapterIndex];

  const phase = useMemo((): 'idle' | 'active' | 'complete' => {
    if (completedChapters.includes(chapter.id)) return 'complete';
    if (gitState.currentStepIndex > 0) return 'active';
    return 'idle';
  }, [completedChapters, chapter.id, gitState.currentStepIndex]);

  const SceneComponent = SCENE_MAP[chapter.id];

  const accentColor = isKingdom ? '#f59e0b' : '#06b6d4';
  const accentBg    = isKingdom ? 'border-amber-500/20 bg-amber-500/[0.04]' : 'border-cyan-500/20 bg-cyan-500/[0.04]';
  const accentText  = isKingdom ? 'text-amber-400' : 'text-cyan-400';

  const difficultyLabel = chapter.id <= 5 ? '🟢 Basic' : chapter.id <= 12 ? '🟡 Intermediate' : chapter.id <= 17 ? '🔴 Advanced' : '🟣 Boss';

  return (
    <div className={`relative rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-500 shadow-2xl ${accentBg}`}>
      {/* Header strip */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Story World</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${accentBg} ${accentText}`}>
            {isKingdom ? '🏰 Kingdom Chronicles' : '🚀 Space Odyssey'}
          </span>
          <span className="text-[9px] text-slate-600">{difficultyLabel}</span>
        </div>
        {/* Phase indicator */}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            phase === 'complete' ? 'bg-emerald-500 animate-pulse' :
            phase === 'active'   ? 'bg-yellow-400 animate-pulse' :
            'bg-slate-600'
          }`} />
          <span className={`text-[9px] font-bold uppercase ${
            phase === 'complete' ? 'text-emerald-400' :
            phase === 'active'   ? 'text-yellow-400' :
            'text-slate-600'
          }`}>{phase}</span>
        </div>
      </div>

      {/* Scene animation area */}
      <div className="h-48 relative">
        {SceneComponent ? (
          <SceneComponent phase={phase} stepIndex={gitState.currentStepIndex} isKingdom={isKingdom} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm italic">
            Scene loading…
          </div>
        )}
      </div>

      {/* Bottom: "What Just Happened?" 3-step reveal — shown once a step completes */}
      {(phase === 'active' || phase === 'complete') && (
        <div className="border-t border-slate-900/60 px-5 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:divide-x sm:divide-slate-800">
            {/* Step 1: Story action */}
            <div className="flex items-start gap-2 sm:pr-5 flex-1">
              <span className="text-base shrink-0">🎮</span>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Story Action</span>
                <span className="text-[10px] font-semibold text-slate-300">
                  {isKingdom ? chapter.realityMode.gameAction : (chapter.realityMode as any).spaceAction || chapter.realityMode.gameAction}
                </span>
              </div>
            </div>
            {/* Step 2: Git concept */}
            <div className="flex items-start gap-2 sm:px-5 flex-1">
              <span className="text-base shrink-0">🌿</span>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Git Concept</span>
                <span className="text-[10px] font-semibold" style={{ color: accentColor }}>
                  {chapter.conceptTerm} — {chapter.conceptMapping[activeWorld]}
                </span>
              </div>
            </div>
            {/* Step 3: Real command */}
            <div className="flex items-start gap-2 sm:pl-5 flex-1">
              <span className="text-base shrink-0">💻</span>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Real Command</span>
                <code className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border
                  ${isKingdom ? 'border-amber-500/30 bg-amber-500/5 text-amber-300' : 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300'}`}>
                  $ {chapter.realityMode.gitCommand}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
