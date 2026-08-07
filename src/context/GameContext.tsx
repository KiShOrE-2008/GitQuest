import React, { createContext, useContext, useState, useEffect } from 'react';
import { chapters } from '../data/chapters';
import { audio } from '../utils/audio';

export interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  parents?: string[];
  files: string[];
}

export interface GitState {
  isInitialized: boolean;
  currentBranch: string;
  branches: string[];
  workingDirectory: string[];
  stagedFiles: string[];
  commits: Commit[];
  history: string[];
  currentStepIndex: number;
  remoteUrl: string;
  isPushed: boolean;
  stashedFiles: string[];
}

interface GameContextType {
  activeWorld: 'kingdom' | 'space';
  setWorld: (world: 'kingdom' | 'space') => void;
  isLoggedIn: boolean;
  user: { username: string; email: string; provider?: string } | null;
  login: (username: string, email: string, provider?: string) => void;
  logout: () => void;
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;
  currentChapterIndex: number;
  setChapterIndex: (index: number) => void;
  completedChapters: number[];
  xp: number;
  level: number;
  streak: number;
  achievements: string[];
  gitState: GitState;
  executeCommand: (cmd: string) => { success: boolean; output: string };
  resetGitStateForChapter: (chapterIndex: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  showMissionComplete: boolean;
  setShowMissionComplete: (show: boolean) => void;
  unlockAchievement: (name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_GIT_STATE: GitState = {
  isInitialized: false,
  currentBranch: '',
  branches: [],
  workingDirectory: [],
  stagedFiles: [],
  commits: [],
  history: [],
  currentStepIndex: 0,
  remoteUrl: '',
  isPushed: false,
  stashedFiles: []
};

const ACHIEVEMENTS_LIST = {
  "First Commit": "Create your first repository snapshot.",
  "Branch Explorer": "Create an alternate development timeline.",
  "Merge Master": "Successfully integrate separate branches.",
  "Conflict Resolver": "Settle divergent files manually.",
  "Git Hero": "Restore a corrupted history or complete all levels."
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeWorld, setActiveWorld] = useState<'kingdom' | 'space'>('kingdom');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; email: string; provider?: string } | null>(null);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [currentChapterIndex, setCurrentChapterIndexState] = useState<number>(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [streak, setStreak] = useState<number>(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [showMissionComplete, setShowMissionComplete] = useState<boolean>(false);

  const [gitState, setGitState] = useState<GitState>(INITIAL_GIT_STATE);

  // Load state from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('gitverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    const savedWorld = localStorage.getItem('gitverse_world');
    if (savedWorld === 'kingdom' || savedWorld === 'space') {
      setActiveWorld(savedWorld);
    }
    const savedTheme = localStorage.getItem('gitverse_theme');
    if (savedTheme === 'light') {
      setThemeMode('light');
    }
    const savedXp = localStorage.getItem('gitverse_xp');
    if (savedXp) setXp(parseInt(savedXp));

    const savedLevel = localStorage.getItem('gitverse_level');
    if (savedLevel) setLevel(parseInt(savedLevel));

    const savedStreak = localStorage.getItem('gitverse_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));

    const savedCompleted = localStorage.getItem('gitverse_completed_chapters');
    if (savedCompleted) setCompletedChapters(JSON.parse(savedCompleted));

    const savedAchievements = localStorage.getItem('gitverse_achievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    const savedSound = localStorage.getItem('gitverse_sound_muted');
    if (savedSound) setSoundEnabledState(savedSound !== 'true');

    const savedChapter = localStorage.getItem('gitverse_current_chapter');
    if (savedChapter) {
      const idx = parseInt(savedChapter);
      setCurrentChapterIndexState(idx);
    }
  }, []);

  // Update localStorage when dependencies update
  const setWorld = (world: 'kingdom' | 'space') => {
    setActiveWorld(world);
    localStorage.setItem('gitverse_world', world);
    audio.playClick();
  };

  const login = (username: string, email: string, provider?: string) => {
    const userData = { username, email, provider };
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('gitverse_user', JSON.stringify(userData));

    if (provider === 'demo') {
      // Pre-populate advanced development states
      setXp(650);
      setLevel(3);
      setStreak(5);
      setCompletedChapters([1, 2, 3, 4, 5, 6, 7]);
      setAchievements(["First Commit", "Branch Explorer"]);
      setCurrentChapterIndexState(7); // Index 7 is Chapter 8 (Merge Chapter)
      
      localStorage.setItem('gitverse_xp', '650');
      localStorage.setItem('gitverse_level', '3');
      localStorage.setItem('gitverse_streak', '5');
      localStorage.setItem('gitverse_completed_chapters', JSON.stringify([1, 2, 3, 4, 5, 6, 7]));
      localStorage.setItem('gitverse_achievements', JSON.stringify(["First Commit", "Branch Explorer"]));
      localStorage.setItem('gitverse_current_chapter', '7');
      
      // Load correct branch and commit nodes for Chapter 8
      setTimeout(() => resetGitStateForChapter(7), 100);
      audio.playVictory();
      return;
    }
    
    audio.playVictory();
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    
    // Clear all storage elements for clean development testing
    localStorage.removeItem('gitverse_user');
    localStorage.removeItem('gitverse_xp');
    localStorage.removeItem('gitverse_level');
    localStorage.removeItem('gitverse_streak');
    localStorage.removeItem('gitverse_completed_chapters');
    localStorage.removeItem('gitverse_achievements');
    localStorage.removeItem('gitverse_current_chapter');

    // Reset local state references
    setXp(0);
    setLevel(1);
    setStreak(1);
    setCompletedChapters([]);
    setAchievements([]);
    setCurrentChapterIndexState(0);
    
    audio.playClick();
  };

  const toggleThemeMode = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    localStorage.setItem('gitverse_theme', next);
    audio.playClick();
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    audio.setMuted(!enabled);
    audio.playClick();
  };

  const unlockAchievement = (name: string) => {
    if (!achievements.includes(name)) {
      const next = [...achievements, name];
      setAchievements(next);
      localStorage.setItem('gitverse_achievements', JSON.stringify(next));
      addXp(50); // XP bonus for achievement
    }
  };

  const addXp = (amount: number) => {
    setXp((prev) => {
      const total = prev + amount;
      localStorage.setItem('gitverse_xp', total.toString());
      // Level calculations: every 300 XP is a level
      const targetLevel = Math.floor(total / 300) + 1;
      if (targetLevel > level) {
        setLevel(targetLevel);
        localStorage.setItem('gitverse_level', targetLevel.toString());
        // Unlock Git Hero if user reaches Level 5 or completes all chapters
        if (targetLevel >= 5) {
          setTimeout(() => unlockAchievement("Git Hero"), 1000);
        }
      }
      return total;
    });
  };

  const setChapterIndex = (index: number) => {
    setCurrentChapterIndexState(index);
    localStorage.setItem('gitverse_current_chapter', index.toString());
    resetGitStateForChapter(index);
    audio.playClick();
  };

  const resetGitStateForChapter = (chapterIndex: number) => {
    const ch = chapters[chapterIndex];
    if (!ch) return;

    // Build custom starting Git state depending on the chapter
    let startState: GitState = { ...INITIAL_GIT_STATE };

    if (ch.id > 1) {
      startState.isInitialized = true;
      startState.currentBranch = 'main';
      startState.branches = ['main'];
    }

    if (ch.id === 2) {
      // Unstaged changes in working dir
      startState.workingDirectory = activeWorld === 'kingdom'
        ? ['castle.txt', 'village.txt', 'road.txt']
        : ['oxygen.txt', 'shield.txt', 'thruster.txt'];
    } else if (ch.id === 3) {
      // Preparing to stage
      startState.workingDirectory = activeWorld === 'kingdom'
        ? ['castle.txt', 'village.txt', 'road.txt']
        : ['oxygen.txt', 'shield.txt', 'thruster.txt'];
    } else if (ch.id === 4) {
      // Staged file ready to commit
      startState.workingDirectory = activeWorld === 'kingdom' ? ['village.txt', 'road.txt'] : ['shield.txt', 'thruster.txt'];
      startState.stagedFiles = activeWorld === 'kingdom' ? ['castle.txt'] : ['oxygen.txt'];
    } else if (ch.id === 5) {
      // Has 1 commit
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: activeWorld === 'kingdom' ? ['castle.txt'] : ['oxygen.txt']
        }
      ];
    } else if (ch.id === 6 || ch.id === 7) {
      // Has 1 commit
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: activeWorld === 'kingdom' ? ['castle.txt'] : ['oxygen.txt']
        }
      ];
    } else if (ch.id === 8) {
      // Has branch magic/reactor with a commit on it
      const branchName = activeWorld === 'kingdom' ? 'magic' : 'reactor';
      startState.branches = ['main', branchName];
      startState.currentBranch = branchName;
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: activeWorld === 'kingdom' ? ['castle.txt'] : ['oxygen.txt']
        },
        {
          id: `${branchName}-c1`,
          hash: '6f7e8a9',
          message: activeWorld === 'kingdom' ? 'Build magic tower' : 'Configure reactor core',
          author: 'Specialist',
          timestamp: '12:05:00 PM',
          branch: branchName,
          files: activeWorld === 'kingdom' ? ['magictower.txt'] : ['reactor.txt']
        }
      ];
    } else if (ch.id === 9) {
      // Staged for conflict resolution
      startState.workingDirectory = activeWorld === 'kingdom' ? [] : [];
      startState.stagedFiles = [];
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build base' : 'System update',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: []
        }
      ];
      // Simulate conflict text in terminal / files
    } else if (ch.id === 13) {
      // Reset chapter starts with 2 commits
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: []
        },
        {
          id: 'c2',
          hash: '5b3c2e1',
          message: activeWorld === 'kingdom' ? 'Build prison' : 'Initiate reactor boot',
          author: 'Historian',
          timestamp: '12:15:00 PM',
          branch: 'main',
          files: []
        }
      ];
    } else if (ch.id === 14) {
      // Revert chapter starts with 2 commits
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: []
        },
        {
          id: 'c2',
          hash: '7a8b9c0',
          message: activeWorld === 'kingdom' ? 'Impose high castle taxes' : 'Overload thrusters config',
          author: 'Historian',
          timestamp: '12:20:00 PM',
          branch: 'main',
          files: []
        }
      ];
    } else if (ch.id === 15) {
      // Rebase starts with parallel branches
      const branchName = activeWorld === 'kingdom' ? 'magic' : 'reactor';
      startState.branches = ['main', branchName];
      startState.currentBranch = branchName;
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: []
        },
        {
          id: 'magic-c1',
          hash: '6f7e8a9',
          message: activeWorld === 'kingdom' ? 'Design windmill' : 'Calibrate solar panels',
          author: 'Builder',
          timestamp: '12:10:00 PM',
          branch: branchName,
          files: []
        }
      ];
    } else if (ch.id === 16) {
      // Cherry pick starts with two commits on experimental branch
      const branchName = activeWorld === 'kingdom' ? 'magic' : 'reactor';
      startState.branches = ['main', branchName];
      startState.currentBranch = 'main';
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Build castle' : 'Repair oxygen',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: []
        },
        {
          id: 'magic-c1',
          hash: activeWorld === 'kingdom' ? 'c-gard' : 'c-shld',
          message: activeWorld === 'kingdom' ? 'Add magic gardens' : 'Add shields module',
          author: 'Scientist',
          timestamp: '12:10:00 PM',
          branch: branchName,
          files: []
        },
        {
          id: 'magic-c2',
          hash: 'c-pot',
          message: activeWorld === 'kingdom' ? 'Synthesize dark potion' : 'Construct warp exhaust',
          author: 'Scientist',
          timestamp: '12:15:00 PM',
          branch: branchName,
          files: []
        }
      ];
    } else if (ch.id === 17) {
      // Stash has modified uncommitted work
      startState.workingDirectory = activeWorld === 'kingdom' ? ['bridge.txt'] : ['solar.txt'];
    } else if (ch.id === 18) {
      // Team collaboration
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: activeWorld === 'kingdom' ? 'Init castle' : 'Establish module',
          author: 'Team',
          timestamp: '11:00:00 PM',
          branch: 'main',
          files: []
        }
      ];
    } else if (ch.id === 20) {
      // Final Boss starts with diverging state
      startState.branches = ['main'];
      startState.currentBranch = 'main';
      startState.commits = [
        {
          id: 'c1',
          hash: '4a2b91d',
          message: 'Origin config',
          author: 'Historian',
          timestamp: '12:00:00 PM',
          branch: 'main',
          files: []
        }
      ];
    }

    startState.history = [`$ git-sim initialized on Chapter ${ch.id}`];
    setGitState(startState);
  };

  const executeCommand = (cmd: string): { success: boolean; output: string } => {
    if (soundEnabled) {
      audio.playKeyPress();
    }
    const cleanCmd = cmd.trim();
    const activeCh = chapters[currentChapterIndex];
    if (!activeCh) return { success: false, output: "Error: No active chapter." };

    // Standard Info commands that run in any chapter context
    if (cleanCmd === "git status") {
      let output = `On branch ${gitState.currentBranch || 'main'}\n`;
      if (!gitState.isInitialized) {
        return { success: false, output: "fatal: not a git repository (or any of the parent directories): .git" };
      }
      if (gitState.stagedFiles.length === 0 && gitState.workingDirectory.length === 0) {
        output += "nothing to commit, working tree clean";
      } else {
        if (gitState.stagedFiles.length > 0) {
          output += "\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n";
          gitState.stagedFiles.forEach(f => {
            output += `\tnew file:   \u001b[32m${f}\u001b[0m\n`;
          });
        }
        if (gitState.workingDirectory.length > 0) {
          output += "\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n";
          gitState.workingDirectory.forEach(f => {
            output += `\t\u001b[31m${f}\u001b[0m\n`;
          });
        }
      }
      setGitState(prev => ({
        ...prev,
        history: [...prev.history, `$ ${cleanCmd}`, output]
      }));
      return { success: true, output };
    }

    if (cleanCmd === "git log") {
      if (!gitState.isInitialized) {
        return { success: false, output: "fatal: not a git repository" };
      }
      if (gitState.commits.length === 0) {
        return { success: true, output: "No commits recorded yet." };
      }
      let output = "";
      // Display reversed commits list (latest first)
      [...gitState.commits].reverse().forEach(c => {
        output += `\u001b[33mcommit ${c.hash}\u001b[0m (HEAD -> ${c.branch})\nAuthor: ${c.author}\nDate: ${c.timestamp}\n\n    ${c.message}\n\n`;
      });
      setGitState(prev => ({
        ...prev,
        history: [...prev.history, `$ ${cleanCmd}`, output]
      }));
      return { success: true, output };
    }

    if (cleanCmd === "git branch") {
      if (!gitState.isInitialized) {
        return { success: false, output: "fatal: not a git repository" };
      }
      const output = gitState.branches.map(b => b === gitState.currentBranch ? `* \u001b[32m${b}\u001b[0m` : `  ${b}`).join('\n');
      setGitState(prev => ({
        ...prev,
        history: [...prev.history, `$ ${cleanCmd}`, output]
      }));
      return { success: true, output };
    }

    if (cleanCmd === "clear") {
      setGitState(prev => ({ ...prev, history: [] }));
      return { success: true, output: "" };
    }

    if (cleanCmd === "help") {
      const output = `Available command structures:\n- git init\n- git status\n- git add <filename> or git add .\n- git commit -m "message"\n- git log\n- git branch <name>\n- git checkout <branch-name>\n- git merge <branch-name>\n- git remote add origin <url>\n- git push origin main\n- git clone <url>\n- git reset --hard <commit-hash>\n- git revert <commit-hash>\n- git stash`;
      setGitState(prev => ({
        ...prev,
        history: [...prev.history, `$ ${cleanCmd}`, output]
      }));
      return { success: true, output };
    }

    // Interactive step validation matching
    const currentStep = activeCh.validationSteps[gitState.currentStepIndex];
    if (!currentStep) {
      return { success: false, output: "All tasks for this chapter are complete. Click Continue!" };
    }

    const validationResult = currentStep.validate(cleanCmd, { ...gitState, theme: activeWorld });

    if (validationResult.success) {
      const nextIndex = gitState.currentStepIndex + 1;
      const finished = nextIndex >= activeCh.validationSteps.length;

      const updatedState = {
        ...gitState,
        ...(validationResult.nextStateUpdate || {}),
        currentStepIndex: nextIndex,
        history: [...gitState.history, `$ ${cleanCmd}`, `\u001b[32m✓ Task complete: ${currentStep.description}\u001b[0m`]
      };

      setGitState(updatedState);

      if (finished) {
        // Trigger completion animation, sounds, and reward points
        if (soundEnabled) {
          setTimeout(() => audio.playVictory(), 200);
        }
        setShowMissionComplete(true);
        addXp(activeCh.xpReward);

        // Add to completed chapters if not already there
        if (!completedChapters.includes(activeCh.id)) {
          const nextCompleted = [...completedChapters, activeCh.id];
          setCompletedChapters(nextCompleted);
          localStorage.setItem('gitverse_completed_chapters', JSON.stringify(nextCompleted));

          // Unlock badges based on chapters completed
          if (activeCh.id === 4) unlockAchievement("First Commit");
          if (activeCh.id === 6) unlockAchievement("Branch Explorer");
          if (activeCh.id === 8) unlockAchievement("Merge Master");
          if (activeCh.id === 9) unlockAchievement("Conflict Resolver");
        }

        // Increment streak count on completion
        setStreak(prev => {
          const next = prev + 1;
          localStorage.setItem('gitverse_streak', next.toString());
          return next;
        });
      } else {
        if (soundEnabled) {
          audio.playClick();
        }
      }

      return { success: true, output: `Success! Advanced to the next step.` };
    } else {
      if (soundEnabled) {
        audio.playError();
      }
      const errorStr = validationResult.errorMsg || "Command incorrect for this task.";
      const updatedState = {
        ...gitState,
        history: [...gitState.history, `$ ${cleanCmd}`, `\u001b[31m✗ ${errorStr}\u001b[0m`]
      };
      setGitState(updatedState);
      return { success: false, output: errorStr };
    }
  };

  return (
    <GameContext.Provider value={{
      activeWorld,
      setWorld,
      themeMode,
      toggleThemeMode,
      currentChapterIndex,
      setChapterIndex,
      completedChapters,
      xp,
      level,
      streak,
      achievements,
      gitState,
      executeCommand,
      resetGitStateForChapter,
      soundEnabled,
      setSoundEnabled,
      showMissionComplete,
      setShowMissionComplete,
      unlockAchievement,
      isLoggedIn,
      user,
      login,
      logout
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
export { ACHIEVEMENTS_LIST };
