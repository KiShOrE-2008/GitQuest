import React from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Rocket, ArrowRight } from 'lucide-react';

interface WorldSelectionProps {
  onSelect: () => void;
}

export const WorldSelection: React.FC<WorldSelectionProps> = ({ onSelect }) => {
  const { setWorld } = useGame();

  const handleSelect = (world: 'kingdom' | 'space') => {
    setWorld(world);
    onSelect();
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center overflow-hidden py-12 px-6">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-radial-at-t from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-lg mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Select Your Universe
        </h2>
        <p className="text-slate-400 text-base font-light">
          Both paths teach the same industry-standard Git concepts. Choose the narrative that fuels your curiosity. You can switch at any time.
        </p>
      </div>

      {/* Cards container */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Kingdom Card */}
        <div 
          onClick={() => handleSelect('kingdom')}
          className="group relative cursor-pointer rounded-3xl border border-amber-500/10 bg-gradient-to-br from-slate-900/80 to-slate-950/95 backdrop-blur-xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between h-[420px]"
        >
          {/* Accent lighting */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-inner">
              <Shield size={28} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500/60 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/15">
              Medieval Fantasy
            </span>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-2xl font-black mb-2 text-slate-100 group-hover:text-amber-400 transition-colors">
              🏰 Kingdom Chronicles
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Establish repository files as land titles. Commit architectural blueprints to the Royal Ledger. Resolve architect arguments. Build the ultimate fortress.
            </p>

            {/* Preview Elements */}
            <div className="flex gap-2 flex-wrap mb-4 opacity-75 group-hover:opacity-100 transition-opacity">
              {['🏰 Castle', '🛖 Village', '🪵 Roads', '🛡️ Knights'].map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button className="relative w-full py-4 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-amber-400 group-hover:scale-[1.02] shadow-lg shadow-amber-500/10">
            Choose Kingdom <ArrowRight size={16} />
          </button>
        </div>

        {/* Space Card */}
        <div 
          onClick={() => handleSelect('space')}
          className="group relative cursor-pointer rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-slate-900/80 to-slate-950/95 backdrop-blur-xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between h-[420px]"
        >
          {/* Accent lighting */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-inner">
              <Rocket size={28} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400/60 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/15">
              Sci-Fi Adventure
            </span>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-2xl font-black mb-2 text-slate-100 group-hover:text-cyan-400 transition-colors">
              🚀 Space Odyssey
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Operate chronological networks of an orbital space base. Stage repairs onto shuttle launchpads. Prevent timeline crashes. Fuel starships for orbit.
            </p>

            {/* Preview Elements */}
            <div className="flex gap-2 flex-wrap mb-4 opacity-75 group-hover:opacity-100 transition-opacity">
              {['🪐 Planets', '🛰️ Satellites', '🚀 Rockets', '🤖 Robots'].map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button className="relative w-full py-4 rounded-xl text-sm font-bold bg-cyan-500 text-slate-950 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-cyan-400 group-hover:scale-[1.02] shadow-lg shadow-cyan-500/10">
            Choose Space <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
