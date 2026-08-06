const express = require('express');
const router = express.Router();
const { generateQuiz, generateRetryQuiz, getQuizById, submitQuiz } = require('../controllers/quiz.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/generate', generateQuiz);
router.post('/retry', generateRetryQuiz);
router.post('/submit', submitQuiz);
router.get('/:id', getQuizById);

module.exports = router;
