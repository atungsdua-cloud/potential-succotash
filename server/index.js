import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './supabase.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import { createCrudRoutes } from './routes/crud.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VALID_TABLES = ['mobil', 'promo', 'testimoni', 'berita', 'gallery', 'keunggulan', 'test_drive', 'trade_in'];

const app = express();
const PORT = process.env.PORT || 3001;

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

app.get('/api/settings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) throw error;
    const obj = {};
    for (const row of data) obj[row.key] = row.value;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'Value required' });
    const { error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', req.params.key);
    if (error) throw error;
    res.json({ key: req.params.key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/batch-delete/:table', authMiddleware, async (req, res) => {
  try {
    const { table } = req.params;
    if (!VALID_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'No IDs provided' });
    const { error } = await supabase.from(table).delete().in('id', ids);
    if (error) throw error;
    res.json({ deleted: ids.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reorder/:table', authMiddleware, async (req, res) => {
  try {
    const { table } = req.params;
    if (!VALID_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid IDs' });
    for (let i = 0; i < ids.length; i++) {
      await supabase
        .from(table)
        .update({ sort_order: i, updated_at: new Date().toISOString() })
        .eq('id', ids[i]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/test-drive', async (req, res) => {
  try {
    const { nama, nohp, mobil, tanggal, lokasi } = req.body;
    if (!nama || !nohp || !mobil || !tanggal || !lokasi) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }
    const { data, error } = await supabase
      .from('test_drive')
      .insert({ nama, nohp, mobil, tanggal, lokasi })
      .select('id')
      .limit(1);
    if (error) throw error;
    res.status(201).json({ id: data[0].id, message: 'Test drive berhasil didaftarkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test-drive', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('test_drive')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trade-in', async (req, res) => {
  try {
    const { nama, nohp, merek, tahun, kilometer, kondisi, mobil_target } = req.body;
    if (!nama || !nohp || !merek || !tahun || !kilometer || !kondisi) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }
    const { data, error } = await supabase
      .from('trade_in')
      .insert({ nama, nohp, merek, tahun, kilometer, kondisi, mobil_target: mobil_target || '' })
      .select('id')
      .limit(1);
    if (error) throw error;
    res.status(201).json({ id: data[0].id, message: 'Trade-in berhasil didaftarkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trade-in', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trade_in')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
