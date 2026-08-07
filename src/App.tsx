import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { GameProvider, useGame } from './context/GameContext';
import { LandingPage } from './components/LandingPage';
import { WorldSelection } from './components/WorldSelection';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LearningScreen } from './components/LearningScreen';
import { Achievements } from './components/Achievements';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { MissionComplete } from './components/MissionComplete';

function AppContent() {
  const [view, setView] = useState<'landing' | 'auth' | 'selection' | 'game'>('landing');
  const [tab, setTab] = useState<string>('dashboard');
  const { 
    activeWorld,
    showMissionComplete, 
    setShowMissionComplete, 
    currentChapterIndex, 
    setChapterIndex,
    isLoggedIn
  } = useGame();

  useEffect(() => {
    if (!isLoggedIn && view === 'game') {
      setView('landing');
    }
  }, [isLoggedIn, view]);

  const handleNextChapter = () => {
    setShowMissionComplete(false);
    setChapterIndex(currentChapterIndex + 1);
    setTab('mission');
  };

  const handleCloseComplete = () => {
    setShowMissionComplete(false);
    setTab('dashboard');
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        onStart={() => {
          if (isLoggedIn) {
            setView('selection');
          } else {
            setView('auth');
          }
        }} 
      />
    );
  }

  if (view === 'auth') {
    return (
      <Auth 
        onSuccess={() => setView('selection')} 
        onClose={() => setView('landing')} 
      />
    );
  }

  if (view === 'selection') {
    return <WorldSelection onSelect={() => setView('game')} />;
  }

  // Active game workspace layout switcher
  const renderTabContent = () => {
    switch (tab) {
      case 'dashboard':
      case 'learn':
        return <Dashboard setTab={setTab} />;
      case 'mission':
        return <LearningScreen />;
      case 'achievements':
        return <Achievements />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setTab={setTab} />;
    }
  };

  return (
    <div className="flex min-h-screen transition-colors duration-500 overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Background Spotlight gradient aura */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-25 transition-colors duration-1000 z-0
        ${activeWorld === 'kingdom' ? 'bg-amber-500/20' : 'bg-cyan-500/20'}
      `} />

      <Sidebar currentTab={tab} setTab={setTab} />
      
      <div className="flex-grow flex flex-col h-screen overflow-y-auto relative z-10">
        <Navbar />
        <main className="flex-grow p-6 md:p-8">
          {renderTabContent()}
        </main>
      </div>

      {showMissionComplete && (
        <MissionComplete 
          onClose={handleCloseComplete} 
          onNextChapter={handleNextChapter} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
export { AppContent };
