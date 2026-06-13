import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Trash2, Plus } from 'lucide-react';
import testimoniData from '../../data/testimoni.json';
import useContent from '../../hooks/useContent';
import useSettings from '../../hooks/useSettings';
import InlineEditor, { InlineImage } from '../admin/InlineEditor';
import ItemModal from '../admin/ItemModal';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../ui/StarRating';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReorderButtons from '../ui/ReorderButtons';
import RichEditor from '../ui/RichEditor';
import UploadWidget from '../ui/UploadWidget';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const testimoniFields = [
  { key: 'nama', label: 'Nama' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'komentar', label: 'Komentar', type: 'textarea' },
  { key: 'foto', label: 'URL Foto', type: 'gambar' },
  { key: 'mobil', label: 'Mobil' },
  { key: 'tanggal', label: 'Tanggal (YYYY-MM-DD)' },
];

export default function Testimoni() {
  const [ref, isVisible] = useScrollAnimation();
  const { editMode } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { data: list, update, create, remove } = useContent('testimoni', testimoniData);
  const [s, setSetting] = useSettings({
    testimoni_badge: 'Testimonial',
    testimoni_title: 'Apa Kata',
    testimoni_title_hl: 'Pelanggan Kami',
    testimoni_desc: 'Kepuasan pelanggan adalah prioritas utama kami.',
  });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const toast = useToast();
  const [items, setItems] = useState(list || []);

  useEffect(() => {
    setItems(list || []);
  }, [list]);

  useEffect(() => {
    if (!list?.length) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % list.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [list]);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % list.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + list.length) % list.length);
  };

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

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const t = list?.[current];
  if (!t) return null;

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
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <InlineEditor value={s.testimoni_badge} onSave={(val) => setSetting('testimoni_badge', val)} tag="span" />
            {editMode && (
              <button onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-honda-red text-white text-xs rounded-full hover:bg-honda-red-dark transition-all">
                <Plus size={12} /> Tambah
              </button>
            )}
          </span>
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
            <InlineEditor value={s.testimoni_title} onSave={(val) => setSetting('testimoni_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.testimoni_title_hl} onSave={(val) => setSetting('testimoni_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.testimoni_desc} onSave={(val) => setSetting('testimoni_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full"
              >
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl premium-shadow overflow-hidden">
                  {editMode && (
                    <>
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(t.id)}
                          onChange={() => toggleSelect(t.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-honda-red cursor-pointer"
                        />
                      </div>
                      <div className="absolute top-3 right-3 z-10 flex items-start gap-1">
                        <ReorderButtons id={t.id} table="testimoni" items={items} setItems={setItems} />
                        <button onClick={() => remove(t.id)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                  <div className="grid md:grid-cols-12">
                    <div className="md:col-span-4 relative h-56 md:h-auto overflow-hidden">
                      <img
                        src={t.foto}
                        alt={t.nama}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 to-transparent" />
                    </div>
                    <div className="md:col-span-8 p-6 sm:p-8 xl:p-10 flex flex-col justify-center">
                      <Quote size={36} className="text-honda-red/20 mb-3" />
                      <StarRating rating={t.rating} size={18} />
                      <RichEditor
                        value={t.komentar}
                        onChange={(val) => update(t.id, { komentar: val })}
                        className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mt-4 mb-5 italic"
                      />
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <InlineEditor
                            value={t.nama}
                            onSave={(val) => update(t.id, { nama: val })}
                            className="font-bold text-sm block"
                            tag="p"
                          />
                          <p className="text-xs text-gray-400">{t.mobil}</p>
                        </div>
                      </div>
                      {editMode && (
                        <div className="mt-3">
                          <UploadWidget
                            onUpload={(url) => update(t.id, { foto: url })}
                            currentUrl={t.foto}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev}
              className="p-3 xl:p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors premium-shadow">
              <ChevronLeft size={20} className="xl:w-6 xl:h-6" />
            </button>
            <div className="flex gap-2 xl:gap-3">
              {(list || []).map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 xl:w-10 bg-honda-red' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
              ))}
            </div>
            <button onClick={next}
              className="p-3 xl:p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors premium-shadow">
              <ChevronRight size={20} className="xl:w-6 xl:h-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ItemModal
            fields={testimoniFields}
            onSave={(form) => create(form)}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
