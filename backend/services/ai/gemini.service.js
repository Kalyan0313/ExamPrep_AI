const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are an expert Indian competitive government exam paper setter (SSC, Banking, UPSC, Railways, State PSC).
Your task is to generate unique, challenging, high-quality exam-level multiple-choice questions (MCQs) from the provided chapter content.

STRICT RULES:
1. Every generated question must be fresh with unique framing. Do not use generic repetitive templates.
2. Ensure diverse question types: factual, analytical, assertion-reason, statement-based, match the following.
3. Distribute options realistically with plausible distractors.
4. Each question must include an exact 0-indexed correct answer (0, 1, 2, or 3), a detailed step-by-step explanation, and a precise conceptTag.
5. Return ONLY a valid JSON object matching the requested schema. Do not add markdown backticks outside the JSON code block.`;

/**
 * Generate standard questions via Google Gemini API
 */
const generateQuestionsGemini = async ({
  subject,
  title,
  chapterContent,
  questionCount,
  difficulty,
  questionTypes,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const promptText = `
Subject: ${subject}
Chapter Title: ${title}

Chapter Content:
"""
${chapterContent.substring(0, 15000)}
"""

CONFIG:
- Question Count: ${questionCount}
- Difficulty Level: ${difficulty}
- Target Types: ${questionTypes ? questionTypes.join(', ') : 'MCQ, Statement, Analytical'}

Return valid JSON with key "questions" containing an array of items with:
- question (string)
- options (array of 4 strings)
- correctAnswer (number: 0, 1, 2, or 3)
- explanation (string)
- conceptTag (string)
- difficulty ("easy" | "medium" | "hard")
`;

  try {
    const result = await model.generateContent([SYSTEM_PROMPT, promptText]);
    const response = await result.response;
    const responseText = response.text() || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid JSON structure returned by Gemini API');
    }

    return parsed.questions;
  } catch (error) {
    console.error('Gemini Generation Error:', error.message);
    throw error;
  }
};

/**
 * Generate Adaptive Retry questions targeting specific weak concepts
 */
const generateAdaptiveRetryGemini = async ({
  subject,
  title,
  chapterContent,
  weakConcepts = [],
  previousQuestions = [],
  questionCount = 10,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const promptText = `
ADAPTIVE RETRY GENERATION:
Subject: ${subject}
Chapter Title: ${title}

Chapter Content:
"""
${chapterContent.substring(0, 15000)}
"""

TARGET WEAK CONCEPTS TO FOCUS ON:
${weakConcepts.join(', ')}

PREVIOUSLY FAILED QUESTIONS (DO NOT REPEAT THESE EXACT QUESTIONS):
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

INSTRUCTIONS:
Generate ${questionCount} BRAND NEW questions specifically testing the weak concepts above. Use different question framing, options, and analytical angles.

Return valid JSON with key "questions" containing an array of items with:
- question (string)
- options (array of 4 strings)
- correctAnswer (number: 0, 1, 2, or 3)
- explanation (string)
- conceptTag (string)
- difficulty ("easy" | "medium" | "hard")
`;

  try {
    const result = await model.generateContent([SYSTEM_PROMPT, promptText]);
    const response = await result.response;
    const responseText = response.text() || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return parsed.questions || [];
  } catch (error) {
    console.error('Gemini Adaptive Retry Generation Error:', error.message);
    throw error;
  }
};

module.exports = {
  generateQuestionsGemini,
  generateAdaptiveRetryGemini,
  SYSTEM_PROMPT,
};
