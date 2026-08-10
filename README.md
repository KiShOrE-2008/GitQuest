# ⚔️ GitQuest — Interactive Gamified Git Learning Platform 🚀

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-FF0050?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lucide](https://img.shields.io/badge/Lucide_Icons-1.30-F56565?style=flat-square)](https://lucide.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

**GitQuest** is an immersive, gamified web application that teaches version control and Git through interactive storytelling, animated visual worlds, live commit graph visualization, a real simulated terminal — and an AI-powered Git tutor chatbot — all in one screen.

> 🎮 **Play. Type. Learn. Git.**

---

## 📑 Table of Contents

- [Core Educational Loop](#-core-educational-loop)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Supabase Database Schema](#-supabase-database-schema)
- [Admin Panel](#-admin-panel)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Custom Animations](#-custom-animations)
- [Deployment](#-deployment)
- [Scripts](#-scripts)
- [License](#-license)

---

## 🎯 Core Educational Loop

Every mission is driven by a single principle:

> **Student performs an action → World reacts → Git visualization updates → Real command is revealed.**

Every mission screen synchronizes three layers:

```
┌──────────────────────────────────────────────────────────────┐
│  STORY WORLD ANIMATION PANEL (Full Width)                    │
│  🏰 Kingdom / 🚀 Space — Animated Git operation in context   │
│  🎮 Story Action → 🌿 Git Concept → 💻 Real Command          │
├─────────────────────────────┬────────────────────────────────┤
│  STORY + MISSION TASKS      │  GIT TIMELINE VISUALIZER       │
│  Chapter narrative          │  SVG commit node graph         │
│  Step-by-step checklist     │  Branch paths, HEAD pointer    │
│  Concept mapping            ├────────────────────────────────┤
│  Educational Loop card      │  REAL GIT TERMINAL SHELL       │
│                             │  $ git branch feature          │
│                             │  Validates real commands       │
└─────────────────────────────┴────────────────────────────────┘
                                         🤖 GitGuide Chatbot (floating)
```

---

## 🌟 Features

### 🏰🚀 1. Dual Storyline Universes

Switch between two fully animated story worlds at any time without losing progress:

| | 🏰 Kingdom Chronicles | 🚀 Space Odyssey |
|---|---|---|
| **Theme** | Medieval kingdom | Sci-fi space station |
| **`git init`** | Royal Archive opens | Timeline Core activates |
| **`git add`** | Sealing scrolls for the archive | Loading supplies onto the shuttle |
| **`git commit`** | Archiving the kingdom record | Saving the ship's log entry |
| **`git branch`** | Kingdom road splits | Wormhole opens |
| **`git checkout`** | Riding to a different castle | Warping through a portal |
| **`git merge`** | Kingdoms unite | Timelines fuse |
| **`git reset`** | Prison collapses, history rewinds | Reactor reversal |
| **`git revert`** | Royal pardon — undo decree | Mission abort — safe rollback |
| **`git rebase`** | Rewriting the chronicle timeline | Rerouting the warp trajectory |
| **`git cherry-pick`** | Plucking a single magic artifact | Extracting one module from another ship |
| **`git stash`** | Hiding blueprints in the vault | Caching data in cryo-storage |
| **`git push`** | Dispatching scrolls to allied kingdoms | Broadcasting data to the mothership |
| **`git clone`** | Copying the entire archive | Downloading the full station blueprint |
| **Conflict** | Two architects, one plot | Shield config collision |

Every Git concept maps 1-to-1 between worlds — same educational outcome, completely different narrative.

---

### 🎬 2. Story World Animation System

Each of the 20 chapters has a dedicated animated scene in **Kingdom** and **Space** variants rendered as a full-width panel at the top of every mission screen. All animations are built with CSS `@keyframes` and Framer Motion.

**Animation phases per chapter:**
- **Idle** — "Before" state, waiting for the student to act
- **Active** — Objects animate in response to executed commands
- **Complete** — Victory stamp + "What Just Happened?" 3-step reveal (shown after animation finishes)

**5 Scene Components** covering all 20 chapters:

| Component | Chapters | Git Domain |
|---|---|---|
| `SceneFoundations.tsx` | 1–5 | `init`, `status`, `add`, `commit`, `log` |
| `SceneBranching.tsx` | 6–9 | `branch`, `checkout`, `merge`, conflicts |
| `SceneRemotes.tsx` | 10–12 | `push`, `clone`, `fork` |
| `SceneHistory.tsx` | 13–17 | `reset`, `revert`, `rebase`, `cherry-pick`, `stash` |
| `SceneCollabFinal.tsx` | 18–20 | `pull`, pull requests, final boss |

---

### 💻 3. Simulated Git Terminal Shell

Full CLI simulator with real-time validation for every chapter. The terminal parses actual Git command syntax and validates against chapter-specific validation steps:

**Supported commands:**
```
git init        git status      git add <file>     git add .
git commit -m   git log         git branch         git branch <name>
git checkout    git merge       git push           git pull
git clone       git remote add  git reset --hard   git revert
git rebase      git cherry-pick git stash          git stash pop
git fetch       git diff        git tag            clear / help
```

**Terminal features:**
- ANSI color-coded output (green for staged, red for untracked, yellow for commit hashes)
- Real `git status` and `git log` output formatting
- Step-by-step command validation with descriptive error messages
- Command history maintained per chapter
- `help` command shows all available commands
- `clear` command clears terminal history

---

### 📊 4. Live Git Timeline Visualizer

- **SVG commit node graph** with HEAD pointer, branch splits, and merge curves
- **Hover tooltips** showing commit hash, author, modified files, timestamps
- **Real-time updates** as terminal commands are executed
- **Branch coloring** — each branch rendered with distinct colors
- **Merge path visualization** — curved SVG lines showing branch merge points
- Built entirely with inline SVG, no external charting libraries

---

### 🤖 5. GitGuide — AI Chatbot Tutor

A floating, world-themed Git tutor chatbot always available during gameplay:

- **Context-aware** — knows your current chapter, active world theme, and mission progress
- **Chapter hints** — type `hint` to get the exact command needed for your current mission
- **Comprehensive knowledge base** — explains 20+ Git commands with detailed descriptions, syntax, and real-world usage examples
- **Topic coverage**: `git init`, `git status`, `git add`, `git commit`, `git log`, `git branch`, `git checkout`, `git merge`, `git push`, `git pull`, `git clone`, `git remote`, `git reset`, `git revert`, `git rebase`, `git stash`, `git cherry-pick`, `git fetch`, `git diff`, `git tag`, forks, merge conflicts, staging area, working directory
- **Themed personality** — responds as a medieval advisor (Kingdom) or starship AI (Space)
- **Typing animation** — realistic character-by-character message rendering
- **Smooth open/close** — spring-based enter/exit transitions

---

### 🗺️ 6. 20-Chapter Curriculum

Progressive curriculum from absolute beginner to advanced Git user:

| Domain | Chapters | Git Concepts | XP Reward |
|---|---|---|---|
| **Foundations** | 1–5 | `init`, `status`, `add`, `commit`, `log` | 100–150 XP each |
| **Branching** | 6–9 | `branch`, `checkout`, `merge`, conflict resolution | 100–200 XP each |
| **Remotes** | 10–12 | `push`, `clone`, `fork` | 100–150 XP each |
| **History Rewriting** | 13–17 | `reset`, `revert`, `rebase`, `cherry-pick`, `stash` | 100–200 XP each |
| **Collaboration** | 18–20 | `pull`, pull requests, final boss sequence | 150–200 XP each |

Each chapter contains:
- **Dual narrative** (Kingdom + Space versions)
- **Mission goal** with step-by-step checklist
- **Concept mapping** between game metaphor and real Git
- **Validation steps** with command-specific state machine logic
- **"What Just Happened?"** 3-step educational reveal after completion

---

### 🏆 7. Gamification & Player System

- **XP & Level Progression** — Earn 100–200 XP per chapter, level up every 300 XP
- **Daily Streak Tracker** — Animated flame counter for consecutive active sessions
- **Achievement Badges** — 5 unlockable milestones:
  - 🏅 **First Commit** — Complete Chapter 4 (`git commit`)
  - 🌿 **Branch Explorer** — Complete Chapter 6 (`git branch`)
  - 🔀 **Merge Master** — Complete Chapter 8 (`git merge`)
  - ⚔️ **Conflict Resolver** — Complete Chapter 9 (merge conflicts)
  - 🦸 **Git Hero** — Reach Level 5 or complete all chapters
- **Global Leaderboard** — Live player rankings powered by Supabase PostgreSQL (real data only, no bots)
- **Git Skillset Radar** — Competency chart across 6 Git domains (Core Repos, Snapshots, Branching, Remotes, History, Collaboration)
- **Rank Titles** — Dynamic titles based on level:
  - Lv 1: *Apprentice Historian / Temporal Initiate*
  - Lv 2+: *Guild Chronicler / Fleet Operations Cadet*
  - Lv 4+: *High Historian Architect / Senior Temporal Engineer*
  - Lv 7+: *Royal Arch-Mage of Repositories / Starfleet Master Navigator*
  - Lv 10+: *Grand Sovereign of Version Control / Supreme Commander of Timeline*

---

### 🔐 8. Authentication & Cloud Sync

Powered entirely by **Supabase Auth** and **Supabase PostgreSQL**:

| Feature | Implementation |
|---|---|
| **Email/Password** | `supabase.auth.signUp()` / `signInWithPassword()` |
| **Google OAuth** | `supabase.auth.signInWithOAuth({ provider: 'google' })` |
| **GitHub OAuth** | `supabase.auth.signInWithOAuth({ provider: 'github' })` |
| **Demo Mode** | Instant access without registration (pre-populated with 650 XP, 7 chapters, Level 3) |
| **Cloud Sync** | XP, level, streak, completed chapters, achievements, and active world synced to `profiles` table |
| **Session Persistence** | `onAuthStateChange()` listener restores state on return visits |
| **Row Level Security** | Supabase RLS policies protect user data |

**Password validation** (sign-up):
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number, 1 special character
- Confirm password match
- Real-time validation indicators

---

### 🛡️ 9. Admin Panel

A full-featured admin dashboard accessible at `/#admin`, authenticated via Supabase:

- **Admin Login** — Uses `supabase.auth.signInWithPassword()`, checks `is_admin` flag on `profiles` table
- **First-Time Setup** — "Create Admin" flow auto-registers `admin@gitquest.com` with `is_admin: true`
- **User Management Table** — Searchable, sortable, all columns:
  - Username, Email, College, XP, Level, Streak, Completed Chapters, Achievements, Provider, Active World, Admin Status
- **Inline Edit Modal** — Modify any field for any user (including JSON arrays for chapters/achievements)
- **Delete Users** — With confirmation dialog (admin accounts are protected)
- **Stats Dashboard** — Total users, Average XP, Total chapters completed, Active streaks
- **Runs independently** of the game — `AdminPanel` renders outside `GameProvider`

---

### 🎨 10. UI/UX Design System

- **Dual Theme Engine** — Dark mode (default) + Light mode toggle with full CSS override system
- **Glassmorphism** — Frosted glass panels with `backdrop-filter: blur()` throughout
- **Dynamic Glow Effects** — Theme-colored shadows, hover glows, and spotlight auras
- **Responsive Layout** — Desktop sidebar (collapsible with hover) + Mobile bottom nav bar
- **Micro-animations** — Hover scale transforms, slide transitions, pulse rings, fade-ins
- **Custom Scrollbars** — Styled thin scrollbars matching the dark theme
- **Typography** — Inter (sans) + JetBrains Mono (code/terminal) via system font stack

---

## 🛠️ Technology Stack

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **[React](https://react.dev/)** | 19.2.8 | UI component library with hooks-based state management |
| **[TypeScript](https://www.typescriptlang.org/)** | 6.0.2 | Static type checking across all components and data models |
| **[Vite](https://vitejs.dev/)** | 8.2.0 | Lightning-fast dev server with HMR and optimized production builds |
| **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** | 6.0.4 | React Fast Refresh and JSX transform for Vite |

### Styling & Design

| Technology | Version | Purpose |
|---|---|---|
| **[Tailwind CSS](https://tailwindcss.com/)** | 3.4.19 | Utility-first CSS framework for rapid UI development |
| **[PostCSS](https://postcss.org/)** | 8.5.26 | CSS transformation pipeline (Tailwind processing) |
| **[Autoprefixer](https://github.com/postcss/autoprefixer)** | 10.5.4 | Automatic vendor prefix insertion for cross-browser CSS |
| **Vanilla CSS** | — | 16+ custom `@keyframes` animations, glassmorphism helpers, light mode overrides |

### Backend & Auth

| Technology | Version | Purpose |
|---|---|---|
| **[Supabase JS Client](https://supabase.com/docs/reference/javascript)** | 2.112.2 | Auth (email, OAuth), PostgreSQL database, real-time subscriptions |
| **Supabase Auth** | — | Email/password sign-up, Google OAuth, GitHub OAuth, session management |
| **Supabase PostgreSQL** | — | `profiles` table with RLS for user data persistence |

### UI Libraries

| Technology | Version | Purpose |
|---|---|---|
| **[Lucide React](https://lucide.dev/)** | 1.30.0 | 200+ crisp SVG icons (Shield, Flame, Trophy, Terminal, etc.) |
| **[Framer Motion](https://www.framer.com/motion/)** | 13.0.0 | Spring-based animations, layout transitions, gesture interactions |

### Audio

| Technology | Purpose |
|---|---|
| **Web Audio API** | Synthesized sound effects — key presses, clicks, errors, victory fanfares — no audio files needed |

### Tooling & Quality

| Tool | Version | Purpose |
|---|---|---|
| **[OxLint](https://oxc-project.github.io/docs/guide/usage/linter.html)** | 1.75.0 | Ultra-fast Rust-based JavaScript/TypeScript linter |
| **TypeScript Compiler** | 6.0.2 | Type checking with strict mode via `tsconfig.app.json` |

### Deployment

| Platform | Configuration |
|---|---|
| **[Vercel](https://vercel.com/)** | Zero-config deployment via `vercel.json` with Vite framework detection |
| **Build Command** | `tsc -b && vite build` |
| **Output Directory** | `dist/` |
| **SPA Routing** | Catch-all route redirects to `index.html` |

---

## 🏗️ Architecture & Design Patterns

### State Management

The entire app state is managed via **React Context API** (`GameContext.tsx`), providing:

```
GameProvider
├── Auth State (isLoggedIn, user, login/logout)
├── Game Progress (xp, level, streak, completedChapters, achievements)
├── World State (activeWorld: 'kingdom' | 'space')
├── Git Simulation (gitState: branches, commits, working dir, staged files)
├── UI State (themeMode, soundEnabled, showMissionComplete)
└── Supabase Sync (syncProgressToDb — auto-persist on every state change)
```

**Persistence layers:**
1. **Supabase PostgreSQL** — Primary cloud storage (synced on every XP/level/streak/chapter change)
2. **localStorage** — Offline fallback and fast hydration on page load
3. **Supabase Auth session** — Restored via `onAuthStateChange()` listener

### Git Simulation Engine

The terminal's Git simulator uses a **step-based validation state machine**:

```
Chapter → validationSteps[] → validate(command, gitState) → { success, nextStateUpdate }
```

Each chapter defines validation steps that:
1. Parse the user's input command
2. Compare against expected Git syntax
3. Return state mutations (new branches, commits, file moves)
4. Advance the step index until all tasks are complete

The `GitState` interface tracks:
- `isInitialized` — whether `git init` has been run
- `currentBranch` — active HEAD branch
- `branches[]` — all branch names
- `workingDirectory[]` — untracked/modified files
- `stagedFiles[]` — files in staging area
- `commits[]` — full commit objects (hash, message, author, timestamp, branch, files)
- `stashedFiles[]` — stashed working changes
- `remoteUrl` — configured remote origin
- `isPushed` — whether `git push` has been executed

### Component Architecture

```
App.tsx
├── #admin route → AdminPanel (outside GameProvider)
│   ├── AdminLogin.tsx (Supabase auth with is_admin check)
│   └── AdminDashboard.tsx (CRUD table for all profiles)
│
└── Default route → GameProvider → AppContent
    ├── LandingPage → Auth → WorldSelection → Game Layout
    │
    └── Game Layout
        ├── Sidebar.tsx (collapsible nav + universe switcher)
        ├── Navbar.tsx (top bar)
        ├── MobileNavBar.tsx (bottom nav for mobile)
        ├── ChatBot.tsx (floating AI tutor)
        │
        └── Tab Content
            ├── Home.tsx (command center dashboard)
            ├── Dashboard.tsx (curriculum roadmap)
            ├── LearningScreen.tsx (3-panel mission screen)
            │   ├── StoryWorld.tsx → scenes/Scene*.tsx
            │   ├── GitTimeline.tsx (SVG commit graph)
            │   └── Terminal.tsx (command shell)
            ├── Achievements.tsx
            ├── Leaderboard.tsx (real Supabase data)
            ├── Profile.tsx (stats, skill radar, badges)
            ├── EditProfile.tsx
            └── Settings.tsx
```

---

## 🗄️ Supabase Database Schema

### `profiles` Table

| Column | Type | Default | Description |
|---|---|---|---|
| `id` | `uuid` (PK) | `auth.uid()` | References `auth.users.id` |
| `username` | `text` | `null` | Display name |
| `email` | `text` | `null` | User email |
| `college_name` | `text` | `null` | College/institution name |
| `xp` | `integer` | `0` | Total experience points |
| `level` | `integer` | `1` | Current level (1 level = 300 XP) |
| `streak` | `integer` | `0` | Consecutive day streak |
| `completed_chapters` | `integer[]` | `[]` | Array of completed chapter IDs |
| `achievements` | `text[]` | `[]` | Array of achievement names |
| `provider` | `text` | `'supabase'` | Auth provider (`supabase`, `google`, `github`) |
| `active_world` | `text` | `'kingdom'` | Active theme (`kingdom` or `space`) |
| `is_admin` | `boolean` | `false` | Admin access flag |
| `created_at` | `timestamptz` | `now()` | Account creation time |
| `updated_at` | `timestamptz` | `now()` | Last profile update |

### SQL Setup

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  college_name TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  completed_chapters INTEGER[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  provider TEXT DEFAULT 'supabase',
  active_world TEXT DEFAULT 'kingdom',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles (for leaderboard)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 🛡️ Admin Panel

### Setup

1. **Add the `is_admin` column** (if not already present):
   ```sql
   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
   ```

2. **Navigate to** `http://your-app-url/#admin`

3. **First-time setup**: Click "Create Admin" tab → enter `admin@gitquest.com` / `Admin@2026` → submit

4. **Login**: Use the admin credentials to access the dashboard

### Features

| Feature | Description |
|---|---|
| **Supabase Auth** | Admin login verified via `signInWithPassword()` + `is_admin` flag check |
| **User Table** | All profiles displayed with sortable columns and search |
| **Edit Any User** | Modal with fields for username, email, college, XP, level, streak, world, admin flag, chapters (JSON), achievements (JSON) |
| **Delete Users** | Confirmation dialog (admin accounts protected from deletion) |
| **Stats Overview** | Total users, Average XP, Total chapters completed, Active streaks |
| **Independent Auth** | Admin panel runs outside `GameProvider` — separate session from game |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (recommended: v20+)
- **npm** v9+
- A **Supabase** project (free tier works)

### Setup

```bash
# Clone the repository
git clone https://github.com/KiShOrE-2008/GitQuest.git
cd GitQuest

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials:
#   VITE_SUPABASE_URL=https://<your-project>.supabase.co
#   VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL (e.g., `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public API key (safe for client-side) |

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note:** The anon key is a **publishable** key designed for client-side use. Row Level Security (RLS) policies on your Supabase tables protect data access.

---

## 📁 Project Structure

```
GitQuest/
├── public/
│   ├── favicon.svg                    # Custom SVG favicon
│   └── icons.svg                      # SVG icon sprite
├── src/
│   ├── components/
│   │   ├── scenes/                    # Story World animation scenes (per chapter)
│   │   │   ├── SceneFoundations.tsx   # Chapters 1–5 (init, status, add, commit, log)
│   │   │   ├── SceneBranching.tsx     # Chapters 6–9 (branch, checkout, merge, conflicts)
│   │   │   ├── SceneRemotes.tsx       # Chapters 10–12 (push, clone, fork)
│   │   │   ├── SceneHistory.tsx       # Chapters 13–17 (reset, revert, rebase, cherry-pick, stash)
│   │   │   └── SceneCollabFinal.tsx   # Chapters 18–20 (pull, PRs, final boss)
│   │   ├── Achievements.tsx           # Achievement badges grid
│   │   ├── AdminDashboard.tsx         # 🛡️ Admin user management CRUD panel
│   │   ├── AdminLogin.tsx             # 🛡️ Admin Supabase auth login
│   │   ├── Auth.tsx                   # Supabase Auth sign-up / login modal
│   │   ├── ChatBot.tsx               # 🤖 GitGuide floating AI chatbot
│   │   ├── Dashboard.tsx             # Curriculum roadmap (Learn Map)
│   │   ├── EditProfile.tsx           # Profile editing form
│   │   ├── GitTimeline.tsx           # SVG commit visualization
│   │   ├── Home.tsx                  # Command center overview dashboard
│   │   ├── LandingPage.tsx           # Landing/marketing page
│   │   ├── Leaderboard.tsx           # Live Supabase leaderboard (real data only)
│   │   ├── LearningScreen.tsx        # 3-layer mission screen layout
│   │   ├── MissionComplete.tsx       # Completion overlay with XP animation
│   │   ├── MobileNavBar.tsx          # Bottom nav for mobile devices
│   │   ├── Navbar.tsx                # Top navigation bar
│   │   ├── Profile.tsx               # Player profile, stats, skill radar, badges
│   │   ├── Settings.tsx              # Theme toggle, sound, account management
│   │   ├── Sidebar.tsx               # Collapsible desktop navigation sidebar
│   │   ├── StoryWorld.tsx            # Scene dispatcher + "What Just Happened?" card
│   │   ├── Terminal.tsx              # Simulated Git terminal shell
│   │   └── WorldSelection.tsx        # Kingdom vs Space universe picker
│   ├── context/
│   │   └── GameContext.tsx           # Central React Context (state + auth + Supabase sync)
│   ├── lib/
│   │   └── supabase.ts              # Supabase client singleton
│   ├── data/
│   │   └── chapters.ts              # 20-chapter mission data + validation step definitions
│   ├── utils/
│   │   └── audio.ts                 # Web Audio API synthesized sound effects engine
│   ├── App.tsx                      # Root component with hash routing (#admin)
│   ├── App.css                      # Additional app-level styles
│   ├── index.css                    # Tailwind base + 16 custom @keyframes + glassmorphism
│   └── main.tsx                     # React DOM entry point
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment variable template
├── index.html                        # HTML entry point with SEO meta tags
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind configuration (custom colors, fonts)
├── postcss.config.js                 # PostCSS plugins (Tailwind, Autoprefixer)
├── tsconfig.json                     # TypeScript base config
├── tsconfig.app.json                 # App-specific TS config (strict mode)
├── tsconfig.node.json                # Node/build TS config
├── vite.config.ts                    # Vite configuration
├── vercel.json                       # Vercel deployment config with SPA routing
└── .oxlintrc.json                    # OxLint configuration
```

---

## 🎬 Custom Animations

GitQuest uses **16 custom CSS `@keyframes`** animations defined in `index.css`:

| Animation | CSS Class | Usage |
|---|---|---|
| `float-up` | `.anim-float-up` | Elements entering with upward float |
| `stamp-in` | `.anim-stamp` | Victory stamp appearing with bounce |
| `draw-path` | `.anim-draw-path` | SVG path stroke drawing effect |
| `rewind-flash` | `.anim-rewind` | Flash effect for `git reset` rewind |
| `rocket-fly` | — | Rocket launch for `git push` |
| `conflict-shake` | `.anim-shake` | Screen shake for merge conflicts |
| `glow-ring` | `.anim-glow-ring` | Pulsing glow border effect |
| `slide-right` | `.anim-slide-r` | Horizontal slide-in from left |
| `slide-left` | `.anim-slide-l` | Horizontal slide-in from right |
| `merge-converge` | `.anim-merge` | SVG lines converging for merge |
| `twinkle` | `.anim-twinkle` | Star twinkle effect (Space theme) |
| `drift-up` | — | Gentle upward drift and fade |
| `pulse-ring` | `.anim-pulse-ring` | Expanding ring pulse effect |
| `cherry-pop` | `.anim-cherry` | Pop-in for `git cherry-pick` |
| `vault-close` | `.anim-vault` | Vault door closing for `git stash` |
| `chat-in` / `chatbot-open` | `.anim-chatbot-in` | Spring-based chatbot panel entrance |

---

## 🌐 Deployment

### Vercel (Recommended)

The project includes a `vercel.json` for zero-config deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repo to Vercel for automatic deployments on push.

### Manual Build

```bash
npm run build
# Output in dist/ — serve with any static file server
```

---

## 📜 Scripts

| Script | Command | Description |
|---|---|---|
| **Dev Server** | `npm run dev` | Start Vite dev server with HMR at `localhost:5173` |
| **Build** | `npm run build` | TypeScript check + Vite production build to `dist/` |
| **Preview** | `npm run preview` | Preview the production build locally |
| **Lint** | `npm run lint` | Run OxLint for code quality checks |

---

## 📝 License

MIT License — see `LICENSE` for details.

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/KiShOrE-2008">KiShOrE</a></strong>
  <br />
  <em>Learn Git. Save the Kingdom. Explore the Universe.</em>
</p>
