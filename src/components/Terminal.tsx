import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Play, RotateCcw, Terminal as TerminalIcon } from 'lucide-react';
import { chapters } from '../data/chapters';

export const Terminal: React.FC = () => {
  const { gitState, executeCommand, activeWorld, currentChapterIndex, resetGitStateForChapter } = useGame();
  const [input, setInput] = useState('');
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  const currentChapter = chapters[currentChapterIndex];
  const isKingdom = activeWorld === 'kingdom';

  // Scroll terminal history to bottom
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gitState.history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input.trim());
    setInput('');
  };

  const handleQuickAction = (action: string) => {
    executeCommand(action);
  };

  const handleReset = () => {
    resetGitStateForChapter(currentChapterIndex);
  };

  // Helper to format ANSI escape codes to colored spans
  const parseAnsiColors = (text: string) => {
    const parts = text.split(/(\u001b\[\d+m|\n)/);
    let currentColorClass = 'text-slate-300';
    
    return parts.map((part, idx) => {
      if (part === '\n') {
        return <br key={idx} />;
      }
      if (part.startsWith('\u001b[')) {
        if (part === '\u001b[32m') {
          currentColorClass = 'text-emerald-400 font-bold';
        } else if (part === '\u001b[31m') {
          currentColorClass = 'text-rose-400 font-bold';
        } else if (part === '\u001b[33m') {
          currentColorClass = 'text-amber-400 font-semibold';
        } else if (part === '\u001b[0m') {
          currentColorClass = 'text-slate-300';
        }
        return null;
      }
      return <span key={idx} className={currentColorClass}>{part}</span>;
    });
  };

  // List of quick action commands relevant to this chapter
  const getQuickCommands = () => {
    const defaultCmds = ['git status', 'git log', 'git branch', 'clear'];
    // Insert target command for easy access
    const mainCmd = currentChapter.realGitCommand;
    if (mainCmd && !defaultCmds.includes(mainCmd)) {
      return [mainCmd, ...defaultCmds];
    }
    return defaultCmds;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* Header controls */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs">
          <TerminalIcon size={14} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
          <span>SIMULATED_GIT_SHELL v1.4.2</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] font-bold text-rose-400 border border-rose-500/20 bg-rose-500/5 px-2.5 py-1 rounded-md hover:bg-rose-500/10 transition-colors"
            title="Reset Terminal Workspace"
          >
            <RotateCcw size={12} /> Reset Chapter State
          </button>
        </div>
      </div>

      {/* Terminal logs viewport */}
      <div className="flex-grow p-4 overflow-y-auto min-h-[180px] max-h-[350px] space-y-2 select-text selection:bg-indigo-500/20">
        {/* Welcome message */}
        <div className="text-slate-500 text-xs">
          Type help to list general instructions, or use the quick buttons below.
        </div>

        {/* History rendering */}
        {gitState.history.map((log, idx) => (
          <div key={idx} className="leading-relaxed">
            {parseAnsiColors(log)}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      {/* Quick Action buttons */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-850 flex gap-1.5 flex-wrap items-center">
        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Hotkeys:</span>
        {getQuickCommands().map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickAction(cmd)}
            className={`text-xs px-2.5 py-1 rounded-md bg-slate-900 border hover:border-slate-600 transition-all font-semibold
              ${cmd === currentChapter.realGitCommand
                ? isKingdom 
                  ? 'border-amber-500/40 text-amber-300 hover:bg-amber-500/5' 
                  : 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/5'
                : 'border-slate-800 text-slate-400 hover:bg-slate-900'
              }
            `}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Prompt input form */}
      <form onSubmit={handleSubmit} className="flex bg-slate-900 border-t border-slate-800 p-2 items-center">
        <div className={`pl-3 font-bold text-xs tracking-tight select-none
          ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}
        `}>
          historian@gitverse:{gitState.currentBranch || 'main'}$
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-slate-100 text-sm px-3 py-1 font-mono placeholder:text-slate-600"
          placeholder={`Run command, e.g. '${currentChapter.realGitCommand}'`}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className={`p-2 rounded-lg text-slate-950 transition-all
            ${isKingdom 
              ? 'bg-amber-500 hover:bg-amber-400' 
              : 'bg-cyan-500 hover:bg-cyan-400'
            }
          `}
        >
          <Play size={14} className="fill-current" />
        </button>
      </form>
    </div>
  );
};
