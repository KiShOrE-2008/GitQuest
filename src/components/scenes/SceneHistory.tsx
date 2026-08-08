import React from 'react';
import type { SceneProps } from './SceneFoundations';

// ─── Chapter 13: git reset --hard ────────────────────────────
export const Ch13Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  const steps = isKingdom
    ? ['🏘️ Village', '🌾 Farm', '🏰 Castle', '⛓️ Prison ❌']
    : ['🌐 Init', '⚙️ Module', '🔋 Core', '💥 Reactor ❌'];

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-slate-950/80 to-slate-950" />
      {on && !done && (
        <div className="absolute inset-0 anim-rewind bg-white/5 pointer-events-none" />
      )}
      <div className="relative z-10 flex flex-col items-center gap-3 w-full px-6">
        {!on && (
          <span className="text-[10px] text-slate-600 italic">
            {isKingdom ? 'Kingdom timeline intact…' : 'Station timeline intact…'}
          </span>
        )}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => {
            const isBad = i === 3;
            const hidden = done && isBad;
            return (
              <React.Fragment key={i}>
                <div className={`flex flex-col items-center gap-1 transition-all duration-500
                  ${hidden ? 'opacity-0 -translate-y-4 scale-0' : on && isBad ? 'opacity-60 anim-shake' : 'opacity-100'}`}
                  style={{ transitionDelay: hidden ? '0.3s' : '0s' }}>
                  <div className="text-xl">{s.split(' ')[0]}</div>
                  <span className={`text-[8px] font-bold ${isBad ? 'text-red-400' : 'text-slate-400'}`}>
                    {s.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`text-slate-700 text-sm ${on && i === 2 && done ? 'text-red-500' : ''}`}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {on && !done && (
          <div className="text-sm font-black text-red-400 tracking-widest anim-shake">⏪ REWIND HISTORY…</div>
        )}
        {done && (
          <div className="anim-stamp flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-orange-400">⚠ Commits after Castle/Core are gone</span>
            <span className="text-[9px] text-slate-500">git reset --hard discards history</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Chapter 14: git revert ───────────────────────────────────
export const Ch14Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';

  const events = isKingdom
    ? ['📖 Init Archive', '🏰 Build Castle', '💰 Tax Increase ❌']
    : ['🛰️ Init Station', '⚙️ Config Core', '🚀 Bad Thruster ❌'];

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/40 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 w-full px-6">
        <svg width="100%" height="90" viewBox="0 0 500 90">
          {/* Timeline rail */}
          <line x1="20" y1="40" x2="480" y2="40" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="20" y1="40" x2="480" y2="40" stroke={accent} strokeWidth="1.5"
            strokeOpacity={on ? 0.6 : 0.2} style={{ transition: 'stroke-opacity 0.5s' }} />

          {/* Existing commits */}
          {events.map((e, i) => {
            const cx = 80 + i * 140;
            const isBad = i === 2;
            return (
              <g key={i}>
                <circle cx={cx} cy={40} r={7} fill={isBad ? '#ef4444' : accent}
                  style={{ filter: isBad && on ? 'drop-shadow(0 0 6px #ef4444)' : 'none', transition: 'all 0.3s' }} />
                <text x={cx} y={62} textAnchor="middle" fill={isBad ? '#ef4444' : '#64748b'} fontSize="8">
                  {e.split(' ').slice(1).join(' ')}
                </text>
              </g>
            );
          })}

          {/* Revert commit — NEW node appended after bad commit */}
          {done && (
            <g className="anim-float-up">
              <circle cx="440" cy="40" r="7" fill="#10b981" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
              <line x1="360" y1="40" x2="433" y2="40" stroke="#10b981" strokeWidth="2" strokeDasharray="73" strokeDashoffset="0" className="anim-draw-path" />
              <text x="440" y="62" textAnchor="middle" fill="#10b981" fontSize="8">Revert ✓</text>
              <text x="440" y="74" textAnchor="middle" fill="#10b981" fontSize="7">history intact</text>
            </g>
          )}
        </svg>
        <div className="flex justify-center">
          {done
            ? <span className="text-[10px] font-black text-emerald-400 anim-stamp">
                ✓ New inverse commit added — original history preserved
              </span>
            : on
              ? <span className="text-[9px] font-mono text-red-400">Bad event found in history…</span>
              : <span className="text-[10px] text-slate-600 italic">
                  {isKingdom ? 'Kingdom chronology intact…' : 'Station timeline running…'}
                </span>
          }
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 15: git rebase ───────────────────────────────────
export const Ch15Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';
  const branchColor = '#8b5cf6';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 w-full px-6">
        <svg width="100%" height="110" viewBox="0 0 500 110">
          {!done ? (
            // Before: branched graph
            <>
              <line x1="20" y1="70" x2="280" y2="70" stroke={accent} strokeWidth="2" />
              <path d="M 180,70 L 220,35 L 480,35" fill="none" stroke={branchColor} strokeWidth="2" />
              {[80, 180].map(cx => <circle key={cx} cx={cx} cy={70} r={7} fill={accent} />)}
              {[260, 360].map(cx => <circle key={cx} cx={cx} cy={35} r={7} fill={branchColor} />)}
              <text x="80" y="90" textAnchor="middle" fill={accent} fontSize="9">A</text>
              <text x="180" y="90" textAnchor="middle" fill={accent} fontSize="9">B</text>
              <text x="260" y="22" textAnchor="middle" fill={branchColor} fontSize="9">D</text>
              <text x="360" y="22" textAnchor="middle" fill={branchColor} fontSize="9">E</text>
              <text x="240" y="90" fill="#64748b" fontSize="8">(branched off B)</text>
            </>
          ) : (
            // After: linear graph
            <>
              <line x1="20" y1="55" x2="480" y2="55" stroke={accent} strokeWidth="2" className="anim-draw-path" style={{ strokeDasharray: '460' }} />
              {[80, 180, 280, 380, 460].map((cx, i) => (
                <circle key={i} cx={cx} cy={55} r={7} fill={i < 3 ? accent : branchColor}
                  style={{ filter: `drop-shadow(0 0 5px ${i < 3 ? accent : branchColor})`, animation: `float-up 0.4s ease-out ${i * 0.1}s both` }} />
              ))}
              {['A', 'B', 'C', "D'", "E'"].map((l, i) => (
                <text key={i} x={80 + i * 95} y={74} textAnchor="middle" fill={i < 3 ? accent : branchColor} fontSize="9">{l}</text>
              ))}
              <text x="250" y="95" textAnchor="middle" fill="#64748b" fontSize="8">Linear history — no branch divergence</text>
            </>
          )}
        </svg>
        <div className="flex justify-center">
          {done
            ? <span className="text-[10px] font-black anim-stamp" style={{ color: accent }}>✓ {isKingdom ? 'Chronicles Realigned' : 'Timeline Realigned'}</span>
            : on
              ? <span className="text-[9px] font-mono text-violet-400">Branch commits D, E will be replayed on main…</span>
              : <span className="text-[10px] text-slate-600 italic">{isKingdom ? 'History has a fork…' : 'Timeline has a divergence…'}</span>
          }
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 16: git cherry-pick ──────────────────────────────
export const Ch16Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';
  const accent = isKingdom ? '#f59e0b' : '#06b6d4';

  const items = isKingdom
    ? [{ icon: '🌱', label: 'Magic Garden', pick: true }, { icon: '🧪', label: 'Dark Potion', pick: false }, { icon: '🏰', label: 'Magic Tower', pick: false }]
    : [{ icon: '🛡️', label: 'Shield', pick: true }, { icon: '⚡', label: 'Laser', pick: false }, { icon: '🌀', label: 'Teleport', pick: false }];

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 flex items-start gap-8 w-full px-6 pt-2">
        {/* Source branch */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-[9px] font-bold text-violet-400 uppercase">{isKingdom ? 'Magic Kingdom' : 'Experimental Lab'}</span>
          {items.map((item) => (
            <div key={item.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-[10px] transition-all duration-500
              ${on && item.pick ? 'bg-violet-500/10 border-violet-500/40 text-violet-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'}
              ${done && item.pick ? 'opacity-40' : 'opacity-100'}`}>
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {on && item.pick && <span className="ml-auto text-[8px] text-violet-400">⬡ target</span>}
            </div>
          ))}
        </div>

        {/* Extract arrow */}
        <div className="flex flex-col items-center gap-1 pt-8">
          <svg width="40" height="60" viewBox="0 0 40 60">
            <line x1="20" y1="0" x2="20" y2="60" stroke={on ? accent : '#1e293b'} strokeWidth="2"
              strokeDasharray="60" strokeDashoffset={on ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
            {on && <polygon points="-6,0 6,0 0,12" fill={accent} transform="translate(20,48)" />}
          </svg>
          <span className="text-[8px] font-mono" style={{ color: on ? accent : '#334155' }}>cherry-pick</span>
        </div>

        {/* Main branch result */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-[9px] font-bold uppercase" style={{ color: accent }}>{isKingdom ? 'Main Kingdom' : 'Main Station'}</span>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-[10px] transition-all duration-700
            ${done
              ? `${isKingdom ? 'bg-amber-500/10 border-amber-500/40' : 'bg-cyan-500/10 border-cyan-500/40'} anim-cherry`
              : 'bg-slate-900/20 border-slate-900 text-slate-600 opacity-20'}`}>
            <span>{items[0].icon}</span>
            <span className="font-medium" style={{ color: done ? accent : '#475569' }}>{items[0].label}</span>
            {done && <span className="ml-auto text-[8px] text-emerald-400">✓ added</span>}
          </div>
          {!done && <span className="text-[9px] text-slate-600 italic">awaiting extraction…</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Chapter 17: git stash ────────────────────────────────────
export const Ch17Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom ? 'bg-gradient-to-br from-amber-950/40 via-slate-950/80 to-slate-950' : 'bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-slate-950'}`} />
      <div className="relative z-10 flex items-center gap-6 w-full px-8">
        {/* Work in progress */}
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${done ? 'opacity-10 -translate-y-2 scale-90' : 'opacity-100'}`}>
          <div className="relative">
            <div className="text-4xl">{isKingdom ? '🌉' : '☀️'}</div>
            {on && <div className="absolute -top-1 -right-1 text-sm animate-bounce">⚠️</div>}
          </div>
          <span className="text-[9px] font-bold text-orange-400">
            {isKingdom ? 'Unfinished Bridge' : 'Half-done Solar Panel'}
          </span>
          {on && !done && <span className="text-[8px] text-orange-500/70 italic">Emergency incoming!</span>}
        </div>

        {/* Arrow to vault */}
        <div className="flex flex-col items-center gap-1">
          <svg width="60" height="30" viewBox="0 0 60 30">
            <line x1="0" y1="15" x2="60" y2="15" stroke={on ? (isKingdom ? '#f59e0b' : '#06b6d4') : '#1e293b'}
              strokeWidth="2" strokeDasharray="60" strokeDashoffset={on ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
            {on && <polygon points="0,-5 12,0 0,5" fill={isKingdom ? '#f59e0b' : '#06b6d4'} transform="translate(48,15)" />}
          </svg>
          <span className={`text-[8px] font-mono ${on ? (isKingdom ? 'text-amber-500' : 'text-cyan-500') : 'text-slate-700'}`}>
            git stash
          </span>
        </div>

        {/* Vault / Storage */}
        <div className={`flex flex-col items-center gap-2 transition-all duration-700 ${on ? 'opacity-100' : 'opacity-20'}`}>
          <div className="text-4xl">{isKingdom ? '🔐' : '🧊'}</div>
          <span className={`text-[9px] font-bold ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>
            {isKingdom ? 'Royal Vault' : 'Cryo Storage'}
          </span>
          {done && (
            <div className={`px-2 py-0.5 rounded border text-[8px] font-bold anim-vault
              ${isKingdom ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'}`}>
              📦 stash@{'{0}'}
            </div>
          )}
        </div>
      </div>
      {done && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className={`text-[9px] font-black anim-stamp ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>
            ✓ Work shelved — run git stash pop to restore
          </span>
        </div>
      )}
    </div>
  );
};
