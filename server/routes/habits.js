import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

router.get('/', (_req, res) => {
  const habits = db.prepare('SELECT * FROM habits ORDER BY id DESC').all();
  res.json(habits);
});

router.post('/', (req, res) => {
  const { name, color } = req.body ?? {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const insert = db.prepare('INSERT INTO habits (name, color) VALUES (?, ?)');
  const info = insert.run(name.trim(), color || '#22c55e');
  const habit = db.prepare('SELECT * FROM habits WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(habit);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
  const del = db.prepare('DELETE FROM habits WHERE id = ?').run(id);
  if (del.changes === 0) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

export default router;
