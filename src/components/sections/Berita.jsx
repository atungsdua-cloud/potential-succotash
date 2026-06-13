import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Trash2, Plus } from 'lucide-react';
import beritaData from '../../data/berita.json';
import useContent from '../../hooks/useContent';
import useSettings from '../../hooks/useSettings';
import InlineEditor, { InlineImage } from '../admin/InlineEditor';
import ItemModal from '../admin/ItemModal';
import { useAuth } from '../../context/AuthContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReorderButtons from '../ui/ReorderButtons';
import RichEditor from '../ui/RichEditor';
import UploadWidget from '../ui/UploadWidget';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const beritaFields = [
  { key: 'judul', label: 'Judul Berita' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'tanggal', label: 'Tanggal (YYYY-MM-DD)' },
  { key: 'gambar', label: 'URL Gambar', type: 'gambar' },
  { key: 'excerpt', label: 'Konten', type: 'textarea' },
];

export default function Berita() {
  const [ref, isVisible] = useScrollAnimation();
  const { editMode } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { data: list, update, create, remove } = useContent('berita', beritaData);
  const [s, setSetting] = useSettings({
    berita_badge: 'Berita & Artikel',
    berita_title: 'Informasi',
    berita_title_hl: 'Terkini',
    berita_desc: 'Dapatkan informasi terbaru seputar Honda dan dunia otomotif.',
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const toast = useToast();
  const [items, setItems] = useState(list || []);

  useEffect(() => {
    setItems(list || []);
  }, [list]);

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
    <section id="berita" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <InlineEditor value={s.berita_badge} onSave={(val) => setSetting('berita_badge', val)} tag="span" />
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
            <InlineEditor value={s.berita_title} onSave={(val) => setSetting('berita_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.berita_title_hl} onSave={(val) => setSetting('berita_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.berita_desc} onSave={(val) => setSetting('berita_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          {(items || []).map((item, index) => (
            <motion.article
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group flex flex-col sm:flex-row bg-white dark:bg-gray-900 rounded-2xl overflow-hidden
                         premium-shadow border border-gray-100 dark:border-gray-800"
            >
              <div className="relative w-full sm:w-56 h-44 sm:h-56 lg:h-auto shrink-0 overflow-hidden">
                {editMode && (
                  <>
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-honda-red cursor-pointer"
                      />
                    </div>
                    <div className="absolute top-3 right-3 z-10 flex items-start gap-1">
                      <ReorderButtons id={item.id} table="berita" items={items} setItems={setItems} />
                      <button onClick={() => remove(item.id)}
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
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-honda-red text-white text-xs font-semibold rounded-lg">
                    <InlineEditor value={item.kategori} onSave={(val) => update(item.id, { kategori: val })} />
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                  <InlineEditor
                    value={item.judul}
                    onSave={(val) => update(item.id, { judul: val })}
                    className="font-bold text-base xl:text-lg block mb-2 group-hover:text-honda-red transition-colors"
                    tag="h3"
                  />
                  <RichEditor
                    value={item.excerpt}
                    onChange={(val) => update(item.id, { excerpt: val })}
                    className="text-sm text-gray-500 dark:text-gray-400 mb-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} />
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                  <a href="#" className="flex items-center gap-1 text-xs font-semibold text-honda-red hover:text-honda-red-dark transition-colors">
                    Baca <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ItemModal
            fields={beritaFields}
            onSave={(form) => create(form)}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
