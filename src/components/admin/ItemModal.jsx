import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import IconPicker from '../ui/IconPicker';
import UploadWidget from '../ui/UploadWidget';
import TipeEditor from '../ui/TipeEditor';

export default function ItemModal({ fields, onSave, onClose }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInputs, setTagInputs] = useState({});

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addTag = (key) => {
    const val = (tagInputs[key] || '').trim();
    if (!val) return;
    setForm(prev => ({ ...prev, [key]: [...(prev[key] || []), val] }));
    setTagInputs(prev => ({ ...prev, [key]: '' }));
  };

  const removeTag = (key, index) => {
    setForm(prev => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== index) }));
  };

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

        <h3 className="text-lg font-bold mb-5">Tambah Baru</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                    <input
                      type="text"
                      value={tagInputs[field.key] || ''}
                      onChange={(e) => setTagInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(field.key); } }}
                      placeholder={`Tambah ${field.label.toLowerCase()}`}
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all text-sm"
                    />
                    <button type="button" onClick={() => addTag(field.key)}
                      className="px-3 py-2 bg-honda-red text-white text-sm font-semibold rounded-xl hover:bg-honda-red-dark transition-all">
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
                <textarea
                  value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  rows={3}
                />
              ) : field.type === 'select' ? (
                <select
                  value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                >
                  <option value="">Pilih {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                />
              ) : field.type === 'gambar' ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder="URL Gambar"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                  <UploadWidget
                    onUpload={(url) => handleChange(field.key, url)}
                    currentUrl={form[field.key] || ''}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={form[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
          >
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
