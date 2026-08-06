import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, AlertTriangle, Sparkles, Terminal, FileCode, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import type { Quest } from '../data/quests';
import { GitEngine } from '../simulator/GitEngine';
import type { GitRepoState } from '../simulator/GitEngine';
import { GitVisualizer } from '../components/GitVisualizer';

interface SimulatorPageProps {
  quest: Quest;
  onQuestComplete: (questId: string, xpEarned: number, coinsEarned: number) => void;
  onNextQuest?: () => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  quest,
  onQuestComplete,
  onNextQuest,
}) => {
  // Simulator states
  const [engine, setEngine] = useState<GitEngine>(new GitEngine());
  const [repoState, setRepoState] = useState<GitRepoState>(new GitEngine().getEmptyState());
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLines, setTerminalLines] = useState<{ type: 'input' | 'output' | 'error'; text: string }[]>([]);
  
  // Editor states
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [editorContent, setEditorContent] = useState<string>('');
  const [newFileName, setNewFileName] = useState<string>('');
  const [showAddFileModal, setShowAddFileModal] = useState<boolean>(false);

  // Quiz states
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Mission validation state
  const [missionFeedback, setMissionFeedback] = useState<{ passed: boolean; message?: string }>({ passed: false });
  const [claimedRewards, setClaimedRewards] = useState<boolean>(false);

  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Setup the starting state when quest changes
  useEffect(() => {
    resetQuest();
  }, [quest]);

  const resetQuest = () => {
    let freshEngine = new GitEngine();
    let freshState = freshEngine.getState();

    if (quest.startingState) {
      // Set up predefined state
      freshState = quest.startingState(freshState);
      freshEngine = new GitEngine(freshState);
    }

    setEngine(freshEngine);
    setRepoState(freshState);
    setHistory([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setTerminalInput('');
    setTerminalLines([
      { type: 'output', text: 'Welcome to GitQuest Terminal Simulator. Type commands below.' },
      { type: 'output', text: 'Type "git init" if you are starting a new repo, or run standard git commands.' }
    ]);
    
    // Set first active file
    const files = Object.keys(freshState.workingDir);
    if (files.length > 0) {
      setActiveFile(files[0]);
      setEditorContent(freshState.workingDir[files[0]]);
    } else {
      setActiveFile('index.html');
      setEditorContent('');
    }

    // Reset Quiz
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);

    // Reset feedback
    setMissionFeedback({ passed: false });
    setClaimedRewards(false);
  };

  // Editor content update handler
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    const updatedState = engine.updateFile(activeFile, content);
    setRepoState(updatedState);
    
    // Re-validate mission criteria
    validateMission(updatedState, history);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    const updatedState = engine.updateFile(name, `// Created ${name}`);
    setRepoState(updatedState);
    setActiveFile(name);
    setEditorContent(`// Created ${name}`);
    setNewFileName('');
    setShowAddFileModal(false);
    validateMission(updatedState, history);
  };

  const handleDeleteFile = (file: string) => {
    const updatedState = engine.deleteFile(file);
    setRepoState(updatedState);
    
    const files = Object.keys(updatedState.workingDir);
    if (files.length > 0) {
      setActiveFile(files[0]);
      setEditorContent(updatedState.workingDir[files[0]]);
    } else {
      setActiveFile('');
      setEditorContent('');
    }
    validateMission(updatedState, history);
  };

  // Switch tab in mock editor
  const handleSwitchFile = (file: string) => {
    setActiveFile(file);
    setEditorContent(repoState.workingDir[file] || '');
  };

  // Run command line parser
  const handleRunCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to lists
    const nextCmdHistory = [...commandHistory, trimmed];
    setCommandHistory(nextCmdHistory);
    setHistoryIndex(-1);
    setTerminalInput('');

    // Print command to lines
    const nextLines = [...terminalLines, { type: 'input' as const, text: `student@gitquest:~$ ${trimmed}` }];

    // Run in engine
    const res = engine.execute(trimmed);
    const nextHistory = [...history, trimmed];
    setHistory(nextHistory);

    // Format output lines
    if (res.output) {
      nextLines.push({
        type: res.error ? ('error' as const) : ('output' as const),
        text: res.output
      });
    }

    setTerminalLines(nextLines);
    setRepoState(res.state);

    // If active file was updated or deleted by checkout/merge/reset, sync editor contents
    if (res.state.workingDir[activeFile] !== undefined) {
      setEditorContent(res.state.workingDir[activeFile]);
    } else {
      const files = Object.keys(res.state.workingDir);
      if (files.length > 0) {
        setActiveFile(files[0]);
        setEditorContent(res.state.workingDir[files[0]]);
      } else {
        setActiveFile('index.html');
        setEditorContent('');
      }
    }

    // Scroll terminal to bottom
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    // Validate mission targets
    validateMission(res.state, nextHistory);
  };

  const validateMission = (state: GitRepoState, historyList: string[]) => {
    if (quest.checkPassed) {
      const feedback = quest.checkPassed(state, historyList);
      setMissionFeedback(feedback);
    }
  };

  // Terminal input handlers: UP/DOWN for history, TAB autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(terminalInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setTerminalInput(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setTerminalInput('');
      } else {
        setHistoryIndex(nextIdx);
        setTerminalInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic autocompletion list
      const commonCommands = ['git init', 'git add .', 'git status', 'git commit -m "', 'git branch', 'git checkout', 'git log', 'git merge', 'git push origin main', 'git pull', 'git remote add origin', 'git stash', 'git stash pop', 'git reset --hard'];
      const match = commonCommands.find(c => c.startsWith(terminalInput));
      if (match) {
        setTerminalInput(match);
      }
    }
  };

  // Quiz submission handler
  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered) return;
    setSelectedAnswer(idx);
    setQuizAnswered(true);

    const questions = quest.quizQuestions || [];
    const currentQ = questions[currentQuizIdx];

    if (idx === currentQ.correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    const questions = quest.quizQuestions || [];
    setSelectedAnswer(null);
    setQuizAnswered(false);

    if (currentQuizIdx + 1 < questions.length) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Determine if quiz passed (e.g. scored 100% or at least 1 correct)
      setMissionFeedback({ passed: true, message: `Completed! Scored ${quizScore + (selectedAnswer === questions[currentQuizIdx].correctAnswer ? 1 : 0)} / ${questions.length}` });
    }
  };

  // Complete mission claims
  const handleClaimReward = () => {
    if (claimedRewards) return;
    setClaimedRewards(true);
    onQuestComplete(quest.id, quest.xp, quest.coins);
  };

  // Helper formatting for logs or terminal styling
  const formatTerminalLine = (line: { type: 'input' | 'output' | 'error'; text: string }) => {
    if (line.type === 'input') {
      return <div className="text-white font-mono">{line.text}</div>;
    }
    if (line.type === 'error') {
      return <div className="text-red-400 font-mono select-text whitespace-pre-wrap">{line.text}</div>;
    }
    
    // Replace standard terminal escape codes in mockup
    let text = line.text;
    const items = text.split('\n').map((subStr, i) => {
      // Mock basic color strings e.g. green (\x1b[32m), yellow (\x1b[33m), cyan (\x1b[36m)
      let element: React.ReactNode = subStr;
      
      if (subStr.includes('\x1b[32m') || subStr.includes('\x1b[31m') || subStr.includes('\x1b[33m') || subStr.includes('\x1b[36m')) {
        // Simple regex replace for escape codes
        const clean = subStr.replace(/\x1b\[\d+m/g, '');
        let colorClass = 'text-gray-300';
        if (subStr.includes('[32m')) colorClass = 'text-emerald-400 font-bold';
        else if (subStr.includes('[31m')) colorClass = 'text-red-400 font-bold';
        else if (subStr.includes('[33m')) colorClass = 'text-amber-400 font-bold';
        else if (subStr.includes('[36m')) colorClass = 'text-cyan-400 font-bold';

        element = <span className={colorClass}>{clean}</span>;
      }

      return <div key={i} className="font-mono whitespace-pre-wrap select-text">{element}</div>;
    });

    return <div className="text-gray-300">{items}</div>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-95px)] min-h-[500px]">
      {/* LEFT COLUMN: Objectives & Instructions */}
      <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between overflow-y-auto h-full max-h-[700px] lg:max-h-none text-left">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div>
              <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest block">
                Quest {quest.id.split('-').slice(1).join(' ')}
              </span>
              <h3 className="font-extrabold text-lg mt-0.5">{quest.title}</h3>
            </div>
            <button
              onClick={resetQuest}
              title="Reset Sandbox"
              className="p-1.5 rounded-lg border border-brand-border bg-slate-950/40 hover:bg-slate-900 text-gray-400 hover:text-white transition-all"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* MAIN BODY: Lessons, Quizzes or Missions */}
          {quest.type === 'lesson' ? (
            <div className="prose prose-invert max-w-none text-xs md:text-sm text-gray-300 leading-relaxed space-y-4">
              <div dangerouslySetInnerHTML={{ __html: quest.instructions.replace(/\n/g, '<br/>') }}></div>
            </div>
          ) : quest.type === 'quiz' ? (
            <div className="space-y-6">
              {quest.quizQuestions && !quizFinished ? (
                <div className="space-y-4">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
                    Question {currentQuizIdx + 1} of {quest.quizQuestions.length}
                  </span>
                  <h4 className="font-extrabold text-base leading-snug">
                    {quest.quizQuestions[currentQuizIdx].question}
                  </h4>
                  <div className="space-y-2">
                    {quest.quizQuestions[currentQuizIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === quest.quizQuestions![currentQuizIdx].correctAnswer;
                      
                      let btnStyle = 'border-slate-800 hover:border-slate-700 bg-slate-950/40';
                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-red-500 bg-red-500/10 text-red-400 font-bold';
                        } else {
                          btnStyle = 'border-slate-900 bg-slate-950/10 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizAnswered}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {quizAnswered && isCorrect && <span className="text-xs">✅</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback description */}
                  {quizAnswered && (
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 text-xs text-gray-400 leading-normal space-y-2">
                      <div className="font-bold text-gray-300">
                        {selectedAnswer === quest.quizQuestions[currentQuizIdx].correctAnswer ? '🎉 Correct!' : '❌ Incorrect'}
                      </div>
                      <p>{quest.quizQuestions[currentQuizIdx].explanation}</p>
                      <button
                        onClick={handleNextQuizQuestion}
                        className="mt-3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 px-4 rounded-lg text-[10px] flex items-center gap-1 transition-all"
                      >
                        <span>Next Question</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="text-emerald-500 mx-auto w-12 h-12" />
                  <h4 className="font-extrabold text-lg">Quiz Completed!</h4>
                  <p className="text-xs text-gray-400">You scored {quizScore} out of {quest.quizQuestions?.length} questions.</p>
                </div>
              )}
            </div>
          ) : (
            // Mission / Boss fight
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none text-xs md:text-sm text-gray-300 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: quest.instructions.replace(/\n/g, '<br/>') }}></div>
              </div>

              {/* Mission Objectives validation HUD */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Mission Status</div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {missionFeedback.passed ? (
                      <CheckCircle className="text-emerald-500 shrink-0" size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-700 animate-pulse shrink-0"></div>
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${missionFeedback.passed ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {missionFeedback.passed ? 'Objectives Complete!' : 'Objectives Pending...'}
                    </span>
                    {missionFeedback.message && (
                      <p className="text-xs text-gray-400 mt-1 leading-normal select-text">
                        {missionFeedback.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claim Rewards Footer Banner */}
        <div className="pt-4 border-t border-brand-border bg-slate-900/10 mt-6">
          {quest.type === 'lesson' || quizFinished || missionFeedback.passed ? (
            !claimedRewards ? (
              <button
                onClick={handleClaimReward}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all glow-green hover:scale-[1.01]"
              >
                <Sparkles size={16} />
                <span>Claim {quest.xp} XP + Coins</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="w-full bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-bold py-3 px-6 rounded-xl text-center text-xs">
                  ✓ Quest Cleared! XP & Coins Awarded.
                </div>
                {onNextQuest && (
                  <button
                    onClick={onNextQuest}
                    className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <span>Next Mission</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            )
          ) : (
            <button
              disabled
              className="w-full bg-slate-800/40 border border-slate-850 text-gray-500 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <AlertTriangle size={14} />
              <span>Complete objectives to unlock reward</span>
            </button>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Simulator Arena (Editor, Visualizer, Terminal) */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-[500px]">
        {/* top-half: Editor File tabs */}
        <div className="bg-brand-panel border border-brand-border rounded-2xl flex flex-col overflow-hidden h-[300px]">
          {/* Editor Header tabs */}
          <div className="flex items-center justify-between border-b border-brand-border bg-slate-950/30 px-4 py-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pr-2">
              <FileCode size={14} className="text-gray-400 shrink-0" />
              {Object.keys(repoState.workingDir).map(file => (
                <button
                  key={file}
                  onClick={() => handleSwitchFile(file)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    activeFile === file
                      ? 'bg-slate-900 text-purple-400 border border-slate-800'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span>{file}</span>
                  {Object.keys(repoState.workingDir).length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file); }}
                      className="text-gray-600 hover:text-red-400 text-[10px] pl-1 font-sans cursor-pointer"
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}

              {/* Add file button */}
              <button
                onClick={() => setShowAddFileModal(true)}
                className="p-1 rounded bg-slate-900 border border-slate-850 hover:bg-slate-800 text-gray-400"
              >
                <Plus size={12} />
              </button>
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest shrink-0">Workspace Editor</span>
          </div>

          {/* New file model overlay */}
          {showAddFileModal && (
            <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-72 text-center space-y-4 shadow-2xl">
                <h4 className="font-bold text-sm">Create New File</h4>
                <input
                  type="text"
                  placeholder="e.g. index.html, script.js"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddFileModal(false)}
                    className="flex-1 bg-slate-800 text-gray-400 py-1.5 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFile}
                    className="flex-1 bg-purple-600 text-white py-1.5 rounded-lg text-xs font-bold"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Text Editor Area */}
          <div className="flex-grow relative bg-slate-950/80 font-mono text-xs flex">
            {/* Mock line numbers */}
            <div className="bg-slate-950 text-gray-600 p-3 select-none text-right border-r border-slate-900 w-9 leading-relaxed shrink-0">
              {Array.from({ length: Math.max(5, editorContent.split('\n').length) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={editorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              className="flex-grow p-3 bg-transparent text-gray-300 font-mono focus:outline-none resize-none leading-relaxed overflow-auto select-text w-full h-full"
              placeholder="// Write mock code here to modify files in the working directory"
            />
          </div>
        </div>

        {/* mid-half: Git Visualizer component */}
        <div className="flex-grow min-h-[220px]">
          <GitVisualizer repoState={repoState} />
        </div>

        {/* bottom-half: Mock Terminal CLI */}
        <div className="bg-brand-panel border border-brand-border rounded-2xl flex flex-col overflow-hidden h-[240px] shrink-0">
          {/* Terminal Header */}
          <div className="bg-slate-950 border-b border-brand-border px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-purple-400" />
              <span className="text-xs font-bold font-mono text-gray-400">gitquest@terminal:~/workspace</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="flex-grow p-4 overflow-y-auto bg-brand-terminal font-mono text-xs text-left leading-relaxed space-y-2 select-text">
            {terminalLines.map((line, idx) => (
              <div key={idx}>{formatTerminalLine(line)}</div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Terminal Input Bar */}
          <div className="bg-slate-950 border-t border-brand-border px-4 py-2.5 flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs text-cyan-400 shrink-0 select-none">student@gitquest:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-transparent border-none text-white focus:outline-none font-mono text-xs w-full"
              placeholder="Type git commands e.g. git status, git log... (Press Tab for autocomplete)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
