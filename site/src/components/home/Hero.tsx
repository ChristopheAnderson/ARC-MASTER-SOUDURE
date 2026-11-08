import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SplitTitle } from '@/components/ui/Reveal';
import { Sparks, Embers } from '@/components/effects/Sparks';
import { img } from '@/data/images';
import { company } from '@/config/company';

gsap.registerPlugin(ScrollTrigger);
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const imgX = useTransform(sx, (v) => v * -18);
  const imgY = useTransform(sy, (v) => v * -12);
  const layerX = useTransform(sx, (v) => v * 22);
  const layerY = useTransform(sy, (v) => v * 16);

  const onMove = (e: MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  // Image panoramique qui s'ouvre au scroll (GSAP ScrollTrigger)
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          frame.current,
          { clipPath: 'inset(0% 6% 0% 6% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: frame.current, start: 'top 85%', end: 'top 10%', scrub: true },
          },
        );
        gsap.to('[data-hero-img]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const h = img.hero;

  return (
    <section
      id="accueil"
      ref={section}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-white pt-28 sm:pt-32 lg:pt-40 scroll-mt-28"
      aria-labelledby="hero-title"
    >
      <span id="top" className="sr-only" />
      <div className="grid-lines absolute inset-x-0 top-0 h-[80vh] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <Embers className="pointer-events-none absolute inset-x-0 top-0 h-[85vh] w-full" count={22} />
      <motion.div
        aria-hidden
        style={{ x: layerX, y: layerY }}
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(240,120,50,0.16),transparent_65%)] blur-2xl"
      />

      <div className="container-x relative">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }}>
              <span className="eyebrow">Soudure & construction métallique</span>
            </motion.div>
            <SplitTitle
              as="h1"
              text={"L'expertise du métal.\nLa précision du savoir-faire."}
              className="display-xl mt-6 text-navy-deep"
              highlight={[5]}
              delay={0.15}
              immediate
            />
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <motion.p
              className="lead"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.75 }}
            >
              <strong className="font-semibold text-navy-deep">{company.companyName}</strong> conçoit, fabrique et pose vos ouvrages
              métalliques à {company.city} : portails, escaliers, garde-corps, charpentes et fabrications sur mesure.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.9 }}
            >
              <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
                Demander un devis
              </Button>
              <Button to="/realisations" size="lg" variant="ghost">
                Découvrir nos réalisations
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-ember" /> {company.city}, {company.country}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" /> Particuliers & entreprises
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" /> Fabrication sur mesure
          </span>
        </motion.div>
      </div>

      {/* Photographie panoramique */}
      <motion.div
        className="relative mt-12 sm:mt-16"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease, delay: 0.5 }}
      >
        <div ref={frame} className="relative mx-4 h-[62vh] min-h-[380px] overflow-hidden rounded-[28px] md:mx-0 md:h-[82vh] md:rounded-none">
          <motion.div style={{ x: imgX, y: imgY }} className="absolute -inset-8">
            <img
              data-hero-img
              src={h.src}
              alt={h.alt}
              width={h.w}
              height={h.h}
              fetchPriority="high"
              className="h-full w-full scale-[1.06] object-cover"
              style={{ objectPosition: h.position ?? 'center' }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/55 via-navy-deep/5 to-transparent" aria-hidden />
          {h.sparkOrigin && (
            <motion.div style={{ x: imgX, y: imgY }} className="pointer-events-none absolute -inset-8">
              <Sparks origin={h.sparkOrigin} rate={3} className="h-full w-full" />
            </motion.div>
          )}
          <div className="absolute inset-x-0 bottom-0">
            <div className="container-x flex items-end justify-between gap-6 pb-6 sm:pb-10">
              <p className="max-w-md font-display text-lg font-medium leading-snug text-white sm:text-2xl">
                Portails, escaliers, charpentes et structures en acier — fabriqués avec exigence.
              </p>
              <a
                href="#presentation"
                className="hidden h-14 w-14 shrink-0 place-items-center rounded-full border border-white/40 text-white backdrop-blur transition-colors hover:bg-white hover:text-navy-deep sm:grid"
                aria-label="Faire défiler vers la présentation"
              >
                <ArrowDown className="h-5 w-5" />
              </a>
            </div>
          </div>
          <span className="badge-illus absolute right-4 top-4">Visuel d'illustration</span>
        </div>
      </motion.div>
    </section>
  );
}
