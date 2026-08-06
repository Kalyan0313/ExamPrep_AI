const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [val => val.length === 4, 'Question must have exactly 4 options'],
    },
    correctAnswer: {
      type: Number, // 0, 1, 2, 3
      default: 0,
    },
    explanation: {
      type: String,
      required: true,
    },
    explanationBengali: {
      type: String,
      default: '',
    },
    conceptTag: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questionHash: {
      type: String,
      required: true,
      index: true,
    },
    userAnswer: {
      type: Number,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: null,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    personalNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ chapterId: 1, questionHash: 1 });

module.exports = mongoose.model('Question', questionSchema);
