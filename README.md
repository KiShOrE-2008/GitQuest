# ⚔️ GitQuest — Interactive Gamified Git Learning Platform 🚀

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

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

**Animation domains:**

| Domain | Chapters | Complexity | Techniques |
|---|---|---|---|
| 🟢 Foundations | 1–5 | Basic | Fade, slide, stamp, glow ring |
| 🟡 Branching | 6–9 | Intermediate | SVG path split, portal, conflict shake |
| 🟡 Remotes | 10–12 | Intermediate | Messenger travel, clone, fork split |
| 🔴 History | 13–17 | Advanced | Rewind flash, SVG reorder, cherry-pick, vault |
| 🟣 Boss | 18–20 | Boss | Multi-source convergence, 5-branch repair |

---

### 💻 3. Simulated Git Terminal Shell

Full CLI simulator validating real Git syntax for every chapter:

```
git init      git status    git add       git commit    git log
git branch    git checkout  git merge     git push      git pull
git clone     git remote    git reset     git revert    git rebase
git cherry-pick   git stash   git fetch   git diff      git tag
```

- Instant colored terminal feedback
- `✓ Task complete` and `✗ Error` ANSI-style output
- `help` and `clear` meta-commands built in

---

### 🤖 4. GitGuide — AI Chatbot Tutor

A floating, world-themed Git tutor chatbot always available during gameplay:

- **Context-aware** — knows your current chapter and active world theme
- **Chapter hints** — type "hint" to get the exact command needed for your current mission
- **Git knowledge base** — explains all 20+ Git commands with examples
- **Quick reply chips** — one-tap access to common questions
- **Comparisons** — reset vs revert, merge vs rebase, fetch vs pull explained clearly
- **Typing indicator** — animated dots for a real AI feel
- **Unread badge** — notification dot when bot replies while chat is closed

Ask it things like:
- *"Hint for this chapter"*
- *"What is git rebase?"*
- *"Reset vs revert?"*
- *"How does branching work?"*
- *"What commands are available?"*

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
- **Global Leaderboard** — Live player rankings by XP, level, and institute
- **Git Skillset Radar** — Competency chart across all 6 Git domains
- **Mission Accomplished Overlay** — Delayed reveal after completion animation fully plays

---

### 🔐 8. Auth & Account System

- **Email/Password sign-up and login** with full client-side validation
  - Email format validation with real-time feedback
  - Password strength checklist (8+ chars, uppercase, lowercase, number, special char)
  - Confirm password match indicator
  - Submit button disabled during loading to prevent duplicate requests
  - Password show/hide toggle
  - `autoComplete` attributes for password manager support
- **OAuth simulation** — Google and GitHub social login flows
- **Demo Sandbox Mode** — Instant access without registration
- **Offline fallback** — Works without backend; auto falls back to local profile
- **Cloud sync** — Progress persists to MongoDB via Express API when backend is available
- **JWT authentication** — 7-day token with `Authorization: Bearer` header

---

### 🎨 9. UI Design System

- **Dark / Light Mode** — Full theme switch, persisted to localStorage
- **Glassmorphism Panels** — Backdrop blur, ambient glow spotlights
- **Responsive Layout** — Mobile tab switcher (Story | Timeline | Terminal), 3-panel desktop view
- **Custom Animations** — 16 `@keyframes`: `float-up`, `stamp-in`, `draw-path`, `rewind-flash`, `merge-converge`, `cherry-pop`, `vault-close`, `conflict-shake`, `chat-in`, `typing`, and more
- **Sound System** — Web Audio API synthesized key press, click, error, and victory sounds

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 6, Vite 8 |
| **Styling** | Tailwind CSS 3.4, Vanilla CSS, custom `@keyframes` |
| **Icons** | Lucide React |
| **Animations** | CSS keyframes + SVG `stroke-dashoffset` |
| **Audio** | Web Audio API (synthesized sound effects) |
| **Backend** | Node.js, Express 4, MongoDB Atlas, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/KiShOrE-2008/GitQuest.git
cd GitQuest

# Install frontend dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

### Backend Setup (optional — for cloud sync & auth persistence)

```bash
cd server

# Install backend dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env:
#   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/gitverse
#   JWT_SECRET=your_secret_key
#   PORT=5000

# Start server
npm run dev   # with nodemon (hot reload)
npm start     # production
```

> Without the backend, the app works fully in **offline mode** — progress is stored in `localStorage`.

---

## 📁 Project Structure

```
GitQuest/
├── public/
├── server/                         # Optional Express auth + sync API
│   ├── models/
│   │   └── User.js                 # Mongoose user schema
│   ├── routes/
│   │   └── auth.js                 # /signup /login /sync endpoints
│   ├── server.js                   # Express app entry point
│   └── .env                        # MongoDB URI + JWT secret
└── src/
    ├── components/
    │   ├── scenes/                  # Story World animation scenes (per chapter)
    │   │   ├── SceneFoundations.tsx # Ch 1–5
    │   │   ├── SceneBranching.tsx   # Ch 6–9
    │   │   ├── SceneRemotes.tsx     # Ch 10–12
    │   │   ├── SceneHistory.tsx     # Ch 13–17
    │   │   └── SceneCollabFinal.tsx # Ch 18–20
    │   ├── Achievements.tsx
    │   ├── Auth.tsx                 # Sign in / Sign up with validation
    │   ├── ChatBot.tsx              # 🤖 GitGuide floating AI chatbot
    │   ├── Dashboard.tsx            # Curriculum roadmap (Learn Map)
    │   ├── EditProfile.tsx
    │   ├── GitTimeline.tsx          # SVG commit visualization
    │   ├── Home.tsx                 # Command center overview dashboard
    │   ├── LandingPage.tsx
    │   ├── Leaderboard.tsx
    │   ├── LearningScreen.tsx       # 3-layer mission screen layout
    │   ├── MissionComplete.tsx      # Completion overlay (delayed reveal)
    │   ├── MobileNavBar.tsx
    │   ├── Navbar.tsx
    │   ├── Profile.tsx
    │   ├── Settings.tsx
    │   ├── Sidebar.tsx
    │   ├── StoryWorld.tsx           # Scene dispatcher + WJH card
    │   ├── Terminal.tsx             # Simulated Git terminal shell
    │   └── WorldSelection.tsx
    ├── context/
    │   └── GameContext.tsx          # Central game state, Git simulator, auth logic
    ├── data/
    │   └── chapters.ts             # 20-chapter mission data + validation steps
    ├── utils/
    │   └── audio.ts                # Web Audio API synthesizer
    ├── App.tsx
    ├── index.css                   # Tailwind base + 16 custom @keyframes
    └── main.tsx
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user with hashed password |
| `POST` | `/api/auth/login` | Authenticate and receive JWT token |
| `POST` | `/api/auth/sync` | Sync XP, level, streak, chapters (JWT required) |
| `GET` | `/api/health` | Server + database status check |

---

## 📝 License

MIT License — see `LICENSE` for details.
