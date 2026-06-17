import { Router } from 'express';
import { supabase } from '../supabase.js';
import { authMiddleware } from '../middleware/auth.js';

export function createCrudRoutes(table, allowedFields) {
  const router = Router();
  const selectFields = allowedFields.join(', ');

  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(`id, ${selectFields}`)
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });
      if (error) throw error;
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(`id, ${selectFields}`)
        .eq('id', req.params.id)
        .limit(1);
      if (error) throw error;
      const row = data && data[0];
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { data: existing } = await supabase
        .from(table)
        .select('id')
        .eq('id', req.params.id)
        .limit(1);
      if (!existing || !existing[0]) return res.status(404).json({ error: 'Not found' });

      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', req.params.id)
        .select(`id, ${selectFields}`)
        .limit(1);
      if (error) throw error;
      res.json(data && data[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authMiddleware, async (req, res) => {
    try {
      const insert = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          insert[field] = req.body[field];
        }
      }
      if (Object.keys(insert).length === 0) {
        return res.status(400).json({ error: 'No fields provided' });
      }

      const { data, error } = await supabase
        .from(table)
        .insert(insert)
        .select(`id, ${selectFields}`)
        .limit(1);
      if (error) throw error;
      res.status(201).json(data && data[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const { error, count } = await supabase
        .from(table)
        .delete()
        .eq('id', req.params.id);
      if (error) throw error;
      if (count === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
