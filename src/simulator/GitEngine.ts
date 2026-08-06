export interface GitCommit {
  hash: string;
  message: string;
  parents: string[];
  tree: Record<string, string>; // filename -> content
  timestamp: number;
}

export interface GitRepoState {
  initialized: boolean;
  workingDir: Record<string, string>; // filename -> content
  stagingArea: Record<string, string>; // filename -> content
  commits: Record<string, GitCommit>; // hash -> commit
  branches: Record<string, string>; // branchName -> commitHash
  head: string; // branch name (e.g. 'main') or commit hash
  tags: Record<string, string>; // tagName -> commitHash
  remote: {
    url: string | null;
    commits: Record<string, GitCommit>;
    branches: Record<string, string>;
    head: string;
  } | null;
  mergeState: {
    targetBranch: string;
    conflicts: string[];
  } | null;
  stash: {
    workingDir: Record<string, string>;
    stagingArea: Record<string, string>;
  }[];
}

export interface CommandResult {
  output: string;
  error: boolean;
  state: GitRepoState;
}

export class GitEngine {
  private state: GitRepoState;

  constructor(initialState?: GitRepoState) {
    if (initialState) {
      this.state = JSON.parse(JSON.stringify(initialState));
    } else {
      this.state = this.getEmptyState();
    }
  }

  public getEmptyState(): GitRepoState {
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
  }

  public getState(): GitRepoState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Helper to generate mock hash
   */
  private generateHash(): string {
    return Math.random().toString(16).substring(2, 9);
  }

  /**
   * Helper to get current commit hash of HEAD
   */
  private getHeadCommitHash(): string | null {
    if (!this.state.initialized) return null;
    const ref = this.state.head;
    if (this.state.branches[ref]) {
      return this.state.branches[ref];
    }
    // Might be direct hash (detached HEAD)
    if (this.state.commits[ref]) {
      return ref;
    }
    return null;
  }

  /**
   * Set file content in Working Directory manually (via mock editor)
   */
  public updateFile(filename: string, content: string): GitRepoState {
    if (!this.state.initialized) {
      // Allow modifications even if not initialized, but typically init is first
    }
    this.state.workingDir[filename] = content;
    return this.getState();
  }

  /**
   * Delete a file from Working Directory
   */
  public deleteFile(filename: string): GitRepoState {
    delete this.state.workingDir[filename];
    return this.getState();
  }

  /**
   * Run a Git command
   */
  public execute(commandStr: string): CommandResult {
    const trimmed = commandStr.trim();
    if (!trimmed) {
      return { output: '', error: false, state: this.getState() };
    }

    if (!trimmed.startsWith('git ')) {
      return {
        output: `gitquest: command not found: '${trimmed.split(' ')[0]}'. Did you mean to prefix with 'git'?`,
        error: true,
        state: this.getState()
      };
    }

    const args = trimmed.split(/\s+/).slice(1);
    const subCommand = args[0];

    if (!subCommand) {
      return {
        output: 'git: command usage: git <command> [<args>]',
        error: true,
        state: this.getState()
      };
    }

    // Git Init is the only command allowed when not initialized
    if (!this.state.initialized && subCommand !== 'init') {
      return {
        output: 'fatal: not a git repository (or any of the parent directories): .git',
        error: true,
        state: this.getState()
      };
    }

    switch (subCommand) {
      case 'init':
        return this.gitInit();
      case 'status':
        return this.gitStatus();
      case 'add':
        return this.gitAdd(args.slice(1));
      case 'commit':
        return this.gitCommit(args.slice(1));
      case 'branch':
        return this.gitBranch(args.slice(1));
      case 'checkout':
        return this.gitCheckout(args.slice(1));
      case 'log':
        return this.gitLog();
      case 'merge':
        return this.gitMerge(args.slice(1));
      case 'remote':
        return this.gitRemote(args.slice(1));
      case 'push':
        return this.gitPush(args.slice(1));
      case 'pull':
        return this.gitPull(args.slice(1));
      case 'fetch':
        return this.gitFetch();
      case 'stash':
        return this.gitStash(args.slice(1));
      case 'reset':
        return this.gitReset(args.slice(1));
      case 'revert':
        return this.gitRevert(args.slice(1));
      default:
        return {
          output: `git: '${subCommand}' is not a git command. See 'git --help'.`,
          error: true,
          state: this.getState()
        };
    }
  }

