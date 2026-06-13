import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import { createCrudRoutes } from './routes/crud.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

const mobilFields = ['nama', 'kategori', 'harga', 'transmisi', 'kapasitas', 'mesin', 'foto', 'warna', 'fitur', 'deskripsi', 'tipe'];
const promoFields = ['judul', 'deskripsi', 'diskon', 'kode', 'gambar', 'validUntil', 'warna'];
const testimoniFields = ['nama', 'rating', 'komentar', 'foto', 'mobil', 'tanggal'];
const beritaFields = ['judul', 'kategori', 'tanggal', 'gambar', 'excerpt'];
const galleryFields = ['judul', 'kategori', 'gambar'];
const keunggulanFields = ['icon', 'title', 'desc'];

app.use('/api/mobil', createCrudRoutes('mobil', mobilFields));
app.use('/api/promo', createCrudRoutes('promo', promoFields));
app.use('/api/testimoni', createCrudRoutes('testimoni', testimoniFields));
app.use('/api/berita', createCrudRoutes('berita', beritaFields));
app.use('/api/gallery', createCrudRoutes('gallery', galleryFields));
app.use('/api/keunggulan', createCrudRoutes('keunggulan', keunggulanFields));

app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  for (const row of rows) obj[row.key] = row.value;
  res.json(obj);
});

app.put('/api/settings/:key', authMiddleware, (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ error: 'Value required' });
  db.prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').run(value, req.params.key);
  res.json({ key: req.params.key, value });
});

app.post('/api/batch-delete/:table', authMiddleware, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'No IDs provided' });
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM ${req.params.table} WHERE id IN (${placeholders})`).run(...ids);
  res.json({ deleted: result.changes });
});

app.post('/api/reorder/:table', authMiddleware, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid IDs' });
  const stmt = db.prepare(`UPDATE ${req.params.table} SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  const tx = db.transaction(() => {
    for (let i = 0; i < ids.length; i++) stmt.run(i, ids[i]);
  });
  tx();
  res.json({ ok: true });
});

app.use(express.static(join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
