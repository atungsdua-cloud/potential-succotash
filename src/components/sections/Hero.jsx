import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Calendar, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useContent from '../../hooks/useContent';
import mobilData from '../../data/mobil.json';
import promoData from '../../data/promo.json';

function formatHarga(price) {
  if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)} Miliar`;
  return `Rp ${(price / 1000000).toFixed(0)} Juta`;
}

function getMinHarga(m) {
  if (Array.isArray(m.tipe) && m.tipe.length > 0) return Math.min(...m.tipe.map(t => t.harga));
  return m.harga;
}

const TEXT_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 * i, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: mobil } = useContent('mobil', mobilData);
  const { data: promo } = useContent('promo', promoData);

  const slides = [
    ...(mobil || []).map(m => ({
      type: 'mobil', id: `m-${m.id}`, image: m.foto, title: m.nama,
      subtitle: 'Mulai ' + formatHarga(getMinHarga(m)), harga: getMinHarga(m),
      desc: m.deskripsi, badge: m.kategori,
      cta: 'Lihat Detail', href: '#mobil',
    })),
    ...(promo || []).map(p => ({
      type: 'promo', id: `p-${p.id}`, image: p.gambar, title: p.judul,
      subtitle: p.diskon, desc: p.deskripsi, badge: 'Promo',
      cta: 'Klaim Promo', href: '#promo',
    })),
  ];

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => { setCurrent(0); }, [mobil, promo]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const DURATION = 6000;
    const start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        setDir(1);
        setCurrent(prev => (prev + 1) % slides.length);
        setProgress(0);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, slides.length, current]);

  const goTo = (i) => { setDir(i > current ? 1 : -1); setCurrent(i); setProgress(0); };
  const next = () => { setDir(1); setCurrent(prev => (prev + 1) % slides.length); setProgress(0); };
  const prev = () => { setDir(-1); setCurrent(prev => (prev - 1 + slides.length) % slides.length); setProgress(0); };

  const slide = slides[current] || slides[0];
  if (!slide) return null;

  return (
    <section id="beranda" ref={ref}
      className="relative h-screen min-h-[500px] sm:min-h-[700px] xl:min-h-[800px] overflow-hidden bg-black group"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)} onTouchEnd={() => setTimeout(() => setPaused(false), 3000)}>

      {/* Background layer with crossfade + ken burns */}
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0">
            <motion.img
              src={slide.image} alt={slide.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: 'linear' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-honda-red/8 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 h-full flex items-center">
        <div className="container-custom w-full">
          <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div key={slide.id} initial="hidden" animate="visible" exit="hidden" className="space-y-2">
                {/* Badge */}
                <motion.div custom={0} variants={TEXT_VARIANTS}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                  <span className={"w-2 h-2 rounded-full animate-pulse " + (slide.type === 'promo' ? 'bg-orange-400' : 'bg-green-400')} />
                  <span className="text-white/90 text-sm font-medium tracking-wide">
                    {slide.type === 'promo' ? 'Promo Spesial' : 'Honda ' + slide.badge}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.div custom={1} variants={TEXT_VARIANTS}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                  {slide.title}
                </motion.div>

                {/* Subtitle */}
                <motion.div custom={2} variants={TEXT_VARIANTS}
                  className={"text-xl sm:text-2xl lg:text-3xl font-bold pt-1 " + (slide.type === 'promo' ? 'text-orange-400' : 'text-honda-red')}>
                  {slide.subtitle}
                </motion.div>

                {/* Description */}
                <motion.p custom={3} variants={TEXT_VARIANTS}
                  className="text-sm sm:text-base md:text-lg text-white/60 max-w-xl leading-relaxed pt-2 line-clamp-2">
                  {slide.desc || ''}
                </motion.p>

                {/* CTA buttons */}
                <motion.div custom={4} variants={TEXT_VARIANTS}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <a href={slide.href}
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-honda-red hover:bg-honda-red-dark
                               text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300
                               shadow-xl shadow-honda-red/30 hover:shadow-2xl hover:shadow-honda-red/40 hover:scale-105 text-sm sm:text-base">
                    {slide.cta} <ArrowRight size={18} />
                  </a>
                  <a href="#testdrive"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md
                               hover:bg-white/20 text-white font-bold rounded-xl sm:rounded-2xl border border-white/20
                               transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                    <Calendar size={18} /> Booking Test Drive
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center
                       bg-white/10 sm:bg-white/5 backdrop-blur-md hover:bg-white/20 text-white/70 sm:text-white/40 hover:text-white rounded-full
                       transition-all border border-white/20 sm:border-white/10 hover:border-white/30
                       opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 duration-500">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center
                       bg-white/10 sm:bg-white/5 backdrop-blur-md hover:bg-white/20 text-white/70 sm:text-white/40 hover:text-white rounded-full
                       transition-all border border-white/20 sm:border-white/10 hover:border-white/30
                       opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 duration-500">
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Bottom bar: dots + progress + pause */}
      {slides.length > 1 && (
        <div className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3">
          {/* Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((s, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="relative rounded-full transition-all duration-500 overflow-hidden"
                style={{ width: i === current ? 28 : 6, height: i === current ? 10 : 6, background: i === current ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)' }}>
                {i === current && (
                  <motion.div className="absolute inset-0 bg-white rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Pause/Play - hidden on mobile */}
          <button onClick={() => setPaused(p => !p)}
            className="hidden sm:flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-all">
            {paused ? <Play size={12} /> : <Pause size={12} />}
            {paused ? 'Putar' : 'Jeda'}
          </button>
        </div>
      )}

      {/* Scroll indicator - hidden on mobile */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1.5 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.2em] font-light">Scroll</span>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
