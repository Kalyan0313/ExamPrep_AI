const Chapter = require('../models/Chapter');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { parseUploadedDocument } = require('../services/parser.service');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ success: false, message: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `You are an expert educator preparing quick-revision one-liner notes for Indian competitive exam students.

From the following chapter content, carefully extract all the important, need-to-know facts, definitions, dates, names, events, and key points that are critical for competitive exams. Do not skip any key pieces of information.
Dynamically generate as many revision notes as needed to cover all the important points in the document.

STRICT RULES:
- Each note must be a single crisp sentence (max 25 words).
- Must be factual, high-yield, and directly testable in exams (SSC, UPSC, Railways, Banking).
- Cover all key sub-topics within the chapter content.
- Do NOT say "The text states" or reference the chapter/passage. State facts directly.
- The "bn" field must be the COMPLETE Bengali translation of "en", written in Bengali script (বাংলা). Not transliteration.

Chapter: ${chapter.title}
Subject: ${chapter.subject}

Content:
"""
${chapter.content.substring(0, 15000)}
"""

Return a valid JSON object with key "notes" containing an array of objects, each with:
- en (string: the one-liner fact in English)
- bn (string: the same fact translated into Bengali script)`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text() || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (!parsed.notes || !Array.isArray(parsed.notes) || parsed.notes.length === 0) {
      return res.status(500).json({ success: false, message: 'AI did not return valid notes structure' });
    }

    const notes = parsed.notes.map(n => ({
      en: String(n.en || ''),
      bn: String(n.bn || ''),
    })).filter(n => n.en && n.bn);

    chapter.quickNotes = notes;
    chapter.quickNotesGeneratedAt = new Date();
    await chapter.save();

    res.status(200).json({ success: true, notes });
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
