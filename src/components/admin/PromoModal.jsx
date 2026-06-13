import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import UploadWidget from '../ui/UploadWidget';

const presetColors = [
  { label: 'Merah', value: 'bg-gradient-to-br from-honda-red to-orange-600' },
  { label: 'Biru', value: 'bg-gradient-to-br from-blue-600 to-blue-900' },
  { label: 'Hijau', value: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
  { label: 'Ungu', value: 'bg-gradient-to-br from-purple-600 to-indigo-800' },
  { label: 'Orange', value: 'bg-gradient-to-br from-orange-500 to-red-600' },
  { label: 'Hitam', value: 'bg-gradient-to-br from-gray-800 to-gray-950' },
];

export default function PromoModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    diskon: '',
    kode: '',
    gambar: '',
    validUntil: '',
    warna: presetColors[0].value,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 premium-shadow max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold mb-5">Tambah Promo Baru</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Judul Promo</label>
            <input type="text" value={form.judul} onChange={(e) => handleChange('judul', e.target.value)}
              placeholder="contoh: Diskon Akhir Tahun"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => handleChange('deskripsi', e.target.value)}
              placeholder="Deskripsi promo..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Diskon</label>
              <input type="text" value={form.diskon} onChange={(e) => handleChange('diskon', e.target.value)}
                placeholder="contoh: 20% OFF"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Kode Promo</label>
              <input type="text" value={form.kode} onChange={(e) => handleChange('kode', e.target.value)}
                placeholder="contoh: HONDA20"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Berlaku Hingga</label>
            <input type="date" value={form.validUntil} onChange={(e) => handleChange('validUntil', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Warna Background</label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((c) => (
                <button key={c.value} type="button" onClick={() => handleChange('warna', c.value)}
                  className={`w-10 h-10 rounded-xl ${c.value} border-2 transition-all ${
                    form.warna === c.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'
                  }`} title={c.label} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Gambar</label>
            <div className="flex gap-2">
              <input type="text" value={form.gambar} onChange={(e) => handleChange('gambar', e.target.value)}
                placeholder="URL Gambar"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all" />
              <UploadWidget onUpload={(url) => handleChange('gambar', url)} currentUrl={form.gambar} />
            </div>
          </div>

          <button type="submit" disabled={loading || !form.judul}
            className="w-full flex items-center justify-center gap-2 py-3 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50">
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Plus size={18} /> Tambah</>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
