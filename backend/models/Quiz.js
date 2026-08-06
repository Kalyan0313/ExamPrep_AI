const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['standard', 'retry', 'revision'],
      default: 'standard',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed',
    },
    questionCount: {
      type: Number,
      default: 10,
    },
    score: {
      type: Number,
      default: null,
    },
    accuracy: {
      type: Number,
      default: null,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ userId: 1, chapterId: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
