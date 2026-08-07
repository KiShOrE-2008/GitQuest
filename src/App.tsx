import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopNavBar } from './components/TopNavBar';
import { Dashboard } from './pages/Dashboard';
import { SimulatorPage } from './pages/SimulatorPage';
import { ShopPage } from './pages/ShopPage';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { CHAPTERS, type Quest } from './data/quests';
import { type WorldTheme } from './utils/themeTranslator';

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
  const [activeTheme, setActiveTheme] = useState<WorldTheme>('kingdom');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);

  // 1. Load profile from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gitquest_profile');
    const savedTheme = localStorage.getItem('gitquest_theme');
    
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
    if (savedTheme === 'kingdom' || savedTheme === 'space') {
      setActiveTheme(savedTheme);
    } else {
      setActiveTheme('kingdom');
    }
  }, []);

  // 2. Save profile helper
  const saveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('gitquest_profile', JSON.stringify(updated));
  };

  const handleStartOnboarding = (name: string, avatar: string, world: 'kingdom' | 'space') => {
    const initialProfile: UserProfile = {
      name,
      avatar,
      coins: 100, // starting coins
      xp: 0,
      level: 1,
      streak: 1,
      completedQuests: [],
      shopUnlockedThemes: ['kingdom', 'space'],
      shopUnlockedAvatars: [avatar],
      badges: [],
    };
    saveProfile(initialProfile);
    setActiveTheme(world);
    localStorage.setItem('gitquest_theme', world);
  };

  // 3. Quest completion handler
  const handleQuestComplete = (questId: string, xpEarned: number, coinsEarned: number) => {
    if (!userProfile) return;
    if (userProfile.completedQuests.includes(questId)) return; // No double claims

    const nextCompleted = [...userProfile.completedQuests, questId];
    const nextXp = userProfile.xp + xpEarned;
    const nextCoins = userProfile.coins + coinsEarned;

    // Level-up calculation
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
    if (themeId === 'kingdom' || themeId === 'space') {
      setActiveTheme(themeId);
      localStorage.setItem('gitquest_theme', themeId);
    }
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
  if (activeTheme === 'kingdom') {
    themeStyle = 'bg-[#0f0a06] text-amber-100/90 theme-kingdom';
  } else if (activeTheme === 'space') {
    themeStyle = 'bg-[#030416] text-cyan-100/90 theme-space';
  }

  return (
    <div className={`min-h-screen bg-grid-pattern flex flex-col ${themeStyle}`}>
      {/* Dynamic background lighting elements */}
      {activeTheme === 'kingdom' && (
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-900/5 rounded-full blur-3xl pointer-events-none"></div>
      )}
      {activeTheme === 'space' && (
        <>
          <div className="absolute top-0 left-10 w-96 h-96 bg-cyan-950/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-950/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      {/* Top HUD Stats & Navigation */}
      <TopNavBar
        userProfile={userProfile}
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view !== 'simulator') setActiveQuestId(null);
        }}
        activeTheme={activeTheme}
        setActiveTheme={handleEquipTheme}
      />

      {/* View router panels */}
      <main className="flex-grow p-6 relative z-10">
        {activeView === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            setActiveView={setActiveView}
            setActiveQuestId={setActiveQuestId}
            activeTheme={activeTheme}
          />
        )}

        {activeView === 'simulator' && activeQuest && (
          <SimulatorPage
            quest={activeQuest}
            onQuestComplete={handleQuestComplete}
            onNextQuest={handleNextQuest}
            activeTheme={activeTheme}
            userAvatar={userProfile.avatar}
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

      <footer className={`py-4 border-t text-center text-[10px] relative z-10 ${
        activeTheme === 'kingdom'
          ? 'border-amber-900/40 bg-amber-950/5 text-amber-800'
          : 'border-cyan-950/40 bg-cyan-950/5 text-cyan-800'
      }`}>
        GitVerse Engine • Master Version Control Through Interchangeable Realities © 2026.
      </footer>
    </div>
  );
}
