const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI OCR Service using Gemini 1.5 Flash Vision for scanned image-only PDFs & photos
 */
const performGeminiOCR = async (buffer, mimeType) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('your_')) {
    throw new Error(
      'Scanned PDF / Image-based document detected, but GEMINI_API_KEY is missing or invalid for AI OCR transcription.'
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const filePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType || 'application/pdf',
      },
    };

    const prompt =
      'You are an expert OCR transcription assistant for government competitive exam study materials. Transcribe and extract all text, headings, diagrams descriptions, and study notes from this scanned document into clean, structured text.';

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Multimodal OCR Error:', error.message);
    throw new Error(`AI OCR Transcription failed: ${error.message}`);
  }
};

const parseUploadedDocument = async (file) => {
  if (!file) {
    throw new Error('No file provided for parsing');
  }

  const mimeType = file.mimetype;
  const buffer = file.buffer;

  let extractedText = '';

  if (mimeType === 'application/pdf' || file.originalname.endsWith('.pdf')) {
    try {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } catch (err) {
      console.warn('pdf-parse failed, falling back to Gemini AI Vision OCR...');
    }

    // If PDF is image-only / scanned (text length < 50 chars), trigger Gemini AI OCR
    if (!extractedText || extractedText.trim().length < 50) {
      console.log('Scanned/Image PDF detected. Running Gemini 1.5 Flash Multimodal OCR...');
      extractedText = await performGeminiOCR(buffer, 'application/pdf');
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.originalname.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer });
    extractedText = result.value;
  } else if (mimeType.startsWith('image/')) {
    // Direct image upload (PNG, JPG, JPEG)
    console.log('Image upload detected. Running Gemini 1.5 Flash Vision OCR...');
    extractedText = await performGeminiOCR(buffer, mimeType);
  } else if (mimeType === 'text/plain' || file.originalname.endsWith('.txt')) {
    extractedText = buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, TXT, or Image files.');
  }

  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('Could not extract readable text content from the uploaded document.');
  }

  return extractedText.trim();
};

module.exports = { parseUploadedDocument, performGeminiOCR };