  // --- GIT INIT ---
  private gitInit(): CommandResult {
    if (this.state.initialized) {
      return {
        output: 'Reinitialized existing Git repository in /workspace/.git/',
        error: false,
        state: this.getState()
      };
    }

    this.state.initialized = true;
    this.state.branches['main'] = '';
    this.state.head = 'main';
    // Pre-populate some starter files for the student
    this.state.workingDir['index.html'] = '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Welcome to GitQuest!</h1>\n</body>\n</html>';
    this.state.workingDir['style.css'] = 'body {\n  background: #000;\n  color: #fff;\n}';

    return {
      output: 'Initialized empty Git repository in /workspace/.git/',
      error: false,
      state: this.getState()
    };
  }

  // --- GIT STATUS ---
  private gitStatus(): CommandResult {
    const headHash = this.getHeadCommitHash();
    const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    
    let output = '';
    if (activeBranchName) {
      output += `On branch ${activeBranchName}\n`;
    } else {
      output += `HEAD detached at ${this.state.head}\n`;
    }

    if (this.state.mergeState) {
      output += `You have unmerged paths.\n  (fix conflicts and run "git commit")\n  (use "git merge --abort" to abort the merge)\n\n`;
    }

    // Compare workingDir vs stagingArea vs current HEAD commit
    const headCommit = headHash ? this.state.commits[headHash] : null;
    const headTree = headCommit ? headCommit.tree : {};

    const stagedChanges: string[] = [];
    const unstagedChanges: string[] = [];
    const untrackedFiles: string[] = [];

    // All files in workingDir
    const allFiles = new Set([
      ...Object.keys(this.state.workingDir),
      ...Object.keys(this.state.stagingArea),
      ...Object.keys(headTree)
    ]);

    for (const file of allFiles) {
      const workingContent = this.state.workingDir[file];
      const stagedContent = this.state.stagingArea[file];
      const headContent = headTree[file];

      // Check staging status
      if (stagedContent !== undefined) {
        // It's in staging
        if (headContent === undefined) {
          stagedChanges.push(`new file:   ${file}`);
        } else if (stagedContent !== headContent) {
          stagedChanges.push(`modified:   ${file}`);
        } else {
          // Staged matches HEAD. Has working dir modified since then?
          if (workingContent === undefined) {
            unstagedChanges.push(`deleted:    ${file}`);
          } else if (workingContent !== stagedContent) {
            unstagedChanges.push(`modified:   ${file}`);
          }
        }
      } else {
        // Not currently staged
        if (workingContent !== undefined) {
          if (headContent === undefined) {
            untrackedFiles.push(file);
          } else if (workingContent !== headContent) {
            unstagedChanges.push(`modified:   ${file}`);
          }
        } else {
          // Deleted in working dir, and not staged for deletion
          if (headContent !== undefined) {
            unstagedChanges.push(`deleted:    ${file}`);
          }
        }
      }
    }

    // Format output
    if (stagedChanges.length > 0) {
      output += `Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n`;
      stagedChanges.forEach(change => {
        output += `\t\x1b[32m${change}\x1b[0m\n`; // Green text
      });
      output += `\n`;
    }

    if (unstagedChanges.length > 0) {
      output += `Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n`;
      unstagedChanges.forEach(change => {
        output += `\t\x1b[31m${change}\x1b[0m\n`; // Red text
      });
      output += `\n`;
    }

    if (untrackedFiles.length > 0) {
      output += `Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n`;
      untrackedFiles.forEach(file => {
        output += `\t\x1b[31m${file}\x1b[0m\n`; // Red text
      });
      output += `\n`;
    }

    if (stagedChanges.length === 0 && unstagedChanges.length === 0 && untrackedFiles.length === 0) {
      output += `nothing to commit, working tree clean`;
    }

    return {
      output,
      error: false,
      state: this.getState()
    };
  }

