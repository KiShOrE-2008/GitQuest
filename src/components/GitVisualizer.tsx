import React from 'react';
import { File, Folder, GitCommit as CommitIcon, GitBranch, Terminal, Globe, AlertCircle } from 'lucide-react';
import type { GitRepoState } from '../simulator/GitEngine';

interface GitVisualizerProps {
  repoState: GitRepoState;
}

export const GitVisualizer: React.FC<GitVisualizerProps> = ({ repoState }) => {
  if (!repoState.initialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500 space-y-3">
        <Terminal size={48} className="text-gray-600 animate-pulse" />
        <h3 className="text-lg font-bold text-gray-400">Git Repository Uninitialized</h3>
        <p className="text-sm max-w-xs">
          Run <code className="bg-slate-900 px-1.5 py-0.5 rounded text-purple-400">git init</code> in the terminal below to start tracking files and view the repository state.
        </p>
      </div>
    );
  }

  // Draw local commit graph
  const localCommits = Object.values(repoState.commits).sort((a, b) => a.timestamp - b.timestamp);
  
  // Track layout calculation
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
    
    // Check branch pointers
    Object.keys(repoState.branches).forEach(bName => {
      if (repoState.branches[bName] === hash) {
        pointers.push({ label: bName, type: 'branch' });
        // Check if HEAD points to this branch
        if (repoState.head === bName) {
          pointers.push({ label: 'HEAD', type: 'head' });
        }
      }
    });

    // Check direct HEAD pointer (detached HEAD)
    if (repoState.head === hash) {
      pointers.push({ label: 'HEAD', type: 'head' });
    }

    // Check tags
    Object.keys(repoState.tags).forEach(tName => {
      if (repoState.tags[tName] === hash) {
        pointers.push({ label: tName, type: 'tag' });
      }
    });

    return pointers;
  };

  const getBranchColor = (track: number) => {
    const colors = [
      'stroke-purple-500 fill-purple-500',
      'stroke-cyan-500 fill-cyan-500',
      'stroke-emerald-500 fill-emerald-500',
      'stroke-pink-500 fill-pink-500',
      'stroke-amber-500 fill-amber-500',
    ];
    return colors[track % colors.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full min-h-[400px]">
      {/* 1. Working Directory */}
      <div className="bg-slate-950/40 border border-brand-border rounded-xl p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-border">
          <Folder size={16} className="text-gray-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Working Directory</span>
        </div>
        <div className="flex-grow space-y-2 overflow-y-auto max-h-[350px] pr-1">
          {Object.keys(repoState.workingDir).length === 0 ? (
            <div className="text-center text-xs text-gray-600 py-8">
              Directory is empty. Create files in the editor.
            </div>
          ) : (
            Object.keys(repoState.workingDir).map(file => {
              const hasStaged = repoState.stagingArea[file] !== undefined;
              // Check if modified vs head commit
              const headHash = repoState.branches[repoState.head] || repoState.head;
              const headCommit = repoState.commits[headHash];
              const isModified = headCommit && headCommit.tree[file] !== repoState.workingDir[file] && !hasStaged;
              const isUntracked = !hasStaged && (!headCommit || headCommit.tree[file] === undefined);

              let badgeText = '';
              let badgeStyle = '';
              if (hasStaged) {
                badgeText = 'staged';
                badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              } else if (isModified) {
                badgeText = 'modified';
                badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
              } else if (isUntracked) {
                badgeText = 'untracked';
                badgeStyle = 'bg-slate-800 text-gray-400 border-slate-700';
              }

              return (
                <div key={file} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-900 hover:border-slate-800">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <File size={14} className={isModified || isUntracked ? 'text-red-400' : 'text-gray-400'} />
                    <span className="text-xs font-mono font-semibold truncate">{file}</span>
                  </div>
                  {badgeText && (
                    <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${badgeStyle}`}>
                      {badgeText}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Staging Area */}
      <div className="bg-slate-950/40 border border-brand-border rounded-xl p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-border">
          <CommitIcon size={16} className="text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Staging Area</span>
        </div>
        <div className="flex-grow space-y-2 overflow-y-auto max-h-[350px] pr-1">
          {Object.keys(repoState.stagingArea).length === 0 ? (
            <div className="text-center text-xs text-gray-600 py-8">
              Staging area is empty. Run <code className="bg-slate-900 px-1 py-0.5 rounded">git add</code> to stage files.
            </div>
          ) : (
            Object.keys(repoState.stagingArea).map(file => (
              <div key={file} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/10 border border-emerald-900/20">
                <div className="flex items-center gap-2 overflow-hidden">
                  <File size={14} className="text-emerald-400" />
                  <span className="text-xs font-mono font-semibold text-emerald-300 truncate">{file}</span>
                </div>
                <span className="text-[8px] uppercase tracking-wider font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  staged
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Local Commit Tree */}
      <div className="bg-slate-950/40 border border-brand-border rounded-xl p-4 flex flex-col lg:col-span-2 relative min-h-[300px]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Commit History Graph</span>
          </div>
          {repoState.mergeState && (
            <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
              <AlertCircle size={10} /> Merge Conflict
            </span>
          )}
        </div>

        {/* SVG Drawing Panel */}
        <div className="flex-grow overflow-auto max-h-[350px] border border-slate-900/60 bg-slate-950/60 rounded-xl relative p-4 flex flex-col items-center">
          {localCommits.length === 0 ? (
            <div className="text-center text-xs text-gray-600 py-16">
              No commits yet. Record your staged files with <code className="bg-slate-900 px-1 py-0.5 rounded">git commit -m</code>.
            </div>
          ) : (
            <div className="relative w-full min-h-[220px]">
              {/* SVG Connector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {localCommits.map((c, idx) => {
                  const x = 50 + (tracks[c.hash] ?? 0) * 80;
                  const y = 30 + idx * 55;

                  return c.parents.map(pHash => {
                    const pIdx = localCommits.findIndex(lc => lc.hash === pHash);
                    if (pIdx === -1) return null;
                    const px = 50 + (tracks[pHash] ?? 0) * 80;
                    const py = 30 + pIdx * 55;

                    // Draw smooth cubic bezier curve
                    return (
                      <path
                        key={`${pHash}-${c.hash}`}
                        d={`M ${px} ${py} C ${px} ${(py + y) / 2}, ${x} ${(py + y) / 2}, ${x} ${y}`}
                        fill="none"
                        strokeWidth="2"
                        className={getBranchColor(tracks[c.hash] ?? 0).split(' ')[0]}
                      />
                    );
                  });
                })}
              </svg>

              {/* Commit Nodes & Pointer Labels */}
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
                    {/* Node circle */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold transition-all relative z-10 ${
                        repoState.head === c.hash || Object.values(repoState.branches).includes(c.hash)
                          ? 'bg-purple-600 border-white text-white scale-110 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                          : 'bg-slate-900 border-slate-700 text-gray-400 group-hover:border-slate-500'
                      }`}
                      title={`${c.hash} - ${c.message}`}
                    >
                      {c.hash.substring(0, 3)}

                      {/* Tooltip on hover */}
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all bg-slate-950 border border-slate-800 text-[10px] p-2 rounded-lg shadow-xl w-44 z-50 text-left">
                        <div className="font-extrabold text-purple-400">commit {c.hash}</div>
                        <div className="text-gray-300 font-semibold truncate mt-0.5">{c.message}</div>
                        <div className="text-[8px] text-gray-500 mt-1">Parents: {c.parents.map(p => p.substring(0,4)).join(', ') || 'root'}</div>
                      </div>
                    </div>

                    {/* Reference Badges next to Node */}
                    <div className="flex items-center gap-1.5 ml-4 pl-1 pointer-events-none">
                      {pointers.map(ptr => {
                        if (ptr.type === 'head') {
                          return (
                            <span key={ptr.label} className="bg-cyan-500 text-slate-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                              HEAD
                            </span>
                          );
                        }
                        if (ptr.type === 'branch') {
                          return (
                            <span key={ptr.label} className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <GitBranch size={8} />
                              {ptr.label}
                            </span>
                          );
                        }
                        return (
                          <span key={ptr.label} className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
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
        <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Globe size={14} className={repoState.remote ? 'text-purple-400' : 'text-gray-600'} />
            <span>Remote: <span className="font-semibold text-gray-400">{repoState.remote ? repoState.remote.url : 'Not connected'}</span></span>
          </div>
          {repoState.remote && (
            <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Connected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
