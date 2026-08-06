const { generateQuestionsGemini, generateAdaptiveRetryGemini } = require('./gemini.service');
const { generateQuestionsOpenRouter, generateAdaptiveRetryOpenRouter } = require('./openrouter.service');
const { generateQuestionHash } = require('../../utils/hash');
const Question = require('../../models/Question');

/**
 * Smart Fallback Generator: Parses real sentences & key terms directly from the chapter text
 * when offline or when no API keys are provided.
 */
const generateSmartChapterQuestions = (subject, title, chapterContent, count, difficulty, conceptsOverride = null) => {
  // Clean chapter sentences
  const sentences = (chapterContent || '')
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 200);

  const defaultConcepts = conceptsOverride || [
    `${title} Origins & Context`,
    `Key Discoveries & Findings`,
    `Administrative System`,
    `Socio-Economic Development`,
  ];

  const questions = [];
  for (let i = 0; i < count; i++) {
    const concept = defaultConcepts[i % defaultConcepts.length];
    const sentenceSnippet = sentences[i % Math.max(sentences.length, 1)] || `Key factual detail regarding ${title}`;

    // Extract a key phrase from sentence if possible
    const words = sentenceSnippet.split(' ');
    const keyTerm = words.length > 4 ? words.slice(0, 4).join(' ') : title;

    questions.push({
      question: `Regarding ${title}, which of the following is accurate concerning "${keyTerm}"?`,
      options: [
        `Statement I: ${sentenceSnippet}`,
        `Statement II: It was established during the later classical period under external rule.`,
        `Statement III: The primary administrative record indicates complete decentralization.`,
        `Statement IV: None of the above statements are historically accurate.`,
      ],
      correctAnswer: 0,
      explanation: `According to the chapter notes on ${title}: "${sentenceSnippet}". Statement I directly reflects the source study content.`,
      conceptTag: concept,
      difficulty: difficulty === 'mixed' ? (i % 3 === 0 ? 'hard' : i % 2 === 0 ? 'medium' : 'easy') : difficulty,
    });
  }
  return questions;
};

/**
 * AI Gateway for standard quiz generation (Gemini -> OpenRouter -> Smart Chapter Extractor)
 */
const generateAIQuestions = async ({
  subject,
  title,
  chapterContent,
  chapterId,
  questionCount = 10,
  difficulty = 'mixed',
  questionTypes = ['MCQ'],
}) => {
  let rawQuestions = [];
  let providerUsed = 'Gemini';

  // 1. Try Google Gemini API
  try {
    rawQuestions = await generateQuestionsGemini({
      subject,
      title,
      chapterContent,
      questionCount,
      difficulty,
      questionTypes,
    });
  } catch (geminiErr) {
    console.warn(`Gemini API failed (${geminiErr.message}). Switching to OpenRouter fallback...`);

    // 2. Try OpenRouter Multi-model API
    try {
      rawQuestions = await generateQuestionsOpenRouter({
        subject,
        title,
        chapterContent,
        questionCount,
        difficulty,
        questionTypes,
      });
      providerUsed = 'OpenRouter';
    } catch (openRouterErr) {
      console.warn(`OpenRouter API failed (${openRouterErr.message}). Using Smart Chapter Extractor...`);
      rawQuestions = generateSmartChapterQuestions(subject, title, chapterContent, questionCount, difficulty);
      providerUsed = 'SmartChapterExtractor';
    }
  }

  // 3. Attach SHA-256 Hash
  const processedQuestions = [];
  for (const item of rawQuestions) {
    const hash = generateQuestionHash(item.question);
    processedQuestions.push({
      ...item,
      questionHash: hash,
    });
  }

  return { providerUsed, questions: processedQuestions };
};

/**
 * AI Gateway for Adaptive Retry Quizzes (Gemini -> OpenRouter -> Smart Chapter Extractor)
 */
const generateAdaptiveRetryQuestions = async ({
  subject,
  title,
  chapterContent,
  chapterId,
  weakConcepts,
  previousQuestions,
  questionCount = 10,
}) => {
  let rawQuestions = [];
  let providerUsed = 'Gemini';

  // 1. Try Gemini Adaptive Retry
  try {
    rawQuestions = await generateAdaptiveRetryGemini({
      subject,
      title,
      chapterContent,
      weakConcepts,
      previousQuestions,
      questionCount,
    });
  } catch (geminiErr) {
    console.warn(`Gemini Adaptive Retry failed (${geminiErr.message}). Switching to OpenRouter Adaptive Retry...`);

    // 2. Try OpenRouter Adaptive Retry
    try {
      rawQuestions = await generateAdaptiveRetryOpenRouter({
        subject,
        title,
        chapterContent,
        weakConcepts,
        previousQuestions,
        questionCount,
      });
      providerUsed = 'OpenRouter';
    } catch (openRouterErr) {
      console.warn(`OpenRouter Retry failed (${openRouterErr.message}). Using Smart Chapter Extractor...`);
      rawQuestions = generateSmartChapterQuestions(subject, title, chapterContent, questionCount, 'medium', weakConcepts);
      providerUsed = 'SmartChapterExtractor';
    }
  }

  // 3. Attach SHA-256 Hash
  const processedQuestions = [];
  for (const item of rawQuestions) {
    const hash = generateQuestionHash(item.question);
    processedQuestions.push({
      ...item,
      questionHash: hash,
    });
  }

  return { providerUsed, questions: processedQuestions };
};

module.exports = {
  generateAIQuestions,
  generateAdaptiveRetryQuestions,
};
