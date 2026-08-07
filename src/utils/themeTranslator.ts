// Theme Translator Utility for GitVerse
// Translates canonical Git terms and files to themed equivalents,
// handling code block preservation in Markdown.

export type WorldTheme = 'kingdom' | 'space';

export interface TermMapping {
  git: string;
  repository: string;
  repo: string;
  commit: string;
  commits: string;
  branch: string;
  branches: string;
  merge: string;
  merges: string;
  push: string;
  pull: string;
  reset: string;
  fork: string;
  head: string;
}

export const KINGDOM_TERMS: TermMapping = {
  git: 'Realm Git',
  repository: 'Kingdom',
  repo: 'Kingdom',
  commit: 'Royal Chronicle entry',
  commits: 'Royal Chronicles',
  branch: 'New Kingdom Plan',
  branches: 'New Kingdom Plans',
  merge: 'Unite Kingdoms',
  merges: 'Kingdom Unifications',
  push: 'Send Messenger',
  pull: 'Receive Messenger',
  reset: 'Undo Construction',
  fork: 'New Empire',
  head: 'Current Reign',
};

export const SPACE_TERMS: TermMapping = {
  git: 'Time-Line Tracker',
  repository: 'Space Station',
  repo: 'Space Station',
  commit: 'Time Checkpoint',
  commits: 'Time Checkpoints',
  branch: 'Alternate Timeline',
  branches: 'Alternate Timelines',
  merge: 'Universe Fusion',
  merges: 'Universe Fusions',
  push: 'Rocket Launch',
  pull: 'Supply Shuttle',
  reset: 'Time Reversal',
  fork: 'Parallel Universe',
  head: 'Timeline Marker',
};

// File mappings
// index.html -> castle.txt / oxygen_system.java
// style.css -> farm_plans.txt / propulsion_core.py
// login.html -> royal_decree.txt / navigation_deck.cpp
export const FILE_MAPPINGS = {
  kingdom: {
    'index.html': 'castle.txt',
    'style.css': 'farm_plans.txt',
    'login.html': 'royal_decree.txt',
  },
  space: {
    'index.html': 'oxygen_system.java',
    'style.css': 'propulsion_core.py',
    'login.html': 'navigation_deck.cpp',
  },
};

// Advisors based on world & avatar
export interface MentorInfo {
  name: string;
  role: string;
  avatar: string; // emoji or image
}

export function getMentor(world: WorldTheme, userAvatar: string): MentorInfo {
  if (world === 'kingdom') {
    const clean = userAvatar.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
    if (clean === 'King') {
      return { name: 'Merlin', role: 'Royal Archmage', avatar: '🧙‍♂️' };
    }
    if (clean === 'Queen') {
      return { name: 'Lord Chancellor', role: 'Royal Advisor', avatar: '📜' };
    }
    return { name: 'Old Wizard', role: 'Keeper of Scrolls', avatar: '🧙' };
  } else {
    const clean = userAvatar.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
    if (clean === 'Robot') {
      return { name: 'Captain Orion', role: 'Human Commander', avatar: '👨‍✈️' };
    }
    if (clean === 'Scientist') {
      return { name: 'Robot EVA', role: 'Scientific Assistant', avatar: '🤖' };
    }
    return { name: 'AI Nova', role: 'Station Core Intelligence', avatar: '💠' };
  }
}

// Salutations based on avatar
export function getSalutation(userAvatar: string): string {
  const clean = userAvatar.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
  switch (clean) {
    case 'King': return 'Your Majesty';
    case 'Queen': return 'Your Highness';
    case 'Wizard': return 'Grand Archmage';
    case 'Robot': return 'Unit';
    case 'Astronaut': return 'Commander';
    case 'Scientist': return 'Chief Researcher';
    default: return 'Recruit';
  }
}

/**
 * Translates file names from canonical to themed
 */
export function translateFilenameToThemed(filename: string, world: WorldTheme): string {
  const map = FILE_MAPPINGS[world];
  return map[filename as keyof typeof map] || filename;
}

/**
 * Translates file names from themed to canonical
 */
export function translateFilenameToCanonical(themedFilename: string, world: WorldTheme): string {
  const map = FILE_MAPPINGS[world];
  for (const [canonical, themed] of Object.entries(map)) {
    if (themed.toLowerCase() === themedFilename.toLowerCase()) {
      return canonical;
    }
  }
  return themedFilename;
}

