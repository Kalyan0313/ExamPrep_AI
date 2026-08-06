const Bookmark = require('../models/Bookmark');
const Question = require('../models/Question');

// @desc    Get user bookmarked questions
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate('questionId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bookmark a question
// @route   POST /api/bookmarks
// @access  Private
const addBookmark = async (req, res) => {
  try {
    const { questionId, chapterId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const existing = await Bookmark.findOne({ userId: req.user._id, questionId });
    if (existing) {
      return res.status(200).json({ success: true, bookmark: existing });
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      questionId,
      chapterId: chapterId || question.chapterId,
    });

    question.isBookmarked = true;
    await question.save();

    res.status(201).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    await Question.findByIdAndUpdate(bookmark.questionId, { isBookmarked: false });
    await Bookmark.deleteOne({ _id: bookmark._id });

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
};
