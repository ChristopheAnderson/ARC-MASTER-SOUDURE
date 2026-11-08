import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Steel3D } from '@/components/three/Steel3D';
import { cn } from '@/lib/cn';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { k: 'Découpe', t: 'Des profilés préparés avec précision', d: 'Mesures, traçage et découpe des profilés et tôles selon les plans validés.' },
  { k: 'Assemblage', t: 'Une structure pensée pour durer', d: "Positionnement, équerrage et pointage des éléments pour garantir l'alignement de l'ouvrage." },
  { k: 'Soudure', t: 'Des assemblages solides', d: 'Soudures réalisées avec méthode pour assurer la résistance de chaque jonction.' },
  { k: 'Finition', t: 'Un rendu net et protégé', d: 'Meulage, traitement et peinture pour un ouvrage esthétique et protégé dans le temps.' },
];

/** Section 3D : la structure s'assemble et pivote au rythme du scroll. */
export function StructureSection() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      progress.current = 1;
      setActive(3);
      return;
    }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const update = (self: ScrollTrigger) => {
        progress.current = self.progress;
        setActive(Math.min(3, Math.floor(self.progress * 4)));
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
      };
      mm.add('(min-width: 1024px)', () => {
        ScrollTrigger.create({
          trigger: section.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: true,
          onUpdate: update,
        });
      });
      mm.add('(max-width: 1023px)', () => {
        ScrollTrigger.create({ trigger: section.current, start: 'top 70%', end: 'bottom 40%', scrub: true, onUpdate: update });
      });
    }, section);
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} id="expertise" className="relative scroll-mt-24 overflow-hidden bg-white lg:h-screen" aria-labelledby="structure-title">
      <div id="savoir-faire" className="absolute -top-24" aria-hidden />
      <div className="metal-sheen absolute inset-0" aria-hidden />
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden />
      <div className="container-x relative grid h-full items-center gap-6 py-20 lg:grid-cols-12 lg:py-0">
        <div className="lg:col-span-5">
          <span className="eyebrow">Savoir-faire</span>
          <h2 id="structure-title" className="display-lg mt-5">
            Du profilé brut <br className="hidden sm:block" />à l'ouvrage <span className="text-gradient-ember">assemblé.</span>
          </h2>
          <div className="relative mt-10 pl-8">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-steel-light" aria-hidden />
            <div ref={bar} className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-ember" aria-hidden />
            <ol className="space-y-6">
              {steps.map((s, i) => (
                <li key={s.k} className={cn('transition-all duration-500', i === active ? 'opacity-100' : 'opacity-35')}>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-ember">
                    0{i + 1} — {s.k}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold">{s.t}</h3>
                  <p
                    className={cn(
                      'overflow-hidden text-[15px] leading-relaxed text-ink-soft transition-all duration-500',
                      i === active ? 'mt-2 max-h-24' : 'max-h-0 lg:max-h-0',
                    )}
                  >
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative h-[420px] sm:h-[520px] lg:col-span-7 lg:h-[86vh]">
          <Steel3D progress={progress} className="h-full w-full" />
          <p className="absolute bottom-2 right-2 text-[11px] uppercase tracking-[0.2em] text-steel">Modèle 3D illustratif</p>
        </div>
      </div>
    </section>
  );
}
