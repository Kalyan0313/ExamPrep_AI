const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Chapter = require('../models/Chapter');
const User = require('../models/User');

// @desc    Get overall dashboard analytics & streak stats
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const totalChapters = await Chapter.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.find({ userId, score: { $ne: null } });

    // Aggregate answered questions
    const answeredQuestions = await Question.find({
      chapterId: { $in: await Chapter.find({ userId }).distinct('_id') },
      userAnswer: { $ne: null },
    });

    const totalQuestionsSolved = answeredQuestions.length;
    const totalCorrect = answeredQuestions.filter((q) => q.isCorrect).length;
    const overallAccuracy = totalQuestionsSolved > 0 ? Math.round((totalCorrect / totalQuestionsSolved) * 100) : 0;

    // Aggregate concept performance
    const conceptStats = {};
    answeredQuestions.forEach((q) => {
      if (!conceptStats[q.conceptTag]) {
        conceptStats[q.conceptTag] = { total: 0, correct: 0 };
      }
      conceptStats[q.conceptTag].total += 1;
      if (q.isCorrect) conceptStats[q.conceptTag].correct += 1;
    });

    const weakSubjects = [];
    const strongSubjects = [];

    Object.keys(conceptStats).forEach((tag) => {
      const stat = conceptStats[tag];
      const acc = Math.round((stat.correct / stat.total) * 100);
      if (acc < 60) {
        weakSubjects.push({ conceptTag: tag, accuracy: acc, count: stat.total });
      } else {
        strongSubjects.push({ conceptTag: tag, accuracy: acc, count: stat.total });
      }
    });

    res.status(200).json({
      success: true,
      analytics: {
        totalChapters,
        totalQuizzes,
        totalQuestionsSolved,
        overallAccuracy,
        currentStreak: user ? user.currentStreak : 0,
        weakSubjects,
        strongSubjects,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardAnalytics };
