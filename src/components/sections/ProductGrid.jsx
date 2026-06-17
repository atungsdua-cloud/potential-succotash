import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Users, Gauge, Fuel, Palette, Car, Plus, Tag } from 'lucide-react';
import mobilData from '../../data/mobil.json';
import useContent from '../../hooks/useContent';
import useSettings from '../../hooks/useSettings';
import InlineEditor, { InlineImage } from '../admin/InlineEditor';
import ItemModal from '../admin/ItemModal';
import TipeEditor from '../ui/TipeEditor';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../ui/SearchBar';
import FilterBar from '../ui/FilterBar';
import CarCard from '../ui/CarCard';
import { CarCardSkeleton } from '../ui/Skeleton';
import { useFilter } from '../../hooks/useFilter';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReorderButtons from '../ui/ReorderButtons';
import RichEditor from '../ui/RichEditor';
import UploadWidget from '../ui/UploadWidget';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api';

function formatHarga(price) {
  if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)} Miliar`;
  return `Rp ${(price / 1000000).toFixed(0)} Juta`;
}

function formatRupiah(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function getMinHarga(mobil) {
  if (Array.isArray(mobil.tipe) && mobil.tipe.length > 0) {
    return Math.min(...mobil.tipe.map(t => t.harga));
  }
  return mobil.harga;
}

function ModalDetail({ mobil, onClose, onUpdate }) {
  const { editMode } = useAuth();
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setLoading(false), 600);
    return () => { document.body.style.overflow = ''; clearTimeout(timer); };
  }, []);

  if (!mobil) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden premium-shadow max-h-[90vh] flex flex-col">
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-gray-900/90 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg">
          <X size={20} />
        </button>

        <div className="relative h-48 sm:h-56 lg:h-72 shrink-0">
          {loading && <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />}
          <InlineImage src={mobil.foto} alt={mobil.nama}
            onSave={(url) => onUpdate?.(mobil.id, { foto: url })}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
          {editMode && (
            <div className="absolute top-4 left-4 z-20">
              <UploadWidget onUpload={(url) => onUpdate?.(mobil.id, { foto: url })} currentUrl={mobil.foto} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 pointer-events-none">
            <InlineEditor value={mobil.nama} onSave={(val) => onUpdate?.(mobil.id, { nama: val })}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-white block mb-1" tag="h2" />
            <p className="text-honda-red text-lg sm:text-xl lg:text-2xl font-bold">Mulai {formatHarga(getMinHarga(mobil))}</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Gauge, label: 'Transmisi', value: mobil.transmisi, key: 'transmisi' },
              { icon: Users, label: 'Kapasitas', value: `${mobil.kapasitas} Kursi`, key: 'kapasitas' },
              { icon: Fuel, label: 'Mesin', value: mobil.mesin, key: 'mesin' },
              { icon: Palette, label: 'Pilihan Warna', value: Array.isArray(mobil.warna) ? mobil.warna.length.toString() : '0', key: null },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <item.icon size={20} className="text-honda-red mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</p>
                <InlineEditor value={item.value} onSave={item.key ? (val) => onUpdate?.(mobil.id, { [item.key]: val }) : undefined}
                  className="text-sm font-semibold mt-1 block" tag="p" />
              </div>
            ))}
          </div>

          {(Array.isArray(mobil.tipe) && mobil.tipe.length > 0) && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Tag size={16} className="text-honda-red" /> Pilihan Tipe
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                {mobil.tipe.map((t, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-900/50">
                    <InlineEditor value={t.nama} onSave={(val) => {
                      const newTipe = [...mobil.tipe];
                      newTipe[i] = { ...newTipe[i], nama: val };
                      onUpdate?.(mobil.id, { tipe: JSON.stringify(newTipe) });
                    }} className="text-sm font-medium" tag="span" />
                    <InlineEditor value={formatRupiah(t.harga)} onSave={(val) => {
                      const parsed = parseInt(val.replace(/\D/g, '')) || 0;
                      const newTipe = [...mobil.tipe];
                      newTipe[i] = { ...newTipe[i], harga: parsed };
                      onUpdate?.(mobil.id, { tipe: JSON.stringify(newTipe) });
                    }} className="text-sm font-bold text-honda-red shrink-0" tag="span" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <RichEditor value={mobil.deskripsi || ''} onChange={(val) => onUpdate?.(mobil.id, { deskripsi: val })}
            className="text-gray-600 dark:text-gray-400 leading-relaxed" />

          <div>
            <h4 className="font-semibold mb-3">Fitur Unggulan</h4>
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(mobil.fitur) ? mobil.fitur : []).map((fitur) => (
                <div key={fitur} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check size={16} className="text-green-500 shrink-0" />
                  {fitur}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a href="#kredit" onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-honda-red hover:bg-honda-red-dark
                         text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base">
              Simulasi Kredit
            </a>
            <a href="#testdrive" onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-honda-red
                         text-honda-red hover:bg-honda-red hover:text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base">
              Test Drive
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductGrid() {
  const [ref, isVisible] = useScrollAnimation();
  const { data: apiMobil, update, create, remove } = useContent('mobil', mobilData);
  const { editMode } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [s, setSetting] = useSettings({
    productgrid_badge: 'Pilihan Mobil Honda',
    productgrid_title: 'Jelajahi Koleksi',
    productgrid_title_hl: 'Kami',
    productgrid_desc: 'Temukan mobil yang sesuai dengan gaya hidup Anda. Dari city car hingga SUV keluarga.',
  });
  const [displayItems, setDisplayItems] = useState(apiMobil || mobilData);

  useEffect(() => { setDisplayItems(apiMobil || mobilData); }, [apiMobil]);
  const { filtered, search, setSearch, kategori, setKategori, sortBy, setSortBy, priceRange, setPriceRange } = useFilter(displayItems);
  const [selectedMobil, setSelectedMobil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="mobil" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <InlineEditor value={s.productgrid_badge} onSave={(val) => setSetting('productgrid_badge', val)} tag="span" />
          </span>
          {editMode && (
            <>
              <label className="inline-flex items-center gap-1.5 ml-3 cursor-pointer">
                <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map(m => m.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="w-4 h-4 rounded" />
                <span className="text-xs text-gray-500">Pilih Semua</span>
              </label>
              <button onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 ml-3 px-3 py-1.5 bg-honda-red text-white text-xs font-semibold rounded-full hover:bg-honda-red-dark transition-all">
                <Plus size={14} /> Tambah Mobil
              </button>
              {selectedIds.length > 0 && (
                <div className="inline-flex items-center gap-2 ml-3 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                  <span>{selectedIds.length} terpilih</span>
                  <button onClick={async () => {
                    try {
                      await apiClient.post('/batch-delete/mobil', { ids: selectedIds });
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
            <InlineEditor value={s.productgrid_title} onSave={(val) => setSetting('productgrid_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.productgrid_title_hl} onSave={(val) => setSetting('productgrid_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.productgrid_desc} onSave={(val) => setSetting('productgrid_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 xl:gap-6 xl:mb-12">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar kategori={kategori} setKategori={setKategori} sortBy={sortBy} setSortBy={setSortBy}
            priceRange={priceRange} setPriceRange={setPriceRange} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
              <AnimatePresence mode="popLayout">
                  {filtered.map((mobil, i) => (
                    <div key={mobil.id} className="relative">
                      {editMode && (
                        <input type="checkbox" checked={selectedIds.includes(mobil.id)}
                          onChange={() => { setSelectedIds(prev => prev.includes(mobil.id) ? prev.filter(id => id !== mobil.id) : [...prev, mobil.id]) }}
                          className="absolute top-3 left-3 z-10 w-4 h-4 rounded" />
                      )}
                      {editMode && (
                        <div className="absolute top-3 right-12 z-10">
                          <ReorderButtons id={mobil.id} table="mobil" items={displayItems} setItems={setDisplayItems} />
                        </div>
                      )}
                      <CarCard mobil={mobil} index={i}
                        editMode={editMode}
                        onDetail={setSelectedMobil}
                        onKredit={() => document.getElementById('kredit')?.scrollIntoView({ behavior: 'smooth' })}
                        onDelete={(id) => remove(id)}
                      />
                    </div>
                  ))}
              </AnimatePresence>
            </div>
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <Car size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Tidak ada mobil yang ditemukan</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedMobil && (
          <ModalDetail mobil={selectedMobil} onClose={() => setSelectedMobil(null)} onUpdate={update} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <ItemModal
            fields={[
              { key: 'nama', label: 'Nama Mobil' },
              { key: 'kategori', label: 'Kategori' },
              { key: 'tipe', label: 'Tipe & Harga', type: 'tipe' },
              { key: 'transmisi', label: 'Transmisi' },
              { key: 'kapasitas', label: 'Kapasitas (kursi)', type: 'number' },
              { key: 'mesin', label: 'Mesin' },
              { key: 'foto', label: 'URL Foto', type: 'gambar' },
              { key: 'warna', label: 'Warna', type: 'tags' },
              { key: 'fitur', label: 'Fitur', type: 'tags' },
              { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
            ]}
            onSave={(form) => {
              const tipe = form.tipe || [];
              const harga = tipe.length > 0 ? Math.min(...tipe.map(t => t.harga)) : 0;
              create({
                ...form,
                harga,
                warna: JSON.stringify(form.warna || []),
                fitur: JSON.stringify(form.fitur || []),
                tipe: JSON.stringify(tipe),
              });
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
