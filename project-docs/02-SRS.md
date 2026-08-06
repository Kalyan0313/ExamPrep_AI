# 02. Software Requirements Specification (SRS)

## 1. System Architecture & Constraints

```
[ Frontend: Next.js + React + Tailwind + Zustand ]
                       │
             HTTP / REST (JWT Auth)
                       ▼
    [ Backend: Express.js + Node.js + Mongoose ]
           ├── Database: MongoDB
           └── AI Gateway
                 ├── Primary: Google Gemini 2.5 Flash Lite
                 └── Fallback: OpenRouter (Qwen / DeepSeek / Llama)
```

---

## 2. Functional Requirements

### 2.1 User Authentication (AUTH-001)
- **AUTH-01.1**: User registration with Name, Email, and Password.
- **AUTH-01.2**: User login returning signed JWT access token.
- **AUTH-01.3**: Profile retrieval and password updates.

### 2.2 Workspace Folders (FOLD-002)
- **FOLD-02.1**: Support infinite tree hierarchy (`parentFolderId` reference).
- **FOLD-02.2**: Folder CRUD + Move operation (re-parenting).

### 2.3 Chapter Management (CHAP-003)
- **CHAP-03.1**: Store chapter text content up to 100,000 characters.
- **CHAP-03.2**: File parsing middleware for PDF, DOCX, and TXT files.

### 2.4 AI Quiz Engine (QUIZ-004)
- **QUIZ-04.1**: Send formatted prompt payload to Gemini 2.5 Flash Lite API.
- **QUIZ-04.2**: Parse structured JSON response into question schema.
- **QUIZ-04.3**: Fallback seamlessly to OpenRouter API on rate limit or 5xx response.
- **QUIZ-04.4**: Enforce strict duplicate checking against existing question hashes.

### 2.5 Adaptive Learning Engine (ADAPT-005)
- **ADAPT-05.1**: Evaluate completed quiz responses; log wrong question `conceptTag` entries.
- **ADAPT-05.2**: Generate targeted retry quiz using logged `conceptTag` array + original chapter context.
- **ADAPT-05.3**: Adjust default difficulty based on score: >90% -> increase difficulty, <50% -> reduce difficulty + detailed explanations.

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time < 200ms for non-AI database calls.
- AI Generation time < 10 seconds for a 20-question quiz.

### 3.2 Security
- Password hashing using bcrypt (salt rounds = 10).
- JWT validation middleware on all protected API routes.
- Sanitized input validation (Zod schemas).

### 3.3 Scalability & Reliability
- Stateless Express application architecture.
- Automatic AI failover ensuring 99.9% quiz generation availability.
