import React from 'react';
import type { SceneProps } from './SceneFoundations';

// ─── Chapter 18: git pull ─────────────────────────────────────
export const Ch18Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';

  const sources = isKingdom
    ? [{ icon: '🏰', label: 'East Guild' }, { icon: '🏯', label: 'West Guild' }]
    : [{ icon: '🛰️', label: 'Station A' }, { icon: '🚀', label: 'Station B' }];

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      {!isKingdom && [...Array(8)].map((_, i) => (
        <div key={i} className="anim-twinkle absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ left: `${(i * 53 + 11) % 100}%`, top: `${(i * 37 + 5) % 100}%`, animationDelay: `${i * 0.2}s` }} />
      ))}
      <div className="relative z-10 flex items-center gap-4 w-full px-6">
        {/* Sources */}
        <div className="flex flex-col gap-4">
          {sources.map((s, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 transition-all duration-500 ${on ? 'opacity-100' : 'opacity-40'}`}>
              <div className="text-2xl">{s.icon}</div>
              <span className="text-[9px] text-slate-400 font-bold">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Converging arrows */}
        <div className="flex-1 relative">
          <svg width="100%" height="70" viewBox="0 0 160 70">
            {/* Top arrow */}
            <line x1="0" y1="15" x2="130" y2="35" stroke={on ? accent : '#1e293b'} strokeWidth="2"
              strokeDasharray="160" strokeDashoffset={on ? 0 : 160}
              style={{ transition: 'stroke-dashoffset 0.7s ease-out' }} />
            {/* Bottom arrow */}
            <line x1="0" y1="55" x2="130" y2="35" stroke={on ? accent : '#1e293b'} strokeWidth="2"
              strokeDasharray="160" strokeDashoffset={on ? 0 : 160}
              style={{ transition: 'stroke-dashoffset 0.7s ease-out 0.1s' }} />
            {on && <polygon points="0,-5 12,0 0,5" fill={accent} transform="translate(118,35)" />}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[8px] font-mono ${on ? (isKingdom ? 'text-amber-500' : 'text-cyan-500') : 'text-slate-700'}`}>
              {on ? '↙ git pull ↗' : '─ no pull ─'}
            </span>
          </div>
        </div>

        {/* Main receiving */}
        <div className={`flex flex-col items-center gap-2 transition-all duration-700 ${done ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`text-3xl ${done ? 'anim-glow-ring rounded-2xl' : ''}`}
            style={{ '--glow-color': `${accent}44` } as React.CSSProperties}>
            {isKingdom ? '🏛️' : '🌍'}
          </div>
          <span className="text-[9px] font-bold" style={{ color: done ? accent : '#64748b' }}>
            {isKingdom ? 'Main Kingdom' : 'Main Station'}
          </span>
          {done && <span className="text-[8px] text-emerald-400 anim-stamp font-bold">✓ Pulled</span>}
        </div>
      </div>
      {done && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="text-[9px] font-black anim-stamp" style={{ color: accent }}>
            ✓ Team changes integrated into local branch
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Chapter 19: Pull Request ─────────────────────────────────
export const Ch19Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/40 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 flex items-center gap-4 w-full px-6">
        {/* Feature branch */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-3xl">{isKingdom ? '🐉' : '⚡'}</div>
          <span className="text-[9px] text-violet-400 font-bold">feature branch</span>
          <span className="text-[8px] text-slate-500">{isKingdom ? 'dragon-wall' : 'fusion-upgrade'}</span>
        </div>

        {/* PR arrow + review */}
        <div className="flex-1 flex flex-col gap-2 items-center">
          <svg width="100%" height="24" viewBox="0 0 120 24">
            <line x1="0" y1="12" x2="120" y2="12" stroke={on ? '#8b5cf6' : '#1e293b'} strokeWidth="2"
              strokeDasharray="120" strokeDashoffset={on ? 0 : 120}
              style={{ transition: 'stroke-dashoffset 0.7s ease-out' }} />
            {on && <polygon points="0,-5 12,0 0,5" fill="#8b5cf6" transform="translate(108,12)" />}
          </svg>
          <span className={`text-[8px] font-mono ${on ? 'text-violet-400' : 'text-slate-700'}`}>
            {on ? '→ PR submitted' : 'no PR yet'}
          </span>
          {/* Review checklist */}
          {on && (
            <div className={`text-[8px] space-y-0.5 px-2 py-1.5 rounded-lg border
              ${done ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className={done ? 'text-emerald-400' : 'text-slate-400'}>✓ {isKingdom ? 'Strong defense' : 'Energy efficiency'}</div>
              <div className={done ? 'text-emerald-400' : 'text-slate-400'}>✓ {isKingdom ? 'Good blueprint' : 'Safety check'}</div>
              <div className={done ? 'text-emerald-400' : 'text-yellow-400'}>
                {done ? '✓ Gate design approved' : '⚠ Needs revision'}
              </div>
            </div>
          )}
        </div>

        {/* Review board */}
        <div className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${on ? 'opacity-100' : 'opacity-30'}`}>
          <div className="text-3xl">{isKingdom ? '🏛️' : '🎛️'}</div>
          <span className="text-[9px] font-bold" style={{ color: isKingdom ? '#f59e0b' : '#06b6d4' }}>
            {isKingdom ? 'Royal Council' : 'Mission Control'}
          </span>
          {done && <span className="text-[8px] text-emerald-400 anim-stamp font-black">✅ APPROVED</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 20: Final Boss ───────────────────────────────────
export const Ch20Scene: React.FC<SceneProps> = ({ phase, stepIndex, isKingdom }) => {
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';
  const done = phase === 'complete';
  const on = phase !== 'idle';

  const steps = ['branch fix', 'checkout fix', 'checkout main', 'merge fix'];
  const branchLines = isKingdom
    ? ['Main', 'Magic', 'War', 'Rogue', 'Trade']
    : ['Main', 'Alpha', 'Beta', 'Gamma', 'Delta'];

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${done ? (isKingdom ? 'bg-gradient-to-br from-amber-950/60 to-slate-950' : 'bg-gradient-to-br from-cyan-950/60 to-slate-950') : 'bg-gradient-to-br from-red-950/40 via-slate-950/80 to-slate-950'}`}
        style={{ transition: 'all 1s ease-out' }} />
      {!isKingdom && [...Array(12)].map((_, i) => (
        <div key={i} className="anim-twinkle absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ left: `${(i * 41 + 7) % 100}%`, top: `${(i * 29 + 3) % 100}%`, animationDelay: `${i * 0.15}s` }} />
      ))}
      <div className="relative z-10 w-full px-6">
        {!done ? (
          // Corrupted branches view
          <div className="flex flex-col items-center gap-2">
            {!on && <div className={`text-lg font-black ${isKingdom ? 'text-red-400' : 'text-red-400'}`}>
              {isKingdom ? '💀 CORRUPTED CHRONICLE!' : '🚨 TEMPORAL COLLAPSE!'}
            </div>}
            <svg width="100%" height="80" viewBox="0 0 500 80">
              <line x1="20" y1="40" x2="480" y2="40" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 2" />
              {branchLines.slice(1).map((b, i) => {
                const angle = (i - 1.5) * 18;
                const fixed = stepIndex > i;
                return (
                  <g key={b}>
                    <line x1="200" y1="40"
                      x2={200 + Math.cos((angle * Math.PI) / 180) * 200}
                      y2={40 + Math.sin((angle * Math.PI) / 180) * 40}
                      stroke={fixed ? (isKingdom ? '#f59e0b' : '#06b6d4') : '#ef4444'}
                      strokeWidth="1.5" strokeDasharray={fixed ? '5 0' : '4 4'}
                      style={{ transition: 'stroke 0.5s ease-out' }} />
                    <text
                      x={200 + Math.cos((angle * Math.PI) / 180) * 220}
                      y={40 + Math.sin((angle * Math.PI) / 180) * 44}
                      textAnchor="middle" fill={fixed ? accent : '#ef4444'} fontSize="8">{b}</text>
                  </g>
                );
              })}
              <circle cx="200" cy="40" r="8" fill={accent} style={{ filter: `drop-shadow(0 0 8px ${accent})` }} />
              <text x="200" y="58" textAnchor="middle" fill={accent} fontSize="9">main</text>
            </svg>
            {/* Step progress */}
            <div className="flex gap-3">
              {steps.map((s, i) => (
                <div key={s} className={`px-2 py-1 rounded text-[8px] font-bold border transition-all duration-300
                  ${i < stepIndex
                    ? `${isKingdom ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'}`
                    : i === stepIndex && on
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300 animate-pulse'
                      : 'bg-slate-900/40 border-slate-800 text-slate-600'
                  }`}>
                  {i < stepIndex ? '✓' : i === stepIndex && on ? '▶' : '○'} {s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Repaired state
          <div className="flex flex-col items-center gap-3">
            <svg width="100%" height="50" viewBox="0 0 500 50">
              <line x1="20" y1="25" x2="480" y2="25" stroke={accent} strokeWidth="2.5"
                className="anim-draw-path" style={{ strokeDasharray: '460', filter: `drop-shadow(0 0 6px ${accent})` }} />
              {[80, 180, 280, 380, 460].map((cx, i) => (
                <circle key={i} cx={cx} cy={25} r={7} fill={accent}
                  style={{ filter: `drop-shadow(0 0 8px ${accent})`, animation: `float-up 0.4s ease-out ${i * 0.08}s both` }} />
              ))}
            </svg>
            <div className="flex flex-col items-center gap-1 anim-stamp">
              <span className="text-2xl">🏆</span>
              <span className="text-sm font-black tracking-wider" style={{ color: accent }}>GIT ARCHITECT</span>
              <span className="text-[9px] text-slate-400">
                {isKingdom ? 'The Royal Chronicle is restored.' : 'All timelines stabilized.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
