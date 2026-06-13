import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Trash2, Plus } from 'lucide-react';
import keunggulanData from '../../data/keunggulan.json';
import useContent from '../../hooks/useContent';
import useSettings from '../../hooks/useSettings';
import InlineEditor from '../admin/InlineEditor';
import ItemModal from '../admin/ItemModal';
import { useAuth } from '../../context/AuthContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReorderButtons from '../ui/ReorderButtons';
import RichEditor from '../ui/RichEditor';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api';

function getIcon(iconName) {
  return LucideIcons[iconName] || LucideIcons.Building2;
}

const keunggulanFields = [
  { key: 'icon', label: 'Ikon', type: 'icon' },
  { key: 'title', label: 'Judul' },
  { key: 'desc', label: 'Deskripsi', type: 'textarea' },
];

export default function Keunggulan() {
  const [ref, isVisible] = useScrollAnimation();
  const { editMode } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { data: list, update, create, remove } = useContent('keunggulan', keunggulanData);
  const [s, setSetting] = useSettings({
    keunggulan_badge: 'Mengapa Memilih Kami',
    keunggulan_title: 'Keunggulan',
    keunggulan_title_hl: 'Kami',
    keunggulan_desc: 'Kami berkomitmen memberikan layanan terbaik untuk setiap pelanggan.',
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const toast = useToast();
  const [displayItems, setDisplayItems] = useState(list || keunggulanData);

  useEffect(() => { setDisplayItems(list || keunggulanData); }, [list]);

  return (
    <section id="tentang" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <InlineEditor value={s.keunggulan_badge} onSave={(val) => setSetting('keunggulan_badge', val)} tag="span" />
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
                      await apiClient.post('/batch-delete/keunggulan', { ids: selectedIds });
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
            <InlineEditor value={s.keunggulan_title} onSave={(val) => setSetting('keunggulan_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.keunggulan_title_hl} onSave={(val) => setSetting('keunggulan_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.keunggulan_desc} onSave={(val) => setSetting('keunggulan_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {(displayItems || []).map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group p-8 xl:p-10 bg-white dark:bg-gray-900 rounded-2xl premium-shadow
                           border border-gray-100 dark:border-gray-800 hover:border-honda-red/20
                           transition-all duration-500"
              >
                {editMode && (
                  <input type="checkbox" checked={selectedIds.includes(item.id)}
                    onChange={() => { setSelectedIds(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]) }}
                    className="absolute top-3 left-3 z-10 w-4 h-4 rounded" />
                )}
                {editMode && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
                    <ReorderButtons id={item.id} table="keunggulan" items={displayItems} setItems={setDisplayItems} />
                    <button onClick={() => remove(item.id)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
                <div className="relative w-14 h-14 xl:w-16 xl:h-16 bg-honda-red/10 dark:bg-honda-red/20 rounded-2xl flex items-center justify-center
                                mb-5 group-hover:bg-honda-red transition-all duration-500">
                  <Icon size={28} className="xl:w-8 xl:h-8 text-honda-red group-hover:text-white transition-colors duration-500" />
                </div>
                <InlineEditor
                  value={item.title}
                  onSave={(val) => update(item.id, { title: val })}
                  className="text-lg xl:text-xl font-bold block mb-2"
                  tag="h3"
                />
                <RichEditor value={item.desc || ''} onChange={(val) => update(item.id, { desc: val })}
                  className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ItemModal
            fields={keunggulanFields}
            onSave={(form) => create(form)}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
