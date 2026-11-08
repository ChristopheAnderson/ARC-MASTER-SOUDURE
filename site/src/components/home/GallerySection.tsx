import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Expand } from 'lucide-react';
import { galleryItems, img } from '@/data/images';
import { galleryCategories } from '@/data/projects';
import { Button } from '@/components/ui/Button';
import { Lightbox } from '@/components/shared/Lightbox';

gsap.registerPlugin(ScrollTrigger);

const catLabel = (c: string) => galleryCategories.find((g) => g.slug === c)?.label ?? '';

/** Galerie horizontale épinglée (desktop) / carrousel tactile (mobile). */
export function GallerySection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const items = galleryItems.slice(0, 8);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth + 96;
        gsap.to(el, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>('[data-par]').forEach((im) => {
          gsap.fromTo(
            im,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${dist()}`, scrub: true },
            },
          );
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const lbItems = items.map((g) => ({ src: img[g.image].src, alt: img[g.image].alt, title: g.title, caption: "Visuel d'illustration" }));

  return (
    <section ref={section} id="realisations" className="relative scroll-mt-24 overflow-hidden bg-white py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="gallery-title">
      <div id="galerie" className="absolute -top-24" aria-hidden />
      <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Réalisations</span>
          <h2 id="gallery-title" className="display-lg mt-5">
            L'acier sous <span className="text-gradient-ember">toutes ses formes.</span>
          </h2>
          <p className="lead mt-4 max-w-xl">Galerie d'inspiration — les visuels présentés sont des illustrations des types d'ouvrages réalisables.</p>
        </div>
        <Button to="/realisations" variant="ghost" icon={<ArrowUpRight className="h-4 w-4" />}>
          Voir la galerie
        </Button>
      </div>
      <div className="no-scrollbar mt-12 overflow-x-auto lg:overflow-visible">
        <div ref={track} className="flex w-max gap-5 px-5 sm:px-8 lg:gap-7 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))]">
          {items.map((g, i) => {
            const im = img[g.image];
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setOpen(i)}
                className="group relative h-[52vh] max-h-[560px] min-h-[340px] w-[78vw] shrink-0 overflow-hidden rounded-xl3 text-left sm:w-[46vw] lg:w-[34vw]"
                aria-label={`Agrandir : ${g.title}`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    data-par
                    src={im.src}
                    alt={im.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-[116%] max-w-none -translate-x-[7%] object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/10 to-transparent" />
                <span className="badge-illus absolute left-4 top-4">Illustration</span>
                <span className="absolute right-4 top-4 grid h-11 w-11 scale-75 place-items-center rounded-full bg-white text-navy-deep opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">{catLabel(g.category)}</span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{g.title}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <Lightbox items={lbItems} index={open} onClose={() => setOpen(null)} onChange={setOpen} />
    </section>
  );
}
