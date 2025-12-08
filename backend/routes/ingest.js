const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { sources } = require('../services/storage');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsPath = path.join(__dirname, '..', process.env.UPLOADS_PATH || 'uploads');
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * POST /api/ingest/file
 * Upload and parse a file (PDF, TXT, DOCX)
 */
router.post('/file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { type } = req.body; // meeting, email, or document
        const filePath = req.file.path;
        let extractedText = '';

        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
            // Parse PDF
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
        } else if (req.file.mimetype === 'text/plain') {
            // Read text file
            extractedText = fs.readFileSync(filePath, 'utf8');
        } else {
            // For other types, try to read as text
            extractedText = fs.readFileSync(filePath, 'utf8');
        }

        // Create source record
        const source = sources.create({
            type: type || 'document',
            originalText: extractedText,
            fileName: req.file.originalname,
            filePath: filePath,
            fileSize: req.file.size,
        });

        res.json({
            success: true,
            sourceId: source.id,
            fileName: req.file.originalname,
            textLength: extractedText.length,
        });
    } catch (error) {
        console.error('File ingestion error:', error);
        res.status(500).json({
            error: 'Failed to process file',
            message: error.message
        });
    }
});

/**
 * POST /api/ingest/text
 * Ingest text directly (for manual paste)
 */
router.post('/text', (req, res) => {
    try {
        const { text, type, subject } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Create source record
        const source = sources.create({
            type: type || 'document',
            originalText: text,
            subject: subject || null,
        });

        res.json({
            success: true,
            sourceId: source.id,
            textLength: text.length,
        });
    } catch (error) {
        console.error('Text ingestion error:', error);
        res.status(500).json({
            error: 'Failed to process text',
            message: error.message
        });
    }
});

module.exports = router;
