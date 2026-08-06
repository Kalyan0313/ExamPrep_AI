# 01. Product Requirements Document (PRD)

## Project Name
**ExamPrep AI** — AI-powered Government Exam Preparation Platform

---

## 1. Project Goal
ExamPrep AI allows competitive exam candidates to paste chapters or upload study materials (PDF, DOCX, TXT), from which AI generates fresh, high-quality, exam-standard multiple-choice questions (MCQs). The system ensures zero repetition by generating unique question framing each time, tracking performance, identifying weak concepts, and automatically curating adaptive retry and revision quizzes.

---

## 2. Target Audience
Aspirants preparing for competitive examinations:
- **SSC** (CGL, CHSL, MTS)
- **Banking** (IBPS, SBI PO/Clerk, RRB)
- **Railways** (RRB NTPC, Group D)
- **UPSC & State PSCs** (IAS, IPS, State Civil Services)
- **Police & Defence** (Sub-Inspector, Constable, CDS)
- **Teaching Eligibility** (CTET, State TET)

---

## 3. Core Features

### 3.1 Workspace & Folder Management
- Hierarchical folder structure (nested folders like Google Drive).
- Operations: Create, rename, move, delete, drag-and-drop, custom folder icons/colors.
- Organization by Exam, Subject, Topic, and Chapter.

### 3.2 Chapter Learning Hub
- Central hub per chapter containing Study Notes, AI Quizzes, Retry Quizzes, Bookmarks, and Concept Analytics.
- Supports text pasting and document uploads (PDF, DOCX, TXT).

### 3.3 AI Quiz Generation
- Configurable question counts (10, 15, 20, 30, 50).
- Difficulty settings: Easy, Medium, Hard, Mixed (auto-adapts based on student score).
- Multiple Question Types: MCQ, True/False, Assertion & Reason, Statement-based, Match the Following, Chronological Order.

### 3.4 Unique Question Generation Strategy
- Hash comparison and similarity check (>90% threshold rejection).
- AI prompt instructs conceptual variations rather than exact string matching.

### 3.5 Adaptive Retry & Smart Revision Mode
- **Retry Mode**: Targets wrong questions by extracting underlying concept tags and generating new questions on those exact concepts.
- **Smart Revision Mode**: Generates a 10-question revision test using overall weak concepts across the user's study history.

### 3.6 Analytics & Streak System
- Real-time accuracy metrics, weak vs. strong concept identification, and average time per question.
- Daily practice streak system with badge milestones (🔥 7, 15, 30, 100 days).

---

## 4. Success Metrics
- **Uniqueness Guarantee**: Duplicate question rate below 5%.
- **Response Speed**: Average quiz generation under 10 seconds.
- **Learning Efficacy**: Minimum 15% increase in user accuracy on targeted weak concepts post-retry.
