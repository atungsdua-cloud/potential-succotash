import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, Check } from 'lucide-react';
import iconList from '../../data/icons';

export default function IconPicker({ value, onSelect }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return iconList;
    return iconList.filter(i =>
      i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [search]);

  const categories = useMemo(() => {
    const groups = {};
    for (const icon of filtered) {
      if (!groups[icon.category]) groups[icon.category] = [];
      groups[icon.category].push(icon);
    }
    return groups;
  }, [filtered]);

  return (
    <div>
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari icon..."
          className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-honda-red/50"
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-3">
        {Object.entries(categories).map(([category, icons]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">{category}</p>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
              {icons.map(({ name }) => {
                const IconComp = LucideIcons[name];
                if (!IconComp) return null;
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onSelect(name)}
                    className={`relative flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all text-xs
                      ${isSelected
                        ? 'bg-honda-red/10 ring-2 ring-honda-red'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    title={name}
                  >
                    <IconComp size={18} className={isSelected ? 'text-honda-red' : 'text-gray-600 dark:text-gray-400'} />
                    {isSelected && <Check size={10} className="text-honda-red absolute -top-0.5 -right-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(categories).length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">Icon tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
