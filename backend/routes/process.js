const express = require('express');
const router = express.Router();
const { processWithGemini } = require('../services/gemini');
const { sources, tasks } = require('../services/storage');

/**
 * POST /api/process/source
 * Process a source with Gemini AI and create tasks
 */
router.post('/source', async (req, res) => {
    try {
        const { sourceId, type, text } = req.body;

        let sourceData;
        let sourceType;
        let content;

        if (sourceId) {
            // Load source from storage
            sourceData = sources.getById(sourceId);
            if (!sourceData) {
                return res.status(404).json({ error: 'Source not found' });
            }
            sourceType = sourceData.type;
            content = sourceData.originalText;
        } else if (text) {
            // Use provided text directly
            sourceType = type || 'document';
            content = text;

            // Create a source record for tracking
            sourceData = sources.create({
                type: sourceType,
                originalText: content,
            });
        } else {
            return res.status(400).json({ error: 'No source or text provided' });
        }

        // Process with Gemini
        const aiResult = await processWithGemini(sourceType, content);

        // Extract action items from AI result
        let actionItems = [];

        if (aiResult.action_items) {
            actionItems = aiResult.action_items;
        } else if (Array.isArray(aiResult)) {
            actionItems = aiResult;
        }

        // Create tasks from action items
        const createdTasks = [];

        for (const item of actionItems) {
            const task = tasks.create({
                title: item.text ? item.text.slice(0, 100) : 'Untitled Task',
                description: item.text || '',
                assignee: item.owner || null,
                dueDate: item.due || null,
                status: 'backlog',
                confidence: item.confidence || 0.5,
                priority: item.priority || 'medium',
                sourceId: sourceData.id,
            });
            createdTasks.push(task);
        }

        res.json({
            success: true,
            tasksCreated: createdTasks.length,
            tasks: createdTasks,
            summary: aiResult.summary || null,
            decisions: aiResult.decisions || null,
        });
    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({
            error: 'Failed to process source',
            message: error.message
        });
    }
});

module.exports = router;
