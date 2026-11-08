import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '@/data/content';
import { SectionHeading } from '@/components/ui/Reveal';

gsap.registerPlugin(ScrollTrigger);

export function ProcessSection({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-line]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 60%', scrub: true } });
      gsap.fromTo('[data-line-v]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 60%', scrub: true } });
      gsap.from('[data-step]', {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-steps]', start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="methode" ref={ref} className={`${compact ? 'py-20' : 'bg-mist py-24 sm:py-32'} scroll-mt-24`} aria-labelledby="process-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Notre méthode"
          title={'Un processus clair,\nde l’idée à la pose.'}
          highlight={[2]}
          intro="Cinq étapes pour avancer sereinement et obtenir un ouvrage conforme à vos attentes."
        />
        <div data-steps className="relative mt-16">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-steel-light lg:block" aria-hidden />
          <div data-line className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-ember lg:block" aria-hidden />
          <div className="absolute bottom-0 left-7 top-0 w-px bg-steel-light lg:hidden" aria-hidden />
          <div data-line-v className="absolute bottom-0 left-7 top-0 w-px origin-top bg-ember lg:hidden" aria-hidden />
          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.n} data-step className="relative pl-20 lg:pl-0">
                  <span className="absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-2xl border border-steel-light bg-white text-navy-deep shadow-soft lg:relative">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-0 block font-display text-xs font-semibold tracking-[0.25em] text-ember lg:mt-7">ÉTAPE {s.n}</span>
                  <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-12 text-xs text-steel">Processus indicatif, adapté à chaque projet.</p>
      </div>
    </section>
  );
}
