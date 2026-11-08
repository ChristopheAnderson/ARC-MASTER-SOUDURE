import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getLenis } from '@/lib/lenis';

export interface LightboxItem {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}

/** Visionneuse plein écran accessible (clavier, swipe, focus). */
export function Lightbox({ items, index, onClose, onChange }: Props) {
  const open = index !== null;
  const prev = useCallback(() => index !== null && onChange((index - 1 + items.length) % items.length), [index, items.length, onChange]);
  const next = useCallback(() => index !== null && onChange((index + 1) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    if (!open) return;
    const l = getLenis();
    l?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      l?.start();
      document.body.style.overflow = '';
    };
  }, [open, onClose, prev, next]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
          className="fixed inset-0 z-[80] flex flex-col bg-white/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="container-x flex items-center justify-between py-5">
            <p className="font-display text-sm font-semibold text-navy-deep">
              {index! + 1} <span className="text-steel">/ {items.length}</span>
            </p>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="grid h-12 w-12 place-items-center rounded-full bg-navy-deep text-white transition-transform hover:rotate-90"
              aria-label="Fermer la visionneuse"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20">
            <AnimatePresence mode="wait">
              <motion.figure
                key={item.src}
                className="flex max-h-full flex-col items-center"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
              >
                <img src={item.src} alt={item.alt} className="max-h-[72vh] w-auto rounded-2xl object-contain shadow-lift" draggable={false} />
                <figcaption className="mt-5 text-center">
                  {item.title && <span className="block font-display text-lg font-semibold text-navy-deep">{item.title}</span>}
                  {item.caption && <span className="mt-1 block text-sm text-ink-soft">{item.caption}</span>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-steel-light bg-white text-navy-deep shadow-soft transition-colors hover:border-ember hover:text-ember sm:grid"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-steel-light bg-white text-navy-deep shadow-soft transition-colors hover:border-ember hover:text-ember sm:grid"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
