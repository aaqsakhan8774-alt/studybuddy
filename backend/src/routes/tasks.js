const express = require('express');
const Task = require('../models/Task');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.userId };
  if (status) {
    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'status must be one of: todo, in-progress, done' });
    }
    filter.status = status;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, description, status, dueDate } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const task = await Task.create({
    user: req.userId,
    title,
    description: description || '',
    status: status || 'todo',
    dueDate: dueDate || null,
  });
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const { title, description, status, dueDate } = req.body || {};

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: { title, description, status, dueDate } },
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const result = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!result) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).end();
});

module.exports = router;
