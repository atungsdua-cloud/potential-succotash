import { SlidersHorizontal } from 'lucide-react';

export default function FilterBar({ kategori, setKategori, sortBy, setSortBy, priceRange, setPriceRange }) {
  const kategoriList = ['SUV', 'Sedan', 'Hatchback'];

  return (
    <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal size={18} className="text-gray-400 hidden sm:block" />
      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                   text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-honda-red/50"
      >
        <option value="">Semua Kategori</option>
        {kategoriList.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                   text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-honda-red/50"
      >
        <option value="">Urutkan</option>
        <option value="termurah">Termurah</option>
        <option value="termahal">Termahal</option>
        <option value="az">A-Z</option>
      </select>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Harga:</span>
        <input
          type="range"
          min={0}
          max={1000000000}
          step={5000000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-28 accent-honda-red"
        />
        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
          {priceRange[1] >= 1000000000
            ? 'Rp 1 M'
            : `Rp ${(priceRange[1] / 1000000).toFixed(0)}jt`}
        </span>
      </div>
    </div>
  );
}
