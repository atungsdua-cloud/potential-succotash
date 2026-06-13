import { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

export default function TipeEditor({ value = [], onChange }) {
  const [inputNama, setInputNama] = useState('');
  const [inputHarga, setInputHarga] = useState('');

  const add = () => {
    const nama = inputNama.trim();
    const harga = parseInt(inputHarga.replace(/\D/g, '')) || 0;
    if (!nama || !harga) return;
    onChange([...value, { nama, harga }]);
    setInputNama('');
    setInputHarga('');
  };

  const remove = (i) => {
    onChange(value.filter((_, idx) => idx !== i));
  };

  const edit = (i, field, val) => {
    const updated = value.map((item, idx) =>
      idx === i ? { ...item, [field]: field === 'harga' ? (parseInt(val.replace(/\D/g, '')) || 0) : val } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
          <GripVertical size={16} className="text-gray-400 shrink-0" />
          <input type="text" value={item.nama} onChange={(e) => edit(i, 'nama', e.target.value)}
            className="flex-1 min-w-0 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
            <input type="text" value={item.harga.toLocaleString('id-ID')} onChange={(e) => edit(i, 'harga', e.target.value)}
              className="w-40 px-3 pl-9 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
          </div>
          <button type="button" onClick={() => remove(i)}
            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all">
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <input type="text" value={inputNama} onChange={(e) => setInputNama(e.target.value)}
          placeholder="Nama tipe" onKeyDown={(e) => e.key === 'Enter' && add()}
          className="flex-1 min-w-0 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
          <input type="text" value={inputHarga} onChange={(e) => setInputHarga(e.target.value)}
            placeholder="0" onKeyDown={(e) => e.key === 'Enter' && add()}
            className="w-40 px-3 pl-9 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-honda-red/50" />
        </div>
        <button type="button" onClick={add}
          className="p-2.5 bg-honda-red text-white rounded-xl hover:bg-honda-red-dark transition-all shrink-0">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
