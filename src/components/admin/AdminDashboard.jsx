import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Image, Car, Gift, MessageSquare, Newspaper, Images, Star, Settings,
  X, Plus, Trash2, Edit3, Search, ChevronLeft, ChevronRight, ArrowLeft, Check, Eye,
  Building2, Upload, LogOut, ExternalLink, Save, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import apiClient from '../../api';
import * as api from '../../api';
import InlineEditor from './InlineEditor';
import ItemModal from './ItemModal';
import UploadWidget from '../ui/UploadWidget';
import IconPicker from '../ui/IconPicker';
import TipeEditor from '../ui/TipeEditor';
import mobilData from '../../data/mobil.json';
import promoData from '../../data/promo.json';
import testimoniData from '../../data/testimoni.json';
import beritaData from '../../data/berita.json';
import galleryData from '../../data/gallery.json';
import keunggulanData from '../../data/keunggulan.json';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero', icon: Image },
  { id: 'mobil', label: 'Mobil', icon: Car },
  { id: 'promo', label: 'Promo', icon: Gift },
  { id: 'testimoni', label: 'Testimoni', icon: MessageSquare },
  { id: 'berita', label: 'Berita', icon: Newspaper },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'keunggulan', label: 'Keunggulan', icon: Star },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

const sectionConfigs = {
  mobil: {
    table: 'mobil',
    fallback: mobilData,
    fields: [
      { key: 'nama', label: 'Nama Mobil', type: 'text' },
      { key: 'kategori', label: 'Kategori', type: 'select', options: ['SUV', 'Sedan', 'Hatchback'] },
      { key: 'harga', label: 'Harga', type: 'number' },
      { key: 'transmisi', label: 'Transmisi', type: 'text' },
      { key: 'kapasitas', label: 'Kapasitas', type: 'number' },
      { key: 'mesin', label: 'Mesin', type: 'text' },
      { key: 'foto', label: 'Foto', type: 'gambar' },
      { key: 'warna', label: 'Warna', type: 'tags' },
      { key: 'fitur', label: 'Fitur', type: 'tags' },
      { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { key: 'tipe', label: 'Tipe', type: 'tipe' },
    ],
    columns: [
      { key: 'id', label: 'ID', width: 'w-16' },
      { key: 'nama', label: 'Nama', width: 'min-w-[180px]' },
      { key: 'kategori', label: 'Kategori', width: 'w-28' },
      { key: 'harga', label: 'Harga', width: 'w-36', render: (v) => `Rp ${(v || 0).toLocaleString('id')}` },
      { key: 'transmisi', label: 'Transmisi', width: 'w-32' },
    ],
  },
  promo: {
    table: 'promo',
    fallback: promoData,
    fields: [
      { key: 'judul', label: 'Judul', type: 'text' },
      { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { key: 'diskon', label: 'Diskon', type: 'text' },
      { key: 'kode', label: 'Kode Promo', type: 'text' },
      { key: 'gambar', label: 'Gambar', type: 'gambar' },
      { key: 'validUntil', label: 'Berlaku Hingga', type: 'text' },
      { key: 'warna', label: 'Warna Background', type: 'text' },
    ],
    columns: [
      { key: 'id', label: 'ID', width: 'w-16' },
      { key: 'judul', label: 'Judul', width: 'min-w-[160px]' },
      { key: 'diskon', label: 'Diskon', width: 'w-28' },
      { key: 'kode', label: 'Kode', width: 'w-28' },
      { key: 'validUntil', label: 'Berlaku', width: 'w-28' },
    ],
  },
  testimoni: {
    table: 'testimoni',
    fallback: testimoniData,
    fields: [
      { key: 'nama', label: 'Nama', type: 'text' },
      { key: 'rating', label: 'Rating', type: 'number' },
      { key: 'komentar', label: 'Komentar', type: 'textarea' },
      { key: 'foto', label: 'Foto', type: 'gambar' },
      { key: 'mobil', label: 'Mobil', type: 'text' },
      { key: 'tanggal', label: 'Tanggal', type: 'text' },
    ],
    columns: [
      { key: 'id', label: 'ID', width: 'w-16' },
      { key: 'nama', label: 'Nama', width: 'min-w-[140px]' },
      { key: 'rating', label: 'Rating', width: 'w-20', render: (v) => '★'.repeat(v) + '☆'.repeat(5 - v) },
      { key: 'mobil', label: 'Mobil', width: 'w-32' },
      { key: 'tanggal', label: 'Tanggal', width: 'w-28' },
    ],
  },
  berita: {
    table: 'berita',
    fallback: beritaData,
    fields: [
      { key: 'judul', label: 'Judul', type: 'text' },
      { key: 'kategori', label: 'Kategori', type: 'text' },
      { key: 'tanggal', label: 'Tanggal', type: 'text' },
      { key: 'gambar', label: 'Gambar', type: 'gambar' },
      { key: 'excerpt', label: 'Kutipan', type: 'textarea' },
    ],
    columns: [
      { key: 'id', label: 'ID', width: 'w-16' },
      { key: 'judul', label: 'Judul', width: 'min-w-[200px]' },
      { key: 'kategori', label: 'Kategori', width: 'w-24' },
      { key: 'tanggal', label: 'Tanggal', width: 'w-28' },
    ],
  },
  gallery: {
    table: 'gallery',
    fallback: galleryData,
    fields: [
      { key: 'judul', label: 'Judul', type: 'text' },
      { key: 'kategori', label: 'Kategori', type: 'text' },
      { key: 'gambar', label: 'Gambar', type: 'gambar' },
    ],
    columns: [
      { key: 'id', label: 'ID', width: 'w-16' },
      { key: 'judul', label: 'Judul', width: 'min-w-[160px]' },
      { key: 'kategori', label: 'Kategori', width: 'w-28' },
    ],
  },
  keunggulan: {
    table: 'keunggulan',
    fallback: keunggulanData,
    fields: [
      { key: 'icon', label: 'Icon', type: 'icon' },
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'desc', label: 'Deskripsi', type: 'textarea' },
    ],
    columns: [
      { key: 'id', label: 'ID', width: 'w-16' },
      { key: 'icon', label: 'Icon', width: 'w-20' },
      { key: 'title', label: 'Judul', width: 'min-w-[160px]' },
      { key: 'desc', label: 'Deskripsi', width: 'min-w-[200px]' },
    ],
  },
};

const settingsGroups = [
  {
    label: 'Hero Section',
    keys: [
      { key: 'hero_title', label: 'Judul Hero', type: 'text' },
      { key: 'hero_subtitle', label: 'Subjudul Hero', type: 'textarea' },
      { key: 'hero_image', label: 'Gambar Hero', type: 'gambar' },
    ],
  },
  {
    label: 'Product Grid',
    keys: [
      { key: 'productgrid_badge', label: 'Badge', type: 'text' },
      { key: 'productgrid_title', label: 'Judul', type: 'text' },
      { key: 'productgrid_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'productgrid_desc', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    label: 'Promo Section',
    keys: [
      { key: 'promo_badge', label: 'Badge', type: 'text' },
      { key: 'promo_title', label: 'Judul', type: 'text' },
      { key: 'promo_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'promo_desc', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    label: 'Keunggulan Section',
    keys: [
      { key: 'keunggulan_badge', label: 'Badge', type: 'text' },
      { key: 'keunggulan_title', label: 'Judul', type: 'text' },
      { key: 'keunggulan_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'keunggulan_desc', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    label: 'Testimoni Section',
    keys: [
      { key: 'testimoni_badge', label: 'Badge', type: 'text' },
      { key: 'testimoni_title', label: 'Judul', type: 'text' },
      { key: 'testimoni_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'testimoni_desc', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    label: 'Berita Section',
    keys: [
      { key: 'berita_badge', label: 'Badge', type: 'text' },
      { key: 'berita_title', label: 'Judul', type: 'text' },
      { key: 'berita_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'berita_desc', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    label: 'Gallery Section',
    keys: [
      { key: 'gallery_badge', label: 'Badge', type: 'text' },
      { key: 'gallery_title', label: 'Judul', type: 'text' },
      { key: 'gallery_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'gallery_desc', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    label: 'Kredit Section',
    keys: [
      { key: 'kredit_badge', label: 'Badge', type: 'text' },
      { key: 'kredit_title', label: 'Judul', type: 'text' },
      { key: 'kredit_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'kredit_desc', label: 'Deskripsi', type: 'textarea' },
      { key: 'kredit_button', label: 'Tombol', type: 'text' },
    ],
  },
  {
    label: 'Test Drive Section',
    keys: [
      { key: 'testdrive_badge', label: 'Badge', type: 'text' },
      { key: 'testdrive_title', label: 'Judul', type: 'text' },
      { key: 'testdrive_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'testdrive_desc', label: 'Deskripsi', type: 'textarea' },
      { key: 'testdrive_button', label: 'Tombol', type: 'text' },
      { key: 'testdrive_success_title', label: 'Sukses - Judul', type: 'text' },
      { key: 'testdrive_success_desc', label: 'Sukses - Deskripsi', type: 'textarea' },
      { key: 'testdrive_book_again', label: 'Sukses - Tombol', type: 'text' },
    ],
  },
  {
    label: 'Trade In Section',
    keys: [
      { key: 'tradein_badge', label: 'Badge', type: 'text' },
      { key: 'tradein_title', label: 'Judul', type: 'text' },
      { key: 'tradein_title_hl', label: 'Judul Highlight', type: 'text' },
      { key: 'tradein_desc', label: 'Deskripsi', type: 'textarea' },
      { key: 'tradein_button', label: 'Tombol', type: 'text' },
      { key: 'tradein_success_title', label: 'Sukses - Judul', type: 'text' },
      { key: 'tradein_success_desc', label: 'Sukses - Deskripsi', type: 'textarea' },
      { key: 'tradein_apply_again', label: 'Sukses - Tombol', type: 'text' },
    ],
  },
  {
    label: 'Kontak',
    keys: [
      { key: 'contact_alamat', label: 'Alamat', type: 'textarea' },
      { key: 'contact_telepon', label: 'Telepon', type: 'text' },
      { key: 'contact_whatsapp', label: 'WhatsApp', type: 'text' },
      { key: 'contact_email', label: 'Email', type: 'text' },
      { key: 'contact_jam', label: 'Jam Operasional', type: 'text' },
      { key: 'contact_maps_url', label: 'URL Google Maps', type: 'textarea' },
      { key: 'contact_maps_label', label: 'Label Maps', type: 'text' },
    ],
  },
  {
    label: 'Footer',
    keys: [
      { key: 'footer_about', label: 'Tentang', type: 'textarea' },
      { key: 'footer_tagline', label: 'Tagline', type: 'text' },
    ],
  },
  {
    label: 'Logo & Navigasi',
    keys: [
      { key: 'logo_text', label: 'Teks Logo', type: 'text' },
      { key: 'logo_text_hl', label: 'Teks Logo Highlight', type: 'text' },
      { key: 'logo_subtitle', label: 'Subtitle Logo', type: 'text' },
      { key: 'logo_initial', label: 'Inisial Logo', type: 'text' },
      { key: 'logo_image', label: 'Gambar Logo', type: 'gambar' },
    ],
  },
  {
    label: 'Social Media',
    keys: [
      { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
      { key: 'social_youtube', label: 'YouTube URL', type: 'text' },
      { key: 'social_twitter', label: 'Twitter URL', type: 'text' },
    ],
  },
];

function tryParse(val) {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return val; }
}

function parseMobilItem(item) {
  return {
    ...item,
    warna: tryParse(item.warna),
    fitur: tryParse(item.fitur),
    tipe: tryParse(item.tipe),
  };
}

function stringifyMobilPayload(payload) {
  const result = { ...payload };
  if (Array.isArray(result.warna)) result.warna = JSON.stringify(result.warna);
  if (Array.isArray(result.fitur)) result.fitur = JSON.stringify(result.fitur);
  if (Array.isArray(result.tipe)) result.tipe = JSON.stringify(result.tipe);
  return result;
}

function useData(table, fallback) {
  const [items, setItems] = useState(fallback || []);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/${table}`);
      const data = table === 'mobil' ? res.data.map(parseMobilItem) : res.data;
      setItems(data);
    } catch {
      setItems(fallback || []);
    }
    setLoading(false);
  }, [table]);

  useEffect(() => { load(); }, [load]);

  const create = async (payload) => {
    try {
      const body = table === 'mobil' ? stringifyMobilPayload(payload) : payload;
      const res = await apiClient.post(`/${table}`, body);
      const created = table === 'mobil' ? parseMobilItem(res.data) : res.data;
      setItems(prev => [...prev, created]);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const update = async (id, payload) => {
    try {
      const body = table === 'mobil' ? stringifyMobilPayload(payload) : payload;
      const res = await apiClient.put(`/${table}/${id}`, body);
      const updated = table === 'mobil' ? parseMobilItem(res.data) : res.data;
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await apiClient.delete(`/${table}/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const reorder = async (ids) => {
    try {
      await apiClient.post(`/reorder/${table}`, { ids });
    } catch { }
  };

  return { items, loading, create, update, remove, reorder, reload: load };
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full premium-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold">Konfirmasi</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all">
            Hapus
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EditModal({ fields, item, onSave, onClose }) {
  const [form, setForm] = useState(item || {});
  const [loading, setLoading] = useState(false);
  const [tagInputs, setTagInputs] = useState({});
  const formRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = formRef.current?.querySelector('input:not([type="hidden"]), textarea, select');
      el?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addTag = (key) => {
    const raw = tagInputs[key] || '';
    const items = raw.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    handleChange(key, [...(form[key] || []), ...items]);
    setTagInputs(prev => ({ ...prev, [key]: '' }));
  };

  const removeTag = (key, index) => {
    handleChange(key, (form[key] || []).filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast('Gagal menyimpan: ' + (err.response?.data?.error || err.message), 'error');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 premium-shadow max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold mb-5">Edit Item</h3>

        <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                {field.label}
              </label>
              {field.type === 'tags' ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(form[field.key] || []).map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-honda-red/10 text-honda-red text-sm rounded-lg">
                        {tag}
                        <button type="button" onClick={() => removeTag(field.key, i)} className="hover:text-honda-red-dark">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text"
                      value={tagInputs[field.key] || ''}
                      onChange={(e) => setTagInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(field.key); } }}
                      placeholder="Tambah (pisah dengan koma)"
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 text-sm"
                    />
                    <button type="button" onClick={() => addTag(field.key)}
                      className="px-3 py-2 bg-honda-red text-white text-sm font-semibold rounded-xl hover:bg-honda-red-dark">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ) : field.type === 'icon' ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50">
                  <IconPicker value={form[field.key] || ''} onSelect={(name) => handleChange(field.key, name)} />
                </div>
              ) : field.type === 'tipe' ? (
                <TipeEditor value={form[field.key] || []} onChange={(val) => handleChange(field.key, val)} />
              ) : field.type === 'textarea' ? (
                <textarea value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50"
                  rows={3} />
              ) : field.type === 'select' ? (
                <select value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50">
                  <option value="">Pilih {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'number' ? (
                <input type="number" value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
              ) : field.type === 'gambar' ? (
                <div className="space-y-2">
                  <input type="text" value={form[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder="URL Gambar"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
                  <div className="flex items-center gap-3">
                    <UploadWidget onUpload={(url) => handleChange(field.key, url)} currentUrl={form[field.key] || ''} />
                    {form[field.key] && (
                      <img src={form[field.key]} alt="preview"
                        className="w-16 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                  </div>
                </div>
              ) : (
                <input type="text" value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
              )}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl transition-all disabled:opacity-50">
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Save size={18} /> Simpan</>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DataTable({ config, onNavigateAway }) {
  const { items, loading, create, update, remove, reorder } = useData(config.table, config.fallback);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(item =>
      config.columns.some(col => {
        const val = item[col.key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }, [items, search, config.columns]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [search]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelected(prev => prev.length === paged.length ? [] : paged.map(i => i.id));
  };

  const bulkDelete = async () => {
    for (const id of selected) {
      try { await remove(id); } catch { }
    }
    toast(`${selected.length} item dihapus`, 'success');
    setSelected([]);
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      toast('Item dihapus', 'success');
    } catch {
      toast('Gagal menghapus', 'error');
    }
    setConfirmDelete(null);
  };

  const handleReorder = (id, dir) => {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    const to = idx + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[idx], next[to]] = [next[to], next[idx]];
    reorder(next.map(i => i.id));
    setItems(next);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <span className="text-sm text-gray-500">{selected.length} dipilih</span>
              <button onClick={selectAll}
                className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                {selected.length === paged.length ? 'Deselect' : 'Pilih Semua'}
              </button>
              <button onClick={bulkDelete}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl">
                <Trash2 size={12} /> Hapus
              </button>
            </>
          )}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-honda-red hover:bg-honda-red-dark text-white text-sm font-semibold rounded-xl transition-all">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" checked={selected.length === paged.length && paged.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-honda-red" />
                </th>
                <th className="px-4 py-3 text-left w-16 text-xs font-semibold text-gray-500 uppercase tracking-wider">Urut</th>
                {config.columns.map(col => (
                  <th key={col.key} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.width || ''}`}>
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right w-24 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan={config.columns.length + 3} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-honda-red border-t-transparent rounded-full animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 3} className="px-4 py-12 text-center text-gray-400">
                    {search ? 'Tidak ada hasil' : 'Belum ada data'}
                  </td>
                </tr>
              ) : paged.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-honda-red" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => handleReorder(item.id, -1)}
                        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-20"
                        disabled={idx === 0}>
                        <ChevronLeft size={14} />
                      </button>
                      <button onClick={() => handleReorder(item.id, 1)}
                        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-20"
                        disabled={idx === paged.length - 1}>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                  {config.columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {col.key === 'id' ? (
                        <span className="text-xs text-gray-400">#{item.id}</span>
                      ) : col.key === 'icon' ? (
                        <span className="text-lg text-honda-red">{item[col.key]}</span>
                      ) : col.render ? (
                        col.render(item[col.key])
                      ) : (
                        <span className="line-clamp-1">{item[col.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditItem(item)}
                        className="p-2 text-gray-400 hover:text-honda-red hover:bg-honda-red/10 rounded-lg transition-all" title="Edit">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => setConfirmDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Hapus">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500">
              {filtered.length} item
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    page === p ? 'bg-honda-red text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <ItemModal
            fields={config.fields}
            onSave={async (form) => {
              try {
                await create(form);
                toast('Item ditambahkan', 'success');
                setShowAdd(false);
              } catch (err) {
                toast('Gagal menambah: ' + (err.response?.data?.error || err.message), 'error');
                throw err;
              }
            }}
            onClose={() => setShowAdd(false)}
          />
        )}
        {editItem && (
          <EditModal
            fields={config.fields}
            item={editItem}
            onSave={async (form) => {
              try {
                await update(editItem.id, form);
                toast('Item diperbarui', 'success');
                setEditItem(null);
              } catch (err) {
                toast('Gagal update: ' + (err.response?.data?.error || err.message), 'error');
                throw err;
              }
            }}
            onClose={() => setEditItem(null)}
          />
        )}
        {confirmDelete && (
          <ConfirmModal
            message="Apakah Anda yakin ingin menghapus item ini?"
            onConfirm={() => handleDelete(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsEditor() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const toast = useToast();

  useEffect(() => {
    api.fetchSettings().then(data => {
      if (data) setSettings(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const update = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      await api.updateSetting(key, value);
    } catch {
      toast('Gagal menyimpan', 'error');
    }
    setSaving(prev => ({ ...prev, [key]: false }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-6 h-6 border-2 border-honda-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {settingsGroups.map(group => (
        <div key={group.label} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Settings size={18} className="text-honda-red" />
            {group.label}
          </h3>
          <div className="space-y-4">
            {group.keys.map(({ key, label, type }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">{label}</label>
                <div className="flex gap-2">
                  {type === 'textarea' ? (
                    <textarea value={settings[key] || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 text-sm"
                      rows={3} />
                  ) : type === 'gambar' ? (
                    <div className="flex-1 space-y-2">
                      <input type="text" value={settings[key] || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder="URL Gambar"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 text-sm" />
                      <UploadWidget onUpload={(url) => update(key, url)} currentUrl={settings[key] || ''} />
                    </div>
                  ) : (
                    <input type="text" value={settings[key] || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 text-sm" />
                  )}
                  <button onClick={() => update(key, settings[key])} disabled={saving[key]}
                    className="px-4 py-2.5 bg-honda-red hover:bg-honda-red-dark text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold shrink-0">
                    {saving[key] ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                    Simpan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroEditor() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const toast = useToast();

  useEffect(() => {
    api.fetchSettings().then(data => {
      if (data) setSettings(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const update = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      await api.updateSetting(key, value);
      toast('Disimpan', 'success');
    } catch {
      toast('Gagal menyimpan', 'error');
    }
    setSaving(prev => ({ ...prev, [key]: false }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><span className="w-6 h-6 border-2 border-honda-red border-t-transparent rounded-full animate-spin" /></div>;
  }

  const heroFields = [
    { key: 'hero_title', label: 'Judul Hero', type: 'text' },
    { key: 'hero_subtitle', label: 'Subjudul Hero', type: 'textarea' },
    { key: 'hero_image', label: 'Gambar Hero', type: 'gambar' },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {heroFields.map(({ key, label, type }) => (
        <div key={key} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">{label}</label>
          {type === 'textarea' ? (
            <textarea value={settings[key] || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50"
              rows={3} />
          ) : type === 'gambar' ? (
            <div className="space-y-3">
              {settings[key] && (
                <img src={settings[key]} alt="Hero" className="w-full h-48 object-cover rounded-xl" />
              )}
              <input type="text" value={settings[key] || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder="URL Gambar"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
              <UploadWidget onUpload={(url) => update(key, url)} currentUrl={settings[key] || ''} crop={16 / 9} />
            </div>
          ) : (
            <input type="text" value={settings[key] || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
          )}
          <div className="flex justify-end mt-3">
            <button onClick={() => update(key, settings[key])} disabled={saving[key]}
              className="px-4 py-2 bg-honda-red hover:bg-honda-red-dark text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold">
              {saving[key] ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              Simpan
            </button>
          </div>
        </div>
      ))}

      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold mb-3">Pratinjau Hero</h4>
        <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {settings.hero_image && (
            <img src={settings.hero_image} alt="Hero Preview" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
            <div>
              <h2 className="text-white text-2xl font-bold">{settings.hero_title || 'Judul Hero'}</h2>
              <p className="text-white/70 text-sm mt-2">{settings.hero_subtitle || 'Subjudul hero'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const sections = ['mobil', 'promo', 'testimoni', 'berita', 'gallery', 'keunggulan'];
        const results = await Promise.all(
          sections.map(async (s) => {
            try {
              const res = await axios.get(`/api/${s}`);
              return { section: s, count: res.data.length };
            } catch { return { section: s, count: 0 }; }
          })
        );
        const obj = {};
        results.forEach(r => { obj[r.section] = r.count; });
        setStats(obj);
      } catch { }
      setLoading(false);
    };
    loadStats();
  }, []);

  const cards = [
    { label: 'Mobil', count: stats?.mobil || 0, icon: Car, color: 'bg-blue-500' },
    { label: 'Promo', count: stats?.promo || 0, icon: Gift, color: 'bg-orange-500' },
    { label: 'Testimoni', count: stats?.testimoni || 0, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'Berita', count: stats?.berita || 0, icon: Newspaper, color: 'bg-purple-500' },
    { label: 'Gallery', count: stats?.gallery || 0, icon: Images, color: 'bg-pink-500' },
    { label: 'Keunggulan', count: stats?.keunggulan || 0, icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Dashboard</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Selamat datang di panel admin. Kelola seluruh konten website di sini.</p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="w-6 h-6 border-2 border-honda-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cards.map(card => (
            <div key={card.label} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-black">{card.count}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold mb-4">Informasi</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>Gunakan sidebar untuk mengelola setiap bagian website.</p>
          <p>Klik <strong>Mode Edit</strong> untuk mengaktifkan edit inline pada halaman utama.</p>
          <p>Setiap perubahan akan tersimpan otomatis ke database.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout } = useAuth();
  const [logoText, setLogoText] = useState('Honda');
  const [logoTextHl, setLogoTextHl] = useState('Dealer');

  useEffect(() => {
    api.fetchSettings().then(data => {
      if (data?.logo_text) setLogoText(data.logo_text);
      if (data?.logo_text_hl) setLogoTextHl(data.logo_text_hl);
    }).catch(() => {});
  }, []);

  const saveSetting = async (key, value) => {
    try { await api.updateSetting(key, value); } catch {}
  };

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex pt-10 sm:pt-12">
      <aside className="w-64 lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-black flex items-center gap-2">
            <span className="w-8 h-8 bg-honda-red rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">H</span>
            <div className="flex flex-col leading-tight">
              <span className="text-base">
                <InlineEditor value={logoText} onSave={(val) => { setLogoText(val); saveSetting('logo_text', val); }} tag="span" />
                {' '}
                <span className="text-honda-red">
                  <InlineEditor value={logoTextHl} onSave={(val) => { setLogoTextHl(val); saveSetting('logo_text_hl', val); }} tag="span" />
                </span>
              </span>
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Authorized Dealer</span>
            </div>
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-honda-red/10 text-honda-red shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-10 sm:top-12 z-10 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ActiveIcon size={22} className="text-honda-red" />
            <h2 className="text-lg font-bold">{tabs.find(t => t.id === activeTab)?.label}</h2>
          </div>
          <a href="/"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <ExternalLink size={15} /> Lihat Website
          </a>
        </div>

        <div className="p-6 lg:p-8">
          {activeTab === 'dashboard' && <Overview />}
          {activeTab === 'hero' && <HeroEditor />}
          {activeTab === 'mobil' && <DataTable config={sectionConfigs.mobil} />}
          {activeTab === 'promo' && <DataTable config={sectionConfigs.promo} />}
          {activeTab === 'testimoni' && <DataTable config={sectionConfigs.testimoni} />}
          {activeTab === 'berita' && <DataTable config={sectionConfigs.berita} />}
          {activeTab === 'gallery' && <DataTable config={sectionConfigs.gallery} />}
          {activeTab === 'keunggulan' && <DataTable config={sectionConfigs.keunggulan} />}
          {activeTab === 'settings' && <SettingsEditor />}
        </div>
      </main>
    </div>
  );
}
