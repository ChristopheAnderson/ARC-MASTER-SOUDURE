import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Service } from '@/data/services';
import { img } from '@/data/images';
import { TiltCard } from '@/components/ui/TiltCard';
import { cn } from '@/lib/cn';

export function ServiceCard({
  service,
  index,
  className,
}: {
  service: Service & { customCoverUrl?: string };
  index: number;
  className?: string;
}) {
  const Icon = service.icon;
  const image = service.customCoverUrl
    ? { src: service.customCoverUrl, alt: service.title, w: 1200, h: 900 }
    : img[service.cover];
  return (
    <motion.div
      className={cn('h-full', className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.08 }}
    >
      <TiltCard className="group rounded-xl3" max={6}>
        <Link
          to={`/services/${service.slug}`}
          className="card relative flex h-full flex-col overflow-hidden transition-shadow duration-500 hover:shadow-lift"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image.src}
              alt={image.alt}
              width={image.w}
              height={image.h}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
            <span className="absolute left-4 top-4 font-display text-sm font-semibold text-white/90">{String(index + 1).padStart(2, '0')}</span>
            <span
              className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy-deep shadow-soft transition-colors duration-300 group-hover:bg-ember group-hover:text-white"
              style={{ transform: 'translateZ(40px)' }}
            >
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6" style={{ transform: 'translateZ(24px)' }}>
            <h3 className="font-display text-xl font-semibold leading-tight">{service.title}</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{service.shortDescription}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-deep transition-colors group-hover:text-ember">
              En savoir plus <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
