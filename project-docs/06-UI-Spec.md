# 06. UI/UX Design Specification

## 1. Design System & Aesthetics

- **Style**: Obsidian-inspired clean dark mode, distraction-free layout, sharp crisp borders, solid surfaces (no glassmorphism), highly readable, smooth micro-interactions.
- **Typography**: Inter / JetBrains Mono via Google Fonts.
- **Color Palette**:
  - Main Background: Deep Charcoal `#1E1E1E`
  - Sidebar / Panel Surface: Dark Obsidian `#181818`
  - Card / Container Surface: Neutral Dark `#262626`
  - Hover / Active Surface: Elevated Dark `#2E2E2E`
  - Borders: Crisp Neutral `#333333`
  - Primary Accent: Obsidian Purple `#7F6DF2`
  - Secondary Accent (Success): Emerald Green `#10B981`
  - Warning / Wrong: Muted Crimson `#E11D48`
  - Text Primary: Soft Light `#E4E4E7`, Text Secondary: Muted Slate `#A1A1AA`

---

## 2. Key Pages & Layouts

### 2.1 Workspace & Folder Navigation View
- **Left Sidebar**: Expandable nested folder tree with icons, colors, search bar, active streak display, and quick actions ("+ New Folder", "+ Upload Chapter").
- **Main Workspace Canvas**: Breadcrumb navigation (`Workspace > History > Ancient History > Chapter 1`), folder grid/list view, chapter cards with progress indicators.

### 2.2 Chapter Learning Hub
- **Header**: Chapter Title, Subject badge, total solved count, mastery gauge (e.g. `82%`).
- **Tab Bar**:
  - 📄 **Notes**: Chapter text viewer / doc preview.
  - 🧠 **Quiz Generator**: Question count sliders, difficulty selector, type checkboxes, "Generate Quiz" button.
  - 📊 **Analytics**: Concept mastery radar/bar chart, weak concepts breakdown.
  - ⭐ **Bookmarks**: Saved questions for quick review.
  - 📝 **Personal Notes**: Student notes per question/concept.

### 2.3 Interactive Quiz Runner Component
- **Header Bar**: Live Countdown Timer, Progress Bar (`Question 3 of 15`), Bookmark toggle star, Flag toggle button.
- **Center Canvas**: Card container with question text, clean option selector (A, B, C, D) with hover state animations.
- **Side Palette**: Interactive Question Palette (Grid 1..N: Solved=Green, Unsolved=Gray, Bookmarked=Purple, Flagged=Yellow).
- **Footer**: `Previous`, `Next`, and prominent `Submit Quiz` trigger.

### 2.4 Quiz Result & Performance Dashboard
- Score ring / gauge banner (`Score: 16/20 - 80% Accuracy`).
- Performance Breakdown: Time taken, correct vs. wrong breakdown, average speed.
- Smart Action Buttons: `🔄 Retry Weak Concepts`, `🎯 Generate Revision Quiz`, `📄 Review Detailed Explanations`.
