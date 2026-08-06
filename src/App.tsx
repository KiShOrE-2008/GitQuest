import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopNavBar } from './components/TopNavBar';
import { Dashboard } from './pages/Dashboard';
import { SimulatorPage } from './pages/SimulatorPage';
import { ShopPage } from './pages/ShopPage';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { CHAPTERS, type Quest } from './data/quests';

interface UserProfile {
  name: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  streak: number;
  completedQuests: string[];
  shopUnlockedThemes: string[];
  shopUnlockedAvatars: string[];
  badges: string[];
}

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTheme, setActiveTheme] = useState<string>('default');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);

  // 1. Load profile from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gitquest_profile');
    const savedTheme = localStorage.getItem('gitquest_theme');
    
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
    if (savedTheme) {
      setActiveTheme(savedTheme);
    }
  }, []);

  // 2. Save profile helper
  const saveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('gitquest_profile', JSON.stringify(updated));
  };

  const handleStartOnboarding = (name: string, avatar: string) => {
    const initialProfile: UserProfile = {
      name,
      avatar,
      coins: 100, // starting coins
      xp: 0,
      level: 1,
      streak: 1,
      completedQuests: [],
      shopUnlockedThemes: ['default'],
      shopUnlockedAvatars: [avatar],
      badges: [],
    };
    saveProfile(initialProfile);
  };

  // 3. Quest completion handler
  const handleQuestComplete = (questId: string, xpEarned: number, coinsEarned: number) => {
    if (!userProfile) return;
    if (userProfile.completedQuests.includes(questId)) return; // No double claims

    const nextCompleted = [...userProfile.completedQuests, questId];
    const nextXp = userProfile.xp + xpEarned;
    const nextCoins = userProfile.coins + coinsEarned;

    // Level-up calculation: level starts at 1, requires level * 150 XP for next level
    let nextLevel = userProfile.level;
    let tempXp = nextXp;
    while (tempXp >= nextLevel * 150) {
      tempXp -= nextLevel * 150;
      nextLevel += 1;
    }

    // Badge awards checking
    const nextBadges = [...userProfile.badges];
    
    if (questId === 'q-git-commit' && !nextBadges.includes('first-commit')) {
      nextBadges.push('first-commit');
    }
    if (questId === 'q-git-branch-create' && !nextBadges.includes('branch-master')) {
      nextBadges.push('branch-master');
    }
    if (questId === 'q-boss-beginner' && !nextBadges.includes('git-hero')) {
      nextBadges.push('git-hero');
    }
    if (questId === 'q-boss-intermediate') {
      if (!nextBadges.includes('merge-wizard')) nextBadges.push('merge-wizard');
      if (!nextBadges.includes('conflict-solver')) nextBadges.push('conflict-solver');
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      completedQuests: nextCompleted,
      xp: nextXp,
      coins: nextCoins,
      level: nextLevel,
      badges: nextBadges,
    };

    saveProfile(updatedProfile);
  };

  // Switch to next quest automatically
  const handleNextQuest = () => {
    if (!activeQuestId) return;
    
    // Collect all quests in a flat array
    const allQuests: Quest[] = [];
    CHAPTERS.forEach(ch => {
      ch.quests.forEach(q => {
        allQuests.push(q);
      });
    });

    const currentIdx = allQuests.findIndex(q => q.id === activeQuestId);
    if (currentIdx !== -1 && currentIdx + 1 < allQuests.length) {
      setActiveQuestId(allQuests[currentIdx + 1].id);
    } else {
      // Completed everything, return to dashboard
      setActiveView('dashboard');
      setActiveQuestId(null);
    }
  };

  // 4. Shop Page interaction triggers
  const handleBuyTheme = (themeId: string, cost: number) => {
    if (!userProfile || userProfile.coins < cost) return;
    const updated: UserProfile = {
      ...userProfile,
      coins: userProfile.coins - cost,
      shopUnlockedThemes: [...userProfile.shopUnlockedThemes, themeId],
    };
    saveProfile(updated);
  };

  const handleEquipTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem('gitquest_theme', themeId);
  };

  const handleBuyAvatar = (avatarName: string, cost: number) => {
    if (!userProfile || userProfile.coins < cost) return;
    const updated: UserProfile = {
      ...userProfile,
      coins: userProfile.coins - cost,
      shopUnlockedAvatars: [...userProfile.shopUnlockedAvatars, avatarName],
    };
    saveProfile(updated);
  };

  const handleEquipAvatar = (avatarName: string) => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      avatar: avatarName,
    };
    saveProfile(updated);
  };

  const handleBuyBadge = (badgeId: string, cost: number) => {
    if (!userProfile || userProfile.coins < cost) return;
    const updated: UserProfile = {
      ...userProfile,
      coins: userProfile.coins - cost,
      badges: [...userProfile.badges, badgeId],
    };
    saveProfile(updated);
  };

  // Render Onboarding if no user profile is set
  if (!userProfile) {
    return <LandingPage onStart={handleStartOnboarding} />;
  }

  // Get active quest detail
  const getActiveQuest = (): Quest | null => {
    if (!activeQuestId) return null;
    let found: Quest | null = null;
    for (const ch of CHAPTERS) {
      const q = ch.quests.find(item => item.id === activeQuestId);
      if (q) {
        found = q;
        break;
      }
    }
    return found;
  };

  const activeQuest = getActiveQuest();

  // Resolve custom theme class names
  let themeStyle = 'bg-brand-bg text-brand-text';
  if (activeTheme === 'synthwave') {
    themeStyle = 'bg-[#180520] text-[#f472b6] theme-synthwave';
  } else if (activeTheme === 'matrix') {
    themeStyle = 'bg-[#030d04] text-[#00ff41] font-mono theme-matrix';
  } else if (activeTheme === 'ocean') {
    themeStyle = 'bg-[#021020] text-[#38bdf8] theme-ocean';
  }

  return (
    <div className={`min-h-screen bg-grid-pattern flex flex-col ${themeStyle}`}>
      {/* Dynamic background lighting elements */}
      {activeTheme === 'default' && (
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>
      )}
      {activeTheme === 'synthwave' && (
        <>
          <div className="absolute top-0 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}
      {activeTheme === 'matrix' && (
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      )}

      {/* Top HUD Stats & Navigation */}
      <TopNavBar
        userProfile={userProfile}
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view !== 'simulator') setActiveQuestId(null);
        }}
      />

      {/* View router panels */}
      <main className="flex-grow p-6 relative z-10">
        {activeView === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            setActiveView={setActiveView}
            setActiveQuestId={setActiveQuestId}
          />
        )}

        {activeView === 'simulator' && activeQuest && (
          <SimulatorPage
            quest={activeQuest}
            onQuestComplete={handleQuestComplete}
            onNextQuest={handleNextQuest}
          />
        )}

        {activeView === 'shop' && (
          <ShopPage
            userProfile={userProfile}
            activeTheme={activeTheme}
            onBuyTheme={handleBuyTheme}
            onEquipTheme={handleEquipTheme}
            onBuyAvatar={handleBuyAvatar}
            onEquipAvatar={handleEquipAvatar}
            onBuyBadge={handleBuyBadge}
          />
        )}

        {activeView === 'leaderboard' && (
          <LeaderboardView userProfile={userProfile} />
        )}

        {activeView === 'profile' && (
          <ProfileView userProfile={userProfile} />
        )}
      </main>

      <footer className="py-4 border-t border-brand-border bg-slate-950/20 text-center text-[10px] text-gray-600 relative z-10">
        GitQuest Simulator © 2026. Made with ❤️ for mastering version history controls.
      </footer>
    </div>
  );
}
