import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, MessageCircle, Settings2, LogIn } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

import useSettings from '../../hooks/useSettings';
import NavEditor from '../ui/NavEditor';
import UploadWidget from '../ui/UploadWidget';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const defaultNav = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Mobil', href: '#mobil' },
  { label: 'Promo', href: '#promo' },
  { label: 'Simulasi Kredit', href: '#kredit' },
  { label: 'Test Drive', href: '#testdrive' },
  { label: 'Trade In', href: '#tradein' },
  { label: 'Berita', href: '#berita' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Kontak', href: '#kontak' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showNavEditor, setShowNavEditor] = useState(false);
  const dropdownRef = useRef(null);
  const { user, editMode, setShowLogin } = useAuth();
  const toast = useToast();
  const [s, update] = useSettings({
    logo_initial: 'H',
    logo_text: 'Honda',
    logo_text_hl: 'Dealer',
    logo_subtitle: 'Authorized Dealer Resmi',
    logo_image: '',
    contact_whatsapp: '+62 812-3456-7890',
    nav_items: JSON.stringify(defaultNav),
  });
  const menuItems = (() => { try { return JSON.parse(s.nav_items); } catch { return defaultNav; } })();

  const primaryItems = menuItems.slice(0, 5);
  const moreItems = menuItems.slice(5);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuItems?.length) return;
    const sections = menuItems.map(item => item.href?.slice(1)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navBaseClass = (isActive, isScrolled) =>
    `px-3 xl:px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
      isActive
        ? isScrolled
          ? 'text-honda-red bg-honda-red/5'
          : 'text-white bg-white/10'
        : isScrolled
          ? 'text-gray-600 dark:text-gray-300 hover:text-honda-red hover:bg-gray-100 dark:hover:bg-gray-800'
          : 'text-white/80 hover:text-white hover:bg-white/10'
    }`;

  const isActive = (href) => activeSection === href.slice(1);

  return (
    <>
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed ${user ? 'top-12 sm:top-14' : 'top-0'} left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#beranda" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {s.logo_image ? (
              <>
                <div className="relative shrink-0">
                  <img src={s.logo_image} alt={s.logo_text} className="h-8 sm:h-9 w-auto object-contain" />
                </div>
                <div className="min-w-0">
                  <span className={`font-bold text-sm sm:text-base lg:text-lg truncate transition-colors ${
                    scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                  }`}>
                    {s.logo_text}
                  </span>
                  <p className={`text-[10px] sm:text-xs leading-tight truncate transition-colors ${
                    scrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/70'
                  }`}>
                    {s.logo_subtitle}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-honda-red rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-xs sm:text-base">{s.logo_initial}</span>
                </div>
                <div className="min-w-0">
                  <span className={`font-bold text-sm sm:text-base lg:text-lg truncate transition-colors ${
                    scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                  }`}>
                    {s.logo_text}{' '}
                    <span className="text-honda-red">{s.logo_text_hl}</span>
                  </span>
                  <p className={`text-[10px] sm:text-xs leading-tight truncate transition-colors ${
                    scrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/70'
                  }`}>
                    {s.logo_subtitle}
                  </p>
                </div>
              </>
            )}
            {editMode && (
              <UploadWidget onUpload={(url) => update('logo_image', url)} currentUrl={s.logo_image} crop={false} />
            )}
          </a>

          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {editMode && (
              <button onClick={() => setShowNavEditor(true)}
                className="p-1.5 mr-0.5 text-gray-400 hover:text-honda-red hover:bg-honda-red/10 rounded-lg transition-all"
                title="Edit Menu Navigasi">
                <Settings2 size={15} />
              </button>
            )}
            {primaryItems.map((item) => (
              <a key={item.href} href={item.href}
                className={navBaseClass(isActive(item.href), scrolled)}>
                {item.label}
              </a>
            ))}
            {moreItems.length > 0 && (
              <div ref={dropdownRef} className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 px-3 xl:px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    moreItems.some(i => isActive(i.href))
                      ? scrolled
                        ? 'text-honda-red bg-honda-red/5'
                        : 'text-white bg-white/10'
                      : scrolled
                        ? 'text-gray-600 dark:text-gray-300 hover:text-honda-red hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                  Lainnya <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="py-1.5">
                        {moreItems.map((item) => (
                          <a key={item.href} href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-4 py-2.5 text-sm font-medium transition-all ${
                              isActive(item.href)
                                ? 'text-honda-red bg-honda-red/5'
                                : 'text-gray-700 dark:text-gray-300 hover:text-honda-red hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {!user && (
              <button
                onClick={() => setShowLogin(true)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  scrolled
                    ? 'text-gray-600 dark:text-gray-300 hover:text-honda-red hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LogIn size={16} /> Login
              </button>
            )}
            <ThemeToggle />
            <a
              href={`https://wa.me/${s.contact_whatsapp?.replace(/[^0-9]/g, '') || '6281234567890'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600
                         text-white rounded-lg transition-all duration-300"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href={`https://wa.me/${s.contact_whatsapp?.replace(/[^0-9]/g, '') || '6281234567890'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-green-500 hover:bg-green-600
                         text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/25 text-sm"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled
                  ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="container-custom py-3 space-y-0.5">
              {menuItems.map((item) => (
                <a key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-honda-red bg-honda-red/5'
                      : 'text-gray-700 dark:text-gray-300 hover:text-honda-red hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                  {item.label}
                </a>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <a href={`https://wa.me/${s.contact_whatsapp?.replace(/[^0-9]/g, '') || '6281234567890'}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-all">
                <MessageCircle size={16} /> Hubungi WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>

      <AnimatePresence>
        {showNavEditor && (
          <NavEditor
            items={menuItems}
            onSave={(items) => { update('nav_items', JSON.stringify(items)); setShowNavEditor(false); toast('Menu navigasi disimpan', 'success'); }}
            onClose={() => setShowNavEditor(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
