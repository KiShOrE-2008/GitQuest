import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { EditProfile } from './EditProfile';
import { 
  Award, 
  BarChart2, 
  CheckCircle2, 
  LogOut, 
  GraduationCap, 
  Flame, 
  Zap, 
  Shield, 
  Rocket, 
  Star, 
  Lock, 
  ChevronRight, 
  TrendingUp, 
  Mail, 
  Key,
  Layers,
  GitBranch,
  Terminal,
  GitMerge,
  Share2,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { chapters } from '../data/chapters';

export const Profile: React.FC = () => {
  const { 
    activeWorld, 
    xp, 
    level, 
    streak, 
    completedChapters, 
    achievements, 
    user, 
    logout,
    setChapterIndex
  } = useGame();

  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const isKingdom = activeWorld === 'kingdom';

  if (isEditingProfile) {
    return <EditProfile onBack={() => setIsEditingProfile(false)} />;
  }

  // Level XP calculations
  const baseLevelXp = (level - 1) * 300;
  const currentLevelProgress = xp - baseLevelXp;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / 300) * 100));

  // Mastery percentage overall
  const totalChapters = chapters.length;
  const numCompleted = completedChapters.length;
  const overallMastery = Math.round((numCompleted / totalChapters) * 100);

  // Rank title determination based on level
  const getRankTitle = () => {
    if (level >= 10) return isKingdom ? 'Grand Sovereign of Version Control' : 'Supreme Commander of Timeline';
    if (level >= 7) return isKingdom ? 'Royal Arch-Mage of Repositories' : 'Starfleet Master Navigator';
    if (level >= 4) return isKingdom ? 'High Historian Architect' : 'Senior Temporal Engineer';
    if (level >= 2) return isKingdom ? 'Guild Chronicler' : 'Fleet Operations Cadet';
    return isKingdom ? 'Apprentice Historian' : 'Temporal Initiate';
  };

  // Skill sets calculation with domain icons & tags
  const skillSets = [
    { 
      id: 'foundations',
      name: 'Core Repositories', 
      commands: 'git init, git status', 
      val: Math.min(100, Math.round((completedChapters.filter(id => id <= 3).length / 3) * 100)),
      icon: Terminal
    },
    { 
      id: 'snapshots',
      name: 'Snapshots & Commits', 
      commands: 'git add, git commit, git log', 
      val: Math.min(100, Math.round((completedChapters.filter(id => id >= 3 && id <= 5).length / 3) * 100)),
      icon: Layers
    },
    { 
      id: 'branching',
      name: 'Branching & Checkout', 
      commands: 'git branch, git checkout', 
      val: Math.min(100, Math.round((completedChapters.filter(id => id >= 6 && id <= 7).length / 2) * 100)),
      icon: GitBranch
    },
    { 
      id: 'integrations',
      name: 'Merges & Conflicts', 
      commands: 'git merge, conflict resolution', 
      val: Math.min(100, Math.round((completedChapters.filter(id => id >= 8 && id <= 9).length / 2) * 100)),
      icon: GitMerge
    },
    { 
      id: 'collaborations',
      name: 'Remote & Team Uplink', 
      commands: 'git push, git pull, git clone', 
      val: Math.min(100, Math.round((completedChapters.filter(id => id >= 10 && id <= 12).length / 3) * 100)),
      icon: Share2
    },
    { 
      id: 'history',
      name: 'History Rewriting', 
      commands: 'git reset, git revert, git rebase', 
      val: Math.min(100, Math.round((completedChapters.filter(id => id >= 13 && id <= 16).length / 4) * 100)),
      icon: RotateCcw
    },
  ];

  // All achievements dictionary metadata
  const ALL_BADGES = [
    { title: "First Commit", desc: "Create your first repository snapshot.", icon: "📌" },
    { title: "Branch Explorer", desc: "Create an alternate development timeline.", icon: "🌿" },
    { title: "Merge Master", desc: "Successfully integrate separate branches.", icon: "🔀" },
    { title: "Conflict Resolver", desc: "Settle divergent files manually.", icon: "⚔️" },
    { title: "Git Hero", desc: "Reach Level 5 or restore corrupted history.", icon: "👑" },
  ];

  const filteredBadges = ALL_BADGES.filter(badge => {
    const isUnlocked = achievements.includes(badge.title);
    if (badgeFilter === 'unlocked') return isUnlocked;
    if (badgeFilter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Hero Profile Glassmorphic Banner Card */}
      <div className={`relative rounded-3xl border overflow-hidden p-8 backdrop-blur-2xl transition-all duration-500 shadow-2xl
        ${isKingdom 
          ? 'bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-amber-950/20 border-amber-500/20 shadow-amber-500/5' 
          : 'bg-gradient-to-r from-cyan-950/30 via-slate-950/80 to-cyan-950/20 border-cyan-500/20 shadow-cyan-500/5'
        }
      `}>
        {/* Dynamic ambient spotlight halos */}
        <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-30
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />
        <div className={`absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20
          ${isKingdom ? 'bg-orange-500' : 'bg-blue-500'}
        `} />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Avatar & Core Profile Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full md:w-auto">
            {/* Glowing Avatar Frame */}
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500
                ${isKingdom ? 'bg-gradient-to-tr from-amber-500 to-amber-300' : 'bg-gradient-to-tr from-cyan-500 to-cyan-300'}
              `} />
              <div className={`w-28 h-28 rounded-3xl flex items-center justify-center font-black text-4xl text-slate-950 relative z-10 border shadow-2xl
                ${isKingdom 
                  ? 'bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 border-amber-300' 
                  : 'bg-gradient-to-tr from-cyan-400 via-cyan-300 to-cyan-200 border-cyan-300'
                }
              `}>
                {(user?.username || 'OP').substring(0, 2).toUpperCase()}
              </div>

              {/* Level Badge Overlay */}
              <div className={`absolute -bottom-2 -right-2 z-20 px-2.5 py-0.5 rounded-lg text-[11px] font-black text-slate-950 shadow-lg border
                ${isKingdom ? 'bg-amber-400 border-amber-200' : 'bg-cyan-400 border-cyan-200'}
              `}>
                Lv.{level}
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {user?.username || 'Starfleet Commander'}
                </h1>
                <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5
                  ${isKingdom 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  }
                `}>
                  {isKingdom ? <Shield size={13} /> : <Rocket size={13} />}
                  {getRankTitle()}
                </span>
              </div>

              {/* User Sub Metadata pill line */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Mail size={13} className="text-slate-500" />
                  <span>{user?.email || 'operator@gitverse.io'}</span>
                </div>
                {user?.collegeName && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span>•</span>
                    <GraduationCap size={14} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                    <span className="font-semibold">{user.collegeName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>•</span>
                  <Key size={13} className="text-slate-500" />
                  <span className="capitalize">{user?.provider || 'Standard Local'} Auth</span>
                </div>
              </div>

              {/* XP Progress Bar in Hero */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between items-center text-[11px] font-extrabold mb-1">
                  <span className="text-slate-400 uppercase tracking-wider">Level {level} Progress</span>
                  <span className={isKingdom ? 'text-amber-400' : 'text-cyan-400'}>
                    {currentLevelProgress} / 300 XP ({Math.round(progressPercent)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden relative border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-700 ease-out shadow-sm
                      ${isKingdom 
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400' 
                        : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400'
                      }
                    `}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit Profile & Sign Out */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsEditingProfile(true)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
                ${isKingdom
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 shadow-amber-500/5'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-cyan-500/5'
                }
              `}
            >
              <Edit3 size={16} /> 
              Edit Profile Details
            </button>

            <button 
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/5 group"
            >
              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Player Level */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-5 flex items-center gap-4 backdrop-blur-xl hover:border-slate-750 transition-colors shadow-lg">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0
            ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}
          `}>
            <Zap size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block tracking-wider">Player Rank</span>
            <span className="text-2xl font-black text-white">Level {level}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Curriculum Tier</span>
          </div>
        </div>

        {/* Card 2: Total XP */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-5 flex items-center gap-4 backdrop-blur-xl hover:border-slate-750 transition-colors shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Star size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block tracking-wider">Total Experience</span>
            <span className="text-2xl font-black text-white">{xp} <span className="text-xs text-purple-400 font-bold">XP</span></span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">+100 per mission</span>
          </div>
        </div>

        {/* Card 3: Streak */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-5 flex items-center gap-4 backdrop-blur-xl hover:border-slate-750 transition-colors shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block tracking-wider">Daily Streak</span>
            <span className="text-2xl font-black text-white">{streak} <span className="text-xs text-orange-400 font-bold">Days</span></span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Active Learning</span>
          </div>
        </div>

        {/* Card 4: Curriculum Mastery */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-5 flex items-center gap-4 backdrop-blur-xl hover:border-slate-750 transition-colors shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block tracking-wider">Git Mastery</span>
            <span className="text-2xl font-black text-white">{overallMastery}%</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">{numCompleted}/{totalChapters} Chapters</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Matrix (Left) & Unlocked Badges (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Git Skillset Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950/50 rounded-3xl border border-slate-850 p-7 space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isKingdom ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  <BarChart2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Git Skillset Matrix</h3>
                  <span className="text-[11px] text-slate-500">Domain competency breakdown based on completed missions</span>
                </div>
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg border
                ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}
              `}>
                {skillSets.filter(s => s.val === 100).length} / 6 Domains Mastered
              </span>
            </div>

            <div className="space-y-5">
              {skillSets.map((skill) => {
                const SkillIcon = skill.icon;
                const isMastered = skill.val === 100;

                return (
                  <div key={skill.id} className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border transition-colors
                          ${isMastered 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-slate-200'
                          }
                        `}>
                          <SkillIcon size={15} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-200 block leading-tight">{skill.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 block">{skill.commands}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold font-mono
                          ${isMastered ? 'text-emerald-400' : isKingdom ? 'text-amber-400' : 'text-cyan-400'}
                        `}>
                          {skill.val}%
                        </span>
                        {isMastered && (
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        )}
                      </div>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-900/80 overflow-hidden relative border border-slate-850">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full
                          ${isMastered
                            ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400'
                            : isKingdom 
                              ? 'bg-gradient-to-r from-amber-600 to-amber-400' 
                              : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
                          }
                        `}
                        style={{ width: `${skill.val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Completed Timeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Achievements Card */}
          <div className="bg-slate-950/50 rounded-3xl border border-slate-850 p-6 space-y-5 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <Award size={18} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                <h3 className="text-base font-bold text-slate-100">Achievements</h3>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['all', 'unlocked', 'locked'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setBadgeFilter(filter)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg capitalize transition-all
                      ${badgeFilter === filter 
                        ? isKingdom 
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                      }
                    `}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="space-y-3">
              {filteredBadges.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No badges match the selected filter.
                </div>
              ) : (
                filteredBadges.map((badge) => {
                  const isUnlocked = achievements.includes(badge.title);

                  return (
                    <div 
                      key={badge.title}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3
                        ${isUnlocked
                          ? isKingdom
                            ? 'bg-amber-500/[0.04] border-amber-500/20'
                            : 'bg-cyan-500/[0.04] border-cyan-500/20'
                          : 'bg-slate-900/30 border-slate-850 opacity-60'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shrink-0
                          ${isUnlocked
                            ? isKingdom 
                              ? 'bg-amber-500/20 border-amber-500/30 text-amber-300 shadow-md shadow-amber-500/10' 
                              : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                          }
                        `}>
                          {badge.icon}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-200 block leading-tight">{badge.title}</span>
                          <span className="text-[10px] text-slate-400 block leading-snug">{badge.desc}</span>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                          ✓ Unlocked
                        </span>
                      ) : (
                        <div className="p-1 rounded-lg bg-slate-900 text-slate-600 border border-slate-800">
                          <Lock size={14} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Completed Timeline Chapters History */}
          <div className="bg-slate-950/50 rounded-3xl border border-slate-850 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                <h3 className="text-base font-bold text-slate-100">Timeline Chapters Mastered</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {numCompleted} / {totalChapters}
              </span>
            </div>

            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2 select-none">
              {completedChapters.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No timeline chapters completed yet. Start learning from the map!
                </div>
              ) : (
                completedChapters.map((id) => {
                  const ch = chapters.find(c => c.id === id);
                  if (!ch) return null;

                  return (
                    <div 
                      key={id}
                      onClick={() => setChapterIndex(ch.id - 1)}
                      className="flex items-center justify-between text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
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
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          +{ch.xpReward} XP
                        </span>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                      </div>
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
