import express from 'express';
import cors from 'cors';
import db from './db/connection.js';
import habitsRouter from './routes/habits.js';
import checkinsRouter from './routes/checkins.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  try {
    // Simple sanity query
    const row = db.prepare('SELECT 1 as ok').get();
    res.json({ status: 'ok', db: row.ok === 1 });
  } catch (error) {
    res.status(500).json({ status: 'error', error: String(error) });
  }
});

// Placeholder: routes will be mounted under /api
app.use('/api/habits', habitsRouter);
app.use('/api/checkins', checkinsRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
