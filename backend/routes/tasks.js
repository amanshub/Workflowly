const express = require('express');
const router = express.Router();
const { tasks } = require('../services/storage');

/**
 * GET /api/tasks
 * Get all tasks
 */
router.get('/', (req, res) => {
    try {
        const allTasks = tasks.getAll();
        res.json({ tasks: allTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

/**
 * GET /api/tasks/:id
 * Get a single task by ID
 */
router.get('/:id', (req, res) => {
    try {
        const task = tasks.getById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ task });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

/**
 * POST /api/tasks
 * Create a new task manually
 */
router.post('/', (req, res) => {
    try {
        const taskData = {
            title: req.body.title || 'Untitled Task',
            description: req.body.description || '',
            assignee: req.body.assignee || null,
            dueDate: req.body.dueDate || null,
            status: req.body.status || 'backlog',
            confidence: req.body.confidence || 1.0,
            priority: req.body.priority || 'medium',
            sourceId: req.body.sourceId || null,
        };

        const newTask = tasks.create(taskData);
        res.status(201).json({ task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

/**
 * PATCH /api/tasks/:id
 * Update a task
 */
router.patch('/:id', (req, res) => {
    try {
        const updates = {};

        // Only update provided fields
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.assignee !== undefined) updates.assignee = req.body.assignee;
        if (req.body.dueDate !== undefined) updates.dueDate = req.body.dueDate;
        if (req.body.status !== undefined) updates.status = req.body.status;
        if (req.body.priority !== undefined) updates.priority = req.body.priority;

        const updatedTask = tasks.update(req.params.id, updates);

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ task: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', (req, res) => {
    try {
        const deleted = tasks.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