  // --- GIT ADD ---
  private gitAdd(files: string[]): CommandResult {
    if (files.length === 0) {
      return {
        output: 'Nothing specified, nothing added.\nMaybe you wanted to say \'git add .\'?',
        error: true,
        state: this.getState()
      };
    }

    const headHash = this.getHeadCommitHash();
    const headCommit = headHash ? this.state.commits[headHash] : null;
    const headTree = headCommit ? headCommit.tree : {};

    const addFile = (file: string) => {
      if (this.state.workingDir[file] !== undefined) {
        this.state.stagingArea[file] = this.state.workingDir[file];
      } else {
        // File doesn't exist in working directory, check if it was deleted
        if (headTree[file] !== undefined) {
          // Staging a deletion
          delete this.state.stagingArea[file];
        }
      }
    };

    if (files[0] === '.' || files[0] === '-A' || files[0] === '--all') {
      // Add all changes
      // 1. Staging modifications and new files
      Object.keys(this.state.workingDir).forEach(file => addFile(file));
      // 2. Staging deletions
      Object.keys(headTree).forEach(file => {
        if (this.state.workingDir[file] === undefined) {
          delete this.state.stagingArea[file];
        }
      });
    } else {
      // Add specified files
      for (const file of files) {
        if (this.state.workingDir[file] === undefined && headTree[file] === undefined) {
          return {
            output: `fatal: pathspec '${file}' did not match any files`,
            error: true,
            state: this.getState()
          };
        }
        addFile(file);
      }
    }

    return {
      output: '',
      error: false,
      state: this.getState()
    };
  }

