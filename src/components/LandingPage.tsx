import React from 'react';

import { Shield, Rocket, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {


  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none`}>
      {/* Background Star/Particle Field */}
      <div className="absolute inset-0 bg-radial-at-t from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none z-0">
        {/* Particle circles */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] -top-40 -left-40 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] -bottom-40 -right-40 animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 z-0" />

      {/* Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-xl text-slate-950 tracking-tighter">G</span>
          </div>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            GitVerse
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#about" className="hover:text-white transition-colors duration-200">World Lore</a>
          <a href="#features" className="hover:text-white transition-colors duration-200">Curriculum</a>
          <a href="#accolades" className="hover:text-white transition-colors duration-200">Leaderboards</a>
        </div>
        <button 
          onClick={onStart} 
          className="relative group px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-slate-950 overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Launch Game <Play size={14} className="fill-current" />
          </span>
        </button>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full py-12">
        {/* Animated timeline background container */}
        <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none -translate-y-8 select-none">
          <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Connection timeline curves */}
            <path d="M 50,200 C 200,200 200,80 350,80 C 500,80 500,320 650,320 C 750,320 780,200 800,200" stroke="url(#timeline-grad)" strokeWidth="3" strokeDasharray="8 6" className="animate-[dash_60s_linear_infinite]" />
            <path d="M 50,200 C 150,200 250,320 400,320 C 550,320 600,80 750,200" stroke="url(#timeline-grad)" strokeWidth="2" opacity="0.6" />
            
            {/* Animated commit pulse circles */}
            <circle cx="200" cy="140" r="6" fill="#6366F1" className="animate-ping" />
            <circle cx="200" cy="140" r="5" fill="#6366F1" />
            <circle cx="400" cy="320" r="6" fill="#06B6D4" className="animate-ping" />
            <circle cx="400" cy="320" r="5" fill="#06B6D4" />
            <circle cx="600" cy="200" r="6" fill="#22C55E" className="animate-ping" />
            <circle cx="600" cy="200" r="5" fill="#22C55E" />

            <defs>
              <linearGradient id="timeline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Badges */}
        <div className="flex gap-3 mb-6 animate-bounce" style={{ animationDuration: '4s' }}>
          <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 backdrop-blur-md">
            🏰 Kingdom Mode
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 self-center" />
          <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            🚀 Space Odyssey
          </span>
        </div>

        {/* Large Premium Title */}
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent select-none">
          GitVerse
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10">
          Master version control and GitHub workflow through two immersive parallel stories. Write real commands, resolve timeline collisions, and build your legend.
        </p>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button 
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 active:scale-95 group"
          >
            Start Learning
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 active:scale-95 hover:text-white"
          >
            Explore Worlds
          </button>
        </div>
      </main>

      {/* Live Previews / Theme Split Panel */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Kingdom Left Card */}
        <div className="group relative rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-slate-900/60 to-slate-950/90 backdrop-blur-xl p-8 overflow-hidden shadow-2xl flex flex-col justify-between h-72 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-indigo-500/5">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all duration-500" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">🏰 Kingdom Universe</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Roleplay as the Royal Historian. Construct castles, bridges, and markets. Manage blueprints and merge alliances to expand the realm.
            </p>
          </div>
          <div className="text-xs font-semibold text-indigo-400 group-hover:underline flex items-center gap-1 mt-4">
            Concept mapping: Repositories are Kingdoms
          </div>
        </div>

        {/* Space Right Card */}
        <div className="group relative rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-slate-900/60 to-slate-950/90 backdrop-blur-xl p-8 overflow-hidden shadow-2xl flex flex-col justify-between h-72 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-cyan-500/5">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all duration-500" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">🚀 Space Odyssey</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Roleplay as a Quantum Operator. Repair reactor modules, navigate parallel time loops, and stabilize gravity fields across space stations.
            </p>
          </div>
          <div className="text-xs font-semibold text-cyan-400 group-hover:underline flex items-center gap-1 mt-4">
            Concept mapping: Repositories are Space Stations
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-slate-600 border-t border-slate-900">
        © {new Date().getFullYear()} GitVerse. Crafted for visual excellence. All rights reserved.
      </footer>
    </div>
  );
};
