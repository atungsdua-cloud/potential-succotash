import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';

export default function NavEditor({ items, onSave, onClose }) {
  const [navItems, setNavItems] = useState([...items]);

  const updateItem = (index, field, value) => {
    setNavItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setNavItems(prev => [...prev, { label: 'Menu Baru', href: '#' }]);
  };

  const removeItem = (index) => {
    setNavItems(prev => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= navItems.length) return;
    setNavItems(prev => {
      const next = [...prev];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
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
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 premium-shadow max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold mb-5">Menu Navigasi</h3>

        <div className="space-y-2 mb-4">
          {navItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                  className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20 text-[10px] leading-none">&uarr;</button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === navItems.length - 1}
                  className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20 text-[10px] leading-none">&darr;</button>
              </div>
              <input value={item.label} onChange={(e) => updateItem(i, 'label', e.target.value)}
                className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
              <input value={item.href} onChange={(e) => updateItem(i, 'href', e.target.value)}
                className="w-28 px-2 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
              <button type="button" onClick={() => removeItem(i)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 hover:text-honda-red hover:border-honda-red transition-all mb-4">
          <Plus size={16} /> Tambah Menu
        </button>

        <button onClick={() => onSave(navItems)}
          className="w-full py-3 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl transition-all">
          Simpan Menu
        </button>
      </motion.div>
    </motion.div>
  );
}
