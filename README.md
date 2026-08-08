# ⚔️ GitQuest — Interactive Gamified Git Learning Platform 🚀

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**GitQuest** (also known as *GitVerse*) is an immersive, gamified web application that teaches version control and Git through interactive storytelling, animated visual worlds, live commit graph visualization, and a real simulated terminal — all in one screen.

---

## 🎮 Core Educational Loop

The key principle driving every chapter:

> **Student performs an action → World reacts → Git visualization updates → Real command is revealed.**

Every mission screen is divided into three synchronized layers:

```
┌──────────────────────────────────────────────────────────────┐
│  STORY WORLD ANIMATION PANEL (Full Width)                    │
│  🏰 Kingdom / 🚀 Space — Animated Git operation in context   │
│  🎮 Story Action → 🌿 Git Concept → 💻 Real Command          │
├─────────────────────────────┬────────────────────────────────┤
│  STORY + MISSION TASKS       │  GIT TIMELINE VISUALIZER      │
│  Chapter narrative           │  SVG commit node graph        │
│  Step-by-step checklist      │  Branch paths, HEAD pointer   │
│  Concept mapping             ├────────────────────────────────┤
│  Educational Loop card       │  REAL GIT TERMINAL SHELL      │
│                              │  $ git branch feature         │
│                              │  Validates real commands      │
└─────────────────────────────┴────────────────────────────────┘
```

---

## 🌟 Key Features

### 🏰🚀 1. Dual Storyline Universes

Switch between two fully animated story worlds at any time without losing progress:

| | 🏰 Kingdom Chronicles | 🚀 Space Odyssey |
|---|---|---|
| **Theme** | Medieval kingdom | Sci-fi space station |
| **Historian** | Royal Archive Keeper | Starfleet Operator |
| **`git init`** | Royal Archive opens | Timeline Core activates |
| **`git branch`** | Kingdom road splits | Wormhole opens |
| **`git merge`** | Kingdoms unite | Timelines fuse |
| **`git reset`** | Prison collapses, history rewinds | Reactor reversal |
| **Conflict** | Two architects, one plot | Shield config collision |

Every Git concept maps 1-to-1 between worlds — same educational outcome, completely different story.

---

### 🎬 2. Story World Animation System

Each of the 20 chapters has a dedicated animated scene — two visual variants (Kingdom + Space) — rendered as a full-width panel at the top of every mission screen.

**Animation phases per chapter:**
- **Idle** — Scene shows the "before" state, waiting for the student to act
- **Active** — Objects animate in response to executed commands
- **Complete** — Victory animation + "What Just Happened?" 3-step reveal

**Animation difficulty by domain:**

| Domain | Chapters | Complexity | Techniques Used |
|---|---|---|---|
| 🟢 Foundations | 1–5 | Basic | Element fade, slide, stamp |
| 🟡 Branching | 6–9 | Intermediate | SVG path split, portal/wormhole, conflict editor |
| 🟡 Remotes | 10–12 | Intermediate | Messenger/rocket travel, clone history copy, fork split |
| 🔴 History | 13–17 | Advanced | Rewind flash, timeline reorder SVG, cherry extraction, vault |
| 🟣 Boss | 18–20 | Boss | Multi-source convergence, council review, 5-branch repair |

**"What Just Happened?" card** — shown after every completed step:

```
🎮 Story Action  →  🌿 Git Concept  →  💻 Real Command
"Royal Archive    →  Repository /       →  git init
 Established"        Kingdom Archive
```

---

### 💻 3. Simulated Git Terminal Shell

Full CLI simulator validating real Git syntax for every chapter:

```
git init • git status • git add • git commit • git log
git branch • git checkout • git merge • (conflict resolution)
git push • git pull • git clone • git fork
git reset --hard • git revert • git rebase
git cherry-pick • git stash • pull requests
```

Features instant feedback with colored terminal output, hotkey buttons, and helpful error guidance for invalid commands.

---

### 📊 4. Live Git Timeline Visualizer

- SVG-based commit node graph with HEAD pointer, branch splits, merge curves
- Hover tooltips: commit hash, author, modified files, timestamps
- Synchronized updates in real-time as commands are executed

---

### 🗺️ 5. 20-Chapter Curriculum

