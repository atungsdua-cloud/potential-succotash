import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Trash2, Plus } from 'lucide-react';
import galleryData from '../../data/gallery.json';
import useContent from '../../hooks/useContent';
import useSettings from '../../hooks/useSettings';
import InlineEditor, { InlineImage } from '../admin/InlineEditor';
import ItemModal from '../admin/ItemModal';
import { useAuth } from '../../context/AuthContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReorderButtons from '../ui/ReorderButtons';
import { useToast } from '../../context/ToastContext';

const galleryFields = [
  { key: 'judul', label: 'Judul' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'gambar', label: 'URL Gambar', type: 'gambar' },
];

export default function Gallery() {
  const [ref, isVisible] = useScrollAnimation();
  const { editMode } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { data: list, update, create, remove } = useContent('gallery', galleryData);
  const [s, setSetting] = useSettings({
    gallery_badge: 'Galeri',
    gallery_title: 'Galeri',
    gallery_title_hl: 'Dealer Kami',
    gallery_desc: 'Lihat langsung suasana dealer dan fasilitas kami.',
  });
  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterKategori, setFilterKategori] = useState('');
  const toast = useToast();
  const [items, setItems] = useState(list || []);

  useEffect(() => {
    setItems(list || []);
  }, [list]);

  const kategoriList = useMemo(() => {
    return [...new Set((items || []).map(i => i.kategori).filter(Boolean))];
  }, [items]);

  const filtered = useMemo(() => {
    if (!filterKategori) return items || [];
    return (items || []).filter(i => i.kategori === filterKategori);
  }, [items, filterKategori]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i.id));
    }
  };

  const bulkDelete = async () => {
    for (const id of selectedIds) {
      await remove(id);
    }
    setSelectedIds([]);
    toast(`${selectedIds.length} item dihapus`, 'success');
  };

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <Image size={14} className="inline mr-1" /> <InlineEditor value={s.gallery_badge} onSave={(val) => setSetting('gallery_badge', val)} tag="span" />
          </span>
          {editMode && (
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 ml-3 px-3 py-1.5 bg-honda-red text-white text-xs font-semibold rounded-full hover:bg-honda-red-dark transition-all">
              <Plus size={14} /> Tambah
            </button>
          )}
          {editMode && selectedIds.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                {selectedIds.length} item dipilih
              </span>
              <div className="flex items-center gap-2">
                <button onClick={selectAll}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  {selectedIds.length === items.length ? 'Deselect All' : 'Select All'}
                </button>
                <button onClick={bulkDelete}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all">
                  <Trash2 size={12} /> Hapus Semua
                </button>
              </div>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4">
            <InlineEditor value={s.gallery_title} onSave={(val) => setSetting('gallery_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.gallery_title_hl} onSave={(val) => setSetting('gallery_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.gallery_desc} onSave={(val) => setSetting('gallery_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setFilterKategori('')}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
              !filterKategori
                ? 'bg-honda-red text-white shadow-md shadow-honda-red/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-honda-red/50'
            }`}
          >
            Semua
          </button>
          {kategoriList.map(kat => (
            <button
              key={kat}
              onClick={() => setFilterKategori(kat)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                filterKategori === kat
                  ? 'bg-honda-red text-white shadow-md shadow-honda-red/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-honda-red/50'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Image size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-400 dark:text-gray-500 text-lg">Tidak ada gambar ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelected(item)}
                className="relative cursor-pointer group rounded-2xl overflow-hidden premium-shadow aspect-[4/3]"
              >
                {editMode && (
                  <>
                    <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-honda-red cursor-pointer"
                      />
                    </div>
                    <div className="absolute top-3 right-3 z-10 flex items-start gap-1">
                      <ReorderButtons id={item.id} table="gallery" items={items} setItems={setItems} />
                      <button onClick={(e) => { e.stopPropagation(); remove(item.id); }}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
                <InlineImage
                  src={item.gambar}
                  alt={item.judul}
                  onSave={(url) => update(item.id, { gambar: url })}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  <span className="px-3 py-1 bg-honda-red text-white text-xs font-semibold rounded-lg w-fit mb-2">
                    <InlineEditor value={item.kategori} onSave={(val) => update(item.id, { kategori: val })} />
                  </span>
                  <InlineEditor
                    value={item.judul}
                    onSave={(val) => update(item.id, { judul: val })}
                    className="text-white font-bold text-lg block drop-shadow-lg"
                    tag="h3"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-xl hover:bg-black/70 transition-colors">
                <X size={24} />
              </button>
              <img src={selected.gambar} alt={selected.judul} className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="p-4 bg-white dark:bg-gray-900">
                <h3 className="font-bold">{selected.judul}</h3>
                <p className="text-sm text-gray-500">{selected.kategori}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <ItemModal
            fields={galleryFields}
            onSave={(form) => create(form)}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
