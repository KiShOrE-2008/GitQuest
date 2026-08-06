import React, { useState } from 'react';
import { Terminal, Trophy, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: (name: string, avatar: string) => void;
}

const AVATARS = [
  { name: 'Code Cadet', emoji: '🧑‍💻', color: 'bg-blue-600 border-blue-400' },
  { name: 'Rebase Ninja', emoji: '🥷', color: 'bg-pink-600 border-pink-400' },
  { name: 'Merge Wizard', emoji: '🧙‍♂️', color: 'bg-emerald-600 border-emerald-400' },
  { name: 'Git Master', emoji: '👑', color: 'bg-amber-600 border-amber-400' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onStart(name.trim(), selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-brand-bg bg-grid-pattern crt-effect flex flex-col items-center justify-center p-6 text-brand-text">
      {/* Curved CRT reflection */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%] pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center mb-8 relative z-10 space-y-4">
        {/* Blinking start indicator */}
        <div className="inline-block text-xs font-arcade text-pink-500 bg-pink-950/40 border-2 border-pink-500 px-4 py-1.5 rounded-none uppercase tracking-widest arcade-blink glow-pink-text">
          INSERT COIN TO PLAY
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-widest font-arcade mb-2 bg-gradient-to-b from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent filter drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)]">
          GITQUEST
        </h1>
        <p className="text-cyan-400 text-lg md:text-2xl font-pixel max-w-xl mx-auto uppercase tracking-wide glow-cyan-text">
          Master Git Internals in 8-Bit Retro Simulation
        </p>
      </div>

      <div className="max-w-md w-full bg-slate-950/90 border-4 border-double border-pink-500 p-8 shadow-[0_0_20px_rgba(236,72,153,0.3)] relative z-10">
        <h2 className="text-xl font-arcade text-center text-pink-400 mb-6 glow-pink-text">CREATE PROFILE</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-arcade text-cyan-400 mb-2">CODENAME ALIAS</label>
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

          <div className="text-left">
            <label className="block text-sm font-arcade text-cyan-400 mb-3">SELECT CHARACTER</label>
            <div className="grid grid-cols-2 gap-3">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.name;
                return (
                  <button
                    key={avatar.name}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.name)}
                    className={`flex flex-col items-center justify-center p-3 border-2 transition-all ${
                      isSelected
                        ? 'bg-pink-950/40 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.3)] text-white'
                        : 'bg-slate-950 border-slate-800 text-cyan-700 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 ${avatar.color} flex items-center justify-center text-xl mb-1 shadow-md`}
                    >
                      {avatar.emoji}
                    </div>
                    <span className="text-[9px] font-arcade tracking-wider">{avatar.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full arcade-btn bg-pink-600 border-pink-400 hover:bg-pink-500 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-gray-600 text-white font-bold py-3.5 px-6 rounded-none transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <span>PRESS START</span>
          </button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 max-w-xl text-center text-xs text-cyan-600 font-arcade relative z-10">
        <div className="flex flex-col items-center gap-1">
          <Zap className="text-pink-500 animate-pulse" size={16} />
          <span className="text-[9px] text-pink-400">DAG TREE</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Terminal className="text-cyan-500" size={16} />
          <span className="text-[9px] text-cyan-400">8-BIT CLI</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Trophy className="text-amber-500" size={16} />
          <span className="text-[9px] text-amber-400">HI-SCORES</span>
        </div>
      </div>
    </div>
  );
};
