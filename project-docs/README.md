# ExamPrep AI - Project Documentation

Welcome to the documentation suite for **ExamPrep AI** — an AI-powered Government Exam Preparation Platform that transforms study materials into dynamic, unique, and adaptive multiple-choice quizzes.

---

## 📚 Documentation Index

| File | Document | Description |
| :--- | :--- | :--- |
| [`01-PRD.md`](./01-PRD.md) | **Product Requirements Document** | Problem statement, target users, core features, unique question strategy, adaptive learning, success metrics. |
| [`02-SRS.md`](./02-SRS.md) | **Software Requirements Specification** | Functional & non-functional requirements, system constraints, security, performance standards. |
| [`03-Database.md`](./03-Database.md) | **Database Schema Specification** | MongoDB collection schemas (`Users`, `Folders`, `Chapters`, `Quizzes`, `Questions`, `RetrySessions`, `Bookmarks`). |
| [`04-API.md`](./04-API.md) | **REST API Reference** | Complete endpoint definitions for Auth, Folders, Chapters, Quiz Generation, Retry Engine, Analytics, Bookmarks. |
| [`05-AI-Prompts.md`](./05-AI-Prompts.md) | **AI Generation & Prompt Strategy** | System prompts, payload structures, Gemini 2.5 Flash Lite & OpenRouter fallback strategy, duplicate prevention logic. |
| [`06-UI-Spec.md`](./06-UI-Spec.md) | **UI/UX Design Specification** | Design system, Obsidian dark color palette, workspace folder view, interactive quiz runner, analytics dashboard. |
| [`07-Cursor-Rules.md`](./07-Cursor-Rules.md) | **Coding Guidelines & Rules** | Project rules, file conventions, architectural constraints, state management patterns. |
| [`08-Roadmap.md`](./08-Roadmap.md) | **Development Roadmap** | Execution phases from documentation setup to backend, frontend, AI integration, and production deployment. |
| [`09-Folder-Structure.md`](./09-Folder-Structure.md) | **Folder Architecture** | Workspace file-system UI hierarchy and repository codebase structure (`frontend/` & `backend/`). |
| [`10-User-Flows.md`](./10-User-Flows.md) | **User Journey & Flows** | Step-by-step user interaction paths from study material upload to adaptive retries and smart revision. |

---

## 🛠️ Technology Stack Overview

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI, Zustand, TanStack Query
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Auth
- **AI Infrastructure**: Primary: Google Gemini 2.5 Flash Lite \| Backup: OpenRouter Free Models (Qwen, DeepSeek, Llama)
