# 10. User Interaction Flows

## 1. Flow 1: Study Material Upload & Quiz Generation

```text
[User Dashboard] ──► Select/Create Folder ──► Click "+ New Chapter"
                                                      │
                                                      ▼
                                       Choose Input: Text / PDF / DOCX
                                                      │
                                                      ▼
                                         Chapter Created in Workspace
                                                      │
                                                      ▼
                                          Click "Generate Quiz"
                                                      │
                                                      ▼
                                  Configure (Count, Difficulty, Types)
                                                      │
                                                      ▼
                                   Backend Calls Gemini 2.5 Flash Lite
                                                      │
                                                      ▼
                                      AI Returns JSON Questions Array
                                                      │
                                                      ▼
                                 Duplicate Hash Check Passed -> Save DB
                                                      │
                                                      ▼
                                        Launch Interactive Quiz Runner
```

---

## 2. Flow 2: Adaptive Learning & Retry Loop

```text
                  [User Completes Quiz & Submits]
                                │
                                ▼
                   Backend Computes Score & Accuracy
                                │
                                ▼
                    Score < 70% or Wrong Answers Present
                                │
                                ▼
                 Extract Concept Tags of Wrong Answers
                                │
                                ▼
                   Click "🔄 Retry Weak Concepts"
                                │
                                ▼
          AI generates NEW questions targeting weak concepts
                                │
                                ▼
           User solves Retry Quiz -> Concept Mastery Improves!
```

---

## 3. Flow 3: Smart Revision Mode

```text
[User Dashboard] ──► Click "🎯 Generate Revision Quiz"
                              │
                              ▼
        Backend aggregates top weak concepts across all past quizzes
                              │
                              ▼
            AI generates 10 high-impact revision questions
                              │
                              ▼
           User completes revision -> Analytics updated
```