  // --- GIT COMMIT ---
  private gitCommit(args: string[]): CommandResult {
    // Parser for commit message: -m "message" or --message="message"
    let message = '';
    const mIndex = args.indexOf('-m');
    if (mIndex !== -1 && args[mIndex + 1]) {
      message = args[mIndex + 1].replace(/^["']|["']$/g, ''); // strip quotes
    } else {
      // Look for inline message like -m"message"
      const mInline = args.find(a => a.startsWith('-m'));
      if (mInline) {
        message = mInline.substring(2).replace(/^["']|["']$/g, '');
      } else {
        return {
          output: 'error: switch `m\' requires a value\nUse git commit -m "your message"',
          error: true,
          state: this.getState()
        };
      }
    }

    // Check if there's anything staged
    const headHash = this.getHeadCommitHash();
    const headCommit = headHash ? this.state.commits[headHash] : null;
    const headTree = headCommit ? headCommit.tree : {};

    // Compare staged vs head tree

    
    // Check if staging is empty and no deletions
    // Wait, stagingArea is a snapshot of all files staged to look like this
    // If it hasn't changed from head tree, nothing to commit
    const keysInStage = Object.keys(this.state.stagingArea);
    
    // Actually, in a simplified model:
    // StagingArea contains files that are "staged".
    // When we run "git add file", file content is saved into stagingArea.
    // If a file is deleted, we remove it from stagingArea but track that it's gone.
    // Let's assume stagingArea contains the EXACT snapshots of staged files.
    // Any file NOT in stagingArea but in headTree is either unchanged OR deleted.
    // Wait! A standard Git staging area contains the index of ALL tracked files.
    // In our gitStatus and gitAdd, when we add a file, it enters stagingArea.
    // So stagingArea holds the items to commit.
    // Let's check: does the combination of staged modifications make a difference?
    
    // Let's check changes:
    // Any item in stagingArea that is different from headTree, OR deleted items.
    const deletedFiles = Object.keys(headTree).filter(file => this.state.workingDir[file] === undefined && this.state.stagingArea[file] === undefined);
    
    let changesCount = deletedFiles.length;
    for (const key of keysInStage) {
      if (headTree[key] !== this.state.stagingArea[key]) {
        changesCount++;
      }
    }

    if (changesCount === 0 && !this.state.mergeState) {
      return {
        output: 'On branch ' + this.state.head + '\nnothing to commit, working tree clean',
        error: false,
        state: this.getState()
      };
    }

    // Create a new commit tree
    // File remains in new tree if it's in stagingArea, or if it wasn't staged but was in headTree (and not deleted in workingDir)
    const finalTree: Record<string, string> = {};
    
    // Add all unstaged files from headTree (which are not deleted)
    Object.keys(headTree).forEach(file => {
      if (this.state.stagingArea[file] === undefined) {
        // If file exists in working dir, preserve it
        if (this.state.workingDir[file] !== undefined) {
          finalTree[file] = headTree[file];
        }
      }
    });

    // Overwrite/add all staged files
    Object.keys(this.state.stagingArea).forEach(file => {
      finalTree[file] = this.state.stagingArea[file];
    });

    const newHash = this.generateHash();
    const parents = headHash ? [headHash] : [];
    
    // If we are in merge state, we add the target branch commit as a second parent
    if (this.state.mergeState) {
      const mergedHash = this.state.branches[this.state.mergeState.targetBranch];
      if (mergedHash && !parents.includes(mergedHash)) {
        parents.push(mergedHash);
      }
    }

    const newCommit: GitCommit = {
      hash: newHash,
      message,
      parents,
      tree: finalTree,
      timestamp: Date.now()
    };

    // Save commit
    this.state.commits[newHash] = newCommit;

    // Update active branch pointer or HEAD
    const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    if (activeBranchName) {
      this.state.branches[activeBranchName] = newHash;
    } else {
      // Detached head updates HEAD directly
      this.state.head = newHash;
    }

    // Clear staging area and merge state
    this.state.stagingArea = {};
    this.state.mergeState = null;

    // Output message
    const isInitial = parents.length === 0;
    const output = `[${activeBranchName || 'detached-HEAD'} ${isInitial ? '(root-commit) ' : ''}${newHash}] ${message}\n ${changesCount} file${changesCount === 1 ? '' : 's'} changed`;

    return {
      output,
      error: false,
      state: this.getState()
    };
  }

  // --- GIT BRANCH ---
  private gitBranch(args: string[]): CommandResult {
    if (args.length === 0) {
      // List branches
      let output = '';
      const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
      Object.keys(this.state.branches).forEach(bName => {
        if (bName === activeBranchName) {
          output += `* \x1b[32m${bName}\x1b[0m\n`; // green with asterisk
        } else {
          output += `  ${bName}\n`;
        }
      });
      return { output: output.trim(), error: false, state: this.getState() };
    }

    // Delete branch: -d <name>
    if (args[0] === '-d' || args[0] === '--delete') {
      const bToDelete = args[1];
      if (!bToDelete) {
        return { output: 'error: branch name required', error: true, state: this.getState() };
      }
      if (this.state.branches[bToDelete] === undefined) {
        return { output: `error: branch '${bToDelete}' not found.`, error: true, state: this.getState() };
      }
      if (this.state.head === bToDelete) {
        return { output: `error: Cannot delete branch '${bToDelete}' checked out at '${this.state.head}'`, error: true, state: this.getState() };
      }
      delete this.state.branches[bToDelete];
      return { output: `Deleted branch ${bToDelete} (was ${this.generateHash()}).`, error: false, state: this.getState() };
    }

    // Create branch
    const newBranchName = args[0];
    if (this.state.branches[newBranchName] !== undefined) {
      return { output: `fatal: A branch named '${newBranchName}' already exists.`, error: true, state: this.getState() };
    }

    const headHash = this.getHeadCommitHash() || '';
    this.state.branches[newBranchName] = headHash;

    return {
      output: '',
      error: false,
      state: this.getState()
    };
  }

  // --- GIT CHECKOUT ---
  private gitCheckout(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'error: branch name or commit hash required.', error: true, state: this.getState() };
    }

    // Checkout new branch shortcut: -b <name>
    if (args[0] === '-b') {
      const newBranchName = args[1];
      if (!newBranchName) {
        return { output: 'fatal: branch name required', error: true, state: this.getState() };
      }
      if (this.state.branches[newBranchName] !== undefined) {
        return { output: `fatal: A branch named '${newBranchName}' already exists.`, error: true, state: this.getState() };
      }
      const headHash = this.getHeadCommitHash() || '';
      this.state.branches[newBranchName] = headHash;
      this.state.head = newBranchName;
      return {
        output: `Switched to a new branch '${newBranchName}'`,
        error: false,
        state: this.getState()
      };
    }

    const target = args[0];

    // Check if target is branch
    if (this.state.branches[target] !== undefined) {
      this.state.head = target;
      
      // Update Working Directory to match the branch's commit tree
      const targetHash = this.state.branches[target];
      if (targetHash && this.state.commits[targetHash]) {
        this.state.workingDir = { ...this.state.commits[targetHash].tree };
      } else {
        // Brand new branch with no commits yet
        this.state.workingDir = {};
      }
      
      // Clear staging
      this.state.stagingArea = {};
      this.state.mergeState = null;

      return {
        output: `Switched to branch '${target}'`,
        error: false,
        state: this.getState()
      };
    }

    // Check if target is commit hash
    if (this.state.commits[target] !== undefined) {
      this.state.head = target; // detached HEAD
      this.state.workingDir = { ...this.state.commits[target].tree };
      this.state.stagingArea = {};
      this.state.mergeState = null;

      return {
        output: `Note: switching to '${target}'.\n\nYou are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them...`,
        error: false,
        state: this.getState()
      };
    }

    return {
      output: `error: pathspec '${target}' did not match any file(s) known to git`,
      error: true,
      state: this.getState()
    };
  }

  // --- GIT LOG ---
  private gitLog(): CommandResult {
    const headHash = this.getHeadCommitHash();
    if (!headHash) {
      return { output: 'fatal: your current branch does not have any commits yet', error: true, state: this.getState() };
    }

    let output = '';
    const visited = new Set<string>();
    const queue: string[] = [headHash];

    // Simple BFS/DFS traversal of history to construct a log
    while (queue.length > 0) {
      const currentHash = queue.shift()!;
      if (visited.has(currentHash)) continue;
      visited.add(currentHash);

      const commit = this.state.commits[currentHash];
      if (commit) {
        // Check branches pointing to this commit
        const pointingRefs: string[] = [];
        Object.keys(this.state.branches).forEach(bName => {
          if (this.state.branches[bName] === currentHash) {
            if (this.state.head === bName) {
              pointingRefs.push(`\x1b[36mHEAD -> \x1b[32m${bName}\x1b[0m`);
            } else {
              pointingRefs.push(`\x1b[32m${bName}\x1b[0m`);
            }
          }
        });

        // Detached head check
        if (this.state.head === currentHash) {
          pointingRefs.push(`\x1b[36mHEAD\x1b[0m`);
        }

        const refsStr = pointingRefs.length > 0 ? ` (${pointingRefs.join(', ')})` : '';

        output += `\x1b[33mcommit ${commit.hash}\x1b[0m${refsStr}\n`;
        output += `Author: GitQuest Student <student@gitquest.dev>\n`;
        output += `Date:   ${new Date(commit.timestamp).toUTCString()}\n\n`;
        output += `    ${commit.message}\n\n`;

        commit.parents.forEach(pHash => {
          if (!visited.has(pHash)) {
            queue.push(pHash);
          }
        });
      }
    }

    return {
      output: output.trim(),
      error: false,
      state: this.getState()
    };
  }

  // --- GIT MERGE ---
  private gitMerge(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'fatal: select branch to merge.', error: true, state: this.getState() };
    }

    if (this.state.mergeState) {
      if (args[0] === '--abort') {
        this.state.mergeState = null;
        // Restore working dir to current HEAD commit
        const headHash = this.getHeadCommitHash();
        if (headHash && this.state.commits[headHash]) {
          this.state.workingDir = { ...this.state.commits[headHash].tree };
        }
        this.state.stagingArea = {};
        return { output: 'Merge aborted.', error: false, state: this.getState() };
      }
      return { output: 'error: merge is already in progress. Resolve conflicts or run git merge --abort.', error: true, state: this.getState() };
    }

    const targetBranch = args[0];
    if (this.state.branches[targetBranch] === undefined) {
      return { output: `merge: ${targetBranch} - not something we can merge`, error: true, state: this.getState() };
    }

    const currentBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    if (!currentBranchName) {
      return { output: 'fatal: You are in detached HEAD state. Cannot merge.', error: true, state: this.getState() };
    }

    const headHash = this.state.branches[currentBranchName];
    const targetHash = this.state.branches[targetBranch];

    if (headHash === targetHash) {
      return { output: 'Already up to date.', error: false, state: this.getState() };
    }

    if (!headHash) {
      // Current branch is empty, fast-forward directly
      this.state.branches[currentBranchName] = targetHash;
      if (this.state.commits[targetHash]) {
        this.state.workingDir = { ...this.state.commits[targetHash].tree };
      }
      return { output: `Fast-forward: merged branch '${targetBranch}'`, error: false, state: this.getState() };
    }

    // Find common ancestor (simple BFS)
    const findAncestor = (c1: string, c2: string): string | null => {
      const getHistory = (start: string): Set<string> => {
        const visited = new Set<string>();
        const queue = [start];
        while (queue.length > 0) {
          const curr = queue.shift()!;
          if (!visited.has(curr)) {
            visited.add(curr);
            const c = this.state.commits[curr];
            if (c) queue.push(...c.parents);
          }
        }
        return visited;
      };

      const history1 = getHistory(c1);
      
      // BFS from c2 to find first intersection in history1
      const queue = [c2];
      const visited = new Set<string>();
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (history1.has(curr)) {
          return curr; // nearest common ancestor
        }
        if (!visited.has(curr)) {
          visited.add(curr);
          const c = this.state.commits[curr];
          if (c) queue.push(...c.parents);
        }
      }
      return null;
    };

