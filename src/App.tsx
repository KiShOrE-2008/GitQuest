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
import { MobileNavBar } from './components/MobileNavBar';
import { ChatBot } from './components/ChatBot';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

import { Home } from './components/Home';
import { EditProfile } from './components/EditProfile';

function AdminPanel() {
  const [adminSession, setAdminSession] = useState<any>(null);

  const handleBack = () => {
    window.location.hash = '';
  };

  if (!adminSession) {
    return <AdminLogin onSuccess={(session) => setAdminSession(session)} onBack={handleBack} />;
  }

  return <AdminDashboard onLogout={() => setAdminSession(null)} />;
}

function AppContent() {
  const [view, setView] = useState<'landing' | 'auth' | 'selection' | 'game'>('landing');
  const [tab, setTab] = useState<string>('dashboard');
  const { 
    activeWorld,
    themeMode,
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
        return <Home setTab={setTab} />;
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
      case 'edit-profile':
        return <EditProfile onBack={() => setTab('profile')} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setTab={setTab} />;
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 overflow-hidden relative
      ${themeMode === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}
    `}>
      {/* Background Spotlight gradient aura */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-25 transition-colors duration-1000 z-0
        ${activeWorld === 'kingdom' ? 'bg-amber-500/20' : 'bg-cyan-500/20'}
      `} />

      <Sidebar currentTab={tab} setTab={setTab} />
      
      <div className="flex-grow flex flex-col h-screen overflow-y-auto relative z-10">
        <Navbar />
        <main className="flex-grow p-6 md:p-8 pb-24 md:pb-8">
          {renderTabContent()}
        </main>
      </div>

      <MobileNavBar currentTab={tab} setTab={setTab} />

      {showMissionComplete && (
        <MissionComplete 
          onClose={handleCloseComplete} 
          onNextChapter={handleNextChapter} 
        />
      )}

      {/* Git Tutor Chatbot — available on all game screens */}
      <ChatBot />
    </div>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Admin route — renders outside GameProvider
  if (hash === '#admin' || hash === '#/admin') {
    return <AdminPanel />;
  }

  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
export { AppContent };
