import React, { useState } from 'react';
import { Terminal, Shield, Rocket } from 'lucide-react';

interface LandingPageProps {
  onStart: (name: string, avatar: string, world: 'kingdom' | 'space') => void;
}

const AVATARS = [
  // Kingdom themed
  { name: 'King', emoji: '👑', color: 'bg-amber-600 border-amber-400', world: 'kingdom' },
  { name: 'Queen', emoji: '👸', color: 'bg-purple-600 border-purple-400', world: 'kingdom' },
  { name: 'Wizard', emoji: '🧙', color: 'bg-emerald-600 border-emerald-400', world: 'kingdom' },
  // Space themed
  { name: 'Robot', emoji: '🤖', color: 'bg-cyan-600 border-cyan-400', world: 'space' },
  { name: 'Astronaut', emoji: '👨‍🚀', color: 'bg-blue-600 border-blue-400', world: 'space' },
  { name: 'Scientist', emoji: '👩‍🔬', color: 'bg-pink-600 border-pink-400', world: 'space' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [selectedWorld, setSelectedWorld] = useState<'kingdom' | 'space'>('kingdom');
  const [selectedAvatar, setSelectedAvatar] = useState('King');

  // Automatically update avatar when world changes to suggest a matching character
  const handleWorldChange = (world: 'kingdom' | 'space') => {
    setSelectedWorld(world);
    if (world === 'kingdom') {
      setSelectedAvatar('King');
    } else {
      setSelectedAvatar('Astronaut');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onStart(name.trim(), selectedAvatar, selectedWorld);
  };

  return (
    <div className="min-h-screen bg-[#0b071a] bg-grid-pattern crt-effect flex flex-col items-center justify-center p-6 text-cyan-400">
      {/* Curved CRT reflection */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%] pointer-events-none"></div>

      <div className="max-w-3xl w-full text-center mb-8 relative z-10 space-y-4">
        {/* Blinking start indicator */}
        <div className="inline-block text-[10px] font-arcade text-pink-500 bg-pink-950/40 border-2 border-pink-500 px-4 py-1.5 rounded-none uppercase tracking-widest arcade-blink glow-pink-text">
          CHOOSE YOUR DESTINY IN GITVERSE
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest font-arcade mb-2 bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)]">
          GITVERSE
        </h1>
        <p className="text-cyan-300 text-sm md:text-xl font-pixel max-w-xl mx-auto uppercase tracking-wide glow-cyan-text">
          One Engine • Two Alternate Worlds • Pure Git Mastery
        </p>
      </div>

      <div className="max-w-2xl w-full bg-slate-950/95 border-4 border-double border-pink-500 p-8 shadow-[0_0_30px_rgba(236,72,153,0.25)] relative z-10">
        <h2 className="text-sm font-arcade text-center text-pink-400 mb-8 glow-pink-text">
          CHARACTER CREATION
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Codename input */}
          <div className="text-left max-w-md mx-auto">
            <label className="block text-[10px] font-arcade text-cyan-300 mb-2">CODENAME ALIAS</label>
            <input
              type="text"
              required
              maxLength={12}
              placeholder="PLAYER_1"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border-2 border-cyan-500 rounded-none px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition-all uppercase placeholder-cyan-900"
            />
          </div>

          {/* World Selector */}
          <div className="text-left">
            <label className="block text-[10px] font-arcade text-cyan-300 mb-3 text-center">
              CHOOSE YOUR LEARNING WORLD
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kingdom World */}
              <button
                type="button"
                onClick={() => handleWorldChange('kingdom')}
                className={`p-5 border-2 text-left relative transition-all group overflow-hidden ${
                  selectedWorld === 'kingdom'
                    ? 'border-amber-500 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                  <Shield size={64} className="text-amber-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏰</span>
                  <div className="font-arcade">
                    <h3 className="text-xs text-white group-hover:text-amber-300 transition-all">KINGDOM</h3>
                    <p className="text-[8px] text-amber-500 font-semibold tracking-widest mt-1">STRATEGY THEME</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-pixel text-[15px] leading-relaxed">
                  Learn Git concepts disguised as medieval warfare, fortresses, chroniclers, and messengers.
                </p>
              </button>

              {/* Space Station World */}
              <button
                type="button"
                onClick={() => handleWorldChange('space')}
                className={`p-5 border-2 text-left relative transition-all group overflow-hidden ${
                  selectedWorld === 'space'
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                  <Rocket size={64} className="text-cyan-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  <div className="font-arcade">
                    <h3 className="text-xs text-white group-hover:text-cyan-300 transition-all">SPACE STATION</h3>
                    <p className="text-[8px] text-cyan-400 font-semibold tracking-widest mt-1">SCI-FI THEME</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-pixel text-[15px] leading-relaxed">
                  Learn Git concepts as artificial intelligences, time crystals, timelines, and supply shuttles.
                </p>
              </button>
            </div>
          </div>

          {/* Character Avatar Grid */}
          <div className="text-left">
            <label className="block text-[10px] font-arcade text-cyan-300 mb-3 text-center">
              SELECT YOUR AVATAR
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.name;
                const isMatchingWorld = avatar.world === selectedWorld;
                return (
                  <button
                    key={avatar.name}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.name)}
                    className={`flex flex-col items-center justify-center p-3 border-2 transition-all ${
                      isSelected
                        ? selectedWorld === 'kingdom'
                          ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] text-white'
                          : 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)] text-white'
                        : 'bg-slate-950 border-slate-900 text-cyan-800 hover:border-slate-800'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 ${avatar.color} flex items-center justify-center text-xl mb-1 shadow-md`}
                    >
                      {avatar.emoji}
                    </div>
                    <span className="text-[8px] font-arcade tracking-wider truncate max-w-full">
                      {avatar.name}
                    </span>
                    {isMatchingWorld && (
                      <span className="text-[6px] font-arcade text-pink-500 mt-1 uppercase tracking-widest">
                        MATCHING
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full arcade-btn border-2 disabled:bg-slate-950 disabled:border-slate-900 disabled:text-gray-700 text-white font-bold py-4 px-6 rounded-none transition-all flex items-center justify-center gap-2 hover:scale-[1.01] ${
              selectedWorld === 'kingdom'
                ? 'bg-amber-600 border-amber-400 hover:bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-cyan-600 border-cyan-400 hover:bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
          >
            <span>PRESS START</span>
          </button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 max-w-xl text-center text-xs text-cyan-600 font-arcade relative z-10">
        <div className="flex flex-col items-center gap-1.5">
          <Shield className="text-pink-500 animate-pulse" size={16} />
          <span className="text-[8px] text-pink-500">REALITY MODE</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Terminal className="text-cyan-500" size={16} />
          <span className="text-[8px] text-cyan-500">SHARED ENGINE</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Rocket className="text-amber-500" size={16} />
          <span className="text-[8px] text-amber-500">DUAL COSMETICS</span>
        </div>
      </div>
    </div>
  );
};
