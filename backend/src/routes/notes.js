const express = require('express');
const Note = require('../models/Note');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
  res.json(notes);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const note = await Note.create({ user: req.userId, title, content: content || '' });
  res.status(201).json(note);
});

router.put('/:id', async (req, res) => {
  const { title, content } = req.body || {};

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: { title, content } },
    { new: true, runValidators: true }
  );

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

router.delete('/:id', async (req, res) => {
  const result = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!result) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.status(204).end();
});

module.exports = router;
