import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import useSettings from '../../hooks/useSettings';

export function FloatingWhatsApp() {
  const [s] = useSettings({ contact_whatsapp: '+62 812-3456-7890' });
  const waNum = s.contact_whatsapp?.replace(/[^0-9]/g, '');
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      href={`https://wa.me/${waNum}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white
                 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30
                 hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle size={22} className="sm:w-[28px] sm:h-[28px]" />
    </motion.a>
  );
}

export function FloatingCallCenter() {
  const [s] = useSettings({ contact_telepon: '(021) 1234-5678' });
  const telNum = s.contact_telepon?.replace(/[^0-9]/g, '');
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring' }}
      href={`tel:${telNum}`}
      className="fixed bottom-[88px] sm:bottom-40 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-honda-red hover:bg-honda-red-dark text-white
                 rounded-full flex items-center justify-center shadow-xl shadow-honda-red/30
                 hover:scale-110 transition-all duration-300"
      aria-label="Call Center"
    >
      <Phone size={20} className="sm:w-[24px] sm:h-[24px]" />
    </motion.a>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900
                     rounded-full flex items-center justify-center shadow-xl hover:bg-honda-red dark:hover:bg-honda-red
                     hover:text-white transition-all duration-300"
          aria-label="Back to top"
        >
          <ChevronUp size={22} className="sm:w-[28px] sm:h-[28px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
