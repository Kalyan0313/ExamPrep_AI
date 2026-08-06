# 03. Database Schema Specification

This document details the MongoDB Mongoose models powering **ExamPrep AI**.

---

## 1. Collections & Data Models

### 1.1 Users Collection (`users`)
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string; // unique, indexed
  passwordHash: string;
  currentStreak: number; // defaults to 0
  lastActiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.2 Folders Collection (`folders`)
```typescript
interface IFolder {
  _id: ObjectId;
  userId: ObjectId; // indexed
  name: string;
  parentFolderId: ObjectId | null; // null for root level, indexed
  icon?: string; // emoji or icon code e.g., '📚'
  color?: string; // hex color e.g., '#3B82F6'
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.3 Chapters Collection (`chapters`)
```typescript
interface IChapter {
  _id: ObjectId;
  userId: ObjectId; // indexed
  folderId: ObjectId; // indexed
  title: string;
  subject: string;
  description?: string;
  content: string; // text body or extracted document content
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.4 Quizzes Collection (`quizzes`)
```typescript
interface IQuiz {
  _id: ObjectId;
  userId: ObjectId; // indexed
  chapterId: ObjectId; // indexed
  title: string;
  type: 'standard' | 'retry' | 'revision';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  score?: number; // percentage (0-100)
  accuracy?: number; // percentage
  timeTakenSeconds?: number;
  completedAt?: Date;
  createdAt: Date;
}
```

### 1.5 Questions Collection (`questions`)
```typescript
interface IQuestion {
  _id: ObjectId;
  quizId: ObjectId; // indexed
  chapterId: ObjectId; // indexed
  question: string;
  options: string[]; // 4 options
  correctAnswer: number; // index (0, 1, 2, 3)
  explanation: string;
  conceptTag: string; // indexed
  difficulty: 'easy' | 'medium' | 'hard';
  questionHash: string; // SHA-256 string for duplicate checking, indexed
  userAnswer?: number;
  isCorrect?: boolean;
  timeTakenSeconds?: number;
  isBookmarked?: boolean;
  personalNote?: string;
  createdAt: Date;
}
```

### 1.6 RetrySessions Collection (`retrysessions`)
```typescript
interface IRetrySession {
  _id: ObjectId;
  userId: ObjectId;
  originalQuizId: ObjectId;
  weakConcepts: string[];
  previousQuestionIds: ObjectId[];
  newQuizId: ObjectId;
  createdAt: Date;
}
```

### 1.7 Bookmarks Collection (`bookmarks`)
```typescript
interface IBookmark {
  _id: ObjectId;
  userId: ObjectId; // indexed
  questionId: ObjectId; // indexed
  chapterId: ObjectId;
  createdAt: Date;
}
```

---

## 2. Indexes
- `users`: `email` (unique)
- `folders`: `{ userId: 1, parentFolderId: 1 }`
- `chapters`: `{ userId: 1, folderId: 1 }`
- `questions`: `{ chapterId: 1, questionHash: 1 }`
- `quizzes`: `{ userId: 1, chapterId: 1 }`
