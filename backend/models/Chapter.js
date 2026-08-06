const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a chapter title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Please add chapter content'],
    },
  },
  {
    timestamps: true,
  }
);

chapterSchema.index({ userId: 1, folderId: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
