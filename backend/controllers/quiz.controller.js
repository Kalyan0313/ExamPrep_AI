const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const RetrySession = require('../models/RetrySession');
const { generateAIQuestions, generateAdaptiveRetryQuestions } = require('../services/ai/gateway.service');

/**
 * Safely parses correctAnswer from AI output (handles numbers, strings "A"/"B"/"C"/"D", "0"/"1"/"2"/"3", etc.)
 */
const parseCorrectAnswerIndex = (q) => {
  const raw = q.correctAnswer ?? q.answer ?? q.correct_answer ?? q.correctOption ?? q.correct_option;

  if (typeof raw === 'number') {
    return Math.max(0, Math.min(3, Math.floor(raw)));
  }

  if (typeof raw === 'string') {
    const str = raw.trim().toUpperCase();
    if (str === 'A' || str === 'OPTION A' || str.startsWith('A.')) return 0;
    if (str === 'B' || str === 'OPTION B' || str.startsWith('B.')) return 1;
    if (str === 'C' || str === 'OPTION C' || str.startsWith('C.')) return 2;
    if (str === 'D' || str === 'OPTION D' || str.startsWith('D.')) return 3;
    const parsed = parseInt(str, 10);
    if (!isNaN(parsed)) return Math.max(0, Math.min(3, parsed));
  }

  return 0;
};

/**
 * Normalizes question object before DB insertion
 */
const normalizeQuestionDoc = (q, quizId, chapterId) => {
  let opts = q.options || q.choices || [];
  if (!Array.isArray(opts) || opts.length < 4) {
    opts = [
      opts[0] || 'Option A',
      opts[1] || 'Option B',
      opts[2] || 'Option C',
      opts[3] || 'Option D',
    ];
  }
  const cleanOptions = opts.slice(0, 4).map((o) => String(o));

  return {
    quizId,
    chapterId,
    question: String(q.question || 'Study Question'),
    options: cleanOptions,
    correctAnswer: parseCorrectAnswerIndex(q),
    explanation: String(q.explanation || 'Refer to study notes for detailed reasoning.'),
    explanationBengali: String(q.explanationBengali || ''),
    conceptTag: String(q.conceptTag || q.concept || 'General Concept'),
    difficulty: q.difficulty || 'medium',
    questionHash: String(q.questionHash || ''),
  };
};

