import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUp, Edit3, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import InlineEditor from '../admin/InlineEditor';
import useSettings from '../../hooks/useSettings';
import UploadWidget from '../ui/UploadWidget';
import { useAuth } from '../../context/AuthContext';

const defaultNav = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Mobil Honda', href: '#mobil' },
  { label: 'Promo', href: '#promo' },
  { label: 'Simulasi Kredit', href: '#kredit' },
  { label: 'Trade In', href: '#tradein' },
  { label: 'Test Drive', href: '#testdrive' },
  { label: 'Berita', href: '#berita' },
];

const socialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

function SocialLink({ icon, url, label, settingKey, onUpdate }) {
  const { editMode } = useAuth();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(url);

  if (editMode && editing) {
    return (
      <div className="flex items-center gap-1 bg-gray-800 rounded-xl px-2 py-1">
        <input value={val} onChange={(e) => setVal(e.target.value)}
          className="w-24 px-1 py-0.5 bg-gray-700 text-white text-xs rounded" />
        <button onClick={() => { onUpdate(settingKey, val); setEditing(false); }} className="text-green-400"><Check size={12} /></button>
        <button onClick={() => { setVal(url); setEditing(false); }} className="text-red-400"><X size={12} /></button>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onClick={editMode ? (e) => { e.preventDefault(); setEditing(true); } : undefined}
      className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-honda-red flex items-center justify-center
                 transition-all duration-300 hover:scale-110"
      aria-label={label}>
      {icon}
    </a>
  );
}

export default function Footer() {
  const { editMode } = useAuth();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [s, update] = useSettings({
    footer_about: 'Dealer resmi Honda terpercaya dengan layanan terbaik. Dapatkan mobil impian Anda bersama kami dengan proses mudah dan cepat.',
    footer_tagline: 'Designed with passion for Honda enthusiasts',
    contact_alamat: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
    contact_telepon: '(021) 1234-5678',
    contact_email: 'info@honda-dealer.id',
    contact_jam: 'Senin - Sabtu: 08:00 - 20:00\nMinggu: 09:00 - 17:00',
    contact_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.865059!3d-6.175192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta!5e0!3m2!1sen!2sid!4v1',
    logo_initial: 'H',
    logo_text: 'Honda',
    logo_text_hl: 'Dealer',
    logo_subtitle: 'Authorized Dealer Resmi',
    logo_image: '',
    social_facebook: 'https://facebook.com',
    social_instagram: 'https://instagram.com',
    social_youtube: 'https://youtube.com',
    social_twitter: 'https://twitter.com',
    nav_items: JSON.stringify(defaultNav),
  });
  const footerLinks = (() => { try { return JSON.parse(s.nav_items); } catch { return defaultNav; } })();

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container-custom py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {s.logo_image ? (
                <img src={s.logo_image} alt={s.logo_text} className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-honda-red rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-lg">{s.logo_initial}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">
                      {s.logo_text}{' '}
                      <span className="text-honda-red">{s.logo_text_hl}</span>
                    </p>
                    <p className="text-xs text-gray-500">{s.logo_subtitle}</p>
                  </div>
                </>
              )}
              {editMode && (
                <UploadWidget onUpload={(url) => update('logo_image', url)} currentUrl={s.logo_image} crop={false} />
              )}
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              <InlineEditor value={s.footer_about} onSave={(val) => update('footer_about', val)} type="textarea" tag="span" />
            </p>
            <div className="flex gap-3">
              {[
                { key: 'social_facebook', label: 'Facebook', icon: socialIcons.facebook },
                { key: 'social_instagram', label: 'Instagram', icon: socialIcons.instagram },
                { key: 'social_youtube', label: 'Youtube', icon: socialIcons.youtube },
                { key: 'social_twitter', label: 'Twitter', icon: socialIcons.twitter },
              ].map((social) => (
                <SocialLink key={social.key} icon={social.icon} url={s[social.key]}
                  label={social.label} settingKey={social.key} onUpdate={update} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Navigasi Cepat</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-honda-red transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-honda-red rounded-full" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-honda-red mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 whitespace-pre-line">
                  {s.contact_alamat}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-honda-red shrink-0" />
                <span className="text-sm text-gray-400">{s.contact_telepon}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-honda-red shrink-0" />
                <span className="text-sm text-gray-400">{s.contact_email}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-honda-red mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 whitespace-pre-line">
                  {s.contact_jam}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Google Maps</h4>
            <div className="rounded-xl overflow-hidden h-44 xl:h-52 bg-gray-800">
              <iframe
                src={s.contact_maps_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dealer Location"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Honda Dealer. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            <InlineEditor value={s.footer_tagline} onSave={(val) => update('footer_tagline', val)} tag="span" />
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-honda-red text-white hover:bg-honda-red-dark transition-colors"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
