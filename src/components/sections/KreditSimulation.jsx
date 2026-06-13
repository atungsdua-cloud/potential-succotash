import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, PiggyBank, CalendarRange, IndianRupee, TrendingDown } from 'lucide-react';
import mobilData from '../../data/mobil.json';
import InlineEditor from '../admin/InlineEditor';
import useSettings from '../../hooks/useSettings';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export default function KreditSimulation() {
  const [ref, isVisible] = useScrollAnimation();
  const [hargaMobil, setHargaMobil] = useState(mobilData[0]?.harga || 300000000);
  const [dp, setDp] = useState(30);
  const [tenor, setTenor] = useState(12);
  const [s, update] = useSettings({
    kredit_badge: 'Simulasi Kredit',
    kredit_title: 'Hitung Cicilan',
    kredit_title_hl: 'Mobil Impian',
    kredit_desc: 'Gunakan kalkulator kredit untuk mengetahui estimasi cicilan bulanan Anda.',
    kredit_button: 'Ajukan Kredit Sekarang',
  });
  const bungaPerTahun = 8;

  const dpAmount = (hargaMobil * dp) / 100;
  const pokokPinjaman = hargaMobil - dpAmount;
  const bungaPerBulan = bungaPerTahun / 12 / 100;
  const cicilan = pokokPinjaman * (bungaPerBulan * Math.pow(1 + bungaPerBulan, tenor)) / (Math.pow(1 + bungaPerBulan, tenor) - 1);
  const totalBayar = cicilan * tenor + dpAmount;
  const totalBunga = totalBayar - hargaMobil;

  return (
    <section id="kredit" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <Calculator size={14} className="inline mr-1" />
            <InlineEditor value={s.kredit_badge} onSave={(val) => update('kredit_badge', val)} tag="span" />
          </span>
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4">
            <InlineEditor value={s.kredit_title} onSave={(val) => update('kredit_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.kredit_title_hl} onSave={(val) => update('kredit_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.kredit_desc} onSave={(val) => update('kredit_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <IndianRupee size={16} className="text-honda-red" /> Harga Mobil
                </label>
                <select
                  value={hargaMobil}
                  onChange={(e) => setHargaMobil(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                             text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-honda-red/50"
                >
                  {mobilData.map((m) => (
                    <option key={m.id} value={m.harga}>
                      {m.nama} - {formatRupiah(m.harga)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <PiggyBank size={16} className="text-honda-red" /> DP ({dp}%)
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={dp}
                  onChange={(e) => setDp(Number(e.target.value))}
                  className="w-full accent-honda-red"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>10%</span>
                  <span>Min: {formatRupiah(hargaMobil * 0.1)}</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <CalendarRange size={16} className="text-honda-red" /> Tenor ({tenor} Bulan)
                </label>
                <input
                  type="range"
                  min={12}
                  max={84}
                  step={12}
                  value={tenor}
                  onChange={(e) => setTenor(Number(e.target.value))}
                  className="w-full accent-honda-red"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 Tahun</span>
                  <span>7 Tahun</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>DP ({dp}%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(dpAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Pokok Pinjaman</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(pokokPinjaman)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Total Bunga</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(totalBunga)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="p-8 bg-gradient-to-br from-honda-red to-honda-red-dark rounded-2xl text-white text-center premium-shadow">
              <p className="text-white/80 text-sm mb-2">Estimasi Cicilan per Bulan</p>
              <p className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black mb-1">
                {cicilan && isFinite(cicilan) ? formatRupiah(Math.round(cicilan)) : formatRupiah(0)}
              </p>
              <p className="text-white/60 text-sm">
                Tenor {tenor} bulan | Bunga {bungaPerTahun}% per tahun
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingDown size={18} className="text-honda-red" /> Ringkasan Kredit
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Harga Mobil', value: formatRupiah(hargaMobil) },
                  { label: 'DP', value: formatRupiah(dpAmount) },
                  { label: 'Pokok Pinjaman', value: formatRupiah(pokokPinjaman) },
                  { label: 'Total Bunga', value: formatRupiah(totalBunga) },
                  { label: 'Total Pembayaran', value: formatRupiah(totalBayar) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-3.5 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl
                              transition-all duration-300 shadow-lg shadow-honda-red/25">
              {s.kredit_button}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
