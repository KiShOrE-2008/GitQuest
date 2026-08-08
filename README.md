# ⚔️ GitQuest — Interactive Gamified Git Learning Platform 🚀

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**GitQuest** (also known as *GitVerse*) is an immersive, gamified web application designed to teach version control and Git concepts through interactive storytelling, simulated terminal environments, and real-time commit graph visualizations.

---

## 🌟 Key Features

### 🏰 1. Dual Storyline Universes
Switch anytime between two story worlds without losing your progress:
- **🏰 Kingdom Chronicles**: Medieval theme where you act as the Royal Historian establishing archives, approving construction blueprints, building magic towers, and issuing decrees.
- **🚀 Space Odyssey**: Sci-fi theme where you serve as a Starfleet Operator calibrating timeline cores, repairing station modules, managing reactor experiments, and deploying satellite uplinks.

---

### 💻 2. Simulated Git Terminal Shell
- Full CLI simulator validating real Git syntax: `git init`, `git status`, `git add`, `git commit`, `git log`, `git branch`, `git checkout`, `git merge`, `git push`, `git pull`, `git clone`, `git reset`, `git revert`, `git rebase`, `git stash`, and merge conflict resolution.
- Instant feedback with colored terminal output, task completion banners, and helpful error guidance.
- Hotkey buttons for quick action testing and terminal reset capabilities.

---

### 📊 3. Interactive Live Git Timeline Graph
- SVG-based commit node graph visualizing HEAD pointers, branch splits, merge curves, and commit metadata.
- Hover tooltips displaying commit hashes, author details, modified files, and timestamps.
- Synchronized rendering that updates dynamically as you execute commands in the terminal shell.

---

### 🗺️ 4. 20-Chapter Storyline Curriculum
Progressive curriculum covering beginner to advanced version control domains:
1. **Welcome to Git** (`git init`)
2. **Working Directory** (`git status`)
3. **Staging Area** (`git add`)
4. **Commit** (`git commit -m`)
5. **Git Log** (`git log`)
6. **Branch** (`git branch`)
7. **Checkout** (`git checkout`)
8. **Merge** (`git merge`)
9. **Merge Conflict** (Conflict resolution)
10. **GitHub & Remote** (`git push origin main`)
11. **Clone** (`git clone`)
12. **Fork** (`git fork`)
13. **Reset** (`git reset --hard`)
14. **Revert** (`git revert`)
15. **Rebase** (`git rebase`)
16. **Cherry Pick** (`git cherry-pick`)
17. **Stash** (`git stash`)
18. **Team Collaboration** (`git pull`)
19. **Pull Request** (`git pr`)
20. **Final Boss** (Multi-branch temporal salvation)

---

### 🏆 5. Gamification & Player Mechanics
- **Experience Points (XP) & Levels**: Earn XP for every completed mission and level up your player rank.
- **Daily Streak Tracker**: Track active learning days with animated streak counters.
- **Achievement Badges**: Unlock badges (*First Commit*, *Branch Explorer*, *Merge Master*, *Conflict Resolver*, *Git Hero*).
- **Global Leaderboard**: Compare ranks, XP, level status, and college/institute affiliations.
- **Git Skillset Matrix**: Visual domain breakdown of repository competencies.

---

### 🎨 6. Glassmorphic Design & Light/Dark Theme Switching
- Modern responsive interface with glassmorphism panels, glowing ambient spotlights, and sleek typography.
- Built-in UI Style Theme switcher supporting both **Dark Mode** and **Light Mode**.
- User profile management with live avatar previews and editable credentials (username, email, institute).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS, Glassmorphism design system
- **Icons & UI**: Lucide React Icons
- **Audio**: Web Audio API (synthesizer feedback, victory & error sound effects)
- **Backend (Optional Sync)**: Node.js, Express, MongoDB authentication & cloud progress synchronization API

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KiShOrE-2008/GitQuest.git
   cd GitQuest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
GitQuest/
├── public/                 # Static public assets
├── server/                 # Express backend API & authentication server
├── src/
│   ├── assets/             # Images and audio assets
│   ├── components/         # React UI components
│   │   ├── Achievements.tsx # Badges & unlocked rewards view
│   │   ├── Auth.tsx         # Sign in / Register modal & auth flow
│   │   ├── Dashboard.tsx    # Curriculum Story Roadmap (Learn Map)
│   │   ├── EditProfile.tsx  # User details & handle editing screen
│   │   ├── GitTimeline.tsx  # SVG commit visualization graph
│   │   ├── Home.tsx         # Command Center & player overview dashboard
│   │   ├── LandingPage.tsx  # Interactive product hero landing screen
│   │   ├── Leaderboard.tsx  # Global player ranking table
│   │   ├── LearningScreen.tsx # Active mission story & console view
│   │   ├── MissionComplete.tsx # Chapter victory celebration overlay
│   │   ├── Navbar.tsx       # Top navigation header & XP bar
│   │   ├── Profile.tsx      # Player profile & skill matrix
│   │   ├── Settings.tsx     # Configuration, audio & theme controls
│   │   ├── Sidebar.tsx      # Workspace side menu & universe jump widget
│   │   ├── Terminal.tsx     # Simulated Git command line shell
│   │   └── WorldSelection.tsx # Storyline universe selection
│   ├── context/
│   │   └── GameContext.tsx  # Centralized game state, Git simulator & auth provider
│   ├── data/
│   │   └── chapters.ts      # 20-chapter story missions, validation steps & data
│   ├── utils/
│   │   └── audio.ts         # Web Audio API sound synthesizer utilities
│   ├── App.tsx              # Root application router & workspace shell
│   ├── index.css            # Tailwind directives & theme style rules
│   └── main.tsx             # React DOM entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more details.
