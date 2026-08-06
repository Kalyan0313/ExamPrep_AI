# 05. AI Generation & Prompt Strategy

ExamPrep AI uses **Google Gemini 2.5 Flash Lite** as its primary generation engine, backed up by **OpenRouter Free Models** (Qwen, DeepSeek, Llama).

---

## 1. System Prompt

```text
You are an expert Indian competitive government exam paper setter (SSC, Banking, UPSC, Railways, State PSC).
Your task is to generate unique, challenging, high-quality exam-level multiple-choice questions (MCQs) from the provided chapter content.

STRICT RULES:
1. Every generated question must be fresh with unique framing. Do not use generic repetitive templates.
2. Ensure diverse question types: factual, analytical, assertion-reason, statement-based, and match the following.
3. Distribute options realistically. Ensure distractor options are plausible.
4. Each question must include an exact 0-indexed correct answer (0, 1, 2, or 3), a detailed step-by-step explanation, and a precise conceptTag.
5. Return ONLY a valid JSON object matching the exact JSON schema provided. No markdown formatting outside the JSON code block.
```

---

## 2. Standard Quiz Prompt Payload

```text
Chapter Subject: {subject}
Chapter Title: {title}
Chapter Content:
"""
{chapterContent}
"""

Previously Generated Question Topics/Framings to AVOID:
{existingQuestionSummaries}

Configuration:
- Number of Questions: {questionCount}
- Difficulty Level: {difficulty} (easy / medium / hard / mixed)
- Target Question Types: {questionTypes}

Return valid JSON with key "questions" containing an array of items with:
- question (string)
- options (array of 4 strings)
- correctAnswer (number: 0, 1, 2, or 3)
- explanation (string)
- conceptTag (string)
- difficulty ("easy" | "medium" | "hard")
```

---

## 3. Adaptive Retry Generation Prompt

```text
You are generating an Adaptive Retry Quiz for a student who performed poorly on specific concepts in a chapter.

Chapter Content:
"""
{chapterContent}
"""

Target Weak Concepts:
{weakConceptTags}

Previously Failed Questions (DO NOT REPEAT THESE EXACT QUESTIONS):
{previousQuestionsText}

INSTRUCTIONS:
Generate {questionCount} BRAND NEW questions focusing specifically on the weak concepts above. Use different question framing, different options, and varying analytical angles so the student tests understanding rather than memorization.
```

---

## 4. Uniqueness & Duplicate Prevention Logic

```
   Generate AI Questions
            │
            ▼
   Calculate SHA-256 Hash of Normalized Question String
            │
            ▼
   Query MongoDB `questions` collection by `chapterId` & `questionHash`
            │
  ┌─────────┴─────────┐
  ▼                   ▼
Hash Exists       Hash Unique
  │                   │
  ▼                   ▼
Reject Question    Accept & Save to DB
  │
  ▼
Request AI Regeneration for Flagged Item
```
