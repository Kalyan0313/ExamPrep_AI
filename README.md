# ExamPrep AI 🎓🤖

> An Enterprise-Grade, AI-Powered Adaptive Quiz & Exam Preparation Engine designed for Government & Competitive Exam Preparation.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat-square&logo=googlegemini)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)](LICENSE)

---

## 🌟 Overview

**ExamPrep AI** revolutionizes competitive exam preparation by transforming raw study materials (plain text, PDF documents, DOCX notes) into structured, dynamic, and non-repetitive multiple-choice quizzes (MCQs). Powered by Google Gemini AI, the platform leverages active recall, spaced repetition, and adaptive difficulty scaling to eliminate passive reading and maximize retention.

---

## ✨ Key Features

### 📁 Workspace & Material Management
- **Hierarchical Subject Folders**: Organize study notes by subject, topic, or exam module.
- **Multi-Format Ingestion**: Upload study materials directly via raw text input, `.pdf` parsing, or `.docx` document processing (via `mammoth` & `pdf-parse`).

### 🤖 Adaptive AI Quiz Generation
- **Dynamic MCQ Engine**: Generates unique context-aware questions with plausible distractors, detailed explanations, and specific syllabus context.
- **Strict Schema Enforcement**: Ensures zero hallucinated response formats using Zod schema validation and structured JSON payloads.
- **Configurable Difficulty & Question Count**: Tailor quiz sessions from fast 5-question drills to comprehensive 50-question mock exams.

### 🔄 Smart Retry & Revision System
- **Mistake Targeting Engine**: Automatically isolates incorrect and unattempted questions into targeted retry sessions.
- **Spaced Repetition Loop**: Track mastery progress over repeated attempts until 100% accuracy is achieved on weak topics.

### 🔖 Bookmarks & Performance Analytics
- **Smart Bookmarking**: Save tricky questions for quick reference and focused review sessions.
- **Visual Performance Dashboard**: High-level metrics tracking accuracy percentage, total quizzes completed, weak areas, and score progression over time.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │   ExamPrep AI Client    │
                       │ Next.js 14 / Zustand    │
                       └────────────┬────────────┘
                                    │ REST API (JSON / Multipart)
                                    ▼
                       ┌─────────────────────────┐
                       │   Express API Server    │
                       │ Middleware / JWT / Zod │
                       └─────┬──────────────┬────┘
                             │              │
        ┌────────────────────┴┐            ┌┴────────────────────┐
        │   MongoDB Database  │            │  Google Gemini AI   │
        │ Mongoose Schemas    │            │ Generative AI API   │
        └─────────────────────┘            └─────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack React Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Obsidian dark theme design system
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **File Ingestion**: `multer`, `pdf-parse`, `mammoth` (DOCX parsing)
- **Validation**: [Zod](https://zod.dev/)

### AI & Prompt Engineering
- **Model**: Google Gemini 2.5 Flash Lite (`@google/generative-ai`)
- **Strategy**: System prompt isolation, JSON schema constraint enforcement, distractor plausibility tuning

---

## 📂 Repository Structure

```
ExamPrep_AI/
├── frontend/                   # Next.js 14 Client Application
│   ├── components/             # Reusable UI & Workspace Components
│   │   ├── ui/                 # Core UI Primitives (Modals, Buttons, Badges)
│   │   └── workspace/          # Folder, Chapter & Quiz Components
│   ├── store/                  # Zustand Store Modules (folderStore, chapterStore)
│   ├── services/               # API Client Service Abstractions
│   ├── app/                    # Next.js App Router Pages
│   └── public/                 # Static Assets
│
├── backend/                    # Express.js REST API Server
│   ├── controllers/            # Business Logic & Request Handlers
│   ├── models/                 # Mongoose Database Schemas
│   ├── routes/                 # Express Route Definitions
│   ├── middleware/             # Auth JWT & Multer File Upload Middlewares
│   ├── services/               # Gemini AI Generation Services
│   └── utils/                  # Document Parsers & Helper Functions
│
├── project-docs/               # Technical Documentation Suite
│   ├── 01-PRD.md               # Product Requirements
│   ├── 02-SRS.md               # Software Requirements Specification
│   ├── 03-Database.md          # Database Schema Specification
│   ├── 04-API.md               # REST API Endpoint Documentation
│   └── ...                     # System Prompts, Roadmap & Specs
│
└── README.md                   # System Overview & Quick Start Guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm** or **yarn**
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas connection string
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Repository Setup
```bash
git clone https://github.com/your-username/ExamPrep_AI.git
cd ExamPrep_AI
```

---

### 2. Backend Configuration & Startup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment variable file
cp .env.example .env   # Or create .env manually
```

Configure your `backend/.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/examprep_ai
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend server:
```bash
# Development mode with Nodemon
npm run dev

# Production mode
npm start
```
The API server will run at `http://localhost:5000`.

---

### 3. Frontend Configuration & Startup
```bash
# Navigate to frontend (from root)
cd ../frontend

# Install dependencies
npm install

# Configure environment variables (.env.local)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Run Next.js development server
npm run dev
```
The application interface will be available at `http://localhost:3000`.

---

## 🔌 API Endpoint Summary

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/auth/register` | Register new user account | ❌ |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & return JWT | ❌ |
| **Folders** | `GET` | `/api/folders` | Fetch user folder hierarchy | 🔒 |
| **Folders** | `POST` | `/api/folders` | Create a new subject folder | 🔒 |
| **Chapters**| `POST` | `/api/chapters` | Add chapter via text payload or file upload | 🔒 |
| **Quiz** | `POST` | `/api/quiz/generate` | Generate AI quiz from chapter content | 🔒 |
| **Quiz** | `POST` | `/api/quiz/:id/submit` | Submit quiz answers & compute score | 🔒 |
| **Retry** | `POST` | `/api/quiz/:id/retry` | Generate targeted retry session for missed questions | 🔒 |
| **Bookmarks**| `POST` | `/api/bookmarks` | Toggle bookmark status for a question | 🔒 |

---

## 🧪 Quality & Type Safety

The codebase strictly enforces TypeScript safety across state stores and client services.

```bash
# Run type-checking on frontend
cd frontend
npx tsc --noEmit

# Run Next.js linter
npm run lint
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.
