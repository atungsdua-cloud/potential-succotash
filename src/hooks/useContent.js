import { useState, useEffect, useCallback } from 'react';
import { fetchMobil, fetchPromo, fetchTestimoni, fetchBerita, fetchGallery, fetchKeunggulan, updateItem, createItem, deleteItem } from '../api';

function tryParse(val) {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return val; }
}

const fetchers = {
  mobil: fetchMobil,
  promo: fetchPromo,
  testimoni: fetchTestimoni,
  berita: fetchBerita,
  gallery: fetchGallery,
  keunggulan: fetchKeunggulan,
};

export default function useContent(table, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetcher = fetchers[table];
      if (fetcher) {
        const result = await fetcher();
        setData(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (id, payload) => {
    try {
      const updated = await updateItem(table, id, payload);
      setData(prev => prev.map(item => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updated };
        if (table === 'mobil') {
          if (typeof merged.warna === 'string') merged.warna = tryParse(merged.warna);
          if (typeof merged.fitur === 'string') merged.fitur = tryParse(merged.fitur);
          if (typeof merged.tipe === 'string') merged.tipe = tryParse(merged.tipe);
        }
        return merged;
      }));
      return true;
    } catch (err) {
      console.error(`Failed to update ${table}/${id}:`, err);
      return false;
    }
  }, [table]);

  const create = useCallback(async (payload) => {
    try {
      const created = await createItem(table, payload);
      setData(prev => [...prev, created]);
      return created;
    } catch (err) {
      console.error(`Failed to create ${table}:`, err);
      return null;
    }
  }, [table]);

  const remove = useCallback(async (id) => {
    try {
      await deleteItem(table, id);
      setData(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error(`Failed to delete ${table}/${id}:`, err);
      return false;
    }
  }, [table]);

  return { data, loading, error, reload: load, update, create, remove };
}