// @desc    Generate a new AI quiz from a chapter
// @route   POST /api/quizzes/generate
// @access  Private
const generateQuiz = async (req, res) => {
  try {
    const { chapterId, difficulty = 'mixed', questionCount = 10, questionTypes = ['MCQ'] } = req.body;

    if (!chapterId) {
      return res.status(400).json({ success: false, message: 'Chapter ID is required' });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, userId: req.user._id });
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const aiResult = await generateAIQuestions({
      subject: chapter.subject,
      title: chapter.title,
      chapterContent: chapter.content,
      chapterId: chapter._id,
      questionCount: Number(questionCount),
      difficulty,
      questionTypes,
    });

    const quiz = await Quiz.create({
      userId: req.user._id,
      chapterId: chapter._id,
      title: `${chapter.title} - ${difficulty.toUpperCase()} Quiz`,
      type: 'standard',
      difficulty,
      questionCount: aiResult.questions.length,
    });

    const questionDocs = aiResult.questions.map((q) => normalizeQuestionDoc(q, quiz._id, chapter._id));
    const savedQuestions = await Question.insertMany(questionDocs);

    res.status(201).json({
      success: true,
      providerUsed: aiResult.providerUsed,
      quiz,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('Quiz Generation Controller Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate an Adaptive Retry Quiz targeting weak concepts
// @route   POST /api/quizzes/retry
// @access  Private
const generateRetryQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    const originalQuiz = await Quiz.findOne({ _id: quizId, userId: req.user._id });
    if (!originalQuiz) {
      return res.status(404).json({ success: false, message: 'Original quiz not found' });
    }

    const chapter = await Chapter.findOne({ _id: originalQuiz.chapterId, userId: req.user._id });
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const previousQuestions = await Question.find({ quizId: originalQuiz._id });
    const wrongQuestions = previousQuestions.filter((q) => q.isCorrect === false);
    const weakConcepts = Array.from(new Set(wrongQuestions.map((q) => q.conceptTag)));

    if (weakConcepts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No weak concepts found in this quiz attempt! Great job.',
      });
    }

    const aiResult = await generateAdaptiveRetryQuestions({
      subject: chapter.subject,
      title: chapter.title,
      chapterContent: chapter.content,
      chapterId: chapter._id,
      weakConcepts,
      previousQuestions: previousQuestions.map((q) => q.question),
      questionCount: Math.max(weakConcepts.length * 2, 5),
    });

    const newQuiz = await Quiz.create({
      userId: req.user._id,
      chapterId: chapter._id,
      title: `${chapter.title} - Adaptive Retry Quiz`,
      type: 'retry',
      difficulty: 'medium',
      questionCount: aiResult.questions.length,
    });

    const questionDocs = aiResult.questions.map((q) => normalizeQuestionDoc(q, newQuiz._id, chapter._id));
    const savedQuestions = await Question.insertMany(questionDocs);

    await RetrySession.create({
      userId: req.user._id,
      originalQuizId: originalQuiz._id,
      weakConcepts,
      previousQuestionIds: previousQuestions.map((q) => q._id),
      newQuizId: newQuiz._id,
    });

    res.status(201).json({
      success: true,
      providerUsed: aiResult.providerUsed,
      quiz: newQuiz,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('Retry Quiz Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single quiz by ID with question list
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user._id }).populate('chapterId', 'title subject');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await Question.find({ quizId: quiz._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      quiz,
      questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit quiz answers, compute score, accuracy & streak
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { quizId, userAnswers = {}, timeTakenSeconds = 0 } = req.body;

    const quiz = await Quiz.findOne({ _id: quizId, userId: req.user._id });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await Question.find({ quizId: quiz._id });

    let correctCount = 0;
    const weakConceptMap = {};
    const strongConceptMap = {};

    for (const q of questions) {
      const submittedOption = userAnswers[q._id] !== undefined ? userAnswers[q._id] : null;
      const isCorrect = submittedOption !== null && Number(submittedOption) === q.correctAnswer;

      q.userAnswer = submittedOption;
      q.isCorrect = isCorrect;
      await q.save();

      if (isCorrect) {
        correctCount++;
        strongConceptMap[q.conceptTag] = (strongConceptMap[q.conceptTag] || 0) + 1;
      } else {
        weakConceptMap[q.conceptTag] = (weakConceptMap[q.conceptTag] || 0) + 1;
      }
    }

    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const score = accuracy;

    quiz.score = score;
    quiz.accuracy = accuracy;
    quiz.timeTakenSeconds = Number(timeTakenSeconds);
    quiz.completedAt = new Date();
    await quiz.save();

    const user = await User.findById(req.user._id);
    if (user) {
      const now = new Date();
      const lastActive = new Date(user.lastActiveDate);
      const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 3600);

      if (diffHours >= 20 && diffHours <= 48) {
        user.currentStreak += 1;
      } else if (diffHours > 48) {
        user.currentStreak = 1;
      } else if (user.currentStreak === 0) {
        user.currentStreak = 1;
      }
      user.lastActiveDate = now;
      await user.save();
    }

    const weakConcepts = Object.keys(weakConceptMap);
    const strongConcepts = Object.keys(strongConceptMap);

    res.status(200).json({
      success: true,
      summary: {
        quizId: quiz._id,
        title: quiz.title,
        totalQuestions: questions.length,
        correctCount,
        wrongCount: questions.length - correctCount,
        accuracy,
        score,
        timeTakenSeconds: Number(timeTakenSeconds),
        weakConcepts,
        strongConcepts,
        currentStreak: user ? user.currentStreak : 1,
      },
      questions,
    });
  } catch (error) {
    console.error('Quiz Submit Controller Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateQuiz,
  generateRetryQuiz,
  getQuizById,
  submitQuiz,
};
