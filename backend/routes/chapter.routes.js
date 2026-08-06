const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  generateQuickNotes,
} = require('../controllers/chapter.controller');
const { protect } = require('../middleware/auth');

// Setup Multer memory storage with 50MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Middleware to catch Multer file size limit errors
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum allowed file size is 50MB.',
        });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};

router.use(protect);

router.route('/')
  .get(getChapters)
  .post(handleUpload, createChapter);

router.route('/:id')
  .get(getChapterById)
  .put(updateChapter)
  .delete(deleteChapter);

router.post('/:id/quick-notes', generateQuickNotes);

module.exports = router;
