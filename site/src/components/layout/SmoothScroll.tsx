import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis, getLenis } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

/** Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger. Désactivé si reduced-motion. */
export function SmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.95 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Remonter en haut ou faire défiler vers l'ancre demandée
  useEffect(() => {
    if (hash) {
      const targetHash = hash;
      const scrollToHash = () => {
        try {
          const el = document.querySelector(targetHash);
          if (el) {
            const l = getLenis();
            if (l) {
              l.scrollTo(el as HTMLElement, { offset: -90 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
            return true;
          }
        } catch {
          // ignore invalid selectors
        }
        return false;
      };

      if (!scrollToHash()) {
        const t1 = setTimeout(scrollToHash, 60);
        const t2 = setTimeout(scrollToHash, 200);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
      return;
    }

    // Navigation standard entre pages : retour immédiat en haut de l'écran
    const l = getLenis();
    if (l) {
      l.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(id);
  }, [pathname, hash]);

  return null;
}
