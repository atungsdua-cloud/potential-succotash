import { motion } from 'framer-motion';
import { Users, Gauge, ArrowRight, Calculator, Trash2 } from 'lucide-react';
import Badge from './Badge';

function formatHarga(price) {
  if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)} Miliar`;
  return `Rp ${(price / 1000000).toFixed(0)} Juta`;
}

function getMinHarga(mobil) {
  if (Array.isArray(mobil.tipe) && mobil.tipe.length > 0) {
    return Math.min(...mobil.tipe.map(t => t.harga));
  }
  return mobil.harga;
}

export default function CarCard({ mobil, index = 0, onDetail, onKredit, onDelete, editMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden premium-shadow
                 border border-gray-100 dark:border-gray-800 transition-all duration-500"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {editMode && onDelete && (
          <button onClick={() => onDelete(mobil.id)}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-all">
            <Trash2 size={14} />
          </button>
        )}
        <img
          src={mobil.foto}
          alt={mobil.nama}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge variant="promo">{mobil.kategori}</Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl xl:text-2xl font-bold text-white mb-1">{mobil.nama}</h3>
          <p className="text-honda-red font-bold text-lg xl:text-xl">Mulai {formatHarga(getMinHarga(mobil))}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Gauge size={16} />
            <span>{mobil.transmisi}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{mobil.kapasitas} Kursi</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {mobil.deskripsi}
        </p>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => onDetail?.(mobil)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-honda-red hover:bg-honda-red-dark
                       text-white font-semibold rounded-xl transition-all duration-300 text-sm"
          >
            Detail <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onKredit?.(mobil)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-honda-red
                       text-honda-red hover:bg-honda-red hover:text-white font-semibold rounded-xl
                       transition-all duration-300 text-sm"
          >
            <Calculator size={16} /> Kredit
          </button>
        </div>
      </div>
    </motion.div>
  );
}
