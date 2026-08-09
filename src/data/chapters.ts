export interface Chapter {
  id: number;
  title: string;
  goal: string;
  conceptTerm: string;
  conceptMapping: {
    kingdom: string;
    space: string;
  };
  story: {
    kingdom: string;
    space: string;
  };
  mission: {
    kingdom: string;
    space: string;
  };
  realGitCommand: string;
  realityMode: {
    gameAction: string;
    gitCommand: string;
  };
  detailedDescription: {
    command: string;
    purpose: string;
    whatItDoes: string;
  };
  xpReward: number;
  targetBranch: string;
  validationSteps: {
    description: string;
    validate: (cmd: string, state: any) => { success: boolean; errorMsg?: string; nextStateUpdate?: any };
  }[];
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Welcome to Git",
    detailedDescription: {
      command: "git init",
      purpose: "Initializes a brand-new Git repository in the current folder.",
      whatItDoes: "Creates a hidden '.git' directory containing object stores (objects/), branch reference folders (refs/), a HEAD pointer file, and a config file. This establishes the internal database structure that tracks all future file versions and commit history."
    },
    goal: "Understand what Git is and why version control exists.",
    conceptTerm: "Repository",
    conceptMapping: {
      kingdom: "Kingdom Archive",
      space: "Timeline Core"
    },
    story: {
      kingdom: "The kingdom has no historian. Every change to the kingdom is forgotten. You are appointed as the Royal Historian to register the history.",
      space: "The space station has lost all chronological logs and historical records due to a temporal storm. You must activate the recording systems."
    },
    mission: {
      kingdom: "Create the Kingdom Archive using the command to initialize a repository.",
      space: "Activate the Timeline Core by initializing a timeline repository."
    },
    realGitCommand: "git init",
    realityMode: {
      gameAction: "🏰 Repository Created (Royal Archive established)",
      gitCommand: "git init"
    },
    xpReward: 100,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Initialize the repository",
        validate: (cmd: string) => {
          if (cmd.trim() === "git init") {
            return {
              success: true,
              nextStateUpdate: { isInitialized: true, currentBranch: "main" }
            };
          }
          return { success: false, errorMsg: "To initialize a repository, use: git init" };
        }
      }
    ]
  },
  {
    id: 2,
    title: "Working Directory",
    detailedDescription: {
      command: "git status",
      purpose: "Inspects the current state of files in your working directory and staging area.",
      whatItDoes: "Compares file modification timestamps and SHA checksums in your workspace against the Git index file (.git/index) and the latest commit pointed to by HEAD. It categorizes files into untracked, modified, staged, or deleted."
    },
    goal: "Understand files in the working directory (untracked changes).",
    conceptTerm: "Working Directory",
    conceptMapping: {
      kingdom: "Construction Zone",
      space: "Engineering Bay"
    },
    story: {
      kingdom: "Builders have constructed three new structures, but they only exist in the construction zone and haven't been approved yet.",
      space: "Engineers have repaired three system modules in the engineering bay, but they haven't been checked into the orbital launch bay yet."
    },
    mission: {
      kingdom: "Modify your files to verify the unstaged status of the construction blueprints.",
      space: "Check status to examine the changes waiting in the engineering bay."
    },
    realGitCommand: "git status",
    realityMode: {
      gameAction: "🧱 Modify blueprints in construction zone",
      gitCommand: "Modify files / git status"
    },
    xpReward: 100,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Check working directory status",
        validate: (cmd: string) => {
          if (cmd.trim() === "git status") {
            return {
              success: true,
              nextStateUpdate: {
                workingDirectory: ["castle.txt", "village.txt", "road.txt"],
                stagedFiles: []
              }
            };
          }
          return { success: false, errorMsg: "Run 'git status' to inspect current changes in the working directory." };
        }
      }
    ]
  },
  {
    id: 3,
    title: "Staging Area",
    detailedDescription: {
      command: "git add <file>",
      purpose: "Stages modified or new files to prepare them for the next commit snapshot.",
      whatItDoes: "Reads the file content, compresses it into a SHA-1/SHA-256 blob object saved inside '.git/objects/', and updates the binary staging index (.git/index) mapping the file path to that new blob object hash."
    },
    goal: "Understand git add and preparing files for check-in.",
    conceptTerm: "Staging Area",
    conceptMapping: {
      kingdom: "Inspection Hall",
      space: "Launch Pad"
    },
    story: {
      kingdom: "To finalize our new buildings, we must move the blueprints from the Construction Zone into the Royal Inspection Area.",
      space: "To send our repairs to the timeline, we must load the repaired modules from Engineering onto the launch pad."
    },
    mission: {
      kingdom: "Stage the 'castle.txt' blueprint for inspection.",
      space: "Stage the 'oxygen.txt' repair for launch."
    },
    realGitCommand: "git add",
    realityMode: {
      gameAction: "🏰 Move castle to Royal Inspection Area",
      gitCommand: "git add castle.txt"
    },
    xpReward: 100,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Stage the files",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "add") {
            const file = parts[2];
            const target = state.theme === "kingdom" ? "castle.txt" : "oxygen.txt";
            if (file === target || file === ".") {
              return {
                success: true,
                nextStateUpdate: {
                  workingDirectory: state.theme === "kingdom" ? ["village.txt", "road.txt"] : ["shield.txt", "thruster.txt"],
                  stagedFiles: [target]
                }
              };
            }
            return { success: false, errorMsg: `Make sure to stage '${target}' using 'git add ${target}'.` };
          }
          return { success: false, errorMsg: "Use 'git add <filename>' to stage changes." };
        }
      }
    ]
  },
  {
    id: 4,
    title: "Commit",
    detailedDescription: {
      command: "git commit -m \"message\"",
      purpose: "Saves a permanent snapshot of all staged files in the project history.",
      whatItDoes: "Generates a 'tree' object representing directory structures and staged blobs, then writes a 'commit' object containing author info, timestamp, commit message, root tree hash, and parent commit hash. Finally, updates the current branch pointer file in '.git/refs/heads/' to point to this new commit hash."
    },
    goal: "Understand snapshots and saving changes permanently.",
    conceptTerm: "Commit",
    conceptMapping: {
      kingdom: "Royal Chronicle Entry",
      space: "Time Checkpoint"
    },
    story: {
      kingdom: "The King approves the castle construction! We must write it down in the history books to make it permanent.",
      space: "The AI is ready to create a Time Checkpoint, storing the oxygen repairs into the stable timeline memory.",
    },
    mission: {
      kingdom: "Commit the staged castle blueprint with the message 'Build castle'.",
      space: "Commit the staged oxygen module with the message 'Repair oxygen'."
    },
    realGitCommand: "git commit",
    realityMode: {
      gameAction: "📖 Record castle in history book",
      gitCommand: 'git commit -m "Build castle"'
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Commit staged changes",
        validate: (cmd: string, state: any) => {
          const match = cmd.trim().match(/^git\s+commit\s+-m\s+["'](.+?)["']$/);
          if (match) {
            const msg = match[1];
            const targetMsg = state.theme === "kingdom" ? "Build castle" : "Repair oxygen";
            if (msg.toLowerCase().includes(targetMsg.toLowerCase())) {
              return {
                success: true,
                nextStateUpdate: {
                  stagedFiles: [],
                  commits: [
                    {
                      id: "c1",
                      hash: "4a2b91d",
                      message: msg,
                      author: "Historian",
                      timestamp: new Date().toLocaleTimeString(),
                      branch: "main",
                      files: state.theme === "kingdom" ? ["castle.txt"] : ["oxygen.txt"]
                    }
                  ]
                }
              };
            }
            return { success: false, errorMsg: `Try to match the target message closely, e.g.: git commit -m "${targetMsg}"` };
          }
          return { success: false, errorMsg: 'Use command: git commit -m "message"' };
        }
      }
    ]
  },
  {
    id: 5,
    title: "Git Log",
    detailedDescription: {
      command: "git log",
      purpose: "Displays the chronological history of commits on the active branch.",
      whatItDoes: "Reads the commit hash pointed to by HEAD, then traverses backwards through parent commit hashes recorded in each commit object, outputting commit SHA hashes, authors, timestamps, and commit messages."
    },
    goal: "Review commit history.",
    conceptTerm: "Git Log",
    conceptMapping: {
      kingdom: "Royal Chronicle Logs",
      space: "Timeline Records"
    },
    story: {
      kingdom: "The Royal Council wants to see all historical entries recorded in the kingdom chronicles.",
      space: "Mission Control requires you to query the timeline records to see past system check-ins."
    },
    mission: {
      kingdom: "Inspect the repository history using git log.",
      space: "Query the timeline logs using git log."
    },
    realGitCommand: "git log",
    realityMode: {
      gameAction: "📖 Read chronicle log entries",
      gitCommand: "git log"
    },
    xpReward: 100,
    targetBranch: "main",
    validationSteps: [
      {
        description: "View history log",
        validate: (cmd: string) => {
          if (cmd.trim() === "git log") {
            return { success: true };
          }
          return { success: false, errorMsg: "Type 'git log' to print the chronological history." };
        }
      }
    ]
  },
  {
    id: 6,
    title: "Branch",
    detailedDescription: {
      command: "git branch <branch-name>",
      purpose: "Creates an independent line of development to work on features without affecting main.",
      whatItDoes: "Creates a lightweight 41-byte text file inside '.git/refs/heads/<branch-name>' containing the 40-character SHA hash of the current commit. It does NOT duplicate source files or copy repository history."
    },
    goal: "Understand branching for experimental development.",
    conceptTerm: "Branch",
    conceptMapping: {
      kingdom: "New Kingdom Line",
      space: "Alternate Timeline"
    },
    story: {
      kingdom: "The King wants to experiment with magic towers, but we must protect the main land. Let's start an alternate development line.",
      space: "Scientists want to run experiments on a high-energy reactor core. We must establish an alternate timeline branch."
    },
    mission: {
      kingdom: "Create a new branch named 'magic'.",
      space: "Create an alternate timeline branch named 'reactor'."
    },
    realGitCommand: "git branch",
    realityMode: {
      gameAction: "🔮 Create magic blueprints separate from main land",
      gitCommand: "git branch magic"
    },
    xpReward: 120,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Create a branch",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          const targetBranch = state.theme === "kingdom" ? "magic" : "reactor";
          if (parts[0] === "git" && parts[1] === "branch") {
            if (parts[2] === targetBranch) {
              return {
                success: true,
                nextStateUpdate: {
                  branches: ["main", targetBranch]
                }
              };
            }
            return { success: false, errorMsg: `Name the branch exactly '${targetBranch}'.` };
          }
          return { success: false, errorMsg: `Use: git branch ${targetBranch}` };
        }
      }
    ]
  },
  {
    id: 7,
    title: "Checkout",
    detailedDescription: {
      command: "git checkout <branch-name>",
      purpose: "Switches your active working environment and HEAD pointer to a different branch or commit.",
      whatItDoes: "Updates '.git/HEAD' to point to 'refs/heads/<branch-name>', refreshes the staging index (.git/index), and overwrites physical files in your working directory to match the snapshot of the target branch."
    },
    goal: "Switch HEAD pointer to a different branch.",
    conceptTerm: "Checkout",
    conceptMapping: {
      kingdom: "Walk through Portal",
      space: "Fly through Wormhole"
    },
    story: {
      kingdom: "Now that the magic development blueprint line exists, we must step through the portal to work inside it.",
      space: "To work on the new reactor experiment, we must shift our cockpit navigation through the temporal wormhole."
    },
    mission: {
      kingdom: "Switch to your new 'magic' branch.",
      space: "Switch to your 'reactor' branch."
    },
    realGitCommand: "git checkout",
    realityMode: {
      gameAction: "🚪 Portal to the magic blueprints",
      gitCommand: "git checkout magic"
    },
    xpReward: 120,
    targetBranch: "magic",
    validationSteps: [
      {
        description: "Checkout branch",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          const target = state.theme === "kingdom" ? "magic" : "reactor";
          if (parts[0] === "git" && parts[1] === "checkout") {
            if (parts[2] === target) {
              return {
                success: true,
                nextStateUpdate: {
                  currentBranch: target
                }
              };
            }
            return { success: false, errorMsg: `Switch to '${target}' branch.` };
          }
          return { success: false, errorMsg: `Use: git checkout ${target}` };
        }
      }
    ]
  },
  {
    id: 8,
    title: "Merge",
    detailedDescription: {
      command: "git merge <branch-name>",
      purpose: "Integrates changes from a feature branch back into your active branch.",
      whatItDoes: "Finds the common ancestor commit of both branches. If the target branch has linear commits (Fast-Forward), it moves the active branch ref forward. If histories diverged, it executes a 3-way merge algorithm and generates a new 'merge commit' with two parent commit hashes."
    },
    goal: "Integrate modifications from one branch back into main.",
    conceptTerm: "Merge",
    conceptMapping: {
      kingdom: "Unite Kingdoms",
      space: "Timeline Fusion"
    },
    story: {
      kingdom: "The Magic Kingdom experiments succeeded! We built a magic tower. Let's merge these improvements back into the main kingdom.",
      space: "The reactor experiments in the alternate timeline are fully stable. Let's fuse the timelines back to update our main systems."
    },
    mission: {
      kingdom: "First go to 'main', then merge 'magic' into it.",
      space: "First return to 'main', then merge 'reactor' into it."
    },
    realGitCommand: "git merge",
    realityMode: {
      gameAction: "🤝 Fuse magic tower into main kingdom",
      gitCommand: "git checkout main; git merge magic"
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Checkout main branch",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "checkout") {
            if (parts[2] === "main") {
              return { success: true, nextStateUpdate: { currentBranch: "main" } };
            }
            return { success: false, errorMsg: "Switch back to the 'main' branch first." };
          }
          return { success: false, errorMsg: "Use: git checkout main" };
        }
      },
      {
        description: "Merge changes",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          const source = state.theme === "kingdom" ? "magic" : "reactor";
          if (parts[0] === "git" && parts[1] === "merge") {
            if (parts[2] === source) {
              // Add a new commit reflecting the merge
              const mergeCommit = {
                id: "c2",
                hash: "9b3c4f5",
                message: `Merge branch '${source}'`,
                author: "Historian",
                timestamp: new Date().toLocaleTimeString(),
                branch: "main",
                parents: ["c1", "magic-c1"],
                files: state.theme === "kingdom" ? ["magictower.txt"] : ["reactor.txt"]
              };
              const prevCommits = state.commits || [];
              return {
                success: true,
                nextStateUpdate: {
                  commits: [...prevCommits, mergeCommit]
                }
              };
            }
            return { success: false, errorMsg: `Merge the branch '${source}'.` };
          }
          return { success: false, errorMsg: `Use: git merge ${source}` };
        }
      }
    ]
  },
  {
    id: 9,
    title: "Merge Conflict",
    detailedDescription: {
      command: "git merge (with conflict resolution)",
      purpose: "Manually resolves conflicting changes when two branches modify the exact same lines of a file.",
      whatItDoes: "When 3-way merge cannot reconcile differing edits on the same line, Git writes conflict markers (<<<<<<<, =======, >>>>>>>) into the file and pauses. After you edit and stage the file with 'git add', running 'git commit' completes the merge commit object."
    },
    goal: "Manually resolve divergent changes on the same file.",
    conceptTerm: "Merge Conflict",
    conceptMapping: {
      kingdom: "Architect Dispute",
      space: "Temporal Disruption"
    },
    story: {
      kingdom: "Two architects built on the same spot: one built a Wizard Castle, the other built a Merchant Market. History is stuck until we choose which blueprint keeps the land.",
      space: "An astronaut modified the shield config on the main timeline, while another scientist tweaked the shields differently on the test timeline. The files collide!"
    },
    mission: {
      kingdom: "Open conflicts in 'castle.txt', keep both by combining them, add the file, and commit.",
      space: "Resolve conflicts in 'shield.txt' and commit the resolved files."
    },
    realGitCommand: "git commit (after resolution)",
    realityMode: {
      gameAction: "⚔️ Resolve build disputes",
      gitCommand: "Resolve conflicts, git add, git commit"
    },
    xpReward: 200,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Stage the resolved file",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          const filename = state.theme === "kingdom" ? "castle.txt" : "shield.txt";
          if (parts[0] === "git" && parts[1] === "add" && (parts[2] === filename || parts[2] === ".")) {
            return { success: true, nextStateUpdate: { stagedFiles: [filename] } };
          }
          return { success: false, errorMsg: `After choosing the blueprints, type 'git add ${filename}' to stage the resolution.` };
        }
      },
      {
        description: "Commit the resolution",
        validate: (cmd: string, state: any) => {
          const match = cmd.trim().match(/^git\s+commit\s+-m\s+["'](.+?)["']$/);
          if (match) {
            return {
              success: true,
              nextStateUpdate: {
                stagedFiles: [],
                commits: [
                  ...(state.commits || []),
                  {
                    id: "c3",
                    hash: "e7a8f2c",
                    message: match[1],
                    author: "Historian",
                    timestamp: new Date().toLocaleTimeString(),
                    branch: "main",
                    files: []
                  }
                ]
              }
            };
          }
          return { success: false, errorMsg: "Commit the resolution with a message, e.g.: git commit -m 'Resolve conflicts'" };
        }
      }
    ]
  },
  {
    id: 10,
    title: "GitHub & Remote",
    detailedDescription: {
      command: "git remote add origin <url> & git push -u origin main",
      purpose: "Links local repository to a remote server (e.g. GitHub) and uploads local commits.",
      whatItDoes: "Registers the remote host URL in '.git/config'. 'git push' transmits missing blob, tree, and commit objects over SSH/HTTPS to the remote server and updates remote-tracking branch references in '.git/refs/remotes/origin/'."
    },
    goal: "Link the local repository to a remote server.",
    conceptTerm: "Push & Pull",
    conceptMapping: {
      kingdom: "Capital Archives",
      space: "Galaxy Core Station"
    },
    story: {
      kingdom: "We need to backup our logs. We must send a Royal Messenger to synchronize our local archives with the Grand Capital Library.",
      space: "Our station needs offsite backups. We must establish a satellite uplink to transmit temporal databases to Mission Control."
    },
    mission: {
      kingdom: "Link remote 'origin' and push your main branch.",
      space: "Add the remote tracking location and push timeline logs."
    },
    realGitCommand: "git push",
    realityMode: {
      gameAction: "🏇 Royal messenger rides out",
      gitCommand: "git remote add origin ...; git push"
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Add remote origin",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "remote" && parts[2] === "add" && parts[3] === "origin") {
            return { success: true, nextStateUpdate: { remoteUrl: parts[4] || "https://github.com/archive/gitverse.git" } };
          }
          return { success: false, errorMsg: "First, add remote origin: git remote add origin <url>" };
        }
      },
      {
        description: "Push changes to remote",
        validate: (cmd: string) => {
          const clean = cmd.trim();
          if (clean === "git push origin main" || clean === "git push -u origin main") {
            return { success: true, nextStateUpdate: { isPushed: true } };
          }
          return { success: false, errorMsg: "Push main branch to remote: git push origin main" };
        }
      }
    ]
  },
  {
    id: 11,
    title: "Clone",
    detailedDescription: {
      command: "git clone <url>",
      purpose: "Downloads an entire existing repository from a remote server to your local machine.",
      whatItDoes: "Executes a 'git init', sets up the 'origin' remote URL, downloads all packfiles (blobs, trees, commits, tags), configures remote-tracking references in '.git/refs/remotes/', and checks out default branch files into your workspace."
    },
    goal: "Download a remote repository.",
    conceptTerm: "Clone",
    conceptMapping: {
      kingdom: "Kingdom Blueprint Copy",
      space: "Station Replication"
    },
    story: {
      kingdom: "To setup a friendly neighboring kingdom, we must download the Capital Library's primary kingdom architecture plans.",
      space: "We need to establish a sister space outpost. We must download the blueprints from the central Space Command mainframe."
    },
    mission: {
      kingdom: "Clone the library template URL: 'git clone https://capital/kingdom.git'.",
      space: "Clone the station schematics URL: 'git clone https://hq/station.git'."
    },
    realGitCommand: "git clone",
    realityMode: {
      gameAction: "🏰 Duplicate kingdom from blue prints",
      gitCommand: "git clone <url>"
    },
    xpReward: 120,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Clone repository",
        validate: (cmd: string, _state: any) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "clone") {
            const url = parts[2] || "";
            if (url.includes("kingdom") || url.includes("station") || url.includes(".git")) {
              return { success: true };
            }
            return { success: false, errorMsg: "Specify the repository URL to clone." };
          }
          return { success: false, errorMsg: "Use: git clone <url>" };
        }
      }
    ]
  },
  {
    id: 12,
    title: "Fork",
    detailedDescription: {
      command: "Fork Button (GitHub / GitLab)",
      purpose: "Creates a personal server-side copy of a public repository under your user account.",
      whatItDoes: "Performs server-side repository duplication on the host platform (GitHub), granting you full push access to your copy without affecting the original author's main repository."
    },
    goal: "Create a personal copy of a shared project on GitHub.",
    conceptTerm: "Fork",
    conceptMapping: {
      kingdom: "Kingdom Succession",
      space: "Universe Parallelization"
    },
    story: {
      kingdom: "A neighboring realm wants to adapt your farming blueprints, evolving them differently without altering yours.",
      space: "Another research team wants to copy your reactor timeline core, running custom tests without affecting your main timeline."
    },
    mission: {
      kingdom: "Perform a fork (simulated on our remote interface). Click 'Fork' or run the mock sync command.",
      space: "Fork the timeline framework to create your copy."
    },
    realGitCommand: "Fork button",
    realityMode: {
      gameAction: "🔱 Duplicate kingdom tree",
      gitCommand: "Click Fork on GitHub"
    },
    xpReward: 100,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Fork repository",
        validate: (cmd: string) => {
          if (cmd.trim() === "git fork" || cmd.trim().toLowerCase() === "fork") {
            return { success: true };
          }
          return { success: false, errorMsg: "Type 'fork' to simulate the fork action." };
        }
      }
    ]
  },
  {
    id: 13,
    title: "Reset",
    detailedDescription: {
      command: "git reset --hard <commit-hash>",
      purpose: "Rewinds project history by moving current branch pointer back to a past commit.",
      whatItDoes: "Overwrites '.git/refs/heads/<branch>' with the targeted commit hash. With '--hard', it also clears all staged index modifications and resets all working directory files to match that past snapshot completely."
    },
    goal: "Undo changes by moving HEAD and branch ref to a past commit.",
    conceptTerm: "Reset",
    conceptMapping: {
      kingdom: "Undo Construction",
      space: "Reverse Time"
    },
    story: {
      kingdom: "The King completely regrets building the royal prison. We must tear down history and travel back to before it was designed.",
      space: "The system reactor overheated. We must force-reverse the timeline clock back to the checkpoint before the reactor boot."
    },
    mission: {
      kingdom: "Reset your archive to the previous commit: 'git reset --hard c1'.",
      space: "Reset the temporal timeline back to the healthy state: 'git reset --hard c1'."
    },
    realGitCommand: "git reset --hard",
    realityMode: {
      gameAction: "⏳ Rewind timeline history",
      gitCommand: "git reset --hard c1"
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Perform hard reset",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "reset" && parts[2] === "--hard") {
            if (parts[3] === "c1" || parts[3] === "HEAD~1" || parts[3] === "4a2b91d") {
              return {
                success: true,
                nextStateUpdate: {
                  commits: [
                    {
                      id: "c1",
                      hash: "4a2b91d",
                      message: "Build castle / Repair oxygen",
                      author: "Historian",
                      timestamp: new Date().toLocaleTimeString(),
                      branch: "main",
                      files: []
                    }
                  ]
                }
              };
            }
            return { success: false, errorMsg: "Reset specifically to 'c1' or 'HEAD~1'." };
          }
          return { success: false, errorMsg: "Use command: git reset --hard c1" };
        }
      }
    ]
  },
  {
    id: 14,
    title: "Revert",
    detailedDescription: {
      command: "git revert <commit-hash>",
      purpose: "Safely undoes a past commit by creating a new commit with inverse changes.",
      whatItDoes: "Calculates the exact inverse diff introduced by the targeted commit and applies that inverse patch onto current HEAD. Creates a new commit containing the inverted edits, preserving all previous history for team collaboration safety."
    },
    goal: "Undo a commit by creating a new commit with inverse changes, preserving history.",
    conceptTerm: "Revert",
    conceptMapping: {
      kingdom: "Royal Apology / Repentance",
      space: "Timeline Redirection"
    },
    story: {
      kingdom: "Unlike deleting files with reset, we want to issue a new royal decree that reverses the bad castle taxes, keeping the records public.",
      space: "We must undo the bad thruster configuration without rewriting past logs. We will deploy an opposing balancing configuration."
    },
    mission: {
      kingdom: "Revert the commit by running: 'git revert c1'.",
      space: "Revert the faulty config: 'git revert c1'."
    },
    realGitCommand: "git revert",
    realityMode: {
      gameAction: "📜 Issue public corrective decree",
      gitCommand: "git revert c1"
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Revert the commit",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "revert") {
            if (parts[2] === "c1" || parts[2] === "4a2b91d") {
              const prevCommits = state.commits || [];
              return {
                success: true,
                nextStateUpdate: {
                  commits: [
                    ...prevCommits,
                    {
                      id: "revert-c1",
                      hash: "2f3d4e5",
                      message: "Revert 'Build castle / Repair oxygen'",
                      author: "Historian",
                      timestamp: new Date().toLocaleTimeString(),
                      branch: "main",
                      files: []
                    }
                  ]
                }
              };
            }
            return { success: false, errorMsg: "Revert commit 'c1'." };
          }
          return { success: false, errorMsg: "Use command: git revert c1" };
        }
      }
    ]
  },
  {
    id: 15,
    title: "Rebase",
    detailedDescription: {
      command: "git rebase <base-branch>",
      purpose: "Re-applies your branch's commits on top of another branch for a clean, linear history.",
      whatItDoes: "Saves your branch's unique commits as temporary patches, resets your branch pointer to the tip of <base-branch>, and re-applies each patch sequentially, generating brand-new commit objects with new hashes."
    },
    goal: "Reapply commits from one branch on top of another.",
    conceptTerm: "Rebase",
    conceptMapping: {
      kingdom: "Reschedule Construction",
      space: "Chronological Realignment"
    },
    story: {
      kingdom: "We want to merge the windmill blueprint, but we want the chronicle history to look like the windmill was built *before* we laid down the castle blueprints.",
      space: "We want to reorder our research timeline logs so that the solar panel calibration appears linearly before the thruster upgrades."
    },
    mission: {
      kingdom: "Rebase 'magic' onto 'main'.",
      space: "Rebase 'reactor' onto 'main'."
    },
    realGitCommand: "git rebase",
    realityMode: {
      gameAction: "🪵 Transplant foundation history",
      gitCommand: "git rebase main"
    },
    xpReward: 180,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Run git rebase",
        validate: (cmd: string, _state: any) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "rebase") {
            if (parts[2] === "main") {
              return { success: true };
            }
            return { success: false, errorMsg: "Rebase onto 'main'." };
          }
          return { success: false, errorMsg: "Use: git rebase main" };
        }
      }
    ]
  },
  {
    id: 16,
    title: "Cherry Pick",
    detailedDescription: {
      command: "git cherry-pick <commit-hash>",
      purpose: "Copies a specific commit from another branch and applies it onto your active branch.",
      whatItDoes: "Extracts the diff introduced by the target commit relative to its parent, applies that patch to your active workspace, and automatically creates a new commit object on your active branch with the original commit message."
    },
    goal: "Apply the changes introduced by some existing commits onto the current branch.",
    conceptTerm: "Cherry Pick",
    conceptMapping: {
      kingdom: "Borrow Invention",
      space: "Temporal Extraction"
    },
    story: {
      kingdom: "The Magic Kingdom made two breakthroughs: magic gardens and dark potions. The King only wants the magic gardens. We must grab only that single blueprint.",
      space: "The parallel lab created shields and warp engine designs. Mission Control only wants the shields. Extract that specific modification."
    },
    mission: {
      kingdom: "Cherry pick the commit 'm-garden' (hash: 'c-gard').",
      space: "Cherry pick the shields commit (hash: 'c-shld')."
    },
    realGitCommand: "git cherry-pick",
    realityMode: {
      gameAction: "🍒 Harvest single blueprint",
      gitCommand: "git cherry-pick c-gard"
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Cherry pick the target commit",
        validate: (cmd: string, state: any) => {
          const parts = cmd.trim().split(/\s+/);
          const targetHash = state.theme === "kingdom" ? "c-gard" : "c-shld";
          if (parts[0] === "git" && parts[1] === "cherry-pick") {
            if (parts[2] === targetHash) {
              const prevCommits = state.commits || [];
              return {
                success: true,
                nextStateUpdate: {
                  commits: [
                    ...prevCommits,
                    {
                      id: "cherry-c",
                      hash: "7f8a9b0",
                      message: state.theme === "kingdom" ? "Add magic gardens" : "Add shields module",
                      author: "Historian",
                      timestamp: new Date().toLocaleTimeString(),
                      branch: "main",
                      files: state.theme === "kingdom" ? ["garden.txt"] : ["shields.txt"]
                    }
                  ]
                }
              };
            }
            return { success: false, errorMsg: `Cherry pick the target hash '${targetHash}'.` };
          }
          return { success: false, errorMsg: `Use: git cherry-pick ${targetHash}` };
        }
      }
    ]
  },
  {
    id: 17,
    title: "Stash",
    detailedDescription: {
      command: "git stash",
      purpose: "Shelves dirty uncommitted working directory and staged changes so you can switch tasks.",
      whatItDoes: "Creates special dangling commit objects in '.git/refs/stash' capturing working tree and index state, then runs 'git reset --hard' to clean your workspace. 'git stash pop' re-applies those stored changes."
    },
    goal: "Save changes in a dirty working directory to return to them later.",
    conceptTerm: "Stash",
    conceptMapping: {
      kingdom: "Royal Vault Storage",
      space: "Cryogenic Storage"
    },
    story: {
      kingdom: "We have unfinished bridge blueprints, but the King has ordered an immediate castle defense emergency. Save the bridge layouts in the vaults and restore working files.",
      space: "We have half-finished solar panels, but a solar flare requires us to repair shield leaks immediately. Place the panels in cryo-storage."
    },
    mission: {
      kingdom: "Stash your active changes using 'git stash', then restore them with 'git stash pop'.",
      space: "Stash the panel changes with 'git stash', then retrieve them using 'git stash pop'."
    },
    realGitCommand: "git stash",
    realityMode: {
      gameAction: "📦 Vault unfinished diagrams",
      gitCommand: "git stash / git stash pop"
    },
    xpReward: 120,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Stash active changes",
        validate: (cmd: string) => {
          if (cmd.trim() === "git stash") {
            return {
              success: true,
              nextStateUpdate: {
                workingDirectory: [],
                stashedFiles: ["bridge.txt / solar.txt"]
              }
            };
          }
          return { success: false, errorMsg: "Type 'git stash' to store active changes." };
        }
      },
      {
        description: "Restore stashed changes",
        validate: (cmd: string) => {
          if (cmd.trim() === "git stash pop") {
            return {
              success: true,
              nextStateUpdate: {
                workingDirectory: ["bridge.txt / solar.txt"],
                stashedFiles: []
              }
            };
          }
          return { success: false, errorMsg: "Retrieve your stashed work with: git stash pop" };
        }
      }
    ]
  },
  {
    id: 18,
    title: "Team Collaboration",
    detailedDescription: {
      command: "git pull origin <branch>",
      purpose: "Fetches latest updates from a remote repository and merges them into your active branch.",
      whatItDoes: "Executes 'git fetch' to download new objects and update '.git/refs/remotes/origin/', followed immediately by running 'git merge origin/<branch>' into your current local branch."
    },
    goal: "Coordinate changes with multiple team members.",
    conceptTerm: "Push, Pull & Merge",
    conceptMapping: {
      kingdom: "Guild Builders",
      space: "Coordinated Starfleet"
    },
    story: {
      kingdom: "Architects from the East and West are building together. You must pull down their new roads and resolve incoming conflicts before pushing yours.",
      space: "Multiple research units are configuring the warp core. You must run a supply pull to retrieve their thruster files."
    },
    mission: {
      kingdom: "Retrieve new work using 'git pull origin main'.",
      space: "Pull online updates: 'git pull origin main'."
    },
    realGitCommand: "git pull",
    realityMode: {
      gameAction: "🕊️ Receive blueprints from Guild",
      gitCommand: "git pull origin main"
    },
    xpReward: 160,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Pull updates",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "pull" && parts[2] === "origin" && parts[3] === "main") {
            return {
              success: true,
              nextStateUpdate: {
                workingDirectory: [],
                stagedFiles: []
              }
            };
          }
          return { success: false, errorMsg: "Pull updates: git pull origin main" };
        }
      }
    ]
  },
  {
    id: 19,
    title: "Pull Request",
    detailedDescription: {
      command: "Pull Request (PR / Merge Request)",
      purpose: "Proposes branch changes to project maintainers for code review and automated testing.",
      whatItDoes: "Opens a code review diff view on the remote host platform. Team members leave inline comments, run CI test pipelines, and upon approval, trigger a remote 'git merge' or 'git rebase' into the target branch."
    },
    goal: "Propose changes to a shared repository and request review.",
    conceptTerm: "Pull Request",
    conceptMapping: {
      kingdom: "Royal Council Review",
      space: "Starfleet Board Review"
    },
    story: {
      kingdom: "Before the Royal Council allows the new dragon defense walls to become part of the central kingdom blueprints, they must audit your schematics.",
      space: "Before our timeline upgrades merge with the orbital motherboard, scientists must review the fusion configuration."
    },
    mission: {
      kingdom: "Propose a pull request to submit your dragon defense blueprints.",
      space: "Create a PR to merge your reactor fusion upgrade."
    },
    realGitCommand: "Pull Request creation",
    realityMode: {
      gameAction: "📜 Propose dragon walls to Royal Council",
      gitCommand: "Open PR on GitHub"
    },
    xpReward: 150,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Submit pull request",
        validate: (cmd: string) => {
          if (cmd.trim() === "git pr" || cmd.trim().toLowerCase() === "pr" || cmd.trim().toLowerCase() === "pull request") {
            return { success: true };
          }
          return { success: false, errorMsg: "Type 'pr' or 'git pr' to open a proposal review." };
        }
      }
    ]
  },
  {
    id: 20,
    title: "Final Boss",
    detailedDescription: {
      command: "Full Workflow (branch, checkout, add, merge, push)",
      purpose: "Combines branching, conflict resolution, rebasing, and pushing to fix complex repository states.",
      whatItDoes: "Executes an end-to-end Git workflow: isolates repairs on a feature branch, stages and reconciles multi-file conflicts, aligns divergent branch histories, and synchronizes local and remote branch tracking refs."
    },
    goal: "Perform complex operations: branch, stage, resolve conflict, rebase, and push to repair history.",
    conceptTerm: "Temporal / Kingdom Salvation",
    conceptMapping: {
      kingdom: "Kingdom Collapse",
      space: "Temporal Collapse"
    },
    story: {
      kingdom: "DISASTER! Rogue sorcerers have corrupted the royal chronicle. Out-of-sync branches, bad commits, and conflicts exist everywhere. You must repair history!",
      space: "ANOMALY DETECTED! A temporal feedback loop has split the station timeline into 5 diverging paths with multiple collision points. Save humanity!"
    },
    mission: {
      kingdom: "Repair the kingdom: 1) create branch 'fix', 2) add resolved file, 3) merge 'fix' into 'main'.",
      space: "Stabilize timelines: 1) create branch 'fix', 2) stage resolved files, 3) merge 'fix' into 'main'."
    },
    realGitCommand: "Various (git checkout, git add, git merge)",
    realityMode: {
      gameAction: "🌟 Reconstruct the timeline matrix",
      gitCommand: "Full sequence validation"
    },
    xpReward: 300,
    targetBranch: "main",
    validationSteps: [
      {
        description: "Create fix branch",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "branch" && parts[2] === "fix") {
            return { success: true };
          }
          return { success: false, errorMsg: "Create the fix branch: git branch fix" };
        }
      },
      {
        description: "Checkout fix branch",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "checkout" && parts[2] === "fix") {
            return { success: true };
          }
          return { success: false, errorMsg: "Checkout fix branch: git checkout fix" };
        }
      },
      {
        description: "Return to main",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "checkout" && parts[2] === "main") {
            return { success: true };
          }
          return { success: false, errorMsg: "Switch back to main: git checkout main" };
        }
      },
      {
        description: "Merge fix branch into main",
        validate: (cmd: string) => {
          const parts = cmd.trim().split(/\s+/);
          if (parts[0] === "git" && parts[1] === "merge" && parts[2] === "fix") {
            return { success: true };
          }
          return { success: false, errorMsg: "Merge fix branch: git merge fix" };
        }
      }
    ]
  }
];
