const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are an expert Indian competitive government exam paper setter (SSC,WBCS,WBPSC MISC, Banking, UPSC, Railways, State PSC).
Your task is to generate unique, challenging, high-quality exam-level multiple-choice questions (MCQs) from the provided chapter content.

STRICT RULES:
1. Every generated question must be fresh with unique framing. Do not use generic repetitive templates.
2. Ensure diverse question types: factual, analytical, assertion-reason, statement-based, match the following.
3. Distribute options realistically with plausible distractors.
4. Each question must include an exact 0-indexed correct answer (0, 1, 2, or 3), a detailed step-by-step explanation, a Bengali explanation, and a precise conceptTag.
5. Return ONLY a valid JSON object matching the requested schema. Do not add markdown backticks outside the JSON code block.
6. CRITICAL EXPLANATION RULES — STRICTLY FOLLOW:
   - The "explanation" field must read as independent factual reasoning. It must NOT reference "the text", "the passage", "the chapter", "the notes", or "the study material" in any way.
   - BANNED PHRASES: "The text states", "According to the text", "The passage says", "As mentioned in", "The chapter mentions", "Based on the provided content", "The notes state". DO NOT use any of these.
   - Write the explanation as if you are a knowledgeable teacher explaining the concept from memory, not quoting a document.
   - The "explanationBengali" field must be the COMPLETE Bengali translation of the explanation, written in Bengali script (বাংলা). Do NOT transliterate into Roman script. Provide clear, accurate Bengali prose.`;

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
- explanation (string: factual, teacher-style reasoning. NEVER say "The text states" or reference the chapter/notes/passage. Explain from knowledge.)
- explanationBengali (string: complete Bengali translation of the explanation in Bengali script/বাংলা)
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
- explanation (string: factual, teacher-style reasoning. NEVER say "The text states" or reference the chapter/notes/passage.)
- explanationBengali (string: complete Bengali translation of the explanation in Bengali script/বাংলা)
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

/**
 * Generate quick notes via Google Gemini API with robust model fallback
 */
const generateQuickNotesGemini = async ({ title, subject, chapterContent }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.5-flash',
    'gemini-1.5-pro',
  ];

  const promptText = `You are an expert educator preparing quick-revision one-liner notes for Indian competitive exam students.

From the following chapter content, carefully extract all the important, need-to-know facts, definitions, dates, names, events, and key points that are critical for competitive exams. Do not skip any key pieces of information.
Dynamically generate as many revision notes as needed to cover all the important points in the document.

STRICT RULES:
- Each note must be a single crisp sentence (max 25 words).
- Must be factual, high-yield, and directly testable in exams (SSC, UPSC, Railways, Banking).
- Cover all key sub-topics within the chapter content.
- Do NOT say "The text states" or reference the chapter/passage. State facts directly.
- The "bn" field must be the COMPLETE Bengali translation of "en", written in Bengali script (বাংলা). Not transliteration.

Chapter: ${title}
Subject: ${subject}

Content:
"""
${chapterContent.substring(0, 15000)}
"""

Return a valid JSON object with key "notes" containing an array of objects, each with:
- en (string: the one-liner fact in English)
- bn (string: the same fact translated into Bengali script)`;

  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(promptText);
      const response = await result.response;
      const responseText = response.text() || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.notes && Array.isArray(parsed.notes)) {
        return parsed.notes;
      }
    } catch (err) {
      console.warn(`Gemini model ${modelName} failed for quick notes:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to generate quick notes');
};

module.exports = {
  generateQuestionsGemini,
  generateAdaptiveRetryGemini,
  generateQuickNotesGemini,
  SYSTEM_PROMPT,
};
