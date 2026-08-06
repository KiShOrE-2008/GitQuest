import React from 'react';
import { Play, CheckCircle2, Lock, Flame, Zap, Coins } from 'lucide-react';
import { CHAPTERS, type Quest } from '../data/quests';

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
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  setActiveView,
  setActiveQuestId,
}) => {
  // Determine if a quest is unlocked
  // Rules: A quest is unlocked if it's the first quest, OR the previous quest in the chapter or preceding chapters is completed.
  const isQuestUnlocked = (questId: string): boolean => {
    // Collect all quests in order
    const allQuests: Quest[] = [];
    CHAPTERS.forEach((ch) => {
      ch.quests.forEach((q) => {
        allQuests.push(q);
      });
    });

    const targetIdx = allQuests.findIndex((q) => q.id === questId);
    if (targetIdx <= 0) return true; // First quest is always unlocked

    // Unlocked if previous is completed
    const prevQuest = allQuests[targetIdx - 1];
    return userProfile.completedQuests.includes(prevQuest.id);
  };

  // Find the next uncompleted unlocked quest to recommend
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
    // If all completed, return last quest
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

  // Count total completed
  const totalQuestsCount = CHAPTERS.reduce((sum, ch) => sum + ch.quests.length, 0);
  const completedCount = userProfile.completedQuests.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-brand-text">
      {/* Welcome Banner Card */}
      <div className="bg-brand-panel border border-brand-border rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Neon blue radial glow */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center md:text-left space-y-2 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">{userProfile.name}</span>!
          </h2>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            Your Git skill level is progressing nicely. Complete coding tasks to unlock developer badges and master branch states.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
            <div>
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">World Progress</span>
              <span className="text-lg font-bold text-cyan-400">{completedCount} / {totalQuestsCount} Solved</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">Chapter Rank</span>
              <span className="text-lg font-bold text-purple-400">Level {userProfile.level}</span>
            </div>
          </div>
        </div>

        {/* Recommended Mission CTA */}
        {recommendedQuest && (
          <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-2xl md:w-80 shrink-0 w-full relative z-10 flex flex-col justify-between">
            <div>
              <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
                Recommended Mission
              </span>
              <h3 className="font-extrabold text-base mt-2 truncate">{recommendedQuest.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {recommendedQuest.description}
              </p>
            </div>
            <button
              onClick={() => handleLaunchQuest(recommendedQuest.id)}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
            >
              <Play size={12} className="fill-white" />
              <span>Launch Arena</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Roadmap & Daily Challenge grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chapters Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold tracking-wider uppercase text-gray-400 pl-1">
            Learning Roadmap
          </h3>

          {CHAPTERS.map((ch) => {
            // Check if any quest in this chapter is unlocked
            const isChapterUnlocked = ch.quests.some((q) => isQuestUnlocked(q.id));

            return (
              <div
                key={ch.id}
                className={`bg-brand-panel border border-brand-border rounded-2xl p-6 backdrop-blur-xl transition-all ${
                  isChapterUnlocked ? 'opacity-100 shadow-lg' : 'opacity-50'
                }`}
              >
                {/* Chapter Title Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="text-left">
                    <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest block">
                      {ch.world} world
                    </span>
                    <h4 className="font-extrabold text-lg mt-0.5">{ch.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{ch.description}</p>
                  </div>
                  {!isChapterUnlocked && (
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-gray-600">
                      <Lock size={14} />
                    </div>
                  )}
                </div>

                {/* Quests Lists in Chapter */}
                <div className="space-y-2">
                  {ch.quests.map((q) => {
                    const isCompleted = userProfile.completedQuests.includes(q.id);
                    const isUnlocked = isQuestUnlocked(q.id);

                    return (
                      <div
                        key={q.id}
                        onClick={() => isUnlocked && handleLaunchQuest(q.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                          isCompleted
                            ? 'bg-slate-950/20 border-emerald-950/20 hover:border-emerald-800/30 cursor-pointer'
                            : isUnlocked
                            ? 'bg-slate-950/40 border-slate-900 hover:border-purple-500/30 hover:bg-slate-900/10 cursor-pointer'
                            : 'bg-slate-950/10 border-transparent text-gray-600 pointer-events-none'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden mr-2">
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="text-emerald-500 fill-emerald-500/10" size={18} />
                            ) : isUnlocked ? (
                              <div className="w-4 h-4 rounded-full border-2 border-purple-500 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                              </div>
                            ) : (
                              <Lock size={14} className="text-gray-700" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm truncate">{q.title}</div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              Type: <span className="capitalize">{q.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* XP & Coin indicators */}
                        {isUnlocked && (
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              +{q.xp} XP
                            </span>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                              <Coins size={10} /> +{q.coins}
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

        {/* Right Column: Daily Challenge, Leaderboard brief, streaks */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-wider uppercase text-gray-400 pl-1">
            Activity Hub
          </h3>

          {/* Daily Challenge Card */}
          <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <Zap className="text-amber-400 fill-amber-400/10" size={16} />
                <span>Daily Challenge</span>
              </h4>
              <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
                Active
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-sm">Git Explorer Ritual</div>
              <p className="text-xs text-gray-400 leading-normal">
                Initialize a Git repository, stage changes, make a commit, and inspect history logs. (Complete the VCS Guard Boss Battle!)
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-gray-500 font-semibold">Reward:</span>
              <span className="text-xs font-extrabold text-amber-400 flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Coins size={12} /> +100 Coins
              </span>
            </div>
          </div>

          {/* Streak tracker */}
          <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <h4 className="font-extrabold text-sm flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Flame className="text-orange-500 fill-orange-500/10" size={16} />
              <span>Daily Streak Tracker</span>
            </h4>
            <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-900/60">
              <div className="text-left">
                <div className="text-2xl font-extrabold text-orange-400">{userProfile.streak} Days</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Active Streak</div>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((d) => (
                  <div
                    key={d}
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold border ${
                      d <= userProfile.streak
                        ? 'bg-orange-500/15 border-orange-500/40 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.15)]'
                        : 'bg-slate-950 border-slate-900 text-gray-600'
                    }`}
                  >
                    M
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-gray-500 text-center leading-normal">
              Solve at least one git mission daily to keep your learning fire burning!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
