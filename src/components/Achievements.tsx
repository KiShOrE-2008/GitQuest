import React from 'react';
import { useGame, ACHIEVEMENTS_LIST } from '../context/GameContext';
import { Award, Lock, ShieldCheck } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { activeWorld, achievements } = useGame();

  const isKingdom = activeWorld === 'kingdom';

  const badgesList = Object.entries(ACHIEVEMENTS_LIST).map(([name, desc]) => {
    const isUnlocked = achievements.includes(name);
    return { name, desc, isUnlocked };
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Title block */}
      <div className={`rounded-3xl border overflow-hidden p-6 backdrop-blur-xl relative transition-all duration-500 shadow-2xl flex items-center justify-between gap-6
        ${isKingdom ? 'bg-amber-950/10 border-amber-500/10' : 'bg-cyan-950/10 border-cyan-500/10'}
      `}>
        {/* Spotlight glow */}
        <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white border shadow-md
            ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'}
          `}>
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Achievements & Lore Badges</h2>
            <p className="text-slate-400 text-xs font-light">
              Unlock unique achievements by executing correct operations and completing critical story checkpoints.
            </p>
          </div>
        </div>

        <div className="text-right relative z-10">
          <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Unlocked</span>
          <span className={`text-2xl font-black
            ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}
          `}>
            {achievements.length} / {badgesList.length}
          </span>
        </div>
      </div>

      {/* Badges Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {badgesList.map((b) => (
          <div
            key={b.name}
            className={`relative rounded-3xl border p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 h-64 shadow-2xl backdrop-blur-xl group select-none
              ${b.isUnlocked 
                ? isKingdom 
                  ? 'border-amber-500/20 bg-amber-500/[0.02] hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-amber-500/5'
                  : 'border-cyan-500/20 bg-cyan-500/[0.02] hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/5'
                : 'border-slate-900 bg-slate-950/20 opacity-60'
              }
            `}
          >
            {/* Locked screen layout overlay */}
            {!b.isUnlocked && (
              <div className="absolute top-3 right-3 text-slate-700 bg-slate-950/50 p-1.5 rounded-lg border border-slate-900 shadow">
                <Lock size={12} />
              </div>
            )}

            {/* Badge Graphic Sphere */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center relative shadow-inner transition-transform duration-500 group-hover:scale-110
              ${b.isUnlocked 
                ? isKingdom
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-700 border border-slate-850'
              }
            `}>
              {b.isUnlocked ? (
                <ShieldCheck size={28} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
              ) : (
                <Award size={28} className="text-slate-800" />
              )}
              {/* Particle glow ring */}
              {b.isUnlocked && (
                <span className={`absolute inset-0 rounded-full animate-ping opacity-25
                  ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
                `} style={{ animationDuration: '4s' }} />
              )}
            </div>

            {/* Description Text */}
            <div className="space-y-1 mt-4">
              <h4 className={`text-sm font-black leading-tight
                ${b.isUnlocked ? 'text-slate-100' : 'text-slate-500'}
              `}>
                {b.name}
              </h4>
              <p className="text-[10px] text-slate-500 max-w-xs font-semibold leading-normal">
                {b.desc}
              </p>
            </div>

            {/* Bottom Reward indicator tag */}
            <div className="mt-4 border-t border-slate-900/60 pt-3 w-full flex justify-center text-[9px] uppercase font-bold tracking-wider">
              {b.isUnlocked ? (
                <span className="text-emerald-400 flex items-center gap-1">✓ Achievement Earned</span>
              ) : (
                <span className="text-slate-600 flex items-center gap-1">🔒 Locked (Locked checkpoint)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
