import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

export function createCrudRoutes(table, allowedFields) {
  const router = Router();

  const selectFields = allowedFields.join(', ');

  router.get('/', (req, res) => {
    const rows = db.prepare(`SELECT id, ${selectFields} FROM ${table} ORDER BY sort_order ASC, id ASC`).all();
    res.json(rows);
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare(`SELECT id, ${selectFields} FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });

  router.put('/:id', authMiddleware, (req, res) => {
    const existing = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const updates = [];
    const values = [];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    db.prepare(`UPDATE ${table} SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    const updated = db.prepare(`SELECT id, ${selectFields} FROM ${table} WHERE id = ?`).get(req.params.id);
    res.json(updated);
  });

  router.post('/', authMiddleware, (req, res) => {
    const fields = [];
    const placeholders = [];
    const values = [];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(field);
        placeholders.push('?');
        values.push(req.body[field]);
      }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields provided' });

    const result = db.prepare(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`).run(...values);
    const created = db.prepare(`SELECT id, ${selectFields} FROM ${table} WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json(created);
  });

  router.delete('/:id', authMiddleware, (req, res) => {
    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  });

  return router;
}