Progressive curriculum from beginner to advanced:

| Domain | Chapters | Git Concepts |
|---|---|---|
| Foundations | 1–5 | `init`, `status`, `add`, `commit`, `log` |
| Branching | 6–9 | `branch`, `checkout`, `merge`, conflict resolution |
| Remotes | 10–12 | `push`, `clone`, `fork` |
| History | 13–17 | `reset`, `revert`, `rebase`, `cherry-pick`, `stash` |
| Collaboration | 18–20 | `pull`, pull requests, final boss sequence |

---

### 🏆 6. Gamification & Player System

- **XP & Level Progression** — Earn XP per completed chapter, level up your rank
- **Daily Streak Tracker** — Animated flame counter for active learning days
- **Achievement Badges** — Unlock: *First Commit*, *Branch Explorer*, *Merge Master*, *Conflict Resolver*, *Git Hero*
- **Global Leaderboard** — Live player rankings by XP, level, and institute
- **Git Skillset Matrix** — Radar chart of competency across all 6 Git domains

---

### 🎨 7. UI Design System

- **Dark / Light Mode Toggle** — Full theme switch persisted to localStorage; syncs via `document.documentElement` class
- **Glassmorphism Panels** — Backdrop blur, ambient glow spotlights, premium card system
- **Responsive Layout** — Mobile tab switcher (Story | Timeline | Terminal), full desktop 3-panel view
- **Custom Animations** — 14 `@keyframes` animation system: `float-up`, `stamp-in`, `draw-path`, `rewind-flash`, `merge-converge`, `cherry-pop`, `vault-close`, `conflict-shake`, and more

---

### 👤 8. User Profile & Account System

- User registration and login with persistent cloud sync (optional backend)
- **Profile Dashboard** — Hero banner, animated avatar, level badge, 4 stat cards
- **Edit Profile** — Live avatar preview, editable username, email, institute name
- **Settings** — Sound toggle, theme mode, universe jump, edit user details

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Vanilla CSS, custom `@keyframes` |
| Icons | Lucide React |
| Animations | CSS keyframes + SVG `stroke-dashoffset` |
| Audio | Web Audio API (synthesized sound effects) |
| Backend (optional) | Node.js, Express, MongoDB |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/KiShOrE-2008/GitQuest.git
cd GitQuest

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

---

## 📁 Project Structure

```
GitQuest/
├── public/
├── server/                    # Optional Express auth + sync API
└── src/
    ├── components/
    │   ├── scenes/            # Story World animation scenes
    │   │   ├── SceneFoundations.tsx    # Ch 1–5
    │   │   ├── SceneBranching.tsx      # Ch 6–9
    │   │   ├── SceneRemotes.tsx        # Ch 10–12
    │   │   ├── SceneHistory.tsx        # Ch 13–17
    │   │   └── SceneCollabFinal.tsx    # Ch 18–20
    │   ├── StoryWorld.tsx     # Scene dispatcher + WJH card
    │   ├── Achievements.tsx
    │   ├── Auth.tsx
    │   ├── Dashboard.tsx      # Curriculum story roadmap (Learn Map)
    │   ├── EditProfile.tsx
    │   ├── GitTimeline.tsx    # SVG commit visualization
    │   ├── Home.tsx           # Command center overview dashboard
    │   ├── LandingPage.tsx
    │   ├── Leaderboard.tsx
    │   ├── LearningScreen.tsx # 3-layer mission screen layout
    │   ├── MissionComplete.tsx
    │   ├── MobileNavBar.tsx
    │   ├── Navbar.tsx
    │   ├── Profile.tsx
    │   ├── Settings.tsx
    │   ├── Sidebar.tsx
    │   ├── Terminal.tsx       # Simulated Git terminal shell
    │   └── WorldSelection.tsx
    ├── context/
    │   └── GameContext.tsx    # Central game state, Git simulator, auth
    ├── data/
    │   └── chapters.ts        # 20-chapter mission data + validation steps
    ├── utils/
    │   └── audio.ts           # Web Audio API synthesizer
    ├── App.tsx
    ├── index.css              # Tailwind + 14 custom @keyframes
    └── main.tsx
```

---

## 📝 License

MIT License — see `LICENSE` for details.
