import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import { Bot, X, Send, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
  time: string;
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────

const GIT_KNOWLEDGE: Record<string, string> = {
  'git init': '`git init` creates a new empty repository — it makes a hidden `.git/` folder that tracks all history. In GitQuest this is the **Royal Archive** (Kingdom) or **Timeline Core** (Space).',
  'git status': '`git status` shows what files are modified, staged, or untracked. Use it constantly — it is the most informative daily command in Git!',
  'git add': '`git add <file>` moves a file from your Working Directory into the **Staging Area** — ready to be committed. Use `git add .` to stage ALL changes at once.',
  'git commit': '`git commit -m "message"` permanently saves staged changes into the repo history. Write clear, short messages describing *what changed and why*.',
  'git log': '`git log` prints the full commit history — author, date, hash, and message. Use `git log --oneline` for a compact view.',
  'git branch': '`git branch <name>` creates a new parallel development line. `git branch` (no args) lists all existing branches.',
  'git checkout': '`git checkout <branch>` switches your HEAD to another branch. Modern Git also accepts `git switch <branch>`.',
  'git merge': '`git merge <branch>` integrates changes from another branch into the current one. If both touched the same lines, you get a **merge conflict**.',
  'git push': '`git push origin <branch>` uploads local commits to the remote repository. You need `git remote add origin <url>` first.',
  'git pull': '`git pull` = `git fetch` + `git merge`. It downloads and integrates remote changes in one step.',
  'git clone': '`git clone <url>` downloads an entire remote repository including all history and branches.',
  'git remote': '`git remote add origin <url>` links your local repo to a remote server. `origin` is just the conventional name for the primary remote.',
  'git reset': '`git reset --hard <hash>` moves HEAD back to a past commit, *discarding* all later changes. Dangerous on shared branches — rewrites history!',
  'git revert': '`git revert <hash>` creates a **new commit** that undoes a past commit — without rewriting history. Safe to use on shared/public branches.',
  'git rebase': '`git rebase main` replays your branch commits on top of the latest `main`, creating a clean linear history. Avoid rebasing already-pushed commits.',
  'git stash': '`git stash` shelves uncommitted changes temporarily. Use `git stash pop` to restore them. Great for mid-work context switching.',
  'git cherry-pick': '`git cherry-pick <hash>` copies a single specific commit from any branch and applies it to the current branch.',
  'git fetch': '`git fetch` downloads remote changes without merging. Lets you review before integrating.',
  'git diff': '`git diff` shows line-by-line unstaged changes. `git diff --staged` shows changes ready to commit.',
  'git tag': '`git tag v1.0` labels a commit with a human-readable name — used for version releases.',
  'fork': 'A **fork** is a server-side copy of a repo under your own account on GitHub. Fork → clone your fork → develop → pull request back to the original.',
  'merge conflict': 'A **merge conflict** occurs when two branches changed the same lines of the same file. Git marks conflicts with `<<<<<<`, `=======`, `>>>>>>`. Resolve manually, then `git add` and `git commit`.',
  'staging area': 'The **Staging Area** (Index) is the preparation zone between Working Directory and Repository. Flow: edit file → `git add` → Staging Area → `git commit` → Repository.',
  'working directory': 'The **Working Directory** is your file system where you make edits. Changes here are "untracked" or "modified" until staged with `git add`.',
  'head': '**HEAD** is a pointer to your current commit position. It normally points to the tip of your active branch. `git checkout` moves HEAD.',
  'repository': 'A **repository** stores your project files and their complete history. The `.git/` folder is the repository database.',
};

const CHAPTER_HINTS: Record<number, { kingdom: string; space: string; command: string }> = {
  1:  { kingdom: 'Type `git init` to create the Royal Archive!', space: 'Type `git init` to activate the Timeline Core!', command: 'git init' },
  2:  { kingdom: 'Run `git status` to see the untracked construction blueprints.', space: 'Run `git status` to scan the engineering bay.', command: 'git status' },
  3:  { kingdom: 'Use `git add castle.txt` to move the blueprint to the Inspection Hall.', space: 'Use `git add oxygen.txt` to load the module onto the Launch Pad.', command: 'git add <file>' },
  4:  { kingdom: 'Commit with: `git commit -m "Build castle"`', space: 'Commit with: `git commit -m "Repair oxygen"`', command: 'git commit -m "message"' },
  5:  { kingdom: 'Run `git log` to read the Royal Chronicle entries.', space: 'Run `git log` to query the Timeline Records.', command: 'git log' },
  6:  { kingdom: 'Create the magic branch: `git branch magic`', space: 'Create the reactor branch: `git branch reactor`', command: 'git branch <name>' },
  7:  { kingdom: 'Switch to magic: `git checkout magic`', space: 'Switch to reactor: `git checkout reactor`', command: 'git checkout <branch>' },
  8:  { kingdom: 'Step 1: `git checkout main`\nStep 2: `git merge magic`', space: 'Step 1: `git checkout main`\nStep 2: `git merge reactor`', command: 'git checkout main → git merge <branch>' },
  9:  { kingdom: 'Step 1: `git add castle.txt`\nStep 2: `git commit -m "Resolve conflicts"`', space: 'Step 1: `git add shield.txt`\nStep 2: `git commit -m "Resolve conflicts"`', command: 'git add <file> → git commit' },
  10: { kingdom: 'Step 1: `git remote add origin <url>`\nStep 2: `git push origin main`', space: 'Step 1: `git remote add origin <url>`\nStep 2: `git push origin main`', command: 'git remote add origin + git push' },
  11: { kingdom: 'Clone: `git clone https://capital/kingdom.git`', space: 'Clone: `git clone https://hq/station.git`', command: 'git clone <url>' },
  12: { kingdom: 'Type `fork` to simulate the kingdom fork.', space: 'Type `fork` to simulate the fork.', command: 'fork' },
  13: { kingdom: 'Hard reset: `git reset --hard c1`', space: 'Hard reset: `git reset --hard c1`', command: 'git reset --hard c1' },
  14: { kingdom: 'Revert: `git revert c1`', space: 'Revert: `git revert c1`', command: 'git revert c1' },
  15: { kingdom: 'Rebase magic onto main: `git rebase main`', space: 'Rebase reactor onto main: `git rebase main`', command: 'git rebase main' },
  16: { kingdom: 'Cherry-pick: `git cherry-pick c-gard`', space: 'Cherry-pick: `git cherry-pick c-shld`', command: 'git cherry-pick <hash>' },
  17: { kingdom: 'Stash work: `git stash` then later `git stash pop`', space: 'Stash: `git stash` then `git stash pop`', command: 'git stash' },
  18: { kingdom: 'Push collaboration: `git push origin main`', space: 'Push module: `git push origin main`', command: 'git push origin main' },
  19: { kingdom: 'Pull remote updates: `git pull origin main`', space: 'Pull updates: `git pull origin main`', command: 'git pull origin main' },
  20: { kingdom: 'Final Boss! Combine all skills: init, add, commit, branch, merge, push!', space: 'Final Boss: init, add, commit, branch, merge, push!', command: 'All commands' },
};

const QUICK_REPLIES = [
  '💡 Hint for this chapter',
  '❓ What is git commit?',
  '🌿 How does branching work?',
  '⚔️ What is a merge conflict?',
  '⏳ reset vs revert?',
  '🎯 What commands are available?',
];

function getBotResponse(userInput: string, chapterIndex: number, isKingdom: boolean): string {
  const input = userInput.toLowerCase().trim();
  const currentChapter = chapters[chapterIndex];
  const chapterId = currentChapter?.id ?? 1;

  // Chapter hint
  if (input.includes('hint') || input.includes('stuck') || input.includes('help me') || input.includes('current chapter') || input.includes('this chapter') || input.includes('what do i do')) {
    const hint = CHAPTER_HINTS[chapterId];
    if (hint) {
      const themeHint = isKingdom ? hint.kingdom : hint.space;
      return `📌 **Chapter ${chapterId} — ${currentChapter?.title}**\n\n${themeHint}\n\nCommand: \`${hint.command}\`\n\nType it into the **Terminal** in the mission panel!`;
    }
    return `You're on Chapter ${chapterId}: **${currentChapter?.title}**. Try the git command shown in the "Real Command" section of the concept card!`;
  }

  // Available commands
  if (input.includes('what command') || input.includes('available') || input.includes('list command') || input.includes('all command')) {
    return '🛠️ **GitQuest Terminal commands:**\n\n`git init` · `git status` · `git add` · `git commit` · `git log` · `git branch` · `git checkout` · `git merge` · `git push` · `git pull` · `git clone` · `git remote` · `git reset` · `git revert` · `git rebase` · `git stash` · `git cherry-pick` · `git fetch` · `git diff` · `git tag`\n\nAlso: `help` · `clear` · `git status` · `git log` · `git branch`';
  }

  // Reset vs revert
  if ((input.includes('reset') && input.includes('revert')) || input.includes('reset vs revert') || input.includes('difference between reset')) {
    return '⚡ **git reset vs git revert:**\n\n**`git reset --hard`** — Moves HEAD backward, *erasing* commits from history. Dangerous on shared branches.\n\n**`git revert`** — Creates a *new* commit that undoes a past one. History preserved. Safe for shared/public branches.\n\n> Rule: Use `revert` on public branches, `reset` only on local private work.';
  }

  // Merge vs rebase
  if ((input.includes('merge') && input.includes('rebase')) || input.includes('merge vs rebase')) {
    return '🔀 **git merge vs git rebase:**\n\n**`git merge`** — Combines branches with a merge commit. Non-destructive, shows full context.\n\n**`git rebase`** — Replays commits for a linear history. Rewrites hashes — avoid on shared branches!\n\n> Use merge for collaboration, rebase for local cleanup.';
  }

  // Pull vs fetch
  if ((input.includes('pull') && input.includes('fetch')) || input.includes('pull vs fetch')) {
    return '📡 **git fetch vs git pull:**\n\n**`git fetch`** — Downloads remote commits, does NOT merge. Review first, then decide.\n\n**`git pull`** — Runs fetch + merge in one step. Convenient but less control.\n\n> Prefer `fetch` when you want to inspect remote changes before merging.';
  }

  // Branching explanation
  if (input.includes('branch') || input.includes('branching')) {
    return GIT_KNOWLEDGE['git branch'] + '\n\n**Typical workflow:**\n1. `git branch feature-x` — create branch\n2. `git checkout feature-x` — switch to it\n3. Make commits\n4. `git checkout main` + `git merge feature-x` — integrate back';
  }

  // Check knowledge base
  for (const [key, answer] of Object.entries(GIT_KNOWLEDGE)) {
    if (input.includes(key.toLowerCase()) || (key.startsWith('git ') && input.includes(key.split(' ')[1]))) {
      return answer;
    }
  }

  // World / theme questions
  if (input.includes('world') || input.includes('kingdom') || input.includes('space') || input.includes('theme') || input.includes('switch')) {
    return isKingdom
      ? '🏰 You are in **Kingdom Chronicles** mode! Git concepts map to medieval actions — commits are chronicle entries, branches are parallel kingdoms, merges unite realms.\n\nSwitch to Space mode via **Settings** or the World Selector on the home dashboard!'
      : '🚀 You are in **Space Odyssey** mode! Git maps to space operations — commits are time checkpoints, branches are alternate timelines, merges are timeline fusions.\n\nSwitch to Kingdom mode via **Settings**!';
  }

  // XP / progress
  if (input.includes('xp') || input.includes('level') || input.includes('progress') || input.includes('score') || input.includes('streak')) {
    return '⚡ **XP & Levels:**\n\nEach chapter rewards **100–200 XP**. Every 300 XP = 1 level up! Check your stats on the **Dashboard** tab.\n\n- 🏆 Achievements give +50 XP bonus\n- 🔥 Streak grows each completed chapter\n- 📊 Compare on the Leaderboard!';
  }

  // Navigation
  if (input.includes('navigate') || input.includes('where') || input.includes('find') || input.includes('tab') || input.includes('go to')) {
    return '🗺️ **GitQuest Navigation:**\n\n- **Dashboard** — Stats overview\n- **Mission ▶** — Active chapter terminal\n- **Achievements** — Unlock badges\n- **Leaderboard** — Compare scores\n- **Profile** — Your stats & world\n- **Settings** — Sound, theme, world\n\nOn mobile, use the **bottom nav bar**!';
  }

  // Greetings
  if (input.match(/^(hi|hello|hey|greetings|hola|howdy)[\s!.?]*$/)) {
    return isKingdom
      ? '👋 Greetings, Royal Historian! I am **GitGuide** — your personal Git tutor. Ask me about any Git command, get a chapter hint, or ask how the game works!'
      : '👋 Commander! I am **GitGuide** — your AI copilot. Ask about Git commands, request a chapter hint, or ask how anything works!';
  }

  // Thanks
  if (input.includes('thank') || input.includes('great') || input.includes('awesome') || input.includes('perfect')) {
    return isKingdom
      ? '📜 The honor is mine, Historian! Keep writing history one commit at a time. Anything else?'
      : '🚀 Happy to help, Commander! Keep those timelines stable. Anything else?';
  }

  // What is GitQuest
  if (input.includes('gitquest') || input.includes('this game') || input.includes('what is this')) {
    return '🎮 **GitQuest** is an interactive Git learning game with 20 chapters, each teaching a real Git concept through a story metaphor.\n\n- 🏰 **Kingdom Chronicles** — medieval theme\n- 🚀 **Space Odyssey** — sci-fi theme\n\nType Git commands in the terminal to complete missions and earn XP!';
  }

  // Fallbacks
  const fallbacks = [
    `I specialize in Git and GitQuest! Try asking about a specific command like **git branch**, or say **"hint"** for your current chapter help.`,
    `Hmm, not sure about that. Ask me things like: "What is git stash?" or "How does rebasing work?" or "Hint for chapter ${chapterId}."`,
    `Try asking: "What is ${currentChapter?.conceptTerm ?? 'git commit'}?" or request a hint for chapter ${chapterId}!`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ChatBot: React.FC = () => {
  const { activeWorld, currentChapterIndex } = useGame();
  const isKingdom = activeWorld === 'kingdom';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: 0,
    from: 'bot',
    text: isKingdom
      ? '👋 Greetings! I am **GitGuide** — your personal Git tutor. Ask about any Git command, say **"hint"** to get help with your current chapter, or ask how the game works!'
      : '👋 Commander! I am **GitGuide** — your AI copilot. Ask about Git commands, say **"hint"** for chapter help, or ask anything about the game!',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now(), from: 'user', text: text.trim(), time: now };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      const response = getBotResponse(text, currentChapterIndex, isKingdom);
      const botMsg: Message = {
        id: Date.now() + 1,
        from: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      if (!isOpen) setUnreadCount(n => n + 1);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputVal);
    }
  };

  // Render markdown-ish bold and code in bot messages
  const renderText = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\n)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold
            ${isKingdom ? 'bg-amber-500/15 text-amber-300' : 'bg-cyan-500/15 text-cyan-300'}`}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
      }
      if (part === '\n') return <br key={i} />;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Open GitGuide chatbot"
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 select-none
          ${isKingdom
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/40'
            : 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-cyan-500/40'
          }
        `}
      >
        {isOpen
          ? <ChevronDown size={22} className="text-slate-950" />
          : <Bot size={22} className="text-slate-950" />
        }
        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-36 md:bottom-24 right-4 md:right-6 z-40 w-[340px] sm:w-[380px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden anim-chatbot-in
            ${isKingdom
              ? 'border-amber-500/20 shadow-amber-500/10'
              : 'border-cyan-500/20 shadow-cyan-500/10'
            }
          `}
          style={{
            height: '520px',
            maxHeight: 'calc(100vh - 160px)',
            background: 'rgba(2, 6, 23, 0.88)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0
            ${isKingdom ? 'border-amber-500/15' : 'border-cyan-500/15'}
          `} style={{ background: isKingdom ? 'rgba(120,53,15,0.15)' : 'rgba(8,51,68,0.15)' }}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-slate-950 shadow-md
                ${isKingdom ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-cyan-400 to-cyan-600'}
              `}>
                <Bot size={17} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-100 leading-none">GitGuide</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-medium">Git Tutor · Always Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(100,116,139,0.2) transparent' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-slate-950 mb-0.5
                    ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
                  `}>
                    <Bot size={11} />
                  </div>
                )}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-[12px] leading-relaxed
                  ${msg.from === 'user'
                    ? `${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'} text-slate-950 font-semibold rounded-br-sm`
                    : 'bg-slate-900 text-slate-300 border border-slate-800/60 rounded-bl-sm'
                  }
                `}>
                  <div className="space-y-0.5">
                    {msg.from === 'bot' ? renderText(msg.text) : msg.text}
                  </div>
                  <div className={`text-[9px] mt-1.5 ${msg.from === 'user' ? 'text-slate-950/50 text-right' : 'text-slate-600'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-slate-950 mb-0.5
                  ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
                `}>
                  <Bot size={11} />
                </div>
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full anim-typing-dot" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className={`flex-shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-full border transition-all whitespace-nowrap hover:scale-105 active:scale-95
                    ${isKingdom
                      ? 'border-amber-500/25 text-amber-400 hover:bg-amber-500/15'
                      : 'border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/15'
                    }
                  `}
                  style={{ background: isKingdom ? 'rgba(245,158,11,0.06)' : 'rgba(6,182,212,0.06)' }}
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className={`px-3 pb-3 pt-2 border-t flex-shrink-0
            ${isKingdom ? 'border-amber-500/15' : 'border-cyan-500/15'}
          `}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Git or this chapter…"
                className="flex-1 bg-slate-900/80 border border-slate-800 focus:border-slate-600 outline-none text-slate-100 rounded-xl px-3 py-2 text-[12px] placeholder:text-slate-600 transition-all"
              />
              <button
                onClick={() => sendMessage(inputVal)}
                disabled={!inputVal.trim() || isTyping}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
                  ${isKingdom
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }
                `}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
