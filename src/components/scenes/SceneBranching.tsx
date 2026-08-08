import React from 'react';
import type { SceneProps } from './SceneFoundations';

// ─── Chapter 6: git branch ────────────────────────────────────
export const Ch6Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';
  const branchColor = '#8b5cf6';
  const branchName = isKingdom ? 'magic' : 'reactor';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom
        ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950'
        : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      {!isKingdom && [...Array(12)].map((_, i) => (
        <div key={i} className="anim-twinkle absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ left: `${(i * 43 + 9) % 100}%`, top: `${(i * 31 + 7) % 100}%`, animationDelay: `${i * 0.2}s` }} />
      ))}
      <div className="relative z-10 w-full px-8">
        <svg width="100%" height="120" viewBox="0 0 500 120" className="overflow-visible">
          {/* Main track */}
          <line x1="30" y1="70" x2="470" y2="70" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 3" />
          {/* Main line drawn */}
          <line x1="30" y1="70" x2="470" y2="70" stroke={accent} strokeWidth="2.5"
            strokeDasharray="440" strokeDashoffset={on ? 0 : 440}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
          {/* Branch split path */}
          <path d={`M 220,70 Q 270,70 300,30 L 470,30`} fill="none" stroke={branchColor} strokeWidth="2.5"
            strokeDasharray="300" strokeDashoffset={done ? 0 : 300}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out 0.4s' }} />
          {/* Main commits */}
          {['c1', 'c2'].map((_, i) => (
            <circle key={i} cx={100 + i * 120} cy={70} r={on ? 8 : 4} fill={accent}
              style={{ transition: 'r 0.4s ease-out', filter: on ? `drop-shadow(0 0 6px ${accent})` : 'none' }} />
          ))}
          {/* Branch commit */}
          {done && (
            <>
              <circle cx="360" cy="30" r="8" fill={branchColor} style={{ filter: `drop-shadow(0 0 6px ${branchColor})` }} />
              <text x="360" y="15" textAnchor="middle" fill={branchColor} fontSize="10" fontWeight="bold">{branchName}</text>
            </>
          )}
          {/* HEAD label */}
          {on && (
            <text x="110" y="95" textAnchor="middle" fill={accent} fontSize="10" fontWeight="bold">HEAD</text>
          )}
          {/* main label */}
          <text x="30" y="90" textAnchor="middle" fill={on ? '#94a3b8' : '#334155'} fontSize="10">main</text>
        </svg>
        <div className="flex justify-center mt-1">
          {done
            ? <span className="text-[10px] font-black text-violet-400 anim-stamp">✓ Branch '{branchName}' created</span>
            : on
              ? <span className={`text-[10px] font-mono ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}`}>main branch active…</span>
              : <span className="text-[10px] text-slate-600 italic">{isKingdom ? 'One kingdom, one road…' : 'Single linear timeline…'}</span>
          }
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 7: git checkout ──────────────────────────────────
export const Ch7Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const target = isKingdom ? 'magic' : 'reactor';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 flex items-center justify-center gap-8 w-full px-8">
        {/* Main branch node */}
        <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${done ? 'opacity-40' : 'opacity-100'}`}>
          <div className="w-14 h-14 rounded-2xl border-2 border-slate-700 bg-slate-900/60 flex items-center justify-center text-2xl">
            {isKingdom ? '🏰' : '🛰️'}
          </div>
          <span className="text-[10px] font-bold text-slate-400">main</span>
          {!done && <div className="text-[10px] font-black text-yellow-400">👑 HEAD</div>}
        </div>

        {/* Portal / Wormhole */}
        <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${on ? 'opacity-100' : 'opacity-10'}`}>
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl
            ${on ? 'anim-pulse-ring border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-900'}`}
            style={{ '--glow-color': '#8b5cf666' } as React.CSSProperties}>
            {isKingdom ? '🌀' : '🌀'}
          </div>
          <span className="text-[9px] text-violet-400 font-bold">{isKingdom ? 'PORTAL' : 'WORMHOLE'}</span>
        </div>

        {/* Target branch node */}
        <div className={`flex flex-col items-center gap-1 transition-all duration-700 ${done ? 'opacity-100' : 'opacity-30'}`}>
          <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all duration-500
            ${done ? `border-violet-500 bg-violet-500/10` : 'border-slate-700 bg-slate-900/30'}`}
            style={done ? { filter: `drop-shadow(0 0 8px #8b5cf6)` } : undefined}>
            {isKingdom ? '🔮' : '⚛️'}
          </div>
          <span className="text-[10px] font-bold text-violet-400">{target}</span>
          {done && <div className="text-[10px] font-black text-yellow-400 anim-stamp">👑 HEAD</div>}
        </div>
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        {done
          ? <span className="text-[10px] font-black text-violet-400">✓ Switched to '{target}' branch</span>
          : on
            ? <span className={`text-[10px] font-mono ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}`}>Traveling through {isKingdom ? 'portal' : 'wormhole'}…</span>
            : <span className="text-[10px] text-slate-600 italic">Standing in {isKingdom ? 'main kingdom' : 'main timeline'}…</span>
        }
      </div>
    </div>
  );
};

