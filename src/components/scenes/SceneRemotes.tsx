import React from 'react';
import type { SceneProps } from './SceneFoundations';

// ─── Chapter 10: git push ─────────────────────────────────────
export const Ch10Scene: React.FC<SceneProps> = ({ phase, stepIndex, isKingdom }) => {
  const linked = stepIndex >= 1;
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      {!isKingdom && [...Array(10)].map((_, i) => (
        <div key={i} className="anim-twinkle absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ left: `${(i * 47 + 5) % 100}%`, top: `${(i * 29 + 3) % 100}%`, animationDelay: `${i * 0.15}s` }} />
      ))}
      <div className="relative z-10 flex items-center gap-6 w-full px-8">
        {/* Local */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-4xl">{isKingdom ? '🏰' : '🚀'}</div>
          <span className="text-[9px] font-bold text-slate-400">{isKingdom ? 'Local Kingdom' : 'Local Station'}</span>
          <div className="w-8 h-1 rounded-full bg-emerald-500/50" />
        </div>

        {/* Arrow animation */}
        <div className="flex-1 relative flex flex-col items-center">
          <svg width="100%" height="40" viewBox="0 0 200 40">
            <line x1="0" y1="20" x2="200" y2="20" stroke={linked ? accent : '#1e293b'} strokeWidth="2"
              strokeDasharray="200" strokeDashoffset={linked ? 0 : 200}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
            {linked && <polygon points="0,-6 14,0 0,6" fill={accent} transform="translate(190,20)"
              style={{ animation: 'slide-right 0.5s ease-out both' }} />}
          </svg>
          {/* Messenger / Data packet */}
          {linked && (
            <div className={`text-lg ${done ? 'opacity-0' : 'opacity-100'} transition-all duration-700`}
              style={{ position: 'absolute', top: -8, animation: done ? 'rocket-fly 0.8s ease-in both 0.2s' : 'slide-right 0.8s ease-out both' }}>
              {isKingdom ? '📜' : '📡'}
            </div>
          )}
          <span className={`text-[9px] font-mono mt-1 ${linked ? (isKingdom ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-600'}`}>
            {linked ? (done ? 'PUSH COMPLETE' : 'Transmitting…') : 'No remote linked'}
          </span>
        </div>

        {/* Remote */}
        <div className={`flex flex-col items-center gap-1.5 transition-all duration-700 ${linked ? 'opacity-100' : 'opacity-30'}`}>
          <div className="text-4xl">{isKingdom ? '🏛️' : '🛰️'}</div>
          <span className="text-[9px] font-bold" style={{ color: linked ? accent : '#64748b' }}>
            {isKingdom ? 'Capital Library' : 'Galaxy Core'}
          </span>
          {done && <div className="anim-stamp text-[9px] font-bold text-emerald-400">✓ Synced</div>}
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 11: git clone ────────────────────────────────────
export const Ch11Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 flex items-center gap-4 w-full px-8">
        {/* Source */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-3xl">{isKingdom ? '🏛️' : '🛰️'}</div>
          <span className="text-[9px] text-slate-400 font-bold">origin</span>
          <div className="space-y-0.5 w-16">
            {['c3', 'c2', 'c1'].map((_h, i) => (
              <div key={i} className={`h-1 rounded-full ${isKingdom ? 'bg-amber-500/40' : 'bg-cyan-500/40'}`} style={{ width: `${100 - i * 15}%` }} />
            ))}
          </div>
        </div>

        {/* Clone arrow */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <svg width="100%" height="24" viewBox="0 0 140 24">
            <line x1="0" y1="12" x2="140" y2="12" stroke={on ? (isKingdom ? '#f59e0b' : '#06b6d4') : '#1e293b'}
              strokeWidth="2" strokeDasharray="140" strokeDashoffset={on ? 0 : 140}
              style={{ transition: 'stroke-dashoffset 0.9s ease-out' }} />
          </svg>
          <span className={`text-[9px] font-mono ${on ? (isKingdom ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-600'}`}>
            {on ? 'git clone ↓' : '─ not cloned ─'}
          </span>
        </div>

        {/* Clone result */}
        <div className={`flex flex-col items-center gap-1 transition-all duration-700 ${done ? 'opacity-100' : 'opacity-10'}`}>
          <div className={`text-3xl ${done ? 'anim-float-up' : ''}`}>{isKingdom ? '🏰' : '🌑'}</div>
          <span className={`text-[9px] font-bold ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>
            {isKingdom ? 'Sister Kingdom' : 'New Outpost'}
          </span>
          {done && (
            <div className="space-y-0.5 w-16">
              {['c3', 'c2', 'c1'].map((_h, i) => (
                <div key={i} className={`h-1 rounded-full anim-slide-r ${isKingdom ? 'bg-amber-500/40' : 'bg-cyan-500/40'}`}
                  style={{ width: `${100 - i * 15}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>
      {done && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className={`text-[9px] font-black anim-stamp ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>
            ✓ Full history cloned — including all commits
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Chapter 12: Fork ─────────────────────────────────────────
export const Ch12Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-purple-950/40 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 flex flex-col items-center gap-4 w-full px-8">
        {/* Original */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-3xl">{isKingdom ? '🏰' : '🌌'}</div>
          <span className="text-[9px] font-bold text-slate-400">{isKingdom ? 'Your Kingdom' : 'Universe A'}</span>
        </div>
        {/* Fork symbol */}
        <div className={`relative transition-all duration-500 ${on ? 'opacity-100' : 'opacity-20'}`}>
          <svg width="160" height="50" viewBox="0 0 160 50">
            <line x1="80" y1="0" x2="80" y2="20" stroke={accent} strokeWidth="2" />
            <line x1="80" y1="20" x2="30" y2="50" stroke={accent} strokeWidth="2"
              strokeDasharray="60" strokeDashoffset={done ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
            <line x1="80" y1="20" x2="130" y2="50" stroke="#8b5cf6" strokeWidth="2"
              strokeDasharray="60" strokeDashoffset={done ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.6s ease-out 0.1s' }} />
            <text x="80" y="18" textAnchor="middle" fill={accent} fontSize="8" fontWeight="bold">⑂ FORK</text>
          </svg>
        </div>
        {/* Forked copies */}
        {done && (
          <div className="flex gap-12 anim-float-up">
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">{isKingdom ? '🏰' : '🌌'}</div>
              <span className="text-[9px] font-bold" style={{ color: accent }}>{isKingdom ? 'Your Kingdom' : 'Universe A'}</span>
              <span className="text-[8px] text-slate-500">unchanged</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">{isKingdom ? '👑' : '🌃'}</div>
              <span className="text-[9px] font-bold text-violet-400">{isKingdom ? 'New Empire' : 'Universe B'}</span>
              <span className="text-[8px] text-slate-500">independent</span>
            </div>
          </div>
        )}
        {!on && <span className="text-[10px] text-slate-600 italic">{isKingdom ? 'One kingdom, no copies…' : 'Single universe…'}</span>}
      </div>
    </div>
  );
};
