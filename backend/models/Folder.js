const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a folder name'],
      trim: true,
    },
    parentFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
      index: true,
    },
    icon: {
      type: String,
      default: '📁',
    },
    color: {
      type: String,
      default: '#7F6DF2',
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.index({ userId: 1, parentFolderId: 1 });

module.exports = mongoose.model('Folder', folderSchema);
