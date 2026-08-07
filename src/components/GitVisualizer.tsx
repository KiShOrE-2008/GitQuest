import React from 'react';
import { File, Folder, GitCommit as CommitIcon, GitBranch, Terminal, Globe, AlertCircle } from 'lucide-react';
import type { GitRepoState } from '../simulator/GitEngine';
import { translateFilenameToThemed, type WorldTheme } from '../utils/themeTranslator';

interface GitVisualizerProps {
  repoState: GitRepoState;
  activeTheme?: string;
}

export const GitVisualizer: React.FC<GitVisualizerProps> = ({ repoState, activeTheme = 'kingdom' }) => {
  const isKingdom = activeTheme === 'kingdom';
  const world = activeTheme as WorldTheme;

  // Theme-aware styles
  const mainBorder = isKingdom ? 'border-amber-500/30' : 'border-cyan-500/20';
  const headerBorder = isKingdom ? 'border-amber-500/10' : 'border-pink-500/10';
  const textClass = isKingdom ? 'text-amber-500' : 'text-cyan-500';
  const focusNodeClass = isKingdom 
    ? 'bg-amber-600 border-white text-white scale-110 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
    : 'bg-pink-600 border-white text-white scale-110 shadow-[0_0_8px_rgba(236,72,153,0.6)]';

  if (!repoState.initialized) {
    return (
      <div className={`flex flex-col items-center justify-center h-full p-8 text-center space-y-4 border-4 border-dashed bg-slate-950/20 font-arcade ${
        isKingdom ? 'border-amber-900/40 text-amber-600' : 'border-slate-900 text-cyan-600'
      }`}>
        <Terminal size={32} className={`animate-pulse ${isKingdom ? 'text-amber-500/50' : 'text-pink-500/50'}`} />
        <h3 className="text-xs font-bold text-gray-500 uppercase">
          {isKingdom ? 'REALM OFFLINE' : 'SECTOR OFFLINE'}
        </h3>
        <p className="text-[14px] font-pixel uppercase max-w-xs leading-relaxed">
          {isKingdom 
            ? 'Run "git init" in the Royal Scroll CLI to crown a new realm tracking archive.'
            : 'Run "git init" in the CLI station terminal to initialize sector timeline tracking.'}
        </p>
      </div>
    );
  }

  const localCommits = Object.values(repoState.commits).sort((a, b) => a.timestamp - b.timestamp);
  
  const tracks: Record<string, number> = {};
  const nextTrackForParent: Record<string, number> = {};
  let maxTrack = 0;

  localCommits.forEach(c => {
    if (c.parents.length === 0) {
      tracks[c.hash] = 0;
    } else {
      const primaryParent = c.parents[0];
      const pTrack = tracks[primaryParent] ?? 0;
      if (nextTrackForParent[primaryParent] === undefined) {
        tracks[c.hash] = pTrack;
        nextTrackForParent[primaryParent] = pTrack + 1;
      } else {
        maxTrack++;
        tracks[c.hash] = maxTrack;
      }
    }
  });

  const getCommitPointers = (hash: string) => {
    const pointers: { label: string; type: 'branch' | 'head' | 'tag' }[] = [];
    
    Object.keys(repoState.branches).forEach(bName => {
      if (repoState.branches[bName] === hash) {
        // Translate HEAD and branch labels
        let label = bName.toUpperCase();
        if (label === 'MAIN') label = isKingdom ? 'MAIN-REIGN' : 'MAIN-TIMELINE';
        pointers.push({ label, type: 'branch' });
        
        if (repoState.head === bName) {
          pointers.push({ label: 'HEAD', type: 'head' });
        }
      }
    });

    if (repoState.head === hash) {
      pointers.push({ label: 'HEAD', type: 'head' });
    }

    Object.keys(repoState.tags).forEach(tName => {
      if (repoState.tags[tName] === hash) {
        pointers.push({ label: tName.toUpperCase(), type: 'tag' });
      }
    });

    return pointers;
  };

  const getBranchColor = (track: number) => {
    const colors = isKingdom
      ? [
          'stroke-amber-500 fill-amber-500',
          'stroke-orange-500 fill-orange-500',
          'stroke-yellow-500 fill-yellow-500',
          'stroke-red-600 fill-red-600',
        ]
      : [
          'stroke-pink-500 fill-pink-500',
          'stroke-cyan-500 fill-cyan-500',
          'stroke-emerald-500 fill-emerald-500',
          'stroke-blue-500 fill-blue-500',
        ];
    return colors[track % colors.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full min-h-[400px]">
      
      {/* 1. Working Directory (Themed) */}
      <div className={`bg-slate-950 border-2 ${mainBorder} p-4 flex flex-col`}>
        <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${headerBorder} font-arcade text-[8px]`}>
          <Folder size={12} className="text-gray-500" />
          <span className="font-bold text-gray-500">
            {isKingdom ? 'KINGDOM LANDS' : 'WORKSPACE SECTORS'}
          </span>
        </div>
        <div className="flex-grow space-y-2 overflow-y-auto max-h-[350px] pr-1">
          {Object.keys(repoState.workingDir).length === 0 ? (
            <div className="text-center text-xs text-gray-600 font-pixel uppercase py-8">
              {isKingdom ? 'No active constructs in the realm lands.' : 'No active sector modules buffered.'}
            </div>
          ) : (
            Object.keys(repoState.workingDir).map(file => {
              const themedFile = translateFilenameToThemed(file, world);
              const hasStaged = repoState.stagingArea[file] !== undefined;
              const headHash = repoState.branches[repoState.head] || repoState.head;
              const headCommit = repoState.commits[headHash];
              const isModified = headCommit && headCommit.tree[file] !== repoState.workingDir[file] && !hasStaged;
              const isUntracked = !hasStaged && (!headCommit || headCommit.tree[file] === undefined);

              let badgeText = '';
              let badgeStyle = '';
              if (hasStaged) {
                badgeText = isKingdom ? 'Prepared' : 'Buffered';
                badgeStyle = 'bg-emerald-950/20 text-emerald-400 border-emerald-800/40';
              } else if (isModified) {
                badgeText = isKingdom ? 'Edits' : 'Divergent';
                badgeStyle = 'bg-red-950/20 text-red-400 border-red-800/40';
              } else if (isUntracked) {
                badgeText = isKingdom ? 'Wild' : 'Unlogged';
                badgeStyle = 'bg-slate-950 text-gray-600 border-slate-900';
              }

              return (
                <div key={file} className="flex items-center justify-between p-2 border-2 border-slate-900 bg-slate-950 hover:border-slate-800 font-pixel text-[16px]">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <File size={12} className={isModified || isUntracked ? 'text-red-400' : isKingdom ? 'text-amber-500' : 'text-cyan-600'} />
                    <span className="font-mono truncate">{themedFile}</span>
                  </div>
                  {badgeText && (
                    <span className={`text-[6px] font-arcade uppercase px-1.5 py-0.5 border ${badgeStyle}`}>
                      {badgeText}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Staging Area (Themed) */}
      <div className={`bg-slate-950 border-2 ${mainBorder} p-4 flex flex-col`}>
        <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${headerBorder} font-arcade text-[8px]`}>
          <CommitIcon size={12} className={isKingdom ? 'text-amber-500' : 'text-emerald-500'} />
          <span className="font-bold text-gray-500">
            {isKingdom ? 'CHRONICLE BUFFER' : 'CHECKPOINT QUEUE'}
          </span>
        </div>
        <div className="flex-grow space-y-2 overflow-y-auto max-h-[350px] pr-1">
          {Object.keys(repoState.stagingArea).length === 0 ? (
            <div className="text-center text-xs text-gray-600 font-pixel uppercase py-8 leading-relaxed">
              {isKingdom 
                ? 'Chronicle buffer is empty. Prepare decree edits using "git add".' 
                : 'Checkpoint buffer is empty. Stage sector modules using "git add".'}
            </div>
          ) : (
            Object.keys(repoState.stagingArea).map(file => {
              const themedFile = translateFilenameToThemed(file, world);
              return (
                <div key={file} className="flex items-center justify-between p-2 border-2 border-emerald-950/20 bg-slate-950 font-pixel text-[16px]">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <File size={12} className="text-emerald-400" />
                    <span className="font-mono text-emerald-300 truncate">{themedFile}</span>
                  </div>
                  <span className="text-[6px] font-arcade bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 uppercase">
                    {isKingdom ? 'PREPARED' : 'BUFFERED'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Local Commit Tree (Themed) */}
      <div className={`bg-slate-950 border-2 ${mainBorder} p-4 flex flex-col lg:col-span-2 relative min-h-[300px]`}>
        <div className={`flex items-center justify-between mb-3 pb-2 border-b ${headerBorder} font-arcade text-[8px]`}>
          <div className="flex items-center gap-2">
            <GitBranch size={12} className={isKingdom ? 'text-amber-500' : 'text-pink-500'} />
            <span className="font-bold text-gray-500">
              {isKingdom ? 'ROYAL CHRONICLE REGISTRY (DAG)' : 'TIMELINE LOG GRAPH (DAG)'}
            </span>
          </div>
          {repoState.mergeState && (
            <span className="text-[6px] bg-red-950/40 border border-red-500 text-red-400 px-2 py-0.5 font-bold arcade-blink glow-pink-text flex items-center gap-1">
              <AlertCircle size={8} /> CONFLICT
            </span>
          )}
        </div>

        {/* SVG Drawing Panel */}
        <div className="flex-grow overflow-auto max-h-[350px] border-2 border-slate-900 bg-slate-950 p-4 flex flex-col items-center">
          {localCommits.length === 0 ? (
            <div className="text-center text-xs text-gray-600 font-pixel uppercase py-16">
              {isKingdom 
                ? 'No chronicle entries in memory logs. Commit blueprints using "git commit".' 
                : 'No timeline checkpoints loaded. Save system status using "git commit".'}
            </div>
          ) : (
            <div className="relative w-full min-h-[220px]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {localCommits.map((c, idx) => {
                  const x = 50 + (tracks[c.hash] ?? 0) * 80;
                  const y = 30 + idx * 55;

                  return c.parents.map(pHash => {
                    const pIdx = localCommits.findIndex(lc => lc.hash === pHash);
                    if (pIdx === -1) return null;
                    const px = 50 + (tracks[pHash] ?? 0) * 80;
                    const py = 30 + pIdx * 55;

                    return (
                      <path
                        key={`${pHash}-${c.hash}`}
                        d={`M ${px} ${py} C ${px} ${(py + y) / 2}, ${x} ${(py + y) / 2}, ${x} ${y}`}
                        fill="none"
                        strokeWidth="3"
                        className={getBranchColor(tracks[c.hash] ?? 0).split(' ')[0]}
                      />
                    );
                  });
                })}
              </svg>

              {localCommits.map((c, idx) => {
                const x = 50 + (tracks[c.hash] ?? 0) * 80;
                const y = 30 + idx * 55;
                const pointers = getCommitPointers(c.hash);

                return (
                  <div
                    key={c.hash}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center group cursor-pointer"
                  >
                    <div
                      className={`w-6 h-6 border-2 flex items-center justify-center text-[8px] font-mono font-bold transition-all relative z-10 ${
                        repoState.head === c.hash || Object.values(repoState.branches).includes(c.hash)
                          ? focusNodeClass
                          : 'bg-slate-950 border-slate-700 text-gray-500 group-hover:border-slate-500'
                      }`}
                      title={`${c.hash} - ${c.message}`}
                    >
                      {c.hash.substring(0, 3).toUpperCase()}

                      <div className={`absolute left-8 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all bg-slate-950 border-2 font-pixel p-2.5 shadow-2xl w-44 z-50 text-left text-[14px] ${
                        isKingdom ? 'border-amber-500' : 'border-pink-500'
                      }`}>
                        <div className={`font-arcade text-[6px] ${isKingdom ? 'text-amber-500' : 'text-pink-400'}`}>
                          {isKingdom ? 'CHRONICLE' : 'CHECKPOINT'} {c.hash.toUpperCase()}
                        </div>
                        <div className="text-white font-bold truncate mt-1">{c.message.toUpperCase()}</div>
                        <div className={`text-[11px] mt-1 uppercase font-semibold ${isKingdom ? 'text-amber-800' : 'text-cyan-800'}`}>
                          Parents: {c.parents.map(p => p.substring(0,3).toUpperCase()).join(', ') || 'ROOT'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-4 pl-1 pointer-events-none font-arcade text-[6px]">
                      {pointers.map(ptr => {
                        if (ptr.type === 'head') {
                          return (
                            <span key={ptr.label} className={`font-extrabold px-1.5 py-0.5 border ${
                              isKingdom 
                                ? 'bg-amber-500 text-slate-950 border-amber-400' 
                                : 'bg-cyan-500 text-slate-950 border-cyan-400'
                            }`}>
                              {isKingdom ? 'REIGN' : 'MARKER'}
                            </span>
                          );
                        }
                        if (ptr.type === 'branch') {
                          return (
                            <span key={ptr.label} className={`border font-bold px-1.5 py-0.5 flex items-center gap-0.5 ${
                              isKingdom 
                                ? 'bg-amber-950/40 border-amber-500 text-amber-400' 
                                : 'bg-pink-950/40 border-pink-500 text-pink-400'
                            }`}>
                              {ptr.label}
                            </span>
                          );
                        }
                        return (
                          <span key={ptr.label} className="bg-amber-950/40 border border-amber-500 text-amber-400 font-bold px-1.5 py-0.5">
                            {ptr.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Remote status indicator */}
        <div className={`mt-3 p-3 bg-slate-950 border-2 border-slate-900 flex items-center justify-between text-xs font-arcade text-[8px] text-gray-500`}>
          <div className="flex items-center gap-1.5">
            <Globe size={12} className={repoState.remote ? isKingdom ? 'text-amber-400' : 'text-pink-400' : 'text-gray-700'} />
            <span>REMOTE: <span className={`${textClass} font-semibold`}>
              {repoState.remote ? repoState.remote.url?.toUpperCase() : 'NOT RUNNING'}
            </span></span>
          </div>
          {repoState.remote && (
            <span className={`border px-2 py-0.5 uppercase tracking-wider font-bold ${
              isKingdom ? 'bg-amber-900/40 border-amber-500/30 text-amber-400' : 'bg-pink-900/40 border-pink-500/30 text-pink-400'
            }`}>
              CONNECTED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
