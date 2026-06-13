import { ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api';

export default function ReorderButtons({ id, table, items, setItems }) {
  const toast = useToast();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;

  const move = async (dir) => {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    setItems(next);
    try {
      await apiClient.post(`/reorder/${table}`, { ids: next.map(i => i.id) });
    } catch { toast('Gagal menyimpan urutan', 'error'); }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <button type="button" onClick={() => move(-1)} disabled={index === 0}
        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-20 transition-colors"
        title="Naik">
        <ChevronUp size={14} />
      </button>
      <button type="button" onClick={() => move(1)} disabled={index === items.length - 1}
        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-20 transition-colors"
        title="Turun">
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
