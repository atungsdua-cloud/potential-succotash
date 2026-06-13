import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Mail, Clock, ChevronRight } from 'lucide-react';
import InlineEditor from '../admin/InlineEditor';
import useSettings from '../../hooks/useSettings';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useAuth } from '../../context/AuthContext';

const defaultSettings = {
  contact_alamat: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
  contact_telepon: '(021) 1234-5678',
  contact_whatsapp: '+62 812-3456-7890',
  contact_email: 'info@honda-dealer.id',
  contact_jam: 'Sen-Sab 08:00-20:00 | Min 09:00-17:00',
  contact_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.865059!3d-6.175192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta!5e0!3m2!1sen!2sid!4v1',
  contact_maps_label: 'Jakarta Pusat',
};

export default function Contact() {
  const [ref, isVisible] = useScrollAnimation();
  const [settings, update] = useSettings(defaultSettings);
  const { editMode } = useAuth();

  const contactItems = [
    { icon: MapPin, label: 'Alamat', value: settings.contact_alamat, key: 'contact_alamat' },
    { icon: Phone, label: 'Telepon', value: settings.contact_telepon, key: 'contact_telepon', href: `tel:${settings.contact_telepon?.replace(/[^0-9]/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: settings.contact_whatsapp, key: 'contact_whatsapp', href: `https://wa.me/${settings.contact_whatsapp?.replace(/[^0-9]/g, '')}` },
    { icon: Mail, label: 'Email', value: settings.contact_email, key: 'contact_email', href: `mailto:${settings.contact_email}` },
    { icon: Clock, label: 'Jam Operasional', value: settings.contact_jam, key: 'contact_jam' },
  ];

  return (
    <section id="kontak" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-custom">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-honda-red/10 text-honda-red text-sm font-semibold rounded-full mb-4">
            Hubungi Kami
          </span>
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4">
            Siap Membantu <span className="text-gradient">Anda</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Tim kami siap membantu Anda memilih mobil impian.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }} className="space-y-5">
            {contactItems.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 xl:p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl
                           hover:bg-honda-red/5 transition-colors group">
                <div className="w-12 h-12 xl:w-14 xl:h-14 bg-honda-red/10 dark:bg-honda-red/20 rounded-xl flex items-center justify-center
                                group-hover:bg-honda-red transition-colors shrink-0">
                  <item.icon size={22} className="xl:w-6 xl:h-6 text-honda-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer" className="font-semibold hover:text-honda-red transition-colors">
                      <InlineEditor value={item.value} onSave={(val) => update(item.key, val)} tag="span" />
                    </a>
                  ) : (
                    <InlineEditor value={item.value} onSave={(val) => update(item.key, val)}
                      className="font-semibold block" tag="p" />
                  )}
                </div>
                <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-honda-red transition-colors" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl overflow-hidden premium-shadow h-[280px] sm:h-[350px] lg:h-[400px] xl:h-[480px] relative">
            {editMode && (
              <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-gray-900/90 rounded-lg px-3 py-1.5 shadow-lg max-w-[90%]">
                <InlineEditor value={settings.contact_maps_url} onSave={(val) => update('contact_maps_url', val)} tag="span" className="text-xs font-mono truncate block" />
              </div>
            )}
            <iframe
              src={settings.contact_maps_url}
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Dealer Location" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
