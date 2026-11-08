import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '@/data/services';
import { img } from '@/data/images';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';

gsap.registerPlugin(ScrollTrigger);

export function Marquee() {
  const items = services.map((s) => s.title);
  return (
    <div className="relative overflow-hidden border-y border-navy/10 bg-navy-deep py-5 text-white" aria-hidden>
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 whitespace-nowrap motion-reduce:animate-none">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-xl font-medium tracking-tight sm:text-2xl">
            {t}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-ember">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
            </svg>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

const statement =
  "Nous transformons l'acier en ouvrages solides, sûrs et élégants. Chaque soudure, chaque assemblage et chaque finition est réalisé avec rigueur, pour des clients particuliers et professionnels qui attendent un travail durable.";

export function Intro() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.3 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="a-propos" className="relative scroll-mt-24 bg-white py-24 sm:py-32 lg:py-40" aria-labelledby="intro-title">
      <div id="presentation" className="absolute -top-24" aria-hidden />
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <h2 id="intro-title" className="eyebrow">ARC MASTER SOUDURE</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <p ref={ref} className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.18] tracking-[-0.02em] text-navy-deep">
              {statement.split(' ').map((w, i) => (
                <span key={i} data-word className="inline">
                  {w}{' '}
                </span>
              ))}
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              <Reveal className="group relative aspect-[4/3] overflow-hidden rounded-xl3">
                <Img image={img.team} illustration className="transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
              </Reveal>
              <Reveal delay={0.12} className="flex flex-col justify-between rounded-xl3 bg-mist p-8 sm:p-10">
                <p className="lead">
                  Basée à Cotonou, l'entreprise accompagne vos projets de métallerie de l'étude à la pose : écoute, conseil technique,
                  fabrication en atelier et installation.
                </p>
                <Link
                  to="/a-propos"
                  className="mt-8 inline-flex items-center gap-2 font-display text-lg font-semibold text-navy-deep transition-colors hover:text-ember"
                >
                  Découvrir l'entreprise
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
