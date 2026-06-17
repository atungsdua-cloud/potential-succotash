import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Gift, ArrowRight, Sparkles, Trash2, Plus, X, Save } from 'lucide-react';
import promoData from '../../data/promo.json';
import useContent from '../../hooks/useContent';
import useSettings from '../../hooks/useSettings';
import InlineEditor, { InlineImage } from '../admin/InlineEditor';
import { useAuth } from '../../context/AuthContext';
import { useCountdown } from '../../hooks/useCountdown';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReorderButtons from '../ui/ReorderButtons';
import RichEditor from '../ui/RichEditor';
import UploadWidget from '../ui/UploadWidget';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api';

function CountdownTimer({ targetDate }) {
  const time = useCountdown(targetDate);
  return (
    <div className="flex gap-2">
      {[
        { label: 'Hari', value: time.days },
        { label: 'Jam', value: time.hours },
        { label: 'Menit', value: time.minutes },
        { label: 'Detik', value: time.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
            <span className="text-xl xl:text-2xl font-bold text-white">{String(item.value).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] text-white/60 uppercase mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PromoSection() {
  const [ref, isVisible] = useScrollAnimation();
  const { editMode } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { data: list, update, create, remove } = useContent('promo', promoData);
  const [s, setSetting] = useSettings({
    promo_badge: 'Promo Spesial',
    promo_title: 'Penawaran',
    promo_title_hl: 'Terbatas',
    promo_desc: 'Jangan lewatkan promo spesial dari kami. Periode terbatas, kesempatan terbatas!',
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const toast = useToast();
  const [displayItems, setDisplayItems] = useState(list || promoData);

  useEffect(() => { setDisplayItems(list || promoData); }, [list]);

  return (
    <section id="promo" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold rounded-full mb-4">
            <Sparkles size={14} /> <InlineEditor value={s.promo_badge} onSave={(val) => setSetting('promo_badge', val)} tag="span" />
          </span>
          {editMode && (
            <>
              <label className="inline-flex items-center gap-1.5 ml-3 cursor-pointer">
                <input type="checkbox" checked={selectedIds.length === (displayItems || []).length && (displayItems || []).length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds((displayItems || []).map(m => m.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="w-4 h-4 rounded" />
                <span className="text-xs text-gray-500">Pilih Semua</span>
              </label>
              <button onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 ml-3 px-3 py-1.5 bg-honda-red text-white text-xs font-semibold rounded-full hover:bg-honda-red-dark transition-all">
                <Plus size={14} /> Tambah
              </button>
              {selectedIds.length > 0 && (
                <div className="inline-flex items-center gap-2 ml-3 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                  <span>{selectedIds.length} terpilih</span>
                  <button onClick={async () => {
                    try {
                      await apiClient.post('/batch-delete/promo', { ids: selectedIds });
                      setDisplayItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
                      selectedIds.forEach(id => remove(id));
                      setSelectedIds([]);
                      toast('Berhasil menghapus item', 'success');
                    } catch { toast('Gagal menghapus', 'error'); }
                  }} className="px-2 py-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all">
                    Hapus Terpilih
                  </button>
                  <button onClick={() => setSelectedIds([])} className="p-0.5 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition-all">
                    <X size={12} />
                  </button>
                </div>
              )}
            </>
          )}
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4">
            <InlineEditor value={s.promo_title} onSave={(val) => setSetting('promo_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.promo_title_hl} onSave={(val) => setSetting('promo_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.promo_desc} onSave={(val) => setSetting('promo_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {(displayItems || []).map((promo, index) => (
            <motion.div
              key={promo.id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative group rounded-2xl overflow-hidden premium-shadow cursor-pointer"
            >
              {editMode && (
                <>
                  <input type="checkbox" checked={selectedIds.includes(promo.id)}
                    onChange={() => { setSelectedIds(prev => prev.includes(promo.id) ? prev.filter(id => id !== promo.id) : [...prev, promo.id]) }}
                    className="absolute top-3 left-3 z-10 w-4 h-4 rounded" />
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
                    <ReorderButtons id={promo.id} table="promo" items={displayItems} setItems={setDisplayItems} />
                    <button onClick={() => remove(promo.id)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
              <div className={`absolute inset-0 ${promo.warna || 'bg-gradient-to-br from-honda-red to-orange-600'}`} />
              <InlineImage
                src={promo.gambar}
                alt={promo.judul}
                onSave={(url) => update(promo.id, { gambar: url })}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              />

              <div className="relative p-6 sm:p-8">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-bold uppercase mb-4">
                  <Gift size={14} className="inline mr-1" />
                  <InlineEditor value={promo.diskon} onSave={(val) => update(promo.id, { diskon: val })} />
                </div>

                <InlineEditor
                  value={promo.judul}
                  onSave={(val) => update(promo.id, { judul: val })}
                  className="text-xl xl:text-2xl font-bold text-white block mb-3"
                  tag="h3"
                />
                <RichEditor value={promo.deskripsi || ''} onChange={(val) => update(promo.id, { deskripsi: val })}
                  className="text-white/70 text-sm mb-5 leading-relaxed" />

                <div className="flex items-center gap-3 mb-5">
                  <Clock size={16} className="text-white/60" />
                  <span className="text-white/60 text-xs">Berlaku hingga:</span>
                  <CountdownTimer targetDate={promo.validUntil} />
                </div>

                {editMode && (
                  <div className="mb-3">
                    <UploadWidget onUpload={(url) => update(promo.id, { gambar: url })} currentUrl={promo.gambar} />
                  </div>
                )}
                <button onClick={() => document.getElementById('kredit')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm
                             hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300
                             border border-white/20 text-sm">
                  Klaim Promo <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddPromoModal onSave={(form) => { create(form); setShowModal(false); }} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

const presetColors = [
  { label: 'Merah', value: 'bg-gradient-to-br from-honda-red to-orange-600' },
  { label: 'Biru', value: 'bg-gradient-to-br from-blue-600 to-blue-900' },
  { label: 'Hijau', value: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
  { label: 'Ungu', value: 'bg-gradient-to-br from-purple-600 to-indigo-800' },
  { label: 'Orange', value: 'bg-gradient-to-br from-orange-500 to-red-600' },
  { label: 'Hitam', value: 'bg-gradient-to-br from-gray-800 to-gray-950' },
];

function AddPromoModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    judul: '', deskripsi: '', diskon: '', kode: '', gambar: '', validUntil: '', warna: presetColors[0].value,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form); onClose(); } catch { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 premium-shadow max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        <h3 className="text-lg font-bold mb-5">Tambah Promo Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={form.judul} onChange={(e) => setForm(p => ({ ...p, judul: e.target.value }))}
            placeholder="Judul Promo" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" />
          <textarea value={form.deskripsi} onChange={(e) => setForm(p => ({ ...p, deskripsi: e.target.value }))}
            placeholder="Deskripsi" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl" rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.diskon} onChange={(e) => setForm(p => ({ ...p, diskon: e.target.value }))}
              placeholder="Diskon" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
            <input type="text" value={form.kode} onChange={(e) => setForm(p => ({ ...p, kode: e.target.value }))}
              placeholder="Kode Promo" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
          </div>
          <input type="date" value={form.validUntil} onChange={(e) => setForm(p => ({ ...p, validUntil: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
          <div className="flex flex-wrap gap-2">
            {presetColors.map((c) => (
              <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, warna: c.value }))}
                className={`w-10 h-10 rounded-xl ${c.value} border-2 ${form.warna === c.value ? 'border-gray-900 scale-110' : 'border-transparent'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={form.gambar} onChange={(e) => setForm(p => ({ ...p, gambar: e.target.value }))}
              placeholder="URL Gambar" className="flex-1 px-4 py-3 bg-gray-50 border rounded-xl" />
            <UploadWidget onUpload={(url) => setForm(p => ({ ...p, gambar: url }))} currentUrl={form.gambar} />
          </div>
          <button type="submit" disabled={loading || !form.judul}
            className="w-full py-3 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl disabled:opacity-50">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : <><Save size={18} /> Tambah</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