    const ancestorHash = findAncestor(headHash, targetHash);

    // Fast-Forward check: if ancestorHash is headHash, targetHash is ahead of headHash
    if (ancestorHash === headHash) {
      this.state.branches[currentBranchName] = targetHash;
      this.state.workingDir = { ...this.state.commits[targetHash].tree };
      return {
        output: `Updating ${headHash.substring(0,7)}..${targetHash.substring(0,7)}\nFast-forward`,
        error: false,
        state: this.getState()
      };
    }

    // 3-Way Merge simulation
    const ancestorTree = ancestorHash ? this.state.commits[ancestorHash].tree : {};
    const headTree = this.state.commits[headHash].tree;
    const targetTree = this.state.commits[targetHash].tree;

    const conflicts: string[] = [];
    const mergedTree: Record<string, string> = { ...headTree };

    const allMergeFiles = new Set([...Object.keys(headTree), ...Object.keys(targetTree)]);

    allMergeFiles.forEach(file => {
      const base = ancestorTree[file];
      const ours = headTree[file];
      const theirs = targetTree[file];

      // Ours vs Theirs vs Base logic
      if (ours === theirs) {
        // Both match, no change or both made same change
        if (ours !== undefined) mergedTree[file] = ours;
      } else if (ours === base) {
        // We didn't change it, but they did
        if (theirs !== undefined) {
          mergedTree[file] = theirs;
        } else {
          delete mergedTree[file];
        }
      } else if (theirs === base) {
        // They didn't change it, but we did (keep ours)
        if (ours !== undefined) {
          mergedTree[file] = ours;
        } else {
          delete mergedTree[file];
        }
      } else {
        // Both changed it, and they differ -> MERGE CONFLICT!
        conflicts.push(file);
        const fileOurs = ours || '';
        const fileTheirs = theirs || '';
        mergedTree[file] = `<<<<<<< HEAD\n${fileOurs}\n=======\n${fileTheirs}\n>>>>>>> ${targetBranch}`;
      }
    });

