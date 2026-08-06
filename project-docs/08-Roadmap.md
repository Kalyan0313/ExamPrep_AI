# 08. Project Implementation Roadmap (10-Phase Plan)

---

## Phase 1: Documentation & System Specification
- [x] Create project specification documents in `project-docs/` (01 to 10 + README).
- [x] Define Obsidian dark design system palette and UI component specs.
- [x] Define database schemas, API contracts, and Gemini prompt strategies.

---

## Phase 2: Project Initialization & Codebase Scaffolding
- [x] Initialize `backend/` Node.js / Express environment and configuration.
- [x] Initialize `frontend/` Next.js App Router app with Tailwind CSS & Shadcn UI primitives.
- [x] Setup Obsidian dark color tokens and global CSS variables.

---

## Phase 3: Database Models & Authentication System
- [x] Setup MongoDB connection & Mongoose models (`User`, `Folder`, `Chapter`, `Quiz`, `Question`, `RetrySession`, `Bookmark`).
- [x] Implement JWT user authentication (Register, Login, Profile, Password hash via bcrypt).
- [x] Build Auth state management in frontend using Zustand & TanStack Query.

---

## Phase 4: Hierarchical Folder Workspace Engine
- [x] Build Folder CRUD REST APIs (`GET`, `POST`, `PUT`, `DELETE`, `PUT /move`).
- [x] Build left sidebar nested folder tree UI with expand/collapse, drag & drop support.
- [x] Implement folder icon and color picker customization.

---

## Phase 5: Study Material Management & Document Parser
- [x] Build Chapter REST API & CRUD endpoints.
- [x] Integrate file parsing service for PDF, DOCX, and TXT uploads.
- [x] Build Chapter Learning Hub UI (Notes Viewer, Quiz History, Analytics tab).

---

## Phase 6: AI Engine & Provider Gateway (Gemini 2.5 Flash Lite + OpenRouter)
- [x] Implement Primary AI service using Google Gemini 2.5 Flash Lite API.
- [x] Implement Backup AI service using OpenRouter Free models (Qwen / DeepSeek / Llama).
- [x] Implement automatic failover middleware (on Gemini rate limit or error).
- [x] Build SHA-256 Question duplicate hash checking middleware.

---

## Phase 7: Interactive Quiz Generation & Runner Engine
- [x] Build Quiz Generator dialog (question count 10–50, difficulty, types).
- [x] Build Interactive Quiz Runner component (Countdown Timer, Question Palette grid, Next/Prev).
- [x] Implement Question Bookmark and Flag toggles during live attempt.

---

## Phase 8: Quiz Scoring & Detailed Performance Analysis
- [x] Build Quiz Submission endpoint (calculates score, accuracy, time taken).
- [x] Build Quiz Result dashboard with score gauges and speed breakdown.
- [x] Implement question review mode with step-by-step AI explanations.

---

## Phase 9: Adaptive Retry Engine & Smart Revision System
- [x] Implement Adaptive Retry Quiz generator targeting wrong `conceptTag` entries.
- [x] Implement Smart Revision Quiz generator targeting overall weak concepts.
- [x] Implement automatic difficulty scaling algorithm (>90% hard, <50% easy).

---

## Phase 10: Performance Analytics, Bookmarks & Final Polish
- [x] Build Analytics Dashboard (accuracy graphs, weak vs. strong concept radar charts).
- [x] Implement Daily Practice Streak System (🔥 7, 15, 30, 100 days).
- [x] Build Bookmarks management page and Personal Notes editor.
- [x] End-to-end testing, UI polish, and deployment preparation.
