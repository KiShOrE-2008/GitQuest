import React from 'react';
import { Play, CheckCircle2, Lock, Flame, Zap } from 'lucide-react';
import { CHAPTERS, type Quest } from '../data/quests';
import { translateMarkdown, type WorldTheme } from '../utils/themeTranslator';

interface DashboardProps {
  userProfile: {
    name: string;
    avatar: string;
    coins: number;
    xp: number;
    level: number;
    streak: number;
    completedQuests: string[];
  };
  setActiveView: (view: string) => void;
  setActiveQuestId: (questId: string) => void;
  activeTheme: WorldTheme;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  setActiveView,
  setActiveQuestId,
  activeTheme,
}) => {
  const isKingdom = activeTheme === 'kingdom';

  // Dynamic styling selectors
  const accentText = isKingdom ? 'text-amber-400' : 'text-cyan-400';
  const borderCol = isKingdom ? 'border-amber-500/20' : 'border-cyan-500/20';
  const activeBorder = isKingdom ? 'border-amber-500' : 'border-cyan-500';
  const btnBg = isKingdom ? 'bg-amber-600 border-amber-400 hover:bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-cyan-600 border-cyan-400 hover:bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
  const textTitle = isKingdom ? 'text-amber-400 glow-amber-text' : 'text-pink-400 glow-pink-text';

  const isQuestUnlocked = (questId: string): boolean => {
    const allQuests: Quest[] = [];
    CHAPTERS.forEach((ch) => {
      ch.quests.forEach((q) => {
        allQuests.push(q);
      });
    });

    const targetIdx = allQuests.findIndex((q) => q.id === questId);
    if (targetIdx <= 0) return true;

    const prevQuest = allQuests[targetIdx - 1];
    return userProfile.completedQuests.includes(prevQuest.id);
  };

  const getRecommendedQuest = (): Quest | null => {
    let recommended: Quest | null = null;
    for (const ch of CHAPTERS) {
      for (const q of ch.quests) {
        if (!userProfile.completedQuests.includes(q.id) && isQuestUnlocked(q.id)) {
          recommended = q;
          break;
        }
      }
      if (recommended) break;
    }
    if (!recommended && CHAPTERS.length > 0) {
      const lastCh = CHAPTERS[CHAPTERS.length - 1];
      recommended = lastCh.quests[lastCh.quests.length - 1];
    }
    return recommended;
  };

  const recommendedQuest = getRecommendedQuest();

  const handleLaunchQuest = (questId: string) => {
    setActiveQuestId(questId);
    setActiveView('simulator');
  };

  const totalQuestsCount = CHAPTERS.reduce((sum, ch) => sum + ch.quests.length, 0);
  const completedCount = userProfile.completedQuests.length;

  return (
    <div className={`max-w-5xl mx-auto space-y-8 ${isKingdom ? 'text-amber-100' : 'text-cyan-100'}`}>
      {/* Welcome Banner Card */}
      <div className={`arcade-panel rounded-none p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
        isKingdom ? 'border-amber-500' : 'border-pink-500'
      }`}>
        <div className="text-center md:text-left space-y-3 relative z-10 font-arcade">
          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-wider ${textTitle}`}>
            WELCOME, {userProfile.name}
          </h2>
          <p className={`${accentText} text-xs tracking-wide leading-relaxed font-pixel text-[16px] max-w-md`}>
            {isKingdom
              ? 'THE ROYAL ARCHIVES ARE DISORGANIZED. COMMUNE WITH THE SCROLL KEEPER TO RECORD NEW DECREES, UNITE PROVINCES, AND SECURE THE REIGN.'
              : 'THE SPACE STATION CORES ARE DESYNCHRONIZED. INTERFACE WITH THE CORE AI TO LOG TIME CHECKPOINTS, RESOLVE TIMELINES, AND PREVENT DISSOLUTION.'}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-6 pt-2 font-arcade text-[9px]">
            <div>
              <span className="text-gray-500 block">SECTORS SYNCHRONIZED</span>
              <span className={`text-xs font-bold ${accentText} mt-1 block`}>{completedCount} / {totalQuestsCount}</span>
            </div>
            <div className={`w-[2px] h-8 ${isKingdom ? 'bg-amber-500/30' : 'bg-pink-500/30'}`}></div>
            <div>
              <span className="text-gray-500 block">PLAYER LEVEL RANK</span>
              <span className={`text-xs font-bold mt-1 block ${isKingdom ? 'text-amber-400' : 'text-pink-400'}`}>STAGE {userProfile.level}</span>
            </div>
          </div>
        </div>

        {/* Recommended Mission CTA */}
        {recommendedQuest && (
          <div className={`bg-slate-950 border-2 ${activeBorder} p-6 rounded-none md:w-80 shrink-0 w-full relative z-10 flex flex-col justify-between font-arcade`}>
            <div>
              <span className={`text-[7px] ${isKingdom ? 'text-amber-500 bg-amber-950/40 border-amber-500' : 'text-pink-500 bg-pink-950/40 border-pink-500'} border px-2 py-0.5 font-extrabold uppercase tracking-widest arcade-blink glow-text`}>
                CURRENT MISSION
              </span>
              <h3 className="font-extrabold text-[10px] text-white mt-3 truncate">
                {translateMarkdown(recommendedQuest.title, activeTheme).toUpperCase()}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-pixel text-[14px] line-clamp-2 leading-relaxed normal-case">
                {translateMarkdown(recommendedQuest.description, activeTheme)}
              </p>
            </div>
            <button
              onClick={() => handleLaunchQuest(recommendedQuest.id)}
              className={`mt-5 w-full arcade-btn text-white font-bold py-2.5 px-4 rounded-none text-[8px] flex items-center justify-center gap-1.5 transition-all ${btnBg}`}
            >
              <Play size={10} className="fill-white" />
              <span>START MISSION</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Roadmap & Daily Challenge grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chapters Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-arcade tracking-widest uppercase text-gray-400 pl-1">
            CAMPAIGN WORLD MAP
          </h3>

          {CHAPTERS.map((ch) => {
            const isChapterUnlocked = ch.quests.some((q) => isQuestUnlocked(q.id));

            return (
              <div
                key={ch.id}
                className={`arcade-panel rounded-none p-6 transition-all ${
                  isKingdom ? 'border-amber-500/60' : 'border-pink-500/60'
                } ${isChapterUnlocked ? 'opacity-100' : 'opacity-40'}`}
              >
                {/* Chapter Title Header */}
                <div className={`flex items-start justify-between gap-4 mb-5 border-b-2 ${borderCol} pb-3`}>
                  <div className="text-left font-arcade">
                    <span className={`text-[8px] ${accentText} uppercase tracking-widest block`}>
                      {isKingdom ? 'KINGDOM' : 'COSMIC'} LEVEL
                    </span>
                    <h4 className={`font-extrabold text-sm mt-1 ${isKingdom ? 'text-amber-400' : 'text-pink-400'}`}>
                      {translateMarkdown(ch.title, activeTheme).toUpperCase()}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-pixel normal-case text-[14px]">
                      {translateMarkdown(ch.description, activeTheme)}
                    </p>
                  </div>
                  {!isChapterUnlocked && (
                    <div className="w-8 h-8 rounded-none bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-gray-700">
                      <Lock size={14} />
                    </div>
                  )}
                </div>

                {/* Quests Lists in Chapter */}
                <div className="space-y-3 font-arcade text-[10px]">
                  {ch.quests.map((q) => {
                    const isCompleted = userProfile.completedQuests.includes(q.id);
                    const isUnlocked = isQuestUnlocked(q.id);

                    return (
                      <div
                        key={q.id}
                        onClick={() => isUnlocked && handleLaunchQuest(q.id)}
                        className={`flex items-center justify-between p-3.5 border-2 text-left transition-all ${
                          isCompleted
                            ? 'bg-slate-950/20 border-emerald-800/40 hover:border-emerald-600/60 cursor-pointer'
                            : isUnlocked
                            ? `bg-slate-950 ${isKingdom ? 'border-amber-800 hover:border-amber-500 hover:bg-amber-950/10' : 'border-cyan-800 hover:border-pink-500 hover:bg-pink-950/10'} cursor-pointer`
                            : 'bg-slate-950/10 border-slate-950 text-gray-800 pointer-events-none'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden mr-2">
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="text-emerald-400 fill-emerald-500/10" size={16} />
                            ) : isUnlocked ? (
                              <div className={`w-3.5 h-3.5 border-2 ${isKingdom ? 'border-amber-500' : 'border-pink-500'} flex items-center justify-center animate-pulse`}>
                                <div className={`w-1.5 h-1.5 ${isKingdom ? 'bg-amber-500' : 'bg-pink-500'}`}></div>
                              </div>
                            ) : (
                              <Lock size={12} className="text-gray-800" />
                            )}
                          </div>
                          <div>
                            <div className={`font-bold text-[10px] truncate ${
                              isCompleted ? 'text-emerald-400' : isUnlocked ? accentText : 'text-gray-700'
                            }`}>
                              {translateMarkdown(q.title, activeTheme).toUpperCase()}
                            </div>
                            <div className="text-[7px] text-gray-500 font-semibold tracking-wider mt-0.5">
                              MISSION TYPE: <span className="uppercase text-gray-400">{q.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* XP & Coin indicators */}
                        {isUnlocked && (
                          <div className="flex items-center gap-3 shrink-0 text-[8px]">
                            <span className={`font-bold ${isKingdom ? 'text-amber-400 bg-amber-950/40 border-amber-500/30' : 'text-pink-400 bg-pink-950/40 border-pink-500/30'} border px-2 py-0.5`}>
                              +{q.xp} XP
                            </span>
                            <span className="font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 flex items-center gap-0.5">
                              +{q.coins} CREDITS
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Daily Challenge, streaks */}
        <div className="space-y-6">
          <h3 className="text-sm font-arcade tracking-widest uppercase text-gray-400 pl-1">
            CAMPAIGN TARGETS
          </h3>

          {/* Daily Challenge Card */}
          <div className={`arcade-panel rounded-none p-6 space-y-4 font-arcade ${
            isKingdom ? 'border-amber-500/60' : 'border-pink-500/60'
          }`}>
            <div className={`flex items-center justify-between border-b-2 ${borderCol} pb-3`}>
              <h4 className={`font-extrabold text-[10px] flex items-center gap-1.5 ${accentText}`}>
                <Zap className={`${isKingdom ? 'text-amber-500' : 'text-pink-500'} animate-bounce`} size={14} />
                <span>SIDE QUEST</span>
              </h4>
              <span className={`text-[7px] ${isKingdom ? 'text-amber-500 bg-amber-950/40 border-amber-500' : 'text-pink-500 bg-pink-950/40 border-pink-500'} border px-2 py-0.5 uppercase tracking-widest glow-text`}>
                ACTIVE
              </span>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[10px] text-white">REPOS D DAG RITUAL</div>
              <p className="text-[14px] text-gray-400 leading-normal font-pixel normal-case">
                {isKingdom
                  ? 'Initiate the Realm Git repository in your Kingdom, prepare castle bricks to chronicle, record commits, and consult the royal chronicles ledger.'
                  : 'Boot up the Time-Line Tracker in your Space Station, buffer oxygen generator sector files, establish checkpoints, and query chronology logs.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-900/60 text-[8px]">
              <span className="text-gray-500 font-semibold">REWARD:</span>
              <span className="font-extrabold text-amber-400 bg-amber-950/40 px-2 py-0.5 border border-amber-500/20">
                +100 CREDITS
              </span>
            </div>
          </div>

          {/* Streak tracker */}
          <div className={`arcade-panel rounded-none p-6 space-y-4 font-arcade ${
            isKingdom ? 'border-amber-500/60' : 'border-pink-500/60'
          }`}>
            <h4 className={`font-extrabold text-[10px] flex items-center gap-1.5 border-b-2 ${borderCol} pb-3 ${accentText}`}>
              <Flame className="text-orange-500 fill-orange-500/10" size={14} />
              <span>COMBO STREAK</span>
            </h4>
            <div className={`flex justify-between items-center bg-slate-950 border-2 ${isKingdom ? 'border-amber-800/40' : 'border-cyan-800'} p-4`}>
              <div className="text-left">
                <div className="text-lg font-extrabold text-orange-400">{userProfile.streak} COMBO</div>
                <div className="text-[7px] text-gray-500 uppercase tracking-widest font-bold">Daily Streak</div>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((d) => (
                  <div
                    key={d}
                    className={`w-5 h-5 border flex items-center justify-center text-[8px] font-bold ${
                      d <= userProfile.streak
                        ? 'bg-orange-500/15 border-orange-500 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                        : 'bg-slate-950 border-slate-900 text-gray-800'
                    }`}
                  >
                    ★
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[14px] text-gray-500 text-center font-pixel normal-case">
              Solve at least one git mission daily to keep your combo multiplier hot!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