    // Update working directory and staging
    this.state.workingDir = { ...mergedTree };

    if (conflicts.length > 0) {
      this.state.mergeState = {
        targetBranch,
        conflicts
      };
      // Staging contains the non-conflicting merges, conflicts are left to edit
      this.state.stagingArea = {};
      Object.keys(mergedTree).forEach(file => {
        if (!conflicts.includes(file)) {
          this.state.stagingArea[file] = mergedTree[file];
        }
      });

      return {
        output: `Auto-merging...\nCONFLICT (content): Merge conflict in files: ${conflicts.join(', ')}\nAutomatic merge failed; fix conflicts and then commit the result.`,
        error: false, // Git returns success code but warns about conflicts
        state: this.getState()
      };
    }

    // Auto merge commit if there are no conflicts
    const mergeHash = this.generateHash();
    const newCommit: GitCommit = {
      hash: mergeHash,
      message: `Merge branch '${targetBranch}' into ${currentBranchName}`,
      parents: [headHash, targetHash],
      tree: mergedTree,
      timestamp: Date.now()
    };

    this.state.commits[mergeHash] = newCommit;
    this.state.branches[currentBranchName] = mergeHash;
    this.state.stagingArea = {};

    return {
      output: `Merge made by the 'recursive' strategy.\nMerged branch '${targetBranch}'.`,
      error: false,
      state: this.getState()
    };
  }

  // --- GIT REMOTE ---
  private gitRemote(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: this.state.remote ? 'origin' : '',
        error: false,
        state: this.getState()
      };
    }

    if (args[0] === 'add') {
      const name = args[1];
      const url = args[2];
      if (!name || !url) {
        return { output: 'usage: git remote add <name> <url>', error: true, state: this.getState() };
      }

      this.state.remote = {
        url,
        commits: {},
        branches: { 'main': '' },
        head: 'main'
      };

      return { output: '', error: false, state: this.getState() };
    }

    if (args[0] === 'v' || args[0] === '-v') {
      if (this.state.remote) {
        return {
          output: `origin\t${this.state.remote.url} (fetch)\norigin\t${this.state.remote.url} (push)`,
          error: false,
          state: this.getState()
        };
      }
      return { output: '', error: false, state: this.getState() };
    }

    return { output: `error: unknown remote command`, error: true, state: this.getState() };
  }

  // --- GIT PUSH ---
  private gitPush(args: string[]): CommandResult {
    if (!this.state.remote) {
      return { output: 'fatal: No configured push destination.', error: true, state: this.getState() };
    }

    // Extract remote name and branch name
    const remoteName = args[0] || 'origin';
    const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    const branchName = args[1] || activeBranchName || 'main';

    const localCommitHash = this.state.branches[branchName];
    if (localCommitHash === undefined) {
      return { output: `error: src refspec ${branchName} does not match any`, error: true, state: this.getState() };
    }

    // Synchronize commits to remote database
    // Copy all commits in history of local branch to remote
    const visited = new Set<string>();
    const queue = [localCommitHash];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (!curr || visited.has(curr)) continue;
      visited.add(curr);

      const localC = this.state.commits[curr];
      if (localC) {
        // Send to remote
        this.state.remote.commits[curr] = JSON.parse(JSON.stringify(localC));
        queue.push(...localC.parents);
      }
    }

    this.state.remote.branches[branchName] = localCommitHash;

    return {
      output: `To ${this.state.remote.url}\n * [new branch]      ${branchName} -> ${branchName}\nBranch '${branchName}' set up to track remote branch '${branchName}' from '${remoteName}'.`,
      error: false,
      state: this.getState()
    };
  }

  // --- GIT FETCH ---
  private gitFetch(): CommandResult {
    if (!this.state.remote) {
      return { output: 'fatal: ' + 'No remote repository configured to fetch from', error: true, state: this.getState() };
    }

    // Pull all commits from remote to local database
    Object.keys(this.state.remote.commits).forEach(hash => {
      this.state.commits[hash] = JSON.parse(JSON.stringify(this.state.remote!.commits[hash]));
    });

    // Create remote references locally e.g. origin/main
    const output = `From ${this.state.remote.url}\n * [new branch]      main       -> origin/main`;

    return {
      output,
      error: false,
      state: this.getState()
    };
  }

  // --- GIT PULL ---
  private gitPull(args: string[]): CommandResult {
    if (!this.state.remote) {
      return { output: 'fatal: No remote repository configured to pull from', error: true, state: this.getState() };
    }

    // 1. Fetch
    this.gitFetch();

    // 2. Merge origin/main into current branch
    const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    if (!activeBranchName) {
      return { output: 'fatal: You are in detached HEAD state. Cannot pull.', error: true, state: this.getState() };
    }

    const remoteBranchName = args[1] || 'main';
    const remoteHash = this.state.remote.branches[remoteBranchName];

    if (!remoteHash) {
      return { output: `fatal: Remote branch '${remoteBranchName}' not found.`, error: true, state: this.getState() };
    }

    // Temporarily create a mock branch origin/main in order to merge it
    const tempBranchName = `origin/${remoteBranchName}`;
    this.state.branches[tempBranchName] = remoteHash;
    
    // Perform merge
    const mergeRes = this.gitMerge([tempBranchName]);

    // Clean up temporary branch pointer
    delete this.state.branches[tempBranchName];

    return {
      output: `Pulling from remote...\n` + mergeRes.output,
      error: mergeRes.error,
      state: this.getState()
    };
  }

  // --- GIT STASH ---
  private gitStash(args: string[]): CommandResult {
    const action = args[0] || 'save';

    if (action === 'save' || action === 'push') {
      // Save working directory and staging area
      const wdChanges = JSON.parse(JSON.stringify(this.state.workingDir));
      const saChanges = JSON.parse(JSON.stringify(this.state.stagingArea));

      // Reset to HEAD commit
      const headHash = this.getHeadCommitHash();
      if (headHash && this.state.commits[headHash]) {
        this.state.workingDir = { ...this.state.commits[headHash].tree };
      } else {
        this.state.workingDir = {};
      }
      this.state.stagingArea = {};

      this.state.stash.push({
        workingDir: wdChanges,
        stagingArea: saChanges
      });

      return {
        output: `Saved working directory and branch state WIP on ${this.state.head}.`,
        error: false,
        state: this.getState()
      };
    }

    if (action === 'pop') {
      if (this.state.stash.length === 0) {
        return { output: 'No stash entries found.', error: true, state: this.getState() };
      }

      const popped = this.state.stash.pop()!;
      this.state.workingDir = popped.workingDir;
      this.state.stagingArea = popped.stagingArea;

      return {
        output: `On branch ${this.state.head}\nChanges not staged for commit:\nRestored stashed state.`,
        error: false,
        state: this.getState()
      };
    }

    return { output: `stash: action '${action}' is not supported.`, error: true, state: this.getState() };
  }

  // --- GIT RESET ---
  private gitReset(args: string[]): CommandResult {
    if (args.length === 0) {
      // Soft reset staging area to HEAD
      this.state.stagingArea = {};
      return { output: 'Unstaged changes after reset.', error: false, state: this.getState() };
    }

    const type = args[0];
    const targetHash = args[1] || 'HEAD';

    let resolvedHash = '';
    if (this.state.commits[targetHash]) {
      resolvedHash = targetHash;
    } else if (targetHash === 'HEAD') {
      resolvedHash = this.getHeadCommitHash() || '';
    } else if (this.state.branches[targetHash]) {
      resolvedHash = this.state.branches[targetHash];
    } else {
      return { output: `fatal: ambiguous argument '${targetHash}': unknown revision`, error: true, state: this.getState() };
    }

    if (!resolvedHash) {
      return { output: `fatal: no commits yet`, error: true, state: this.getState() };
    }

    if (type === '--hard') {
      // Reset HEAD branch pointer, staging area, and working directory
      const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
      if (activeBranchName) {
        this.state.branches[activeBranchName] = resolvedHash;
      } else {
        this.state.head = resolvedHash;
      }

      this.state.workingDir = { ...this.state.commits[resolvedHash].tree };
      this.state.stagingArea = {};
      this.state.mergeState = null;

      return {
        output: `HEAD is now at ${resolvedHash.substring(0,7)} ${this.state.commits[resolvedHash].message}`,
        error: false,
        state: this.getState()
      };
    }

    if (type === '--soft') {
      // Just move head/branch pointer, keep working tree and staging
      const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
      if (activeBranchName) {
        this.state.branches[activeBranchName] = resolvedHash;
      } else {
        this.state.head = resolvedHash;
      }

      return {
        output: `Reset HEAD pointer to ${resolvedHash.substring(0,7)}`,
        error: false,
        state: this.getState()
      };
    }

    // Default: mixed reset (move head, clear staging, keep working directory)
    const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    if (activeBranchName) {
      this.state.branches[activeBranchName] = resolvedHash;
    } else {
      this.state.head = resolvedHash;
    }
    this.state.stagingArea = {};

    return {
      output: `Unstaged changes after reset.`,
      error: false,
      state: this.getState()
    };
  }

  // --- GIT REVERT ---
  private gitRevert(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'error: commit hash required to revert.', error: true, state: this.getState() };
    }

    const targetCommit = args[0];
    if (!this.state.commits[targetCommit]) {
      return { output: `error: no such commit: ${targetCommit}`, error: true, state: this.getState() };
    }

    const headHash = this.getHeadCommitHash();
    if (!headHash) {
      return { output: `error: no commits in history`, error: true, state: this.getState() };
    }

    const commitToRevert = this.state.commits[targetCommit];
    const headCommit = this.state.commits[headHash];

    // Compute diff and apply reverse changes (simulated)
    // To revert a commit, we want to look at its changes relative to its parent, 
    // and undo those changes on top of our current working tree.
    // Simplification: set working tree file values back to what they were before commitToRevert was made
    const parentHash = commitToRevert.parents[0];
    const parentTree = parentHash ? this.state.commits[parentHash].tree : {};
    const revertTree = commitToRevert.tree;

    const finalTree = { ...headCommit.tree };

    // Find what changes commitToRevert made
    // Files added: delete them
    // Files modified: change them back to parentTree version
    // Files deleted: restore them from parentTree
    const allFiles = new Set([...Object.keys(parentTree), ...Object.keys(revertTree)]);

    allFiles.forEach(file => {
      const before = parentTree[file];
      const after = revertTree[file];

      if (before === undefined && after !== undefined) {
        // Added in target -> delete in reverted
        delete finalTree[file];
      } else if (before !== undefined && after === undefined) {
        // Deleted in target -> add back in reverted
        finalTree[file] = before;
      } else if (before !== after) {
        // Modified -> restore to before
        finalTree[file] = before;
      }
    });

    // Create revert commit
    const newHash = this.generateHash();
    const newCommit: GitCommit = {
      hash: newHash,
      message: `Revert "${commitToRevert.message}"\n\nThis reverts commit ${targetCommit}.`,
      parents: [headHash],
      tree: finalTree,
      timestamp: Date.now()
    };

    this.state.commits[newHash] = newCommit;

    const activeBranchName = this.state.branches[this.state.head] !== undefined ? this.state.head : null;
    if (activeBranchName) {
      this.state.branches[activeBranchName] = newHash;
    } else {
      this.state.head = newHash;
    }

    this.state.workingDir = { ...finalTree };
    this.state.stagingArea = {};

    return {
      output: `[${activeBranchName || 'detached-HEAD'} ${newHash}] Revert "${commitToRevert.message}"\n 1 file reverted`,
      error: false,
      state: this.getState()
    };
  }
}
