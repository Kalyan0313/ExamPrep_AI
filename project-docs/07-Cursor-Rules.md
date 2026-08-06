# 07. Workspace Coding Rules & Conventions

## 1. Project Conventions

- **Code Structure**: Strict separation of concerns between `frontend/` (Next.js App Router) and `backend/` (Express REST API).
- **TypeScript**: Strict mode enabled on frontend. Prefer interface definitions for React components and props.
- **State Management**: Use Zustand for global UI state (auth session, active folder tree, quiz runtime runner). Use TanStack Query (React Query) for server state fetching and caching.
- **Styling**: Vanilla CSS tokens combined with Tailwind CSS classes and Shadcn UI primitive components. Avoid ad-hoc inline styles.

---

## 2. API & Backend Rules

- All controller endpoints must be wrapped in error-handling middleware (`asyncHandler`).
- Always validate request bodies using Zod schemas before database queries or AI API invocations.
- Never hardcode API keys or secret tokens. Always read from process environment variables (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `JWT_SECRET`, `MONGO_URI`).

---

## 3. AI Service Rules

- Primary calls must target Google Gemini 2.5 Flash Lite (`@google/genai` or direct REST API).
- AI call wrappers must catch timeouts or 429/5xx errors and fallback automatically to OpenRouter.
- Always validate AI JSON responses against the expected question structure before writing to MongoDB.
