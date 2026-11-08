import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

/** Logotype typographique PROVISOIRE — à remplacer par le logo officiel de l'entreprise. */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" aria-label="ARC MASTER SOUDURE — Accueil" className={cn('group inline-flex items-center gap-3', className)}>
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-navy-deep">
        <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden>
          <path d="M8 31 L20 9 L32 31" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M13.5 24 H26.5" stroke="#F07832" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-ember blur-[3px] transition-transform duration-500 group-hover:scale-150" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-[17px] font-bold tracking-[-0.02em]', light ? 'text-white' : 'text-navy-deep')}>
          ARC MASTER
        </span>
        <span className={cn('mt-1 font-display text-[10px] font-semibold tracking-[0.42em]', light ? 'text-ember' : 'text-ember')}>
          SOUDURE
        </span>
      </span>
    </Link>
  );
}
