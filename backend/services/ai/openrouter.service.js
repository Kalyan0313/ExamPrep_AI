const { SYSTEM_PROMPT } = require('./gemini.service');

/**
 * Robust JSON Extractor for AI Responses
 */
const extractJsonFromText = (text) => {
  if (!text) return null;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Continue cleanup if direct parse fails
    }
  }
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

/**
 * Fallback question generation via OpenRouter API (Qwen / Llama / Gemini Flash Free)
 */
const generateQuestionsOpenRouter = async ({
  subject,
  title,
  chapterContent,
  questionCount,
  difficulty,
  questionTypes,
}) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

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

Return valid JSON with key "questions" containing an array of ${questionCount} items with:
- question (string: real, factual, challenging competitive exam question)
- options (array of 4 distinct plausible strings)
- correctAnswer (number: 0, 1, 2, or 3)
- explanation (string: factual, teacher-style reasoning. NEVER say "The text states", "According to the text", "The passage says", or reference the chapter/notes/passage in any way. Explain as a knowledgeable teacher from memory.)
- explanationBengali (string: complete Bengali translation of the explanation in Bengali script/বাংলা)
- conceptTag (string: specific historical/scientific concept)
- difficulty ("easy" | "medium" | "hard")
`;

  const modelsToTry = [
    'google/gemini-2.5-flash-lite',
    'qwen/qwen-2.5-72b-instruct:free',
    'meta-llama/llama-3.3-70b-instruct:free',
  ];

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://examprep.ai',
          'X-Title': 'ExamPrep AI',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: promptText },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`OpenRouter model ${modelName} returned HTTP ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const messageContent = data.choices?.[0]?.message?.content || '';
      const parsed = extractJsonFromText(messageContent);

      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions;
      }
    } catch (err) {
      console.warn(`OpenRouter model ${modelName} failed: ${err.message}`);
    }
  }

  throw new Error('All OpenRouter models failed to return structured questions.');
};

/**
 * Fallback Adaptive Retry generation via OpenRouter API
 */
const generateAdaptiveRetryOpenRouter = async ({
  subject,
  title,
  chapterContent,
  weakConcepts = [],
  previousQuestions = [],
  questionCount = 10,
}) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const promptText = `
ADAPTIVE RETRY GENERATION:
Subject: ${subject}
Chapter Title: ${title}

Chapter Content:
"""
${chapterContent.substring(0, 15000)}
"""

WEAK CONCEPTS TO TARGET:
${weakConcepts.join(', ')}

PREVIOUSLY FAILED QUESTIONS (DO NOT REPEAT):
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

INSTRUCTIONS:
Generate ${questionCount} BRAND NEW questions specifically testing the weak concepts above. Re-frame questions conceptually.

Return valid JSON with key "questions" containing an array of items with:
- question (string)
- options (array of 4 strings)
- correctAnswer (number: 0, 1, 2, or 3)
- explanation (string: factual, teacher-style reasoning. NEVER say "The text states" or reference the chapter/notes/passage.)
- explanationBengali (string: complete Bengali translation of the explanation in Bengali script/বাংলা)
- conceptTag (string)
- difficulty ("easy" | "medium" | "hard")
`;

  const modelsToTry = [
    'google/gemini-2.5-flash-lite',
    'qwen/qwen-2.5-72b-instruct:free',
    'meta-llama/llama-3.3-70b-instruct:free',
  ];

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://examprep.ai',
          'X-Title': 'ExamPrep AI',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: promptText },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const messageContent = data.choices?.[0]?.message?.content || '';
        const parsed = extractJsonFromText(messageContent);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return parsed.questions;
        }
      }
    } catch (err) {
      console.warn(`OpenRouter retry model ${modelName} failed: ${err.message}`);
    }
  }

  throw new Error('All OpenRouter retry models failed.');
};

module.exports = {
  generateQuestionsOpenRouter,
  generateAdaptiveRetryOpenRouter,
};
