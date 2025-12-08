const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
const storagePath = path.join(__dirname, process.env.STORAGE_PATH || 'storage');
const uploadsPath = path.join(__dirname, process.env.UPLOADS_PATH || 'uploads');

if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
}
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// Routes
const ingestRoutes = require('./routes/ingest');
const processRoutes = require('./routes/process');
const tasksRoutes = require('./routes/tasks');

app.use('/api/ingest', ingestRoutes);
app.use('/api/process', processRoutes);
app.use('/api/tasks', tasksRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'WorkFlowly API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 WorkFlowly Backend running on http://localhost:${PORT}`);
    console.log(`📁 Storage path: ${storagePath}`);
    console.log(`📤 Uploads path: ${uploadsPath}`);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.warn('⚠️  WARNING: GEMINI_API_KEY not set! Please add it to .env file');
    } else {
        console.log('✅ Gemini API key configured');
    }
});

module.exports = app;
