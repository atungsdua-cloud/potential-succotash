import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, MapPin, Car, CheckCircle } from 'lucide-react';
import mobilData from '../../data/mobil.json';
import InlineEditor from '../admin/InlineEditor';
import useSettings from '../../hooks/useSettings';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useToast } from '../../context/ToastContext';
import api from '../../api';

export default function TestDrive() {
  const [ref, isVisible] = useScrollAnimation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: '', nohp: '', mobil: '', tanggal: '', lokasi: '' });
  const [s, update] = useSettings({
    testdrive_badge: 'Booking Test Drive',
    testdrive_title: 'Rasakan Langsung',
    testdrive_title_hl: 'Pengalaman Berkendara',
    testdrive_desc: 'Isi form di bawah untuk menjadwalkan test drive mobil Honda impian Anda.',
    testdrive_button: 'Jadwalkan Test Drive',
    testdrive_success_title: 'Berhasil Terdaftar!',
    testdrive_success_desc: 'Kami akan menghubungi Anda untuk konfirmasi jadwal test drive.',
    testdrive_book_again: 'Booking Lagi',
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(form).every((v) => v.trim())) return;
    setLoading(true);
    try {
      await api.post('/test-drive', form);
      setSubmitted(true);
      toast('Berhasil mendaftarkan test drive', 'success');
    } catch (err) {
      toast('Gagal: ' + (err.response?.data?.error || err.message), 'error');
    }
    setLoading(false);
  };

  return (
    <section id="testdrive" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            <InlineEditor value={s.testdrive_badge} onSave={(val) => update('testdrive_badge', val)} tag="span" />
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <InlineEditor value={s.testdrive_title} onSave={(val) => update('testdrive_title', val)} tag="span" />{' '}
            <span className="text-gradient">
              <InlineEditor value={s.testdrive_title_hl} onSave={(val) => update('testdrive_title_hl', val)} tag="span" />
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            <InlineEditor value={s.testdrive_desc} onSave={(val) => update('testdrive_desc', val)} type="textarea" tag="span" />
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
                <InlineEditor value={s.testdrive_success_title} onSave={(val) => update('testdrive_success_title', val)} tag="span" />
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                <InlineEditor value={s.testdrive_success_desc} onSave={(val) => update('testdrive_success_desc', val)} type="textarea" tag="span" />
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ nama: '', nohp: '', mobil: '', tanggal: '', lokasi: '' }); }}
                className="px-6 py-3 bg-honda-red text-white font-semibold rounded-xl hover:bg-honda-red-dark transition-colors"
              >
                {s.testdrive_book_again}
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
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <User size={16} className="text-honda-red" /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Phone size={16} className="text-honda-red" /> Nomor HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.nohp}
                    onChange={(e) => setForm({ ...form, nohp: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Car size={16} className="text-honda-red" /> Pilih Mobil
                  </label>
                  <select
                    required
                    value={form.mobil}
                    onChange={(e) => setForm({ ...form, mobil: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  >
                    <option value="">Pilih Mobil</option>
                    {mobilData.map((m) => (
                      <option key={m.id} value={m.nama}>{m.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar size={16} className="text-honda-red" /> Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <MapPin size={16} className="text-honda-red" /> Lokasi Dealer
                </label>
                <select
                  required
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                >
                  <option value="">Pilih Lokasi</option>
                  <option value="Jakarta Pusat">Jakarta Pusat</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                  <option value="Jakarta Utara">Jakarta Utara</option>
                  <option value="Jakarta Barat">Jakarta Barat</option>
                  <option value="Jakarta Timur">Jakarta Timur</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Depok">Depok</option>
                  <option value="Bogor">Bogor</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-honda-red hover:bg-honda-red-dark text-white font-bold rounded-xl
                           transition-all duration-300 shadow-lg shadow-honda-red/25 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : s.testdrive_button}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
