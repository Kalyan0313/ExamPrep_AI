const mongoose = require('mongoose');

const retrySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    weakConcepts: {
      type: [String],
      default: [],
    },
    previousQuestionIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }],
    newQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RetrySession', retrySessionSchema);