/**
 * Translates command inputted by the user (themed files -> canonical files)
 */
export function preProcessCommand(command: string, world: WorldTheme): string {
  let processed = command;
  const map = FILE_MAPPINGS[world];
  for (const [canonical, themed] of Object.entries(map)) {
    // Replace whole word file names
    const regex = new RegExp(`\\b${themed.replace('.', '\\.')}\\b`, 'g');
    processed = processed.replace(regex, canonical);
  }
  return processed;
}

/**
 * Translates terminal output (canonical files/terms -> themed files/terms)
 */
export function postProcessOutput(output: string, world: WorldTheme): string {
  if (!output) return output;
  let processed = output;
  
  // 1. Translate file names
  const fileMap = FILE_MAPPINGS[world];
  for (const [canonical, themed] of Object.entries(fileMap)) {
    const regex = new RegExp(`\\b${canonical.replace('.', '\\.')}\\b`, 'g');
    processed = processed.replace(regex, themed);
  }

  // 2. Translate base terms
  const terms = world === 'kingdom' ? KINGDOM_TERMS : SPACE_TERMS;
  // Let's replace common Git terms in output messages
  const replacements: [RegExp, string][] = [
    [/\bcommit\b/g, terms.commit.toLowerCase()],
    [/\bcommits\b/g, terms.commits.toLowerCase()],
    [/\bCommit\b/g, terms.commit],
    [/\bCommits\b/g, terms.commits],
    [/\brepository\b/g, terms.repository.toLowerCase()],
    [/\bRepository\b/g, terms.repository],
    [/\brepo\b/g, terms.repo.toLowerCase()],
    [/\bbranch\b/g, terms.branch.toLowerCase()],
    [/\bbranches\b/g, terms.branches.toLowerCase()],
    [/\bBranch\b/g, terms.branch],
    [/\bBranches\b/g, terms.branches],
    [/\bmerge\b/g, terms.merge.toLowerCase()],
    [/\bmerges\b/g, terms.merges.toLowerCase()],
    [/\bMerge\b/g, terms.merge],
    [/\bpush\b/g, terms.push.toLowerCase()],
    [/\bpull\b/g, terms.pull.toLowerCase()],
    [/\breset\b/g, terms.reset.toLowerCase()],
    [/\bHEAD\b/g, terms.head],
  ];

  for (const [regex, replacement] of replacements) {
    processed = processed.replace(regex, replacement);
  }

  return processed;
}

/**
 * Translates markdown text (like instructions/descriptions) while preserving
 * code blocks and inline backtick code snippets intact.
 */
