# ⚔️ GitQuest — Interactive Gamified Git Learning Platform 🚀

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

**GitQuest** is an immersive, gamified web application that teaches version control and Git through interactive storytelling, animated visual worlds, live commit graph visualization, a real simulated terminal — and an AI-powered Git tutor chatbot — all in one screen.

> 🎮 **Play. Type. Learn. Git.**

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
| **`git branch`** | Kingdom road splits | Wormhole opens |
| **`git merge`** | Kingdoms unite | Timelines fuse |
| **`git reset`** | Prison collapses, history rewinds | Reactor reversal |
| **Conflict** | Two architects, one plot | Shield config collision |

Every Git concept maps 1-to-1 between worlds — same educational outcome, completely different narrative.

---

### 🎬 2. Story World Animation System

Each of the 20 chapters has a dedicated animated scene in **Kingdom** and **Space** variants rendered as a full-width panel at the top of every mission screen.

**Animation phases per chapter:**
- **Idle** — "Before" state, waiting for the student to act
- **Active** — Objects animate in response to executed commands
- **Complete** — Victory stamp + "What Just Happened?" 3-step reveal (shown after animation finishes)

---

### 💻 3. Simulated Git Terminal Shell

Full CLI simulator validating real Git syntax for every chapter:

```
git init      git status    git add       git commit    git log
git branch    git checkout  git merge     git push      git pull
git clone     git remote    git reset     git revert    git rebase
git cherry-pick   git stash   git fetch   git diff      git tag
```

---

### 🤖 4. GitGuide — AI Chatbot Tutor

A floating, world-themed Git tutor chatbot always available during gameplay:

- **Context-aware** — knows your current chapter and active world theme
- **Chapter hints** — type "hint" to get the exact command needed for your current mission
- **Git knowledge base** — explains all 20+ Git commands with examples

---

### 📊 5. Live Git Timeline Visualizer

- SVG commit node graph with HEAD pointer, branch splits, and merge curves
- Hover tooltips showing commit hash, author, modified files, timestamps
- Real-time updates as terminal commands are executed

---

### 🗺️ 6. 20-Chapter Curriculum

Progressive curriculum from absolute beginner to advanced Git user:

| Domain | Chapters | Git Concepts |
|---|---|---|
| Foundations | 1–5 | `init`, `status`, `add`, `commit`, `log` |
| Branching | 6–9 | `branch`, `checkout`, `merge`, conflict resolution |
| Remotes | 10–12 | `push`, `clone`, `fork` |
| History | 13–17 | `reset`, `revert`, `rebase`, `cherry-pick`, `stash` |
| Collaboration | 18–20 | `pull`, pull requests, final boss sequence |

---

### 🏆 7. Gamification & Player System

- **XP & Level Progression** — Earn 100–200 XP per chapter, level up every 300 XP
- **Daily Streak Tracker** — Animated flame counter for active sessions
- **Achievement Badges** — *First Commit* · *Branch Explorer* · *Merge Master* · *Conflict Resolver* · *Git Hero*
- **Global Leaderboard** — Live player rankings powered by Supabase PostgreSQL
- **Git Skillset Radar** — Competency chart across all 6 Git domains

---

### 🔐 8. Supabase Auth & Cloud Database

- **Email/Password sign-up and login** via Supabase Auth
- **Native Social OAuth** — Google and GitHub login
- **Cloud Progress Persistence** — Automatically syncs XP, level, streak, completed chapters, and achievements to Supabase `profiles` table guarded by Row Level Security (RLS)
- **Demo Sandbox Mode** — Instant access without registration

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 6, Vite 8 |
| **Styling** | Tailwind CSS 3.4, Vanilla CSS, custom `@keyframes` |
| **Icons** | Lucide React |
| **Auth & DB** | Supabase Auth, Supabase PostgreSQL (RLS) |
| **Audio** | Web Audio API (synthesized sound effects) |

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

# Configure environment
cp .env.example .env
# Edit .env:
#   VITE_SUPABASE_URL=https://<your-project>.supabase.co
#   VITE_SUPABASE_ANON_KEY=<your-anon-key>

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
└── src/
    ├── components/
    │   ├── scenes/                  # Story World animation scenes (per chapter)
    │   ├── Achievements.tsx
    │   ├── Auth.tsx                 # Supabase Auth sign-up / login modal
    │   ├── ChatBot.tsx              # 🤖 GitGuide floating AI chatbot
    │   ├── Dashboard.tsx            # Curriculum roadmap (Learn Map)
    │   ├── EditProfile.tsx
    │   ├── GitTimeline.tsx          # SVG commit visualization
    │   ├── Home.tsx                 # Command center overview dashboard
    │   ├── LandingPage.tsx
    │   ├── Leaderboard.tsx          # Live Supabase leaderboard
    │   ├── LearningScreen.tsx       # 3-layer mission screen layout
    │   ├── MissionComplete.tsx      # Completion overlay
    │   ├── MobileNavBar.tsx
    │   ├── Navbar.tsx
    │   ├── Profile.tsx
    │   ├── Settings.tsx
    │   ├── Sidebar.tsx
    │   ├── StoryWorld.tsx           # Scene dispatcher + WJH card
    │   ├── Terminal.tsx             # Simulated Git terminal shell
    │   └── WorldSelection.tsx
    ├── context/
    │   └── GameContext.tsx          # Game state & Supabase auth/sync logic
    ├── lib/
    │   └── supabase.ts              # Supabase client singleton
    ├── data/
    │   └── chapters.ts             # 20-chapter mission data + validation steps
    ├── utils/
    │   └── audio.ts                # Web Audio API synthesizer
    ├── App.tsx
    ├── index.css                   # Tailwind base + 16 custom @keyframes
    └── main.tsx
```

---

## 📝 License

MIT License — see `LICENSE` for details.
