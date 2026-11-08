import { motion, type Variants } from 'framer-motion';
import type { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/cn';

const ease = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
}

/** Révélation au montage (animation fluide garantie, sans risque d'élément bloqué invisible). */
export function Reveal({ children, delay = 0, y = 14, className, as = 'div' }: RevealProps) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease, delay }}
    >
      {children}
    </M>
  );
}

const parentVariants: Variants = {
  hidden: { opacity: 1 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: delay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

interface SplitTitleProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Mots (index) mis en valeur avec la couleur orange. */
  highlight?: number[];
  immediate?: boolean;
}

/** Titre révélé mot par mot avec animation fluide et visibilité immédiate. */
export function SplitTitle({
  text,
  className,
  as: Tag = 'h2',
  delay = 0,
  highlight = [],
}: SplitTitleProps) {
  const lines = text.split('\n');
  let idx = 0;

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')}>
      <motion.span
        className="block"
        initial="hidden"
        animate="show"
        custom={delay}
        variants={parentVariants}
      >
        {lines.map((line, li) => {
          // Normaliser et fusionner la ponctuation haute (: ; ? ! ») avec le mot précédent (typographie française)
          const rawTokens = line.split(' ').filter(Boolean);
          const words: string[] = [];
          for (const token of rawTokens) {
            if ([':', ';', '?', '!', '»'].includes(token) && words.length > 0) {
              words[words.length - 1] += `\u00A0${token}`;
            } else {
              words.push(token);
            }
          }

          return (
            <span key={li} className="block">
              {words.map((w, wi) => {
                const i = idx++;
                return (
                  <span key={wi} className="inline-block align-bottom">
                    <motion.span
                      variants={wordVariants}
                      className={cn('inline-block origin-bottom-left', highlight.includes(i) && 'text-gradient-ember')}
                    >
                      {w}
                      {wi < words.length - 1 ? '\u00A0' : ''}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  highlight?: number[];
  className?: string;
  delay?: number;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  highlight,
  className,
  delay = 0,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal delay={delay}>
        <span className={cn('eyebrow', align === 'center' && 'justify-center')}>{eyebrow}</span>
      </Reveal>
      <SplitTitle text={title} className="display-lg mt-5 text-navy-deep" highlight={highlight} delay={delay + 0.05} />
      {intro && (
        <Reveal delay={delay + 0.12}>
          <p className="lead mt-6">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
