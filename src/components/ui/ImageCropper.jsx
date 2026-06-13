import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, RotateCcw, Crop } from 'lucide-react';

const MIN = 40;
const H = 10;

export default function ImageCropper({ file, onCrop, onClose, aspectRatio: AR }) {
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const containerRef = useRef(null);
  const [src, setSrc] = useState('');
  const [crop, setCrop] = useState(null);
  const [dims, setDims] = useState(null);
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);
  const cropRef = useRef(null);

  useEffect(() => { dragRef.current = drag; }, [drag]);
  useEffect(() => { cropRef.current = crop; }, [crop]);

  useEffect(() => {
    const r = new FileReader();
    r.onload = (e) => setSrc(e.target.result);
    r.readAsDataURL(file);
  }, [file]);

  const onImgLoad = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    const cr = container.getBoundingClientRect();
    const s = Math.min(cr.width / img.naturalWidth, cr.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    setDims({ w, h });
    setCrop({ x: 0, y: 0, w, h });
  };

  const clamp = useCallback((r) => {
    if (!dims) return r;
    let { x, y, w, h } = r;
    w = Math.max(MIN, w);
    h = Math.max(MIN, h);
    x = Math.max(0, Math.min(x, dims.w - w));
    y = Math.max(0, Math.min(y, dims.h - h));
    return { x, y, w, h };
  }, [dims]);

  const handleMD = (e, type, handle) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag({ type, handle, sx: e.clientX, sy: e.clientY, sc: { ...crop } });
  };

  const handleMM = useCallback((e) => {
    const d = dragRef.current;
    const c = cropRef.current;
    if (!d || !c || !dims) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    let { x, y, w, h } = d.sc;

    if (d.type === 'move') {
      x += dx;
      y += dy;
    } else if (d.type === 'resize') {
      const hdl = d.handle;
      if (hdl.includes('e')) w = d.sc.w + dx;
      if (hdl.includes('w')) { const nw = d.sc.w - dx; x = d.sc.x + (d.sc.w - nw); w = nw; }
      if (hdl.includes('s')) h = d.sc.h + dy;
      if (hdl.includes('n')) { const nh = d.sc.h - dy; y = d.sc.y + (d.sc.h - nh); h = nh; }

      if (AR) {
        if (hdl === 'e' || hdl === 'w') {
          h = w / AR;
        } else if (hdl === 'n' || hdl === 's') {
          w = h * AR;
        } else {
          const hFromW = w / AR;
          const wFromH = h * AR;
          if (Math.abs(w - d.sc.w) >= Math.abs(h - d.sc.h)) {
            h = hFromW;
          } else {
            w = wFromH;
          }
          if (hdl.includes('w')) x = d.sc.x + (d.sc.w - w);
          if (hdl.includes('n')) y = d.sc.y + (d.sc.h - h);
        }
      }
    }

    setCrop(clamp({ x, y, w, h }));
  }, [dims, AR, clamp]);

  const handleMU = useCallback(() => setDrag(null), []);

  useEffect(() => {
    if (!drag) return;
    window.addEventListener('mousemove', handleMM);
    window.addEventListener('mouseup', handleMU);
    return () => {
      window.removeEventListener('mousemove', handleMM);
      window.removeEventListener('mouseup', handleMU);
    };
  }, [drag, handleMM, handleMU]);

  const doCrop = () => {
    const img = imgRef.current;
    if (!img || !crop || !dims) return;
    const sx = (crop.x / dims.w) * img.naturalWidth;
    const sy = (crop.y / dims.h) * img.naturalHeight;
    const sw = (crop.w / dims.w) * img.naturalWidth;
    const sh = (crop.h / dims.h) * img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob((blob) => {
      onCrop(new File([blob], file.name, { type: file.type }));
    }, file.type);
  };

  const reset = () => { if (dims) setCrop({ x: 0, y: 0, w: dims.w, h: dims.h }); };

  if (!src) return null;

  const hStyle = (t, r, b, l, cur) => ({
    position: 'absolute',
    top: t, right: r, bottom: b, left: l,
    width: 20, height: 20,
    marginLeft: l != null && !String(l).includes('%') ? -10 : 0,
    marginTop: t != null && !String(t).includes('%') ? -10 : 0,
    transform: String(l).includes('%') || String(t).includes('%') ? 'translate(-50%, -50%)' : 'none',
    background: 'white',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    border: '2px solid #E40521',
    zIndex: 10,
    cursor: cur,
  });

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden premium-shadow w-full max-w-4xl flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h3 className="font-bold text-lg">Crop Gambar</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div ref={containerRef} className="flex-1 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 relative overflow-hidden" style={{ minHeight: 420 }}>
          <div ref={wrapRef} className="relative">
            <img ref={imgRef} src={src} onLoad={onImgLoad} className="block max-w-full max-h-full" draggable={false} style={dims ? { width: dims.w, height: dims.h } : {}} />

            {crop && dims && (
              <>
                <div className="absolute bg-black/50 pointer-events-none" style={{ top: 0, left: 0, right: 0, height: crop.y }} />
                <div className="absolute bg-black/50 pointer-events-none" style={{ top: crop.y + crop.h, left: 0, right: 0, bottom: 0 }} />
                <div className="absolute bg-black/50 pointer-events-none" style={{ top: crop.y, left: 0, width: crop.x, height: crop.h }} />
                <div className="absolute bg-black/50 pointer-events-none" style={{ top: crop.y, left: crop.x + crop.w, right: 0, height: crop.h }} />

                <div
                  className="absolute cursor-move border-2 border-white rounded-sm"
                  style={{ top: crop.y, left: crop.x, width: crop.w, height: crop.h }}
                  onMouseDown={(e) => handleMD(e, 'move')}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                    <div />
                  </div>

                  <div style={hStyle(-H, null, null, -H, 'nw-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'nw')} />
                  <div style={hStyle(-H, -H, null, null, 'ne-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'ne')} />
                  <div style={hStyle(null, null, -H, -H, 'sw-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'sw')} />
                  <div style={hStyle(null, -H, -H, null, 'se-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'se')} />
                  <div style={hStyle(-H, null, null, '50%', 'n-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'n')} />
                  <div style={hStyle(null, null, -H, '50%', 's-resize')} onMouseDown={(e) => handleMD(e, 'resize', 's')} />
                  <div style={hStyle('50%', null, null, -H, 'w-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'w')} />
                  <div style={hStyle('50%', -H, null, null, 'e-resize')} onMouseDown={(e) => handleMD(e, 'resize', 'e')} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <span className="text-sm text-gray-500">
            {crop ? `${Math.round(crop.w)} × ${Math.round(crop.h)} px` : ''}
            {AR ? ` (${AR}:1)` : ''}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={reset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              Batal
            </button>
            <button onClick={doCrop}
              className="flex items-center gap-1.5 px-6 py-2 text-sm font-bold text-white bg-honda-red rounded-xl hover:bg-honda-red-dark transition-all">
              <Crop size={14} /> Crop &amp; Upload
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
