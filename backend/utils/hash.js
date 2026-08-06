const crypto = require('crypto');

/**
 * Normalizes question text (removes special chars, whitespace, lowercases)
 * and generates a SHA-256 hash digest.
 */
const generateQuestionHash = (questionText) => {
  if (!questionText) return '';
  const normalized = questionText
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return crypto.createHash('sha256').update(normalized).digest('hex');
};

module.exports = { generateQuestionHash };
