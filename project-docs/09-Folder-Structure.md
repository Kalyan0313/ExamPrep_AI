# 09. Folder Structure & Architecture

## 1. User Workspace Hierarchy (Logical Folder Tree)

```text
My Workspace
│
├── SSC Exams
│   ├── General Awareness
│   │   ├── Indian History
│   │   │   ├── Chapter 1: Ancient India
│   │   │   │   ├── 📄 Study Notes
│   │   │   │   ├── 🧠 AI Quizzes
│   │   │   │   ├── 🔄 Adaptive Retry Quiz
│   │   │   │   ├── 📊 Concept Analytics
│   │   │   │   └── ⭐ Bookmarks
│   │   │   └── Chapter 2: Medieval India
│   │   └── Indian Polity
│   └── Quantitative Aptitude
│
├── Banking & Insurance
│   └── Reasoning Ability
│
└── Custom Notes & Documents
```

---

## 2. Codebase Directory Structure

```text
ExamPrep_AI/
├── project-docs/           # Project specifications & PRD documents
├── backend/
│   ├── config/             # DB connection, environment config
│   ├── controllers/        # Route logic handlers (auth, folders, chapters, quiz, analytics)
│   ├── middleware/         # JWT auth, error handler, file upload
│   ├── models/             # Mongoose schemas (User, Folder, Chapter, Quiz, Question, Bookmark)
│   ├── routes/             # Express API routes
│   ├── services/
│   │   ├── ai/
│   │   │   ├── gemini.service.js     # Primary Gemini 2.5 Flash Lite engine
│   │   │   └── openrouter.service.js # Fallback OpenRouter engine
│   │   └── parser.service.js         # PDF / DOCX / TXT text extraction
│   ├── utils/              # Hash calculators, response helpers
│   └── server.js           # Server entry point
│
└── frontend/
    ├── app/                # Next.js App Router pages
    │   ├── dashboard/      # Main dashboard & workspace view
    │   ├── chapters/[id]/  # Chapter Learning Hub
    │   ├── quiz/[id]/      # Interactive Quiz Runner
    │   ├── analytics/      # Performance analytics page
    │   └── page.tsx        # Landing / auth page
    ├── components/         # Shared UI components & Shadcn primitives
    │   ├── workspace/      # FolderTree, FolderCard, ChapterCard
    │   ├── quiz/           # QuestionCard, Timer, Palette, ResultSummary
    │   └── ui/             # Buttons, Modals, Badges, Inputs
    ├── hooks/              # Custom React hooks
    ├── store/              # Zustand state stores (authStore, folderStore, quizStore)
    ├── services/           # Axios / Fetch API client functions
    └── types/              # TypeScript interfaces
```
