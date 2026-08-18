const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const noteRoutes = require('./routes/notes');

async function start() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/notes', noteRoutes);

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  app.listen(config.port, () => {
    console.log(`StudyBuddy backend listening on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
