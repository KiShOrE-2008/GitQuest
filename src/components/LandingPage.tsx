import React, { useState } from 'react';
import { Terminal, Award, Zap, Code } from 'lucide-react';

interface LandingPageProps {
  onStart: (name: string, avatar: string) => void;
}

const AVATARS = [
  { name: 'Code Cadet', emoji: '🧑‍💻', color: 'from-blue-500 to-indigo-500' },
  { name: 'Rebase Ninja', emoji: '🥷', color: 'from-purple-600 to-pink-600' },
  { name: 'Merge Wizard', emoji: '🧙‍♂️', color: 'from-emerald-500 to-teal-500' },
  { name: 'Git Master', emoji: '👑', color: 'from-amber-500 to-orange-500' },
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
    <div className="min-h-screen bg-brand-bg bg-grid-pattern flex flex-col items-center justify-center p-6 text-brand-text">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm mb-4 backdrop-blur-md">
          <Terminal size={14} />
          <span>Interactive Simulation & Gamification</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          GitQuest
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
          Master Git and GitHub internals through interactive simulations, story-driven missions, and battles.
        </p>
      </div>

      <div className="max-w-md w-full bg-brand-panel border border-brand-border rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="Enter your coder alias..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Choose Your Title Avatar</label>
            <div className="grid grid-cols-2 gap-3">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.name;
                return (
                  <button
                    key={avatar.name}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-tr ${avatar.color} flex items-center justify-center text-2xl mb-2 shadow-lg`}
                    >
                      {avatar.emoji}
                    </div>
                    <span className="text-xs font-semibold">{avatar.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Code size={18} />
            <span>Enter the GitQuest</span>
          </button>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl text-center text-sm text-gray-500 relative z-10">
        <div className="flex flex-col items-center gap-1">
          <Zap className="text-purple-500" size={20} />
          <span className="font-semibold text-gray-400">Live Visualizer</span>
          <span>Watch the Git DAG render in real-time</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Terminal className="text-cyan-500" size={20} />
          <span className="font-semibold text-gray-400">Interactive Terminal</span>
          <span>Run real commands in a simulated index</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Award className="text-amber-500" size={20} />
          <span className="font-semibold text-gray-400">Earn Badges</span>
          <span>Unlock developer roles and level up</span>
        </div>
      </div>
    </div>
  );
};
