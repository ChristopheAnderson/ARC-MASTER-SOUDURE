import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SplitTitle } from '@/components/ui/Reveal';
import { Embers } from '@/components/effects/Sparks';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight?: number[];
  intro?: string;
  actions?: ReactNode;
}

export function PageHero({ eyebrow, title, highlight, intro, actions }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-mist-2 bg-white pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden />
      <Embers className="pointer-events-none absolute inset-0 h-full w-full" count={14} />
      <div className="container-x relative">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="eyebrow">{eyebrow}</span>
        </motion.div>
        <SplitTitle as="h1" text={title} className="display-lg mt-5 max-w-4xl text-navy-deep" highlight={highlight} immediate />
        {intro && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <p className="lead mt-6 max-w-2xl">{intro}</p>
          </motion.div>
        )}
        {actions && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
