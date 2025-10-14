import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

// Get check-ins for a habit within a date range
router.get('/', (req, res) => {
  const habitId = Number(req.query.habitId);
  const { start, end } = req.query;
  if (!Number.isFinite(habitId)) return res.status(400).json({ error: 'habitId required' });
  const rows = db
    .prepare(
      `SELECT date, value FROM checkins
       WHERE habit_id = ? AND date BETWEEN ? AND ?
       ORDER BY date ASC`
    )
    .all(habitId, start || '0000-01-01', end || '9999-12-31');
  res.json(rows);
});

// Toggle or set a check-in value for a specific date
router.post('/', (req, res) => {
  const { habitId, date, value } = req.body ?? {};
  if (!Number.isFinite(habitId) || !date) {
    return res.status(400).json({ error: 'habitId and date required' });
  }
  const normalizedValue = typeof value === 'number' ? (value ? 1 : 0) : 1;
  const insert = db.prepare(
    `INSERT INTO checkins (habit_id, date, value) VALUES (?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET value = excluded.value`
  );
  insert.run(habitId, date, normalizedValue);
  const row = db
    .prepare('SELECT date, value FROM checkins WHERE habit_id = ? AND date = ?')
    .get(habitId, date);
  res.status(201).json(row);
});

export default router;
