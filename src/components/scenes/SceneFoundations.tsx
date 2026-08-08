import React from 'react';

export interface SceneProps {
  phase: 'idle' | 'active' | 'complete';
  stepIndex: number;
  isKingdom: boolean;
}

// ─── Shared helpers ───────────────────────────────────────────

function SceneShell({ isKingdom, children }: { isKingdom: boolean; children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <div className={`absolute inset-0 ${isKingdom
        ? 'bg-gradient-to-br from-amber-950/50 via-slate-950/80 to-slate-950'
        : 'bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-slate-950'
      }`} />
      {/* Star field for space */}
      {!isKingdom && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="anim-twinkle absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 11) % 100}%`, animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      )}
      {/* Ground line for kingdom */}
      {isKingdom && (
        <div className="absolute bottom-4 left-6 right-6 h-px bg-amber-900/40" />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${color}`}>
      {children}
    </span>
  );
}

// ─── Chapter 1: git init ──────────────────────────────────────
export const Ch1Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  return (
    <SceneShell isKingdom={isKingdom}>
      <div className="flex flex-col items-center gap-3">
        {isKingdom ? (
          <>
            <div className={`text-5xl transition-all duration-700 ${on ? 'anim-float-up' : 'opacity-20'}`}>🏛️</div>
            <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs font-bold text-amber-300">Royal Archive</span>
              <span className="text-[10px] text-amber-500/70">Kingdom history begins here</span>
            </div>
            {done && (
              <div className="anim-stamp px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-lg">
                <span className="text-[10px] font-black text-amber-300">✓ Repository Created</span>
              </div>
            )}
            {!on && <span className="text-[10px] text-slate-600 italic">Kingdom awaits its historian…</span>}
          </>
        ) : (
          <>
            <div className={`transition-all duration-700 ${on ? 'opacity-100 scale-100' : 'opacity-20 scale-90'}`}>
              <div className={`text-5xl ${done ? 'anim-glow-ring rounded-full' : ''}`}>🛰️</div>
            </div>
            <div className={`flex flex-col items-center gap-1 transition-all duration-500 delay-300 ${on ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-cyan-400 anim-pulse-ring' : 'bg-slate-600'}`} />
                <span className="font-mono text-[10px] text-cyan-300">.git</span>
                <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-cyan-400 anim-pulse-ring' : 'bg-slate-600'}`} style={{ animationDelay: '0.3s' }} />
              </div>
              <span className="text-[10px] text-cyan-500/70">Timeline Core materializing</span>
            </div>
            {done && <div className="anim-stamp"><Label color="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">✓ Timeline Core Online</Label></div>}
            {!on && <span className="text-[10px] text-slate-600 italic">Station offline…</span>}
          </>
        )}
      </div>
    </SceneShell>
  );
};

// ─── Chapter 2: git status ────────────────────────────────────
export const Ch2Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';

  const buildings = isKingdom
    ? [{ icon: '🏰', label: 'castle.txt', delay: '0s' }, { icon: '🏘️', label: 'village.txt', delay: '0.15s' }, { icon: '🛤️', label: 'road.txt', delay: '0.3s' }]
    : [{ icon: '⚙️', label: 'oxygen.txt', delay: '0s' }, { icon: '🛡️', label: 'shield.txt', delay: '0.15s' }, { icon: '🚀', label: 'thruster.txt', delay: '0.3s' }];

  return (
    <SceneShell isKingdom={isKingdom}>
      <div className="flex flex-col items-center gap-4 w-full px-6">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
          {isKingdom ? 'Construction Zone — Untracked Files' : 'Engineering Bay — Modified Modules'}
        </span>
        <div className="flex gap-8 justify-center">
          {buildings.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-1.5 transition-all duration-500" style={{ animationDelay: b.delay }}>
              <div className={`text-3xl transition-all duration-500 ${on ? '' : 'grayscale opacity-40'}`}
                style={on ? { filter: 'drop-shadow(0 0 8px #f59e0b)' } : undefined}>{b.icon}</div>
              <div className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all duration-500
                ${on ? (isKingdom ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30') : 'bg-slate-800 text-slate-500'}`}>
                {on ? '⚠ untracked' : 'hidden'}
              </div>
              <span className="text-[9px] font-mono text-slate-500">{b.label}</span>
            </div>
          ))}
        </div>
        {on && (
          <div className={`text-[10px] font-mono px-3 py-1 rounded border ${isKingdom ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'}`}>
            {isKingdom ? '$ git status → 3 untracked blueprints' : '$ git status → 3 modified modules'}
          </div>
        )}
      </div>
    </SceneShell>
  );
};

// ─── Chapter 3: git add ───────────────────────────────────────
export const Ch3Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  return (
    <SceneShell isKingdom={isKingdom}>
      <div className="flex items-center gap-0 w-full px-4 justify-center">
        {/* Source zone */}
        <div className="flex flex-col items-center gap-2 min-w-24">
          <div className={`text-2xl px-3 py-2 rounded-xl border transition-all duration-500
            ${isKingdom ? 'border-slate-700 bg-slate-900/60' : 'border-slate-700 bg-slate-900/60'}
            ${done ? 'opacity-30' : 'opacity-100'}`}>
            {isKingdom ? '📜' : '🔧'}
          </div>
          <span className="text-[9px] text-slate-500 font-bold uppercase">{isKingdom ? 'Construction Zone' : 'Engineering Bay'}</span>
          <span className="font-mono text-[9px] text-slate-600">{isKingdom ? 'castle.txt' : 'oxygen.txt'}</span>
        </div>

        {/* Arrow + path */}
        <div className="flex-1 flex flex-col items-center gap-1 px-2">
          <svg width="100%" height="30" className="overflow-visible">
            <line x1="0" y1="15" x2="100%" y2="15" stroke={isKingdom ? '#f59e0b' : '#06b6d4'}
              strokeWidth="1.5" strokeDasharray="6 3"
              style={{ opacity: on ? 1 : 0.2, transition: 'opacity 0.5s' }} />
            {on && <polygon points="0,-5 12,0 0,5" fill={isKingdom ? '#f59e0b' : '#06b6d4'}
              transform="translate(calc(100% - 12), 15)" style={{ animation: 'slide-right 0.5s ease-out both' }} />}
          </svg>
          {on && <span className={`text-[9px] font-mono font-bold ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>→ git add</span>}
        </div>

        {/* Destination zone */}
        <div className="flex flex-col items-center gap-2 min-w-24">
          <div className={`text-2xl px-3 py-2 rounded-xl border transition-all duration-700
            ${on
              ? isKingdom ? 'border-amber-500/50 bg-amber-500/10 anim-float-up' : 'border-cyan-500/50 bg-cyan-500/10 anim-float-up'
              : 'border-slate-800 bg-slate-900/30 opacity-20'
            }`}>
            {isKingdom ? '📋' : '🚀'}
          </div>
          <span className={`text-[9px] font-bold uppercase ${on ? (isKingdom ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-600'}`}>
            {isKingdom ? 'Inspection Area' : 'Launch Pad'}
          </span>
          {done && <Label color={isKingdom ? 'bg-amber-500/10 text-amber-300' : 'bg-cyan-500/10 text-cyan-300'}>STAGED ✓</Label>}
        </div>
      </div>
    </SceneShell>
  );
};

// ─── Chapter 4: git commit ────────────────────────────────────
export const Ch4Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const done = phase === 'complete';

  return (
    <SceneShell isKingdom={isKingdom}>
      <div className="flex flex-col items-center gap-3">
        <div className={`relative transition-all duration-500 ${on ? 'opacity-100' : 'opacity-30'}`}>
          {isKingdom ? (
            <div className={`text-5xl ${done ? 'anim-glow-ring rounded-xl' : ''}`}>📖</div>
          ) : (
            <div className={`text-5xl ${done ? 'anim-glow-ring rounded-xl' : ''}`}>💎</div>
          )}
          {/* Stamp comes down on active */}
          {on && !done && (
            <div className="absolute -top-2 -right-2 text-xl anim-stamp">🔏</div>
          )}
        </div>

        {done && (
          <div className={`anim-stamp flex flex-col items-center gap-1 px-4 py-2 rounded-2xl border
            ${isKingdom ? 'bg-amber-500/10 border-amber-500/40' : 'bg-cyan-500/10 border-cyan-500/40'}`}>
            <span className={`text-[10px] font-black ${isKingdom ? 'text-amber-300' : 'text-cyan-300'}`}>
              {isKingdom ? '📖 Royal Chronicle Entry' : '💎 Time Checkpoint Created'}
            </span>
            <div className={`text-[9px] font-mono ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}`}>
              hash: 4a2b91d • HEAD → main
            </div>
          </div>
        )}
        {!on && (
          <span className="text-[10px] text-slate-600 italic">
            {isKingdom ? 'Staged files await royal approval…' : 'Checkpoint awaiting AI freeze…'}
          </span>
        )}
      </div>
    </SceneShell>
  );
};

// ─── Chapter 5: git log ───────────────────────────────────────
export const Ch5Scene: React.FC<SceneProps> = ({ phase, isKingdom }) => {
  const on = phase !== 'idle';
  const entries = ['4a2b91d — Build castle', '3f1c88a — Add village', '1e9b44c — Init archive'];

  return (
    <SceneShell isKingdom={isKingdom}>
      <div className="flex flex-col items-center gap-3 w-full px-6">
        <div className="text-3xl">{isKingdom ? '📚' : '🌀'}</div>
        <div className={`w-full space-y-1.5 transition-all duration-500 ${on ? 'opacity-100' : 'opacity-20'}`}>
          {entries.map((e, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px]
              ${on ? `anim-slide-r ${isKingdom ? 'bg-amber-500/5 border-amber-500/20 text-amber-300/80' : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-300/80'}` : 'bg-slate-900 border-slate-800 text-slate-600'}`}
              style={{ animationDelay: on ? `${i * 0.1}s` : '0s' }}>
              <span className="font-mono text-slate-500 shrink-0">{isKingdom ? '📜' : '⬡'}</span>
              <span className="font-mono">{e}</span>
            </div>
          ))}
        </div>
        {!on && <span className="text-[10px] text-slate-600 italic">{isKingdom ? 'History tower is empty…' : 'Timeline viewer offline…'}</span>}
      </div>
    </SceneShell>
  );
};