export function translateMarkdown(markdownText: string, world: WorldTheme, userAvatar: string = 'Recruit'): string {
  if (!markdownText) return markdownText;

  // Split markdown text by code blocks (```...```) and code spans (`...`)
  // We want to avoid translating any text inside these blocks.
  const parts = markdownText.split(/(```[\s\S]*?```|`[^`\n]*?`)/g);

  const terms = world === 'kingdom' ? KINGDOM_TERMS : SPACE_TERMS;
  const salutation = getSalutation(userAvatar);

  const translatedParts = parts.map((part, index) => {
    // If index is odd, it matched the code block/span regex, so return it untouched
    if (index % 2 === 1) {
      return part;
    }

    // Otherwise, it's normal markdown text. Translate terms and file names.
    let text = part;

    // Replace greetings if template placeholder exists or generically
    text = text.replace(/Student/g, salutation)
               .replace(/student/g, salutation.toLowerCase())
               .replace(/Player/g, salutation)
               .replace(/player/g, salutation.toLowerCase());

    // File mappings translation
    const fileMap = FILE_MAPPINGS[world];
    for (const [canonical, themed] of Object.entries(fileMap)) {
      const regex = new RegExp(`\\b${canonical.replace('.', '\\.')}\\b`, 'g');
      text = text.replace(regex, themed);
    }

    // Git terms translation
    const replacements: [RegExp, string][] = [
      [/\bGit repository\b/g, `${terms.git} ${terms.repository}`],
      [/\bgit repository\b/g, `${terms.git.toLowerCase()} ${terms.repository.toLowerCase()}`],
      [/\bGit repositories\b/g, `${terms.git} ${terms.repository}s`],
      [/\bversion control system\b/g, world === 'kingdom' ? 'Royal Archivist Guild' : 'Chronology Registry System'],
      [/\bversion control systems\b/g, world === 'kingdom' ? 'Royal Archivist Guilds' : 'Chronology Registry Systems'],
      [/\bVCS\b/g, world === 'kingdom' ? 'Archivist Guild' : 'CRS Network'],
      [/\bGit\b/g, terms.git],
      [/\bgit\b/g, terms.git.toLowerCase()],
      [/\brepository\b/g, terms.repository.toLowerCase()],
      [/\bRepository\b/g, terms.repository],
      [/\brepositories\b/g, `${terms.repository.toLowerCase()}s`],
      [/\bRepositories\b/g, `${terms.repository}s`],
      [/\brepo\b/g, terms.repo.toLowerCase()],
      [/\brepos\b/g, `${terms.repo.toLowerCase()}s`],
      [/\bcommits\b/g, terms.commits.toLowerCase()],
      [/\bcommit\b/g, terms.commit.toLowerCase()],
      [/\bCommits\b/g, terms.commits],
      [/\bCommit\b/g, terms.commit],
      [/\bbranching\b/g, world === 'kingdom' ? 'Plan Drafting' : 'Timeline Splitting'],
      [/\bbranches\b/g, terms.branches.toLowerCase()],
      [/\bbranch\b/g, terms.branch.toLowerCase()],
      [/\bBranches\b/g, terms.branches],
      [/\bBranch\b/g, terms.branch],
      [/\bmerges\b/g, terms.merges.toLowerCase()],
      [/\bmerge\b/g, terms.merge.toLowerCase()],
      [/\bMerges\b/g, terms.merges],
      [/\bMerge\b/g, terms.merge],
      [/\bpush\b/g, terms.push.toLowerCase()],
      [/\bPush\b/g, terms.push],
      [/\bpull\b/g, terms.pull.toLowerCase()],
      [/\bPull\b/g, terms.pull],
      [/\breset\b/g, terms.reset.toLowerCase()],
      [/\bReset\b/g, terms.reset],
      [/\bfork\b/g, terms.fork.toLowerCase()],
      [/\bFork\b/g, terms.fork],
      [/\bHEAD\b/g, terms.head],
    ];

    for (const [regex, replacement] of replacements) {
      text = text.replace(regex, replacement);
    }

    return text;
  });

  return translatedParts.join('');
}

export interface RealityExplanation {
  message: string;
  commands: string[];
  explanation: string;
}

export function getRealityExplanation(questId: string, world: WorldTheme): RealityExplanation {
  const isKingdom = world === 'kingdom';
  switch (questId) {
    case 'q-git-init':
      return {
        message: isKingdom 
          ? '🏰 You initiated the realm tracker for your Kingdom.'
          : '🚀 You booted up the station timeline tracker.',
        commands: ['git init'],
        explanation: 'Creates a hidden .git directory in your project root to initialize repository tracking.'
      };
    case 'q-git-add':
      return {
        message: isKingdom 
          ? '🏰 Prepared construction materials for the Chronicle.'
          : '🚀 Buffered oxygen generator sensor data in the timeline.',
        commands: isKingdom ? ['git add castle.txt'] : ['git add oxygen_system.java'],
        explanation: 'Stages the file changes, putting them into the Staging Area (index) to prepare them for the next commit snapshot.'
      };
    case 'q-git-commit':
      return {
        message: isKingdom 
          ? '🏰 Recorded today\'s construction in the Royal Chronicle.'
          : '🚀 Saved current space station state to a Time Checkpoint.',
        commands: isKingdom 
          ? ['git add .', 'git commit -m "Initial commit"']
          : ['git add .', 'git commit -m "Initial commit"'],
        explanation: 'Takes a snapshot of staged files, writes them to the commit database, and advances the current branch pointer.'
      };
    case 'q-git-log':
      return {
        message: isKingdom 
          ? '🏰 Read the past records of the Royal Chronicle.'
          : '🚀 Pulled up the logs of past Time Checkpoints.',
        commands: ['git log'],
        explanation: 'Displays the list of commits made on the active timeline in reverse chronological order, showing hashes, messages, and authors.'
      };
    case 'q-boss-beginner':
      return {
        message: isKingdom 
          ? '🏰 Secured the kingdom blueprint ledger by adding and committing files.'
          : '🚀 Repaired the reactor cores and recorded the stable state.',
        commands: isKingdom
          ? ['git init', 'git add castle.txt farm_plans.txt', 'git commit -m "Secure kingdom blueprint"']
          : ['git init', 'git add oxygen_system.java propulsion_core.py', 'git commit -m "Repair reactor cores"'],
        explanation: 'Combines initializing a repo, staging multiple changed files, and committing them together to form a baseline project history.'
      };
    case 'q-git-branch-create':
      return {
        message: isKingdom 
          ? '🏰 Drafted a New Kingdom Plan for castle defenses.'
          : '🚀 Created an Alternate Timeline to test reactor safety.',
        commands: ['git branch feature-defense'],
        explanation: 'Creates a new branch pointing to the current commit, allowing you to develop new features in isolation.'
      };
    case 'q-git-branch-checkout':
      return {
        message: isKingdom 
          ? '🏰 Dispatched builders to focus on the New Kingdom Plan.'
          : '🚀 Dispatched the crew into the Alternate Timeline.',
        commands: ['git checkout feature-defense'],
        explanation: 'Updates the HEAD pointer to point to the specified branch, replacing the working directory files with the branch\'s latest tree state.'
      };
    case 'q-git-merge':
      return {
        message: isKingdom 
          ? '🏰 United the kingdoms: merged defense plans into the main reign.'
          : '🚀 Conducted a Universe Fusion: merged alternate timeline into main.',
        commands: ['git merge feature-defense'],
        explanation: 'Merges changes from the feature branch into your active branch. In a Fast-Forward merge, it simply moves the main branch pointer forward.'
      };
    case 'q-git-push':
      return {
        message: isKingdom 
          ? '🏰 Sent a Messenger with the chronicle logs to the High King\'s fortress.'
          : '🚀 Launched a supply shuttle cargo container sending files to the mothership.',
        commands: ['git remote add origin https://github.com/player/gitquest.git', 'git push origin main'],
        explanation: 'Adds a link to a remote server repository and pushes your local branch history up to keep remote and local in sync.'
      };
    case 'q-boss-intermediate':
      return {
        message: isKingdom 
          ? '🏰 Unified rival kingdoms by resolving planning clashes and merging chronicles.'
          : '🚀 Stabilized universe collision by resolving conflicting sensor code in timelines.',
        commands: ['git checkout main', 'git merge feature-plans', '# Edit conflicts manually', 'git add castle.txt', 'git commit -m "Merge resolved"'],
        explanation: 'Resolves merge conflicts manually by editing files containing conflict markers (<<<<<<<, =======, >>>>>>>), staging, and final-committing.'
      };
    case 'q-git-reset':
      return {
        message: isKingdom 
          ? '🏰 Undid construction, rolling back the realm state to a safer reign.'
          : '🚀 Triggered a Time Reversal, resetting station status to a previous checkpoint.',
        commands: ['git reset --hard HEAD~1'],
        explanation: 'Resets the active branch to a specific commit. `--hard` discards all uncommitted changes in both staging area and working directory.'
      };
    case 'q-git-stash':
      return {
        message: isKingdom 
          ? '🏰 Hidden active plans in the vaults to work on a royal emergency, then popped them.'
          : '🚀 Saved current reactor work in subspace pockets to fix oxygen leaks, then pop-restored it.',
        commands: ['git stash', 'git stash pop'],
        explanation: 'Temporarily shelves (stashes) changes made to your working directory so you can work on something else, and pops them back later.'
      };
    case 'q-boss-advanced':
      return {
        message: isKingdom 
          ? '🏰 Restored order to the archives: stashed plans, reset faulty builds, and pushed final blueprints.'
          : '🚀 Defeated the system corruption: stashed repairs, reversed timelines, and synchronized with the mothership.',
        commands: ['git stash', 'git reset --hard HEAD~1', 'git stash pop', 'git add .', 'git commit -m "Perfect system"', 'git push origin main'],
        explanation: 'Integrates resetting history, stashing active changes, restoring files, making custom adjustments, and pushing updates to a remote repository.'
      };
    default:
      return {
        message: 'Equivalent Git operations completed.',
        commands: ['git status'],
        explanation: 'You verified the state of the repository directories.'
      };
  }
}
