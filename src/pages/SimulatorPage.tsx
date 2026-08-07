import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Terminal, FileCode, CheckCircle, ArrowRight, Plus, HelpCircle, Code } from 'lucide-react';
import type { Quest } from '../data/quests';
import { GitEngine } from '../simulator/GitEngine';
import type { GitRepoState } from '../simulator/GitEngine';
import { GitVisualizer } from '../components/GitVisualizer';
import {
  preProcessCommand,
  postProcessOutput,
  translateFilenameToThemed,
  translateFilenameToCanonical,
  translateMarkdown,
  getMentor,
  getRealityExplanation,
  type WorldTheme,
} from '../utils/themeTranslator';

interface SimulatorPageProps {
  quest: Quest;
  onQuestComplete: (questId: string, xpEarned: number, coinsEarned: number) => void;
  onNextQuest?: () => void;
  activeTheme: string;
  userAvatar: string;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  quest,
  onQuestComplete,
  onNextQuest,
  activeTheme,
  userAvatar,
}) => {
  const isKingdom = activeTheme === 'kingdom';
  const world = activeTheme as WorldTheme;

  const [engine, setEngine] = useState<GitEngine>(new GitEngine());
  const [repoState, setRepoState] = useState<GitRepoState>(new GitEngine().getEmptyState());
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLines, setTerminalLines] = useState<{ type: 'input' | 'output' | 'error'; text: string }[]>([]);
  
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [editorContent, setEditorContent] = useState<string>('');
  const [newFileName, setNewFileName] = useState<string>('');
  const [showAddFileModal, setShowAddFileModal] = useState<boolean>(false);

  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const [missionFeedback, setMissionFeedback] = useState<{ passed: boolean; message?: string }>({ passed: false });
  const [claimedRewards, setClaimedRewards] = useState<boolean>(false);
  const realityMode = true; // active by default to bridge knowledge
  
  // Animation state
  const [animationState, setAnimationState] = useState<'idle' | 'committing'>('idle');

  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const mentor = getMentor(world, userAvatar);

  useEffect(() => {
    resetQuest();
  }, [quest]);

  // Handle theme changes by reloading active file editor view safely
  useEffect(() => {
    if (repoState.workingDir[activeFile] !== undefined) {
      setEditorContent(repoState.workingDir[activeFile]);
    }
  }, [activeTheme]);

  const resetQuest = () => {
    let freshEngine = new GitEngine();
    let freshState = freshEngine.getState();

    if (quest.startingState) {
      freshState = quest.startingState(freshState);
      freshEngine = new GitEngine(freshState);
    }

    setEngine(freshEngine);
    setRepoState(freshState);
    setHistory([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setTerminalInput('');
    
    // Set initial welcome terminal text themed
    const text1 = postProcessOutput('Welcome to GitQuest Arcade Terminal. Execute commands below.', world);
    const text2 = postProcessOutput('Type "git init" to boot the repository tracker.', world);
    
    setTerminalLines([
      { type: 'output', text: text1 },
      { type: 'output', text: text2 }
    ]);
    
    const files = Object.keys(freshState.workingDir);
    if (files.length > 0) {
      setActiveFile(files[0]);
      setEditorContent(freshState.workingDir[files[0]]);
    } else {
      setActiveFile('index.html');
      setEditorContent('');
    }

    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
    setMissionFeedback({ passed: false });
    setClaimedRewards(false);
    setAnimationState('idle');
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    const updatedState = engine.updateFile(activeFile, content);
    setRepoState(updatedState);
    validateMission(updatedState, history);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    // Translate the file name to canonical if they entered a themed file
    const canonicalName = translateFilenameToCanonical(newFileName.trim(), world);
    const updatedState = engine.updateFile(canonicalName, `# Virtual File: ${newFileName.trim()}`);
    
    setRepoState(updatedState);
    setActiveFile(canonicalName);
    setEditorContent(`# Virtual File: ${newFileName.trim()}`);
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

  const handleSwitchFile = (file: string) => {
    setActiveFile(file);
    setEditorContent(repoState.workingDir[file] || '');
  };

  const handleRunCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const nextCmdHistory = [...commandHistory, trimmed];
    setCommandHistory(nextCmdHistory);
    setHistoryIndex(-1);
    setTerminalInput('');

    // Print command typed in history (themed filenames)
    const nextLines = [...terminalLines, { type: 'input' as const, text: `student@gitquest:~$ ${trimmed}` }];

    // Translate command to canonical before execution
    const canonicalCmd = preProcessCommand(trimmed, world);
    const res = engine.execute(canonicalCmd);
    const nextHistory = [...history, canonicalCmd];
    setHistory(nextHistory);

    // Dynamic commit animation trigger
    if (canonicalCmd.startsWith('git commit') && !res.error) {
      setAnimationState('committing');
      setTimeout(() => {
        setAnimationState('idle');
      }, 3500);
    }

    if (res.output) {
      // Translate command output to themed
      const themedOutput = postProcessOutput(res.output, world);
      nextLines.push({
        type: res.error ? ('error' as const) : ('output' as const),
        text: themedOutput
      });
    }

    setTerminalLines(nextLines);
    setRepoState(res.state);

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

    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    validateMission(res.state, nextHistory);
  };

  const validateMission = (state: GitRepoState, historyList: string[]) => {
    if (quest.checkPassed) {
      const feedback = quest.checkPassed(state, historyList);
      // Translate validation message
      if (feedback.message) {
        feedback.message = postProcessOutput(feedback.message, world);
      }
      setMissionFeedback(feedback);
    }
  };

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
      
      const themedFile1 = translateFilenameToThemed('index.html', world);
      const themedFile2 = translateFilenameToThemed('style.css', world);

      const commonCommands = [
        'git init',
        `git add ${themedFile1}`,
        `git add ${themedFile2}`,
        'git add .',
        'git status',
        'git commit -m "',
        'git branch',
        'git checkout',
        'git log',
        'git merge',
        'git push origin main',
        'git pull',
        'git remote add origin',
        'git stash',
        'git stash pop',
        'git reset --hard'
      ];
      
      const match = commonCommands.find(c => c.startsWith(terminalInput));
      if (match) {
        setTerminalInput(match);
      }
    }
  };

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
      setMissionFeedback({ passed: true, message: `Completed! Scored ${quizScore + (selectedAnswer === questions[currentQuizIdx].correctAnswer ? 1 : 0)} / ${questions.length}` });
    }
  };

  const handleClaimReward = () => {
    if (claimedRewards) return;
    setClaimedRewards(true);
    onQuestComplete(quest.id, quest.xp, quest.coins);
  };

  const formatTerminalLine = (line: { type: 'input' | 'output' | 'error'; text: string }) => {
    if (line.type === 'input') {
      return <div className={`font-mono select-text ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}`}>{line.text}</div>;
    }
    if (line.type === 'error') {
      return <div className="text-red-400 font-mono select-text whitespace-pre-wrap">{line.text}</div>;
    }
    
    let text = line.text;
    const items = text.split('\n').map((subStr, i) => {
      let element: React.ReactNode = subStr;
      if (subStr.includes('\x1b[32m') || subStr.includes('\x1b[31m') || subStr.includes('\x1b[33m') || subStr.includes('\x1b[36m')) {
        const clean = subStr.replace(/\x1b\[\d+m/g, '');
        let colorClass = isKingdom ? 'text-amber-400' : 'text-cyan-400';
        if (subStr.includes('[32m')) colorClass = 'text-emerald-400 font-bold';
        else if (subStr.includes('[31m')) colorClass = 'text-red-400 font-bold';
        else if (subStr.includes('[33m')) colorClass = 'text-amber-400 font-bold';
        else if (subStr.includes('[36m')) colorClass = isKingdom ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold';

        element = <span className={colorClass}>{clean}</span>;
      }
      return <div key={i} className="font-mono whitespace-pre-wrap select-text">{element}</div>;
    });
    return <div className={isKingdom ? 'text-amber-300' : 'text-cyan-300'}>{items}</div>;
  };

  const realityExp = getRealityExplanation(quest.id, world);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-105px)] min-h-[550px]">
      
      {/* LEFT COLUMN: Objectives & Instructions */}
      <div className={`arcade-panel rounded-none p-6 flex flex-col justify-between overflow-y-auto h-full max-h-[700px] lg:max-h-none text-left ${
        isKingdom ? 'border-amber-500/60' : 'border-pink-500/60'
      }`}>
        <div className="space-y-6">
          {/* Header */}
          <div className={`flex items-center justify-between border-b-2 ${isKingdom ? 'border-amber-500/20' : 'border-pink-500/20'} pb-3 font-arcade`}>
            <div>
              <span className={`text-[7px] ${isKingdom ? 'text-amber-500' : 'text-cyan-400'} uppercase tracking-widest block`}>
                {isKingdom ? 'QUEST DECREE' : 'SECTOR CHECK'}
              </span>
              <h3 className={`font-extrabold text-xs mt-1 ${isKingdom ? 'text-amber-400' : 'text-pink-400'}`}>
                {translateMarkdown(quest.title, world, userAvatar).toUpperCase()}
              </h3>
            </div>
            <button
              onClick={resetQuest}
              title="Reset Sandbox"
              className={`p-1 rounded bg-slate-950 border ${isKingdom ? 'border-amber-900/40 hover:text-amber-300' : 'border-slate-800 hover:text-white'} text-gray-500`}
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* AI Mentor HUD */}
          <div className={`flex items-start gap-3 p-3 bg-slate-950/80 border ${isKingdom ? 'border-amber-900/40' : 'border-slate-800'}`}>
            <div className="text-3xl shrink-0 p-1 select-none">
              {mentor.avatar}
            </div>
            <div className="text-xs font-arcade">
              <span className={`font-bold ${isKingdom ? 'text-amber-400' : 'text-cyan-400'} block text-[8px]`}>
                {mentor.name.toUpperCase()} ({mentor.role.toUpperCase()})
              </span>
              <p className="text-gray-400 font-pixel text-[15px] leading-relaxed mt-1 normal-case">
                {isKingdom 
                  ? `Ah, ${translateMarkdown('Student', world, userAvatar)}, pay close attention to this decree. We must coordinate our plans.`
                  : `Greetings, ${translateMarkdown('Student', world, userAvatar)}. We need to maintain stability in this time-sector.`}
              </p>
            </div>
          </div>

          {/* MAIN BODY: Lessons, Quizzes or Missions */}
          {quest.type === 'lesson' ? (
            <div className={`prose prose-invert max-w-none font-pixel text-[16px] leading-relaxed space-y-4 ${
              isKingdom ? 'text-amber-200' : 'text-cyan-200'
            }`}>
              <div dangerouslySetInnerHTML={{ __html: translateMarkdown(quest.instructions, world, userAvatar).replace(/\n/g, '<br/>') }}></div>
            </div>
          ) : quest.type === 'quiz' ? (
            <div className="space-y-6">
              {quest.quizQuestions && !quizFinished ? (
                <div className="space-y-4">
                  <span className="text-[8px] font-arcade text-gray-500 uppercase tracking-wider block">
                    Q-DIAGNOSTIC {currentQuizIdx + 1} / {quest.quizQuestions.length}
                  </span>
                  <h4 className="font-arcade text-[10px] text-white leading-normal">
                    {translateMarkdown(quest.quizQuestions[currentQuizIdx].question, world, userAvatar)}
                  </h4>
                  <div className="space-y-2">
                    {quest.quizQuestions[currentQuizIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === quest.quizQuestions![currentQuizIdx].correctAnswer;
                      
                      let btnStyle = isKingdom ? 'border-amber-900/40 bg-slate-950/40 text-amber-500' : 'border-slate-800 bg-slate-950/40 text-cyan-500';
                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-red-500 bg-red-950/20 text-red-400 font-bold';
                        } else {
                          btnStyle = 'border-slate-950 opacity-40';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizAnswered}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full p-3 border-2 rounded-none text-left text-xs font-pixel text-[16px] transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{translateMarkdown(option, world, userAvatar)}</span>
                          {quizAnswered && isCorrect && <span className="text-xs">✅</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback description */}
                  {quizAnswered && (
                    <div className={`p-4 bg-slate-950 border text-xs font-pixel text-[15px] space-y-2 ${isKingdom ? 'border-amber-900/40 text-amber-300' : 'border-slate-850 text-cyan-400'}`}>
                      <div className="font-arcade text-[9px] text-white">
                        {selectedAnswer === quest.quizQuestions[currentQuizIdx].correctAnswer ? '★ SUCCESS!' : '★ FAIL!'}
                      </div>
                      <p>{translateMarkdown(quest.quizQuestions[currentQuizIdx].explanation, world, userAvatar)}</p>
                      <button
                        onClick={handleNextQuizQuestion}
                        className={`mt-3 border-2 text-white font-arcade text-[8px] py-1 px-3 transition-all ${
                          isKingdom ? 'bg-amber-600 border-amber-400 hover:bg-amber-500' : 'bg-pink-600 border-pink-400 hover:bg-pink-500'
                        }`}
                      >
                        <span>NEXT</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3 font-arcade">
                  <CheckCircle className="text-emerald-400 mx-auto w-10 h-10 animate-bounce" />
                  <h4 className="font-extrabold text-sm text-white">DIAGNOSTIC PASS!</h4>
                  <p className={`text-[14px] font-pixel ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}`}>
                    Verified {quizScore} / {quest.quizQuestions?.length} parameters correctly.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Mission / Boss fight
            <div className="space-y-4">
              <div className={`prose prose-invert max-w-none font-pixel text-[16px] leading-relaxed ${
                isKingdom ? 'text-amber-200' : 'text-cyan-200'
              }`}>
                <div dangerouslySetInnerHTML={{ __html: translateMarkdown(quest.instructions, world, userAvatar).replace(/\n/g, '<br/>') }}></div>
              </div>

              {/* Mission Objectives validation HUD */}
              <div className={`p-4 bg-slate-950 border-2 space-y-3 ${isKingdom ? 'border-amber-800' : 'border-cyan-800'}`}>
                <div className="text-[8px] font-arcade text-gray-500">STAGE SYNC OBJECTIVES</div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {missionFeedback.passed ? (
                      <CheckCircle className="text-emerald-400 shrink-0" size={14} />
                    ) : (
                      <div className={`w-3.5 h-3.5 border-2 animate-pulse shrink-0 ${isKingdom ? 'border-amber-700' : 'border-cyan-700'}`}></div>
                    )}
                  </div>
                  <div>
                    <span className={`text-[9px] font-arcade ${missionFeedback.passed ? 'text-emerald-400' : isKingdom ? 'text-amber-600' : 'text-cyan-600'}`}>
                      {missionFeedback.passed ? 'STAGE OBJECTIVES MET!' : 'WAITING FOR SYNC...'}
                    </span>
                    {missionFeedback.message && (
                      <p className="text-xs font-pixel text-[15px] text-gray-400 mt-1.5 leading-normal select-text">
                        {missionFeedback.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claim Rewards & Reality Mode Blueprint Footer */}
        <div className={`pt-4 border-t-2 ${isKingdom ? 'border-amber-500/20' : 'border-pink-500/20'} bg-slate-900/10 mt-6 space-y-4`}>
          
          {/* REALITY MODE PANEL (Bridges gameplay to real Git command line structures) */}
          {(quest.type === 'lesson' || quizFinished || missionFeedback.passed) && realityMode && (
            <div className={`border-2 p-4 font-arcade text-[8px] space-y-3 bg-[#02050f]/90 animate-fade-in ${
              isKingdom ? 'border-amber-500/40 text-amber-300' : 'border-cyan-500/40 text-cyan-300'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="font-extrabold flex items-center gap-1">
                  <Code size={10} className={isKingdom ? 'text-amber-500' : 'text-cyan-500'} />
                  REALITY MODE COMMANDS BRIDGE
                </span>
                <span className="text-[6px] text-gray-500">PRODUCTION SYNC</span>
              </div>
              <div className="space-y-2">
                <div className="text-[7px] text-white italic font-pixel text-[13px] leading-normal">
                  {realityExp.message}
                </div>
                <div className="bg-black/80 border border-slate-900 p-2.5 font-mono text-[9px] text-emerald-400 space-y-1.5 select-text">
                  {realityExp.commands.map((cmd, i) => (
                    <div key={i}>$ {cmd}</div>
                  ))}
                </div>
                <p className="text-[7px] text-gray-400 leading-relaxed font-pixel text-[13px] normal-case">
                  <HelpCircle size={10} className="inline mr-1" />
                  {realityExp.explanation}
                </p>
              </div>
            </div>
          )}

          {quest.type === 'lesson' || quizFinished || missionFeedback.passed ? (
            !claimedRewards ? (
              <button
                onClick={handleClaimReward}
                className={`w-full arcade-btn text-white font-bold py-3.5 px-6 rounded-none flex items-center justify-center gap-2 transition-all glow-text ${
                  isKingdom
                    ? 'bg-amber-600 border-amber-400 hover:bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-pink-600 border-pink-400 hover:bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                }`}
              >
                <span>CLAIM {quest.xp} SCORE POINTS</span>
              </button>
            ) : (
              <div className="space-y-2 font-arcade text-[9px]">
                <div className="w-full bg-emerald-950/20 border-2 border-emerald-800/40 text-emerald-400 py-3.5 px-6 rounded-none text-center font-bold">
                  ✓ STAGE COMPLETE! SCORE ADDED.
                </div>
                {onNextQuest && (
                  <button
                    onClick={onNextQuest}
                    className={`w-full bg-slate-950 border-2 text-white font-bold py-2.5 px-6 rounded-none flex items-center justify-center gap-1.5 ${
                      isKingdom ? 'border-amber-800 hover:border-amber-500' : 'border-cyan-800 hover:border-cyan-500'
                    }`}
                  >
                    <span>NEXT STAGE</span>
                    <ArrowRight size={10} />
                  </button>
                )}
              </div>
            )
          ) : (
            <button
              disabled
              className="w-full bg-slate-950 border-2 border-slate-900 text-slate-800 font-arcade text-[8px] py-3.5 px-6 rounded-none flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span>COMPLETE MISSION OBJECTIVES</span>
            </button>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Simulator Arena (Animations Panel, Editor, Visualizer, Terminal) */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-[550px]">
        
        {/* THEMED GRAPHICAL ANIMATIONS PANEL (Top right) */}
        <div className={`arcade-panel rounded-none flex flex-col items-center justify-center overflow-hidden h-[120px] shrink-0 p-4 border-2 relative ${
          isKingdom ? 'border-amber-500/60 bg-[#160e06]' : 'border-cyan-500/60 bg-[#060818]'
        }`}>
          {isKingdom ? (
            /* Kingdom Animation Area */
            animationState === 'committing' ? (
              <div className="flex flex-col items-center justify-center space-y-2 w-full h-full font-arcade text-[8px] text-amber-400">
                <span className="arcade-blink font-bold uppercase">👑 Chronicle entry recorded! 📝</span>
                <div className="flex items-center gap-8 relative mt-1">
                  <span className="text-3xl animate-bounce">🏡</span>
                  <span className="text-xl animate-pulse">🏰</span>
                  <div className="absolute left-[30px] top-[10px] text-lg animate-ping">📜</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full h-full text-xs font-arcade px-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl animate-pulse">🏰</span>
                  <div className="text-left">
                    <span className="text-[9px] text-white block">KINGDOM REIGN</span>
                    <span className="text-[7px] text-amber-500 block">VCS GUARD ACTIVE</span>
                  </div>
                </div>
                <div className="flex gap-4 select-none">
                  <span className="text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>🛡️</span>
                  <span className="text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>🐉</span>
                  <span className="text-xl animate-pulse">🧙‍♂️</span>
                </div>
              </div>
            )
          ) : (
            /* Space Animation Area */
            animationState === 'committing' ? (
              <div className="flex flex-col items-center justify-center space-y-2 w-full h-full font-arcade text-[8px] text-cyan-400">
                <span className="arcade-blink font-bold uppercase">🚀 Establishing checkpoint crystal... 💎</span>
                <div className="flex items-center gap-8 relative mt-1">
                  <span className="text-3xl animate-bounce">🛰️</span>
                  <span className="text-xl animate-pulse">🪐</span>
                  <div className="absolute left-[35px] top-[8px] text-lg animate-ping">💎</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full h-full text-xs font-arcade px-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl animate-spin" style={{ animationDuration: '25s' }}>🛰️</span>
                  <div className="text-left">
                    <span className="text-[9px] text-white block">SPACE STATION CORE</span>
                    <span className="text-[7px] text-cyan-500 block">TIMELINE RADAR ACTIVE</span>
                  </div>
                </div>
                <div className="flex gap-4 select-none">
                  <span className="text-xl animate-pulse">🤖</span>
                  <span className="text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>🚀</span>
                  <span className="text-xl animate-pulse" style={{ animationDuration: '4s' }}>🌀</span>
                </div>
              </div>
            )
          )}
          <div className="absolute top-1 right-2 text-[6px] text-gray-600 font-arcade uppercase">
            {isKingdom ? 'Royal Vizier Cam' : 'Core Radar Link'}
          </div>
        </div>

        {/* mid-half: Editor File tabs */}
        <div className={`arcade-panel rounded-none flex flex-col overflow-hidden h-[240px] border-2 ${
          isKingdom ? 'border-amber-500/60' : 'border-pink-500/60'
        }`}>
          {/* Editor Header tabs */}
          <div className={`flex items-center justify-between border-b-2 ${isKingdom ? 'border-amber-500/20 bg-amber-950/20' : 'border-pink-500/20 bg-slate-950/40'} px-4 py-2 shrink-0 font-arcade text-[8px]`}>
            <div className="flex items-center gap-1.5 overflow-x-auto pr-2">
              <FileCode size={12} className="text-gray-500 shrink-0" />
              {Object.keys(repoState.workingDir).map(file => (
                <button
                  key={file}
                  onClick={() => handleSwitchFile(file)}
                  className={`px-3 py-1 text-[8px] font-mono font-semibold transition-all shrink-0 flex items-center gap-1 border-2 ${
                    activeFile === file
                      ? isKingdom
                        ? 'bg-slate-950 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-cyan-500 text-cyan-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span>{translateFilenameToThemed(file, world)}</span>
                  {Object.keys(repoState.workingDir).length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file); }}
                      className="text-gray-600 hover:text-red-400 pl-1 cursor-pointer font-sans text-xs"
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}

              <button
                onClick={() => setShowAddFileModal(true)}
                className={`px-2 py-1 rounded-none bg-slate-950 border hover:bg-slate-900 text-gray-400 ${
                  isKingdom ? 'border-amber-900/40' : 'border-slate-850'
                }`}
              >
                <Plus size={10} />
              </button>
            </div>
            <span className="text-gray-500 uppercase tracking-widest font-bold">
              {isKingdom ? 'Scroll Ledger' : 'Station Sector File'}
            </span>
          </div>

          {/* New file model overlay */}
          {showAddFileModal && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
              <div className={`bg-slate-900 border-2 p-6 rounded-none w-72 text-center space-y-4 shadow-2xl font-arcade text-[10px] ${
                isKingdom ? 'border-amber-500' : 'border-pink-500'
              }`}>
                <h4 className="font-bold text-white">NEW CORE FILE</h4>
                <input
                  type="text"
                  placeholder={isKingdom ? "grain_silo.txt" : "oxygen_valve.cpp"}
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className={`w-full bg-slate-950 border-2 px-3 py-2 text-white font-mono focus:outline-none text-[10px] ${
                    isKingdom ? 'border-amber-500 focus:border-amber-400' : 'border-cyan-500 focus:border-pink-500'
                  }`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddFileModal(false)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-gray-500 py-1.5 text-[8px]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleCreateFile}
                    className={`flex-1 border text-white py-1.5 text-[8px] font-bold ${
                      isKingdom ? 'bg-amber-600 border-amber-400 hover:bg-amber-500' : 'bg-pink-600 border-pink-400 hover:bg-pink-500'
                    }`}
                  >
                    CREATE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Text Editor Area */}
          <div className="flex-grow relative bg-slate-950/80 font-mono text-xs flex">
            {/* Mock line numbers */}
            <div className={`bg-slate-950 text-right p-3 select-none border-r-2 w-9 leading-relaxed shrink-0 ${
              isKingdom ? 'text-amber-900/30 border-amber-500/20' : 'text-cyan-900/30 border-pink-500/20'
            }`}>
              {Array.from({ length: Math.max(5, editorContent.split('\n').length) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={editorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              className={`flex-grow p-3 bg-transparent font-mono focus:outline-none resize-none leading-relaxed overflow-auto select-text w-full h-full ${
                isKingdom ? 'text-amber-200' : 'text-cyan-300'
              }`}
              placeholder={isKingdom ? "// Record construction instructions in parchment scroll..." : "// Code systems operations parameters here..."}
            />
          </div>
        </div>

        {/* mid-half: Git Visualizer component */}
        <div className="flex-grow min-h-[220px]">
          <GitVisualizer repoState={repoState} activeTheme={activeTheme} />
        </div>

        {/* bottom-half: Mock Terminal CLI */}
        <div className={`arcade-panel rounded-none flex flex-col overflow-hidden h-[220px] shrink-0 border-2 ${
          isKingdom ? 'border-amber-500/60' : 'border-pink-500/60'
        }`}>
          {/* Terminal Header */}
          <div className={`bg-slate-950 border-b-2 px-4 py-2 flex items-center justify-between shrink-0 font-arcade text-[8px] ${
            isKingdom ? 'border-amber-500/20' : 'border-pink-500/20'
          }`}>
            <div className="flex items-center gap-2">
              <Terminal size={12} className={isKingdom ? 'text-amber-500' : 'text-pink-500'} />
              <span className="font-bold text-gray-500">
                {isKingdom ? 'ROYAL SCROLL CLI_TRANSCRIPT' : 'CLI STATION_TERMINAL'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-yellow-500"></div>
              <div className={`w-2 h-2 animate-ping ${isKingdom ? 'bg-amber-500' : 'bg-green-500'}`}></div>
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-left leading-relaxed space-y-2 select-text">
            {terminalLines.map((line, idx) => (
              <div key={idx}>{formatTerminalLine(line)}</div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Terminal Input Bar */}
          <div className={`bg-slate-950 border-t-2 px-4 py-2.5 flex items-center gap-2 shrink-0 ${
            isKingdom ? 'border-amber-500/20' : 'border-pink-500/20'
          }`}>
            <span className={`font-mono text-xs shrink-0 select-none ${isKingdom ? 'text-amber-500' : 'text-pink-500'}`}>
              student@gitquest:~$
            </span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-transparent border-none text-white focus:outline-none font-mono text-xs w-full"
              placeholder={isKingdom ? "Record decrees using git commands..." : "Execute git terminal operations..."}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
