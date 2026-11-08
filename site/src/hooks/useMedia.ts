import { useEffect, useState } from 'react';

function query(q: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(q).matches;
}

export function useMediaQuery(q: string): boolean {
  const [matches, setMatches] = useState(() => query(q));
  useEffect(() => {
    const mql = window.matchMedia(q);
    const on = () => setMatches(mql.matches);
    on();
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, [q]);
  return matches;
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** Détection prudente des appareils peu puissants ou sans WebGL. */
export function canRender3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (query('(prefers-reduced-motion: reduce)')) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 3) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/** Renvoie true une fois que l'élément entre (ou approche) le viewport. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = '200px', once = true) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}
