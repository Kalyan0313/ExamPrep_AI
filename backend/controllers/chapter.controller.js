const Chapter = require('../models/Chapter');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { parseUploadedDocument } = require('../services/parser.service');
const { generateAIQuickNotes } = require('../services/ai/gateway.service');

// @desc    Get chapters (optional filter by folderId)
// @route   GET /api/chapters
// @access  Private
const getChapters = async (req, res) => {
  try {
    const { folderId } = req.query;
    const filter = { userId: req.user._id };

    if (folderId) {
      filter.folderId = folderId;
    }

    const chapters = await Chapter.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: chapters.length,
      chapters,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single chapter details with summary stats & quizzes
// @route   GET /api/chapters/:id
// @access  Private
const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ _id: req.params.id, userId: req.user._id });

    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    // Fetch past quizzes for this chapter
    const quizzes = await Quiz.find({ chapterId: chapter._id, userId: req.user._id }).sort({ createdAt: -1 });

    // Calculate overall stats
    const completedQuizzes = quizzes.filter(q => q.score !== null);
    const avgScore = completedQuizzes.length > 0
      ? Math.round(completedQuizzes.reduce((acc, q) => acc + (q.score || 0), 0) / completedQuizzes.length)
      : null;

    res.status(200).json({
      success: true,
      chapter,
      stats: {
        totalQuizzes: quizzes.length,
        completedQuizzes: completedQuizzes.length,
        averageScore: avgScore,
      },
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new chapter (via text paste or file upload)
// @route   POST /api/chapters
// @access  Private
const createChapter = async (req, res) => {
  try {
    const { folderId, title, subject, description } = req.body;
    let { content } = req.body;

    if (!folderId || !title || !subject) {
      return res.status(400).json({ success: false, message: 'Folder ID, Title, and Subject are required' });
    }

    // If file uploaded via multer, parse text content from file
    if (req.file) {
      content = await parseUploadedDocument(req.file);
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Chapter content or document file is required' });
    }

    const chapter = await Chapter.create({
      userId: req.user._id,
      folderId,
      title: title.trim(),
      subject: subject.trim(),
      description: description ? description.trim() : '',
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      chapter,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private
const updateChapter = async (req, res) => {
  try {
    const { title, subject, description, content } = req.body;
    const chapter = await Chapter.findOne({ _id: req.params.id, userId: req.user._id });

    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    if (title !== undefined) chapter.title = title;
    if (subject !== undefined) chapter.subject = subject;
    if (description !== undefined) chapter.description = description;
    if (content !== undefined) chapter.content = content;

    await chapter.save();

    res.status(200).json({
      success: true,
      chapter,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete chapter and related quizzes/questions
// @route   DELETE /api/chapters/:id
// @access  Private
const deleteChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await Chapter.findOne({ _id: chapterId, userId: req.user._id });

    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    // Delete related questions, quizzes, and chapter
    await Question.deleteMany({ chapterId, userId: req.user._id });
    await Quiz.deleteMany({ chapterId, userId: req.user._id });
    await Chapter.deleteOne({ _id: chapterId, userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Chapter and associated quiz data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI one-liner quick notes for a chapter (bilingual EN + BN)
// @route   POST /api/chapters/:id/quick-notes
// @access  Private
const generateQuickNotes = async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const { providerUsed, notes: rawNotes } = await generateAIQuickNotes({
      title: chapter.title,
      subject: chapter.subject,
      chapterContent: chapter.content,
    });

    if (!rawNotes || !Array.isArray(rawNotes) || rawNotes.length === 0) {
      return res.status(500).json({ success: false, message: 'AI failed to generate quick notes' });
    }

    const notes = rawNotes.map(n => ({
      en: String(n.en || ''),
      bn: String(n.bn || ''),
    })).filter(n => n.en && n.bn);

    chapter.quickNotes = notes;
    chapter.quickNotesGeneratedAt = new Date();
    await chapter.save();

    res.status(200).json({ success: true, providerUsed, notes });
  } catch (error) {
    console.error('Quick Notes Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  generateQuickNotes,
};