// ─── Chapter 8: git merge ─────────────────────────────────────
export const Ch8Scene: React.FC<SceneProps> = ({ phase, stepIndex, isKingdom }) => {
  const checked = stepIndex >= 1;
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';
  const branchColor = '#8b5cf6';
  const src = isKingdom ? 'magic' : 'reactor';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 w-full px-8">
        <svg width="100%" height="120" viewBox="0 0 500 120">
          {/* Base tracks */}
          <line x1="30" y1="80" x2="470" y2="80" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="30" y1="30" x2={done ? "250" : "470"} y2="30" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 3" />
          {/* Main line */}
          <line x1="30" y1="80" x2={checked ? 470 : 200} y2="80" stroke={accent} strokeWidth="2.5"
            style={{ transition: 'all 0.8s ease-out' }} />
          {/* Branch line (disappears after merge) */}
          <line x1="30" y1="30" x2={done ? 280 : 400} y2="30" stroke={branchColor} strokeWidth="2.5"
            style={{ transition: 'all 0.8s ease-out' }} />
          {/* Merge converge path */}
          {done && (
            <path d="M 280,30 Q 320,30 340,55 L 340,80" fill="none" stroke={branchColor} strokeWidth="2" strokeDasharray="60" strokeDashoffset="0"
              className="anim-merge" />
          )}
          {/* Merge commit node */}
          {done && (
            <circle cx="380" cy="80" r="10" fill={accent} style={{ filter: `drop-shadow(0 0 10px ${accent})` }} className="anim-float-up" />
          )}
          {/* Labels */}
          <text x="30" y="100" fill="#64748b" fontSize="10">main</text>
          <text x="30" y="20" fill={branchColor} fontSize="10">{src}</text>
          {done && <text x="380" y="100" textAnchor="middle" fill={accent} fontSize="9" fontWeight="bold">merge</text>}
        </svg>
        <div className="flex justify-center mt-1">
          {done
            ? <span className="text-[10px] font-black anim-stamp" style={{ color: accent }}>✓ {isKingdom ? 'Kingdoms United!' : 'Timelines Fused!'}</span>
            : checked
              ? <span className="text-[10px] font-mono text-slate-400">On main — ready to merge…</span>
              : <span className="text-[10px] text-slate-600 italic">Two separate {isKingdom ? 'kingdoms' : 'timelines'} exist…</span>
          }
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 9: Merge Conflict ────────────────────────────────
export const Ch9Scene: React.FC<SceneProps> = ({ phase, stepIndex, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const resolved = stepIndex >= 1 || done;
  const filename = isKingdom ? 'castle.txt' : 'shield.txt';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-red-950/40 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-red-950/40 via-cyan-950/30 to-slate-950'}`} />
      <div className="relative z-10 flex flex-col items-center gap-2 w-full px-6">
        {on && !resolved && (
          <div className="anim-shake text-xs font-extrabold text-red-400 tracking-widest uppercase">
            💥 CONFLICT DETECTED!
          </div>
        )}
        <div className={`w-full rounded-xl border font-mono text-[9px] leading-5 p-3 transition-all duration-500
          ${on
            ? resolved
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/30 border-red-500/40 text-red-300'
            : 'bg-slate-900/40 border-slate-800 text-slate-600'
          }`}>
          <div className="font-bold text-slate-400 mb-1">{filename}</div>
          {resolved ? (
            <>
              <div className="text-emerald-400">✓ {isKingdom ? 'Castle + Market (merged)' : 'Shield Level: 95 (selected)'}</div>
              <div className="text-emerald-500/60 text-[8px]">Conflict resolved — ready to commit</div>
            </>
          ) : (
            <>
              <div className="text-red-400">{'<<<<<<< main'}</div>
              <div className="text-amber-300">{isKingdom ? 'Castle' : 'Shield = 80'}</div>
              <div className="text-red-400">{'======='}</div>
              <div className="text-violet-300">{isKingdom ? 'Market' : 'Shield = 95'}</div>
              <div className="text-red-400">{'>>>>>>> magic'}</div>
            </>
          )}
        </div>
        {done && <span className="text-[10px] font-black text-emerald-400 anim-stamp">✓ Conflict Resolved & Committed</span>}
        {!on && <span className="text-[10px] text-slate-600 italic">{isKingdom ? 'Two architects, one plot…' : 'Two scientists, same config file…'}</span>}
      </div>
    </div>
  );
};
