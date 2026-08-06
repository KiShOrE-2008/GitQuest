import type { GitRepoState } from '../simulator/GitEngine';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
  explanation: string;
}

export interface Quest {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'mission' | 'boss';
  xp: number;
  coins: number;
  description: string;
  instructions: string; // Markdown text
  quizQuestions?: QuizQuestion[];
  // Validation function to check if the simulator state passes the quest goals
  checkPassed?: (state: GitRepoState, history: string[]) => { passed: boolean; message?: string };
  // Setup file system or commits on start
  startingState?: (state: GitRepoState) => GitRepoState;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  world: 'beginner' | 'intermediate' | 'advanced';
  quests: Quest[];
}

export const CHAPTERS: Chapter[] = [
  // ==================== BEGINNER WORLD ====================
  {
    id: 'ch-intro',
    title: '1. Introduction to Version Control',
    description: 'Understand the core concepts of VCS, Git, and how code history is saved.',
    world: 'beginner',
    quests: [
      {
        id: 'q-intro-vcs',
        title: 'What is Version Control?',
        type: 'lesson',
        xp: 30,
        coins: 10,
        description: 'Learn the fundamentals of tracking code changes.',
        instructions: `
### What is Version Control?

Version Control Systems (VCS) are software tools that help software teams manage changes to source code over time. They keep track of every modification to the code in a special database called a **repository**. 

If a mistake is made, developers can turn back the clock and compare earlier versions of the code to help fix the mistake while minimizing disruption to all team members.

#### Why Use Version Control?
1. **History Tracking**: Know exactly who changed what, when, and why.
2. **Backups**: If your local computer crashes, your code is safely saved in history.
3. **Branching & Merging**: Multiple people can work on the same project simultaneously without overwriting each other's changes.
3. **Collaboration**: Easily merge code from team members.

Click **Continue** below to proceed to the quiz!
        `
      },
      {
        id: 'q-intro-quiz',
        title: 'VCS Fundamentals Quiz',
        type: 'quiz',
        xp: 50,
        coins: 15,
        description: 'Test your understanding of version control basics.',
        instructions: 'Answer the following questions to verify your learning and earn XP & coins!',
        quizQuestions: [
          {
            question: 'What is the primary purpose of a Version Control System?',
            options: [
              'To speed up the internet connection for downloading files.',
              'To compile source code into executable files automatically.',
              'To track modifications to code files over time and coordinate teamwork.',
              'To write source code automatically using AI.'
            ],
            correctAnswer: 2,
            explanation: 'VCS is designed to track file changes over time, coordinate between developers, and review past history.'
          },
          {
            question: 'What is a Git Repository?',
            options: [
              'A directory containing all your code files along with a special .git history database.',
              'A folder where developers store delete cache logs.',
              'An online server where you only read programming books.',
              'A text editor used to write HTML pages.'
            ],
            correctAnswer: 0,
            explanation: 'A repository (or repo) is the directory containing your project files and the .git directory storing all version history.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch-repo-basics',
    title: '2. Creating a Repository',
    description: 'Learn how to spin up a virtual Git repository using git init.',
    world: 'beginner',
    quests: [
      {
        id: 'q-git-init',
        title: 'Initializing a Repository',
        type: 'mission',
        xp: 75,
        coins: 20,
        description: 'Initialize a new repository using the terminal.',
        instructions: `
### Mission: Run git init

To start tracking a project with Git, you must initialize a repository. This creates a hidden \`.git\` directory in your project folder, which stores all your metadata and revision histories.

#### Your Task
Type the following command in the terminal to initialize your Git repository:

\`\`\`bash
git init
\`\`\`

You will see that the simulator will activate, visual files will appear in your **Working Directory**, and the commit graph will prepare for action!
        `,
        checkPassed: (state) => {
          if (state.initialized) {
            return { passed: true, message: 'Excellent! You initialized an empty Git repository.' };
          }
          return { passed: false, message: 'Please run "git init" to initialize the repository.' };
        }
      }
    ]
  },
  {
    id: 'ch-staging',
    title: '3. The Staging Area',
    description: 'Understand the intermediate staging area (index) and how to stage files.',
    world: 'beginner',
    quests: [
      {
        id: 'q-git-add',
        title: 'Staging Files',
        type: 'mission',
        xp: 75,
        coins: 20,
        description: 'Stage changes in the working directory to prepare for a commit.',
        instructions: `
### The 3 Areas of Git
Git projects have three main sections:
1. **Working Directory**: The actual files you are editing on your computer (represented in red in git status).
2. **Staging Area**: A preview room. You select which modified files should go into the next commit (represented in green in git status).
3. **Local Directory (Repository)**: Files that have been permanently stored in Git history.

#### Your Task
Use the terminal to add your changes. We want to add all modified/untracked files (like \`index.html\` and \`style.css\`) to the staging area.

Run:
\`\`\`bash
git add .
\`\`\`
*(Alternatively, you can run \`git add index.html style.css\`)*

You will see files move visually from the **Working Directory** lane into the **Staging Area** lane!
        `,
        startingState: (state) => {
          state.initialized = true;
          state.workingDir['index.html'] = '<h1>Hello Git</h1>';
          state.workingDir['style.css'] = 'h1 { color: red; }';
          state.stagingArea = {};
          state.branches['main'] = '';
          state.head = 'main';
          return state;
        },
        checkPassed: (state) => {
          const stagedCount = Object.keys(state.stagingArea).length;
          if (stagedCount >= 2) {
            return { passed: true, message: 'Great job! Files have been staged.' };
          }
          return { passed: false, message: 'Please stage all changes using "git add ."' };
        }
      }
    ]
  },
  {
    id: 'ch-commit',
    title: '4. Committing History',
    description: 'Learn how to take snapshots of your staged code using git commit.',
    world: 'beginner',
    quests: [
      {
        id: 'q-git-commit',
        title: 'Your First Commit',
        type: 'mission',
        xp: 100,
        coins: 30,
        description: 'Permanently record your staged modifications into the commit tree.',
        instructions: `
### Recording Changes: git commit

Committing is like saving a progress snapshot in a video game. Once committed, you can always revert back to this exact moment in your code history.

Every commit needs a **commit message** that explains *why* the changes were made.

#### Your Task
Stage your files and make your first commit with the message \`"Initial commit"\`.

Run:
\`\`\`bash
git add .
git commit -m "Initial commit"
\`\`\`

Watch as the staged files transform into an interactive node on the **Commit Graph**!
        `,
        startingState: (state) => {
          state.initialized = true;
          state.workingDir['index.html'] = '<h1>Hello Git</h1>';
          state.workingDir['style.css'] = 'h1 { color: red; }';
          state.stagingArea = {};
          state.commits = {};
          state.branches['main'] = '';
          state.head = 'main';
          return state;
        },
        checkPassed: (state) => {
          const commits = Object.values(state.commits);
          if (commits.length > 0) {
            const hasInitial = commits.some(c => c.message.toLowerCase().includes('initial') || c.message.toLowerCase().includes('commit'));
            if (hasInitial) {
              return { passed: true, message: 'Fantastic! You created your first Git commit.' };
            }
          }
          return { passed: false, message: 'Please commit your changes using `git commit -m "Initial commit"`' };
        }
      }
    ]
  },
  {
    id: 'ch-logs',
    title: '5. Checking History',
    description: 'Inspect the commit history to see who did what.',
    world: 'beginner',
    quests: [
      {
        id: 'q-git-log',
        title: 'Exploring Git Log',
        type: 'mission',
        xp: 80,
        coins: 20,
        description: 'List the repository commit logs.',
        instructions: `
### Inspecting the Timeline: git log

To view the history of commits in a repository, we use \`git log\`. It shows:
- The unique commit hash (a SHA-1 ID like \`a45f9e2...\`).
- The author of the changes.
- The date and time of creation.
- The commit message description.

#### Your Task
Execute the log command in the terminal to inspect the commit history:

\`\`\`bash
git log
\`\`\`
        `,
        startingState: (state) => {
          state.initialized = true;
          const cHash = 'a4d5e23';
          state.commits[cHash] = {
            hash: cHash,
            message: 'First setup',
            parents: [],
            tree: { 'index.html': '<h1>Setup</h1>' },
            timestamp: Date.now() - 360000
          };
          state.branches['main'] = cHash;
          state.head = 'main';
          state.workingDir = { 'index.html': '<h1>Setup</h1>' };
          return state;
        },
        checkPassed: (_state, history) => {
          const ranLog = history.some(cmd => cmd.trim() === 'git log');
          if (ranLog) {
            return { passed: true, message: 'Well done! You inspected the project timeline.' };
          }
          return { passed: false, message: 'Run "git log" in the terminal to list commits.' };
        }
      }
    ]
  },
  {
    id: 'ch-boss-beginner',
    title: '6. Beginner Boss Fight',
    description: 'Face the Guard of Version Control in a full workflow challenge!',
    world: 'beginner',
    quests: [
      {
        id: 'q-boss-beginner',
        title: 'Boss Battle: The Guard of VCS',
        type: 'boss',
        xp: 250,
        coins: 100,
        description: 'Perform a full sequence: Initialize, create files, stage, commit, and inspect logs.',
        instructions: `
### ⚔️ BOSS BATTLE: The Guard of VCS ⚔️

Welcome to your first Boss Fight! To defeat the guard, you must execute a correct sequence of repository operations from scratch.

#### Your Tasks:
1. Initialize a new Git repository.
2. In the mock text editor (top center), make a modification to \`index.html\` or create a new file named \`script.js\` in the working directory.
3. Stage all your changes.
4. Commit the changes with the message \`"Boss defeated"\`.
5. Run \`git log\` to verify your success!

Show the guard what you have learned!
        `,
        startingState: () => {
          // Reset to completely empty, uninitialized state
          return {
            initialized: false,
            workingDir: {},
            stagingArea: {},
            commits: {},
            branches: {},
            head: '',
            tags: {},
            remote: null,
            mergeState: null,
            stash: []
          };
        },
        checkPassed: (state, history) => {
          if (!state.initialized) {
            return { passed: false, message: 'You must first initialize the repository with "git init"' };
          }
          
          const commits = Object.values(state.commits);
          if (commits.length === 0) {
            return { passed: false, message: 'You need to create a commit containing your modifications!' };
          }
          
          const hasBossMsg = commits.some(c => c.message.toLowerCase().includes('boss') || c.message.toLowerCase().includes('defeated'));
          if (!hasBossMsg) {
            return { passed: false, message: 'Your commit message must be "Boss defeated" (or contain "boss" / "defeated")' };
          }

          const ranLog = history.some(cmd => cmd.trim() === 'git log');
          if (!ranLog) {
            return { passed: false, message: 'Make sure to run "git log" as the final step of the ritual!' };
          }

          return { passed: true, message: '👑 VICTORY! The VCS Guard has been defeated. You earned 250 XP!' };
        }
      }
    ]
  },

  // ==================== INTERMEDIATE WORLD ====================
  {
    id: 'ch-branches',
    title: '7. Git Branching',
    description: 'Learn branching concepts to work on parallel features.',
    world: 'intermediate',
    quests: [
      {
        id: 'q-git-branch-create',
        title: 'Creating Branches',
        type: 'mission',
        xp: 90,
        coins: 25,
        description: 'Create a new feature branch pointer.',
        instructions: `
### Why Branching?
Branches allow developers to work on new features, bugs, or experiments in an isolated bubble. The default branch is usually named \`main\` or \`master\`. Creating a branch builds a pointer that references the current commit you are on.

#### Your Task
Create a new branch named \`feature-login\`.

Run:
\`\`\`bash
git branch feature-login
\`\`\`

Watch as a new branch label points to your current commit!
        `,
        startingState: (state) => {
          state.initialized = true;
          const h = 'b1029c8';
          state.commits[h] = {
            hash: h,
            message: 'Main page layout',
            parents: [],
            tree: { 'index.html': '<h1>Home</h1>' },
            timestamp: Date.now()
          };
          state.branches = { 'main': h };
          state.head = 'main';
          state.workingDir = { 'index.html': '<h1>Home</h1>' };
          return state;
        },
        checkPassed: (state) => {
          if (state.branches['feature-login'] !== undefined) {
            return { passed: true, message: 'Success! You created the branch feature-login.' };
          }
          return { passed: false, message: 'Run "git branch feature-login" to create the branch.' };
        }
      }
    ]
  },
  {
    id: 'ch-checkout',
    title: '8. Switching Branches',
    description: 'Switch HEAD to active branches or direct commits.',
    world: 'intermediate',
    quests: [
      {
        id: 'q-git-checkout-branch',
        title: 'Switching Branches',
        type: 'mission',
        xp: 90,
        coins: 25,
        description: 'Navigate HEAD to your new branch.',
        instructions: `
### Navigating Branches: git checkout
Creating a branch just draws a pointer. To actually move your cursor (HEAD) onto that branch, you must check it out. Switching branches updates your Working Directory files to match the tree saved in that branch's latest commit.

#### Your Task
Switch to the branch \`feature-login\`.

Run:
\`\`\`bash
git checkout feature-login
\`\`\`

Or use the shortcut to create and switch in one command:
\`\`\`bash
git checkout -b feature-login
\`\`\`
        `,
        startingState: (state) => {
          state.initialized = true;
          const h = 'b1029c8';
          state.commits[h] = {
            hash: h,
            message: 'Main page layout',
            parents: [],
            tree: { 'index.html': '<h1>Home</h1>' },
            timestamp: Date.now()
          };
          state.branches = { 'main': h, 'feature-login': h };
          state.head = 'main';
          return state;
        },
        checkPassed: (state) => {
          if (state.head === 'feature-login') {
            return { passed: true, message: 'Great! You have switched to feature-login.' };
          }
          return { passed: false, message: 'Run "git checkout feature-login" to complete the mission.' };
        }
      }
    ]
  },
  {
    id: 'ch-merge',
    title: '9. Merging Branches',
    description: 'Combine work from feature branches back into main.',
    world: 'intermediate',
    quests: [
      {
        id: 'q-git-merge-ff',
        title: 'Fast-Forward Merges',
        type: 'mission',
        xp: 100,
        coins: 30,
        description: 'Integrate the feature branch back into main.',
        instructions: `
### Integrating History: git merge

Once a feature is completed on a separate branch, we merge it back into the main branch. 
If the main branch has *not* diverged (no commits made since branching), Git performs a **Fast-Forward** merge, which simply slides the main pointer up to the feature commit.

#### Your Task
We are currently on \`feature-login\`, which is one commit *ahead* of \`main\`. We need to switch back to \`main\` and merge \`feature-login\` into it.

Run:
\`\`\`bash
git checkout main
git merge feature-login
\`\`\`
        `,
        startingState: (state) => {
          state.initialized = true;
          const c1 = 'c111111';
          const c2 = 'c222222';
          
          state.commits[c1] = {
            hash: c1,
            message: 'Main layout',
            parents: [],
            tree: { 'index.html': '<h1>Home</h1>' },
            timestamp: Date.now() - 60000
          };
          state.commits[c2] = {
            hash: c2,
            message: 'Add login panel',
            parents: [c1],
            tree: { 'index.html': '<h1>Home</h1>', 'login.html': '<form></form>' },
            timestamp: Date.now()
          };

          state.branches = {
            'main': c1,
            'feature-login': c2
          };
          state.head = 'feature-login';
          state.workingDir = { 'index.html': '<h1>Home</h1>', 'login.html': '<form></form>' };
          return state;
        },
        checkPassed: (state) => {
          if (state.head === 'main' && state.branches['main'] === 'c222222') {
            return { passed: true, message: 'Fast-forward merge successful! main is now up-to-date.' };
          }
          return { passed: false, message: 'Ensure you checkout to "main" and run "git merge feature-login"' };
        }
      }
    ]
  },
  {
    id: 'ch-remote',
    title: '10. Remote Repositories',
    description: 'Learn how to publish code to remote platforms like GitHub.',
    world: 'intermediate',
    quests: [
      {
        id: 'q-git-remote',
        title: 'Publishing to GitHub',
        type: 'mission',
        xp: 100,
        coins: 30,
        description: 'Add a remote destination and push your commits.',
        instructions: `
### Linking with GitHub: git remote & git push

GitHub hosts Git repositories online. To link your local project to a GitHub repository, you add a **remote reference** (usually named \`origin\`). 
To upload your local commits to that remote, you use \`git push\`.

#### Your Task
1. Add a remote location named \`origin\` using URL \`https://github.com/student/gitquest.git\`.
2. Push your main branch commits to the remote.

Commands to run:
\`\`\`bash
git remote add origin https://github.com/student/gitquest.git
git push origin main
\`\`\`
        `,
        startingState: (state) => {
          state.initialized = true;
          const hash = 'a2b3c4d';
          state.commits[hash] = {
            hash,
            message: 'Stable v1',
            parents: [],
            tree: { 'index.html': '<h1>Hello World</h1>' },
            timestamp: Date.now()
          };
          state.branches = { 'main': hash };
          state.head = 'main';
          state.remote = null;
          return state;
        },
        checkPassed: (state) => {
          if (!state.remote) {
            return { passed: false, message: 'You must add a remote repository with "git remote add origin ..."' };
          }
          if (state.remote.branches['main'] === state.branches['main'] && state.remote.branches['main'] !== '') {
            return { passed: true, message: 'Awesome! Pushed local main branch to remote GitHub repository.' };
          }
          return { passed: false, message: 'Run "git push origin main" to sync your commits to the remote!' };
        }
      }
    ]
  },
  {
    id: 'ch-boss-intermediate',
    title: '11. Intermediate Boss Fight',
    description: 'Face the Branch Wizard in a conflict-resolution duel!',
    world: 'intermediate',
    quests: [
      {
        id: 'q-boss-intermediate',
        title: 'Boss Battle: The Merge Wizard',
        type: 'boss',
        xp: 350,
        coins: 150,
        description: 'Merge a feature branch, resolve a file conflict, and push details to remote.',
        instructions: `
### 🧙‍♂️ BOSS BATTLE: The Merge Wizard 🧙‍♂️

The Merge Wizard has disrupted the git streams, causing a **Merge Conflict**! You must align the codebases manually.

Your current status:
- You are on branch \`main\`.
- There is a branch named \`feature-layout\`. Both branches modified \`index.html\` differently since their split.

#### Your Tasks:
1. Merge the \`feature-layout\` branch into \`main\`. You will receive a conflict warning.
2. Open the mock editor on \`index.html\`, delete the conflict markers (\`<<<<<<\`, \`=======\`, \`>>>>>>>\`), and merge the text to look like:
\`\`\`html
<h1>Welcome to GitQuest Dashboard</h1>
\`\`\`
3. Stage the resolved \`index.html\`.
4. Commit with the message \`"Resolved merge conflict"\`.
5. Push the branch to the remote origin: \`git push origin main\`.

Defeat the conflict wizard!
        `,
        startingState: (state) => {
          state.initialized = true;
          const cBase = 'cbase77';
          const cMain = 'cmain88';
          const cFeat = 'cfeat99';

          state.commits[cBase] = {
            hash: cBase,
            message: 'Base commit',
            parents: [],
            tree: { 'index.html': '<h1>Welcome</h1>' },
            timestamp: Date.now() - 120000
          };

          state.commits[cMain] = {
            hash: cMain,
            message: 'Update main header',
            parents: [cBase],
            tree: { 'index.html': '<h1>Welcome to GitQuest</h1>' },
            timestamp: Date.now() - 60000
          };

          state.commits[cFeat] = {
            hash: cFeat,
            message: 'Update feature header',
            parents: [cBase],
            tree: { 'index.html': '<h1>Welcome to Dashboard</h1>' },
            timestamp: Date.now() - 30000
          };

          state.branches = {
            'main': cMain,
            'feature-layout': cFeat
          };
          state.head = 'main';
          state.workingDir = { 'index.html': '<h1>Welcome to GitQuest</h1>' };
          
          state.remote = {
            url: 'https://github.com/student/boss.git',
            commits: { [cBase]: state.commits[cBase] },
            branches: { 'main': cBase },
            head: 'main'
          };
          state.mergeState = null;

          return state;
        },
        checkPassed: (state) => {
          // 1. Check if merge state is resolved
          if (state.mergeState !== null) {
            return { passed: false, message: 'A merge conflict is still active. Resolve conflict in index.html, stage, and commit.' };
          }

          // 2. Check if main branch has a new commit
          const mainHash = state.branches['main'];
          if (mainHash === 'cmain88') {
            return { passed: false, message: 'You have not merged the branch or committed the resolution.' };
          }

          const headCommit = state.commits[mainHash];
          if (!headCommit || headCommit.parents.length < 2) {
            return { passed: false, message: 'Please merge the branch properly so that the new commit has both main and feature-layout as parents.' };
          }

          // 3. Check conflict resolved content
          const fileContent = headCommit.tree['index.html'] || '';
          if (fileContent.includes('<<<<<') || fileContent.includes('=====')) {
            return { passed: false, message: 'Conflict markers are still in index.html! Edit the file to remove them.' };
          }

          if (!fileContent.includes('Welcome to GitQuest Dashboard')) {
            return { passed: false, message: 'Make sure your resolved index.html content matches "<h1>Welcome to GitQuest Dashboard</h1>"' };
          }

          // 4. Check if pushed to remote
          if (!state.remote || state.remote.branches['main'] !== mainHash) {
            return { passed: false, message: 'Resolve conflict successfully, then run "git push origin main" to finish the boss battle!' };
          }

          return { passed: true, message: '🏆 AMAZING! The Merge Wizard has been subdued. Git flows are restored.' };
        }
      }
    ]
  },

  // ==================== ADVANCED WORLD ====================
  {
    id: 'ch-undoing',
    title: '12. Undoing Changes',
    description: 'Learn how to reset or revert commits in git history.',
    world: 'advanced',
    quests: [
      {
        id: 'q-git-reset',
        title: 'Hard Resetting Commits',
        type: 'mission',
        xp: 120,
        coins: 40,
        description: 'Destroy recent commits and restore state using git reset --hard.',
        instructions: `
### Rewinding History: git reset

If you made a bad commit or want to roll back your repository status completely, you can use \`git reset\`.
- \`git reset --soft <commit>\`: Moves the HEAD pointer to target commit, keeping files modified in your Staging/Working directory.
- \`git reset --hard <commit>\`: Moves HEAD, clears Staging, and **overwrites** all local file changes.

#### Your Task
We have a bad commit \`cbad999\` at the top of our main history. We need to do a hard reset to the stable commit \`cgood55\`.

Run:
\`\`\`bash
git reset --hard cgood55
\`\`\`
        `,
        startingState: (state) => {
          state.initialized = true;
          const c1 = 'cgood55';
          const c2 = 'cbad999';

          state.commits[c1] = {
            hash: c1,
            message: 'Stable version',
            parents: [],
            tree: { 'index.html': '<h1>Stable</h1>' },
            timestamp: Date.now() - 50000
          };
          state.commits[c2] = {
            hash: c2,
            message: 'Added buggy code',
            parents: [c1],
            tree: { 'index.html': '<h1>Stable</h1><h1>Buggy</h1>' },
            timestamp: Date.now()
          };

          state.branches = { 'main': c2 };
          state.head = 'main';
          state.workingDir = { 'index.html': '<h1>Stable</h1><h1>Buggy</h1>' };
          return state;
        },
        checkPassed: (state) => {
          if (state.branches['main'] === 'cgood55' && Object.keys(state.stagingArea).length === 0 && state.workingDir['index.html'] === '<h1>Stable</h1>') {
            return { passed: true, message: 'Success! You rewound the repository to the stable commit.' };
          }
          return { passed: false, message: 'Perform a hard reset to "cgood55" using "git reset --hard cgood55".' };
        }
      }
    ]
  },
  {
    id: 'ch-stash',
    title: '13. Stashing Progress',
    description: 'Save dirty work-in-progress modifications without committing.',
    world: 'advanced',
    quests: [
      {
        id: 'q-git-stash',
        title: 'Stashing and Popping',
        type: 'mission',
        xp: 110,
        coins: 35,
        description: 'Stash changes, inspect clean tree, and pop them back.',
        instructions: `
### Temporary Storage: git stash

Imagine working on a new feature, but a critical bug appears on production. You aren't ready to commit your half-finished feature yet.
\`git stash\` saves your dirty Working Directory changes on a temporary clipboard and resets the working tree to the current HEAD commit.
Later, when you are ready, run \`git stash pop\` to re-apply the changes.

#### Your Task
1. Stash your current changes: \`git stash\`
2. Check the status: \`git status\` (shows clean)
3. Restore your stashed changes: \`git stash pop\`
        `,
        startingState: (state) => {
          state.initialized = true;
          const h = 'h111222';
          state.commits[h] = {
            hash: h,
            message: 'Initial page',
            parents: [],
            tree: { 'index.html': '<h1>Page</h1>' },
            timestamp: Date.now()
          };
          state.branches = { 'main': h };
          state.head = 'main';
          state.workingDir = { 'index.html': '<h1>Page</h1>\n<h2>WIP details...</h2>' };
          state.stash = [];
          return state;
        },
        checkPassed: (state, history) => {
          const ranStash = history.some(c => c.trim() === 'git stash');
          const ranPop = history.some(c => c.trim() === 'git stash pop');

          if (ranStash && ranPop && state.workingDir['index.html'].includes('WIP details')) {
            return { passed: true, message: 'Excellent! You successfully stashed and popped your edits.' };
          }
          return { passed: false, message: 'Please run "git stash" and then "git stash pop" to complete the cycle.' };
        }
      }
    ]
  },
  {
    id: 'ch-boss-advanced',
    title: '14. Advanced Boss Fight',
    description: 'Defeat the Git Master in the ultimate repository test!',
    world: 'advanced',
    quests: [
      {
        id: 'q-boss-advanced',
        title: 'Boss Battle: The Git Overlord',
        type: 'boss',
        xp: 500,
        coins: 200,
        description: 'Perform stashing, hard resetting, and reverting to fully master Git operations.',
        instructions: `
### 👹 BOSS BATTLE: The Git Overlord 👹

This is it! The Git Overlord has corrupted the master branch logs. You must perform precise operations to align the timeline.

Current repository status:
- You have uncommitted, experimental work in \`index.html\`.
- The branch pointer is currently on a corrupted commit \`cbad999\`.
- The target stable commit is \`cgood11\`.

#### Your Tasks:
1. Save your experimental changes using \`git stash\`.
2. Perform a hard reset to the clean, stable commit: \`git reset --hard cgood11\`.
3. Pop your stashed changes back into the working directory: \`git stash pop\`.
4. Stage the files and commit with the message \`"Overlord defeated"\`.

Verify the command flow and save the repository!
        `,
        startingState: (state) => {
          state.initialized = true;
          const c1 = 'cgood11';
          const c2 = 'cbad999';

          state.commits[c1] = {
            hash: c1,
            message: 'Stable foundation',
            parents: [],
            tree: { 'index.html': '<h1>Base System</h1>' },
            timestamp: Date.now() - 100000
          };
          state.commits[c2] = {
            hash: c2,
            message: 'Corrupted registry file',
            parents: [c1],
            tree: { 'index.html': '<h1>Base System</h1>\n<h1>Corrupt</h1>' },
            timestamp: Date.now() - 50000
          };

          state.branches = { 'main': c2 };
          state.head = 'main';
          // Dirty workspace containing the experimental features
          state.workingDir = { 'index.html': '<h1>Base System</h1>\n<h1>Corrupt</h1>\n<h2>Experimental Laser</h2>' };
          state.stagingArea = {};
          state.stash = [];

          return state;
        },
        checkPassed: (state, history) => {
          // Check if stash was used
          const usedStash = history.some(c => c.trim() === 'git stash');
          const poppedStash = history.some(c => c.trim() === 'git stash pop');
          const resetHard = history.some(c => c.trim() === 'git reset --hard cgood11');

          if (!usedStash) {
            return { passed: false, message: 'You must stash your experimental changes before resetting, or they will be deleted!' };
          }
          if (!resetHard) {
            return { passed: false, message: 'Perform a hard reset to the stable commit "cgood11".' };
          }
          if (!poppedStash) {
            return { passed: false, message: 'Restore your experimental work in progress using "git stash pop".' };
          }

          // Check final commit
          const mainHash = state.branches['main'];
          if (mainHash === 'cgood11' || mainHash === 'cbad999') {
            return { passed: false, message: 'You need to commit your changes after pop!' };
          }

          const headCommit = state.commits[mainHash];
          if (!headCommit || !headCommit.message.toLowerCase().includes('overlord') && !headCommit.message.toLowerCase().includes('defeated')) {
            return { passed: false, message: 'Commit your restored changes with the message "Overlord defeated"' };
          }

          // Check if the experimental features are preserved in the commit
          const indexContent = headCommit.tree['index.html'] || '';
          if (!indexContent.includes('Experimental Laser')) {
            return { passed: false, message: 'The experimental content was lost! Make sure you pop the stash before committing.' };
          }
          if (indexContent.includes('Corrupt')) {
            return { passed: false, message: 'The corrupt code is still present! The hard reset to cgood11 should have cleaned it out.' };
          }

          return { passed: true, message: '👑 IMMORTAL VICTORY! The Git Overlord has been banished. You have completed the GitQuest!' };
        }
      }
    ]
  }
];
