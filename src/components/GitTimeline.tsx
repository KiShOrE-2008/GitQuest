import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Commit } from '../context/GameContext';
import { HelpCircle, GitBranch } from 'lucide-react';

export const GitTimeline: React.FC = () => {
  const { gitState, activeWorld } = useGame();
  const [hoveredCommit, setHoveredCommit] = useState<Commit | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const isKingdom = activeWorld === 'kingdom';

  // Coordinate mapping function for visualization nodes
  const getNodeCoordinates = (commit: Commit) => {
    let x = 80;
    let y = 120; // Default center line for main branch

    // Horizontal mapping by commit index / time sequence
    if (commit.id === 'c1') { x = 100; y = 120; }
    else if (commit.id === 'c2') { x = 240; y = 120; }
    else if (commit.id === 'c3') { x = 380; y = 120; }
    else if (commit.id === 'revert-c1') { x = 520; y = 120; }
    else if (commit.id === 'cherry-c') { x = 660; y = 120; }
    // Alternate branch mapping (drawn higher up)
    else if (commit.id === 'magic-c1' || commit.id === 'reactor-c1') { x = 240; y = 50; }
    else if (commit.id === 'magic-c2' || commit.id === 'reactor-c2') { x = 380; y = 50; }
    else if (commit.id === 'cherry-c1') { x = 520; y = 50; }

    return { x, y };
  };

  // Helper to determine parent path connection lines
  const getPaths = () => {
    const paths: { d: string; color: string; dash?: boolean }[] = [];
    const colorMain = isKingdom ? '#d97706' : '#0891b2'; // amber vs cyan
    const colorBranch = '#8b5cf6'; // violet for alternate branch

    if (!gitState.isInitialized) return paths;

    // Draw main track background path
    paths.push({
      d: "M 40,120 H 750",
      color: "#1e293b",
      dash: true
    });

    // Draw active connections depending on commits array
    const idList = gitState.commits.map(c => c.id);

    if (idList.includes('c1')) {
      // Line from base
      paths.push({ d: "M 40,120 L 100,120", color: colorMain });
    }

    if (idList.includes('c2')) {
      if (idList.includes('magic-c1') || idList.includes('reactor-c1')) {
        // This was a merge! Main c1 connects to Main c2, and Branch magic-c1 curves down to Main c2
        paths.push({ d: "M 100,120 L 240,120", color: colorMain });
        paths.push({ d: "M 240,50 C 290,50 290,120 380,120", color: colorBranch });
      } else {
        paths.push({ d: "M 100,120 L 240,120", color: colorMain });
      }
    }

    if (idList.includes('c3')) {
      paths.push({ d: "M 240,120 L 380,120", color: colorMain });
    }

    if (idList.includes('revert-c1')) {
      paths.push({ d: "M 380,120 L 520,120", color: colorMain });
    }

    if (idList.includes('cherry-c')) {
      paths.push({ d: "M 520,120 L 660,120", color: colorMain });
    }

    // Branch drawing split off c1
    const branchCommit = gitState.commits.find(c => c.id.startsWith('magic-') || c.id.startsWith('reactor-'));
    if (branchCommit) {
      // Split curve from c1 (x=100, y=120) up to branch-c1 (x=240, y=50)
      paths.push({
        d: "M 100,120 C 150,120 170,50 240,50",
        color: colorBranch
      });

      if (idList.includes('magic-c2') || idList.includes('reactor-c2')) {
        paths.push({ d: "M 240,50 L 380,50", color: colorBranch });
      }
    }

    return paths;
  };

  const handleMouseEnter = (commit: Commit, e: React.MouseEvent<SVGCircleElement>) => {
    const svgRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (svgRect) {
      const coord = getNodeCoordinates(commit);
      setTooltipPos({
        x: coord.x + 10,
        y: coord.y - 80
      });
    }
    setHoveredCommit(commit);
  };

  const handleMouseLeave = () => {
    setHoveredCommit(null);
  };

  // Determine which commit is HEAD
  const getHeadCommitHash = () => {
    if (gitState.commits.length === 0) return '';
    // Typically HEAD is the last commit on the active branch
    const branchCommits = gitState.commits.filter(c => c.branch === gitState.currentBranch);
    if (branchCommits.length > 0) {
      return branchCommits[branchCommits.length - 1].hash;
    }
    return gitState.commits[gitState.commits.length - 1].hash;
  };

  const headHash = getHeadCommitHash();

  return (
    <div className={`relative rounded-2xl border bg-slate-950/40 p-5 flex flex-col justify-between h-full backdrop-blur-md shadow-inner transition-colors duration-500
      ${isKingdom ? 'border-amber-500/10' : 'border-cyan-500/10'}
    `}>
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className={isKingdom ? 'text-amber-500' : 'text-cyan-500'} />
          <span className="text-xs font-bold text-slate-300">INTERACTIVE_GIT_TIMELINE</span>
        </div>
        <span className="text-[10px] text-slate-500 font-semibold uppercase">Live Commit Graph</span>
      </div>

      {/* SVG Canvas Viewport */}
      <div className="relative flex-grow flex items-center justify-center min-h-[160px] py-4">
        {gitState.isInitialized ? (
          <svg className="w-full h-full max-w-2xl overflow-visible" viewBox="0 0 760 180" fill="none">
            {/* Draw connectors */}
            {getPaths().map((path, idx) => (
              <path
                key={idx}
                d={path.d}
                stroke={path.color}
                strokeWidth={path.dash ? "1.5" : "3.5"}
                strokeDasharray={path.dash ? "6 4" : undefined}
                className="transition-all duration-500"
              />
            ))}

            {/* Draw nodes */}
            {gitState.commits.map((c) => {
              const { x, y } = getNodeCoordinates(c);
              const isHead = c.hash === headHash;
              const nodeColor = c.branch === 'main' ? (isKingdom ? '#f59e0b' : '#06b6d4') : '#a78bfa';

              return (
                <g key={c.id} className="cursor-pointer group">
                  {/* Outer animated ring for HEAD */}
                  {isHead && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      fill="transparent"
                      className="animate-ping opacity-60"
                    />
                  )}
                  
                  {/* Node Hover boundary */}
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="transparent"
                    onMouseEnter={(e) => handleMouseEnter(c, e)}
                    onMouseLeave={handleMouseLeave}
                  />

                  {/* Core Commit Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHead ? "6.5" : "5"}
                    fill={nodeColor}
                    stroke="#020617"
                    strokeWidth="1.5"
                    onMouseEnter={(e) => handleMouseEnter(c, e)}
                    onMouseLeave={handleMouseLeave}
                    className="transition-all duration-300 group-hover:scale-125"
                  />

                  {/* Commit label quick-preview */}
                  <text
                    x={x}
                    y={y + 22}
                    textAnchor="middle"
                    fill="#475569"
                    className="text-[9px] font-mono font-bold select-none"
                  >
                    {c.hash}
                  </text>
                  
                  {/* HEAD tag indicator */}
                  {isHead && (
                    <g transform={`translate(${x - 18}, ${y - 28})`}>
                      <rect
                        width="36"
                        height="12"
                        rx="3"
                        fill={nodeColor}
                        className="opacity-95"
                      />
                      <text
                        x="18"
                        y="9"
                        textAnchor="middle"
                        fill="#0f172a"
                        className="text-[8px] font-bold tracking-tighter"
                      >
                        HEAD
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 animate-pulse">
              <HelpCircle size={22} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Repository Not Initialized</span>
              <p className="text-[10px] text-slate-600 max-w-xs leading-normal">
                Run 'git init' inside the terminal simulator to activate the timeline database logic.
              </p>
            </div>
          </div>
        )}

        {/* Hover commit tooltip card */}
        {hoveredCommit && (
          <div 
            className="absolute z-30 w-52 rounded-xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl p-3 shadow-2xl space-y-2 pointer-events-none transition-all duration-200"
            style={{ 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y}px` 
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
              <span className="text-[9px] font-mono text-indigo-400 font-extrabold">{hoveredCommit.hash}</span>
              <span className="text-[8px] font-bold uppercase text-slate-500 bg-slate-900 px-1 rounded">
                {hoveredCommit.branch}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 block uppercase">Commit Message</span>
              <p className="text-xs text-slate-300 font-bold leading-tight">{hoveredCommit.message}</p>
            </div>
            {hoveredCommit.files && hoveredCommit.files.length > 0 && (
              <div>
                <span className="text-[8px] font-bold text-slate-500 block uppercase">Modified Assets</span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                  {hoveredCommit.files.join(', ')}
                </span>
              </div>
            )}
            <div className="text-[8px] text-slate-600">
              Recorded at: {hoveredCommit.timestamp}
            </div>
          </div>
        )}
      </div>

      {/* Graph Legend indicators */}
      {gitState.isInitialized && (
        <div className="border-t border-slate-900/60 pt-3 flex gap-4 text-[10px] justify-center text-slate-500 font-semibold select-none">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}`} />
            <span>Main Timeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>Alternate Branch</span>
          </div>
        </div>
      )}
    </div>
  );
};
