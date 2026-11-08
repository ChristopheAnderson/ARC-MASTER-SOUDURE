import { useEffect, useRef } from 'react';

interface SparksProps {
  /** Point d'émission en fraction du conteneur (0..1). */
  origin?: { x: number; y: number };
  /** Intensité (particules émises par frame). */
  rate?: number;
  className?: string;
  /** Mode "lumière" pour fonds sombres (blend additif). */
  additive?: boolean;
}

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
}

/**
 * Particules d'étincelles légères (Canvas 2D).
 * — Pause automatique hors écran / onglet masqué
 * — Densité réduite sur mobile, désactivé si prefers-reduced-motion
 */
export function Sparks({ origin = { x: 0.5, y: 0.5 }, rate = 3, className, additive = true }: SparksProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const perFrame = mobile ? Math.max(1, Math.round(rate * 0.5)) : rate;
    const maxParticles = mobile ? 90 : 220;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let burstT = 0;
    const ps: P[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (n: number) => {
      const ox = origin.x * w;
      const oy = origin.y * h;
      for (let i = 0; i < n && ps.length < maxParticles; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
        const s = 2 + Math.random() * 6.5;
        const max = 40 + Math.random() * 55;
        ps.push({ x: ox, y: oy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: max, max, size: 0.6 + Math.random() * 1.6 });
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      // émission irrégulière, comme un arc de soudure
      burstT -= 1;
      if (burstT <= 0) {
        spawn(perFrame * (Math.random() < 0.08 ? 6 : 1));
        burstT = Math.random() < 0.85 ? 1 : 6;
      }
      ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over';
      // halo de l'arc
      const ox = origin.x * w;
      const oy = origin.y * h;
      const flicker = 0.55 + Math.random() * 0.45;
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, 46 * flicker);
      g.addColorStop(0, `rgba(255,250,235,${0.85 * flicker})`);
      g.addColorStop(0.25, `rgba(255,190,110,${0.35 * flicker})`);
      g.addColorStop(1, 'rgba(240,120,50,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ox, oy, 46 * flicker, 0, Math.PI * 2);
      ctx.fill();

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        const px = p.x;
        const py = p.y;
        p.vy += 0.16; // gravité
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.y > h - 2 && p.vy > 0) {
          p.vy *= -0.35; // rebond au sol
          p.vx *= 0.6;
          p.y = h - 2;
        }
        const t = p.life / p.max;
        if (t <= 0 || p.x < -20 || p.x > w + 20) {
          ps.splice(i, 1);
          continue;
        }
        const hue = 22 + t * 26;
        ctx.strokeStyle = `hsla(${hue}, 100%, ${55 + t * 35}%, ${Math.min(1, t * 1.4)})`;
        ctx.lineWidth = p.size * (0.5 + t);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && !document.hidden));
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [origin.x, origin.y, rate, additive]);

  return <canvas ref={ref} className={className} aria-hidden />;
}

/** Braises ambiantes très légères qui flottent (fond clair). */
export function Embers({ count = 26, className }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const n = mobile ? Math.round(count * 0.5) : count;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const es = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.8 + Math.random() * 2.2,
      s: 0.0006 + Math.random() * 0.0016,
      d: Math.random() * Math.PI * 2,
      a: 0.25 + Math.random() * 0.6,
    }));
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const e of es) {
        e.y -= e.s;
        if (e.y < -0.05) {
          e.y = 1.05;
          e.x = Math.random();
        }
        const x = (e.x + Math.sin(t * 0.0006 + e.d) * 0.012) * w;
        const y = e.y * h;
        const tw = 0.6 + Math.sin(t * 0.004 + e.d) * 0.4;
        const g = ctx.createRadialGradient(x, y, 0, x, y, e.r * 4);
        g.addColorStop(0, `rgba(240,120,50,${e.a * tw})`);
        g.addColorStop(1, 'rgba(240,120,50,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [count]);
  return <canvas ref={ref} className={className} aria-hidden />;
}
