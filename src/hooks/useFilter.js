import { useMemo, useState } from 'react';

export function useFilter(items) {
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1_000_000_000]);
  const [sortBy, setSortBy] = useState('');

  const filtered = useMemo(() => {
    let result = [...items];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q)
      );
    }

    if (kategori) {
      result = result.filter(item => item.kategori === kategori);
    }

    result = result.filter(item =>
      item.harga >= priceRange[0] && item.harga <= priceRange[1]
    );

    if (sortBy === 'termurah') result.sort((a, b) => a.harga - b.harga);
    else if (sortBy === 'termahal') result.sort((a, b) => b.harga - a.harga);
    else if (sortBy === 'az') result.sort((a, b) => a.nama.localeCompare(b.nama));

    return result;
  }, [items, search, kategori, priceRange, sortBy]);

  return { filtered, search, setSearch, kategori, setKategori, priceRange, setPriceRange, sortBy, setSortBy };
}
