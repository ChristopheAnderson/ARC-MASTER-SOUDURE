import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react';
import { canRender3D, useInView } from '@/hooks/useMedia';

const SteelScene = lazy(() => import('./SteelScene'));

/** Rendu alternatif léger (SVG) pour appareils peu puissants / reduced-motion. */
function StaticStructure() {
  return (
    <svg viewBox="0 0 400 420" className="h-full w-full" role="img" aria-label="Illustration d'une structure métallique assemblée">
      <defs>
        <linearGradient id="st" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e9edf1" />
          <stop offset="0.5" stopColor="#a8b0b8" />
          <stop offset="1" stopColor="#dfe4e9" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="392" rx="150" ry="16" fill="#10243a" opacity="0.08" />
      <g stroke="url(#st)" strokeWidth="14" strokeLinecap="square" fill="none">
        <path d="M90 380 V90 M310 380 V90 M150 340 V60 M250 340 V60" />
        <path d="M90 90 L150 60 L250 60 L310 90 L250 120 L150 120 Z" strokeWidth="10" />
        <path d="M90 235 L310 235 M90 380 L310 380" strokeWidth="10" />
      </g>
      <g stroke="#30455b" strokeWidth="6" fill="none" opacity="0.8">
        <path d="M90 90 L310 235 M90 235 L310 380" />
      </g>
      <g fill="#f07832">
        {[
          [90, 90], [310, 90], [90, 235], [310, 235], [90, 380], [310, 380],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="7" />
        ))}
      </g>
    </svg>
  );
}

interface Steel3DProps {
  progress: RefObject<number>;
  className?: string;
}

/** Chargement différé de la scène 3D : uniquement à l'approche du viewport, avec fallback. */
export function Steel3D({ progress, className }: Steel3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, '300px', true);
  const visible = useInView(ref, '0px', false);
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => setOk(canRender3D()), []);

  return (
    <div ref={ref} className={className}>
      {ok === false && <StaticStructure />}
      {ok && near && (
        <Suspense fallback={<StaticStructure />}>
          <SteelScene progress={progress} active={visible} />
        </Suspense>
      )}
    </div>
  );
}
