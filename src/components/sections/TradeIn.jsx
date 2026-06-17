import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import mobilData from '../../data/mobil.json';
import InlineEditor from '../admin/InlineEditor';
import useSettings from '../../hooks/useSettings';
import { useToast } from '../../context/ToastContext';
import api from '../../api';

export default function TradeIn() {
  const [ref, isVisible] = useScrollAnimation();
  const fileRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: '', nohp: '', merek: '', tahun: '', kilometer: '', kondisi: 'baik', mobil_target: '',
  });
  const [files, setFiles] = useState([]);
  const [s, update] = useSettings({
    tradein_badge: 'Trade In',
    tradein_title: 'Tukar Tambah',
    tradein_title_hl: 'Mobil Anda',
    tradein_desc: 'Dapatkan penilaian terbaik untuk mobil lama Anda. Proses cepat dan transparan.',
    tradein_button: 'Dapatkan Estimasi Harga',
    tradein_success_title: 'Data Terkirim!',
    tradein_success_desc: 'Tim kami akan menghubungi Anda dalam 1x24 jam untuk memberikan estimasi harga.',
    tradein_apply_again: 'Ajukan Lagi',
  });
  const toast = useToast();

  const handleFile = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(form).every((v) => v.trim())) return;
    setLoading(true);
    try {
      await api.post('/trade-in', form);
      setSubmitted(true);
      toast('Berhasil mengirim data trade-in', 'success');
    } catch (err) {
      toast('Gagal: ' + (err.response?.data?.error || err.message), 'error');
    }
    setLoading(false);
  };

  return (
    <section id="tradein" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <RefreshCw size={14} className="inline mr-1" />
            <InlineEditor value={s.tradein_badge} onSave={(val) => update('tradein_badge', val)} tag="span" />
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <InlineEditor value={s.tradein_title} onSave={(val) => update('tradein_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.tradein_title_hl} onSave={(val) => update('tradein_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.tradein_desc} onSave={(val) => update('tradein_desc', val)} type="textarea" tag="span" />
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-10 bg-white dark:bg-gray-900 rounded-2xl premium-shadow text-center"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                <InlineEditor value={s.tradein_success_title} onSave={(val) => update('tradein_success_title', val)} tag="span" />
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                <InlineEditor value={s.tradein_success_desc} onSave={(val) => update('tradein_success_desc', val)} type="textarea" tag="span" />
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ nama: '', nohp: '', merek: '', tahun: '', kilometer: '', kondisi: 'baik', mobil_target: '' }); setFiles([]); }}
                className="px-6 py-3 bg-honda-red text-white font-semibold rounded-xl hover:bg-honda-red-dark transition-colors"
              >
                {s.tradein_apply_again}
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="p-8 bg-white dark:bg-gray-900 rounded-2xl premium-shadow space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                  <input
                    type="text" required value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nomor HP</label>
                  <input
                    type="tel" required value={form.nohp}
                    onChange={(e) => setForm({ ...form, nohp: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Merek Mobil</label>
                  <input
                    type="text" required value={form.merek}
                    onChange={(e) => setForm({ ...form, merek: e.target.value })}
                    placeholder="Contoh: Toyota"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tahun</label>
                  <input
                    type="number" required value={form.tahun}
                    onChange={(e) => setForm({ ...form, tahun: e.target.value })}
                    placeholder="2020"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kilometer</label>
                  <input
                    type="text" required value={form.kilometer}
                    onChange={(e) => setForm({ ...form, kilometer: e.target.value })}
                    placeholder="Contoh: 30.000 km"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kondisi Kendaraan</label>
                  <select
                    value={form.kondisi}
                    onChange={(e) => setForm({ ...form, kondisi: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  >
                    <option value="baik">Baik</option>
                    <option value="cukup">Cukup</option>
                    <option value="kurang">Kurang</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mobil Incaran</label>
                  <select
                    value={form.mobil_target}
                    onChange={(e) => setForm({ ...form, mobil_target: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  >
                    <option value="">Pilih Mobil</option>
                    {mobilData.map((m) => (
                      <option key={m.id} value={m.nama}>{m.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Foto Kendaraan</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8
                             text-center cursor-pointer hover:border-honda-red transition-colors"
                >
                  <Camera size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Klik untuk upload foto kendaraan
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Maksimal 5 foto</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
                {files.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {files.map((file, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-honda-red hover:bg-honda-red-dark
                           text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-honda-red/25 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : <>{s.tradein_button} <ArrowRight size={18} /></>}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
