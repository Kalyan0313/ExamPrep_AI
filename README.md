# ExamPrep AI

A full-stack exam prep tool I built because I was tired of reading the same notes passively. The idea is simple — you paste your study material, and the AI generates fresh MCQs from it every time. No repeated questions, no memorizing answers. Just actual practice.

Built for UPSC, SSC, Railways, and similar Government exam aspirants who need to do more than just highlight text.

---

## What it actually does

You upload a chapter — either typed out or as a PDF/DOCX — and from that you can:

- Generate a quiz of 5 to 50 questions at any difficulty
- Submit answers and get scored with per-question explanations
- Retry only the questions you got wrong, with *reframed* questions on the same concept (not the same question again)
- Bookmark questions you want to revisit later
- Track your accuracy trends, streaks, and weak topics across subjects

The workspace is organized like a file tree — folders for each subject, chapters inside them. It feels closer to Obsidian than a typical quiz app.

---

## Tech stack

**Frontend** — Next.js 14 (App Router), TypeScript, Zustand, TanStack Query, Tailwind CSS

**Backend** — Node.js, Express, MongoDB with Mongoose, JWT auth, Multer for file uploads

**Document parsing** — `pdf-parse` for PDFs, `mammoth` for DOCX files

**AI** — Google Gemini 2.5 Flash Lite as the primary model. OpenRouter (Qwen, DeepSeek, Llama) as a fallback if the Gemini quota runs dry.

---

## Running it locally

You'll need Node 18+, MongoDB running locally or an Atlas URI, and a Gemini API key from Google AI Studio.

### Clone and set up

```bash
git clone https://github.com/Kalyan0313/ExamPrep_AI.git
cd ExamPrep_AI
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (use `.env.example` as reference):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/examprep_ai
JWT_SECRET=something_long_and_random
GEMINI_API_KEY=your_key_here
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

Backend runs at `http://localhost:5000`. You can hit `/api/health` to confirm it's up.

### Frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## Deploying

Backend is on Render. Frontend is on Vercel (or any platform that runs Next.js).

The only thing that trips people up: set `NEXT_PUBLIC_API_URL` in your Vercel environment variables to your Render URL, and include `/api` at the end — e.g. `https://examprep-ai-f5ux.onrender.com/api`.

On the backend side, set `CLIENT_URL` to your frontend domain so CORS is scoped correctly.

---

## Project structure

```
ExamPrep_AI/
├── frontend/
│   ├── app/               # Next.js pages (login, register, dashboard, quiz runner, analytics)
│   ├── components/        # UI components and workspace panels
│   ├── store/             # Zustand stores (auth, folders, chapters, quiz)
│   └── services/          # fetchApi wrapper and base URL utility
│
├── backend/
│   ├── controllers/       # Route handlers for auth, folders, chapters, quiz, bookmarks
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express route definitions
│   ├── services/          # Gemini AI service, OpenRouter fallback, document parsers
│   └── middleware/        # JWT auth middleware, Multer file upload config
│
└── project-docs/          # PRD, SRS, DB schema, API reference, UI spec, AI prompt strategy
```

---

## API overview

| Method | Endpoint | What it does |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/folders` | Fetch user's folder tree |
| POST | `/api/folders` | Create a new folder |
| POST | `/api/chapters` | Add chapter (text or file upload) |
| POST | `/api/quizzes/generate` | Generate quiz from chapter content |
| POST | `/api/quizzes/:id/submit` | Submit answers, get results |
| POST | `/api/quizzes/:id/retry` | Generate retry session for wrong answers |
| POST | `/api/bookmarks` | Bookmark a question |
| GET | `/api/analytics` | Fetch performance stats |

Full endpoint documentation in [`project-docs/04-API.md`](./project-docs/04-API.md).

---

## Auth flow

JWT tokens are stored in `localStorage` and attached to every API request via `Authorization: Bearer <token>`. 

- The dashboard is route-guarded — unauthenticated users get redirected to `/login`
- Login and register pages redirect back to `/dashboard` if you're already logged in
- Token expiry is 30 days

---

## A few things worth knowing

**Render cold starts** — The free tier backend goes to sleep after 15 minutes of inactivity. First request after a sleep can take 30–50 seconds. Hit `/api/health` in the browser first if things seem slow.

**Gemini quotas** — Free tier has daily limits. The AI gateway automatically falls back to OpenRouter models if Gemini returns a quota error.

**File size** — Upload limit is 50MB. Scanned PDFs with image-heavy pages may take longer to parse.

---

## License

MIT
