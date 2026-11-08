import { useEffect, useState, type MouseEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { company, telLink } from '@/config/company';
import { navItems, type NavItem } from '@/config/nav';
import { cn } from '@/lib/cn';
import { getLenis } from '@/lib/lenis';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const l = getLenis();
    if (open) {
      l?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      l?.start();
      document.body.style.overflow = '';
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setOpen(false);
    // Si l'utilisateur clique sur le lien de la page où il se trouve déjà, remonter en haut
    if (pathname === item.to) {
      e.preventDefault();
      const l = getLenis();
      if (l) l.scrollTo(0, { immediate: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Aller au contenu
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'py-2.5' : 'py-4 lg:py-6',
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              'flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-500 sm:px-4',
              scrolled ? 'border border-white/60 bg-white/85 shadow-soft backdrop-blur-xl' : 'border border-transparent',
            )}
          >
            <Logo />
            <nav aria-label="Navigation principale" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={(e) => handleNavClick(e, item)}
                      className={({ isActive }) =>
                        cn(
                          'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                          isActive ? 'text-navy-deep font-semibold' : 'text-ink-soft hover:text-navy-deep',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="nav-pill"
                              className="absolute inset-0 -z-10 rounded-full bg-mist border border-mist-2"
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                            />
                          )}
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href={telLink}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-navy-deep transition-colors hover:text-ember xl:inline-flex"
              >
                <Phone className="h-4 w-4" /> {company.phoneDisplay}
              </a>
              <div className="hidden sm:block">
                <Button to="/devis" size="md" icon={<ArrowUpRight className="h-4 w-4" />}>
                  Demander un devis
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="grid h-11 w-11 place-items-center rounded-full bg-navy-deep text-white transition-transform active:scale-95 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile / latéral (Sidebar responsive) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="container-x relative flex min-h-full flex-col pb-10 pt-28">
              <nav aria-label="Navigation mobile">
                <ul className="space-y-1">
                  {[...navItems, { to: '/devis', label: 'Demande de devis' }].map((item, i) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        onClick={(e) => handleNavClick(e, item)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between border-b border-mist-2 py-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl',
                            isActive ? 'text-ember' : 'text-navy-deep',
                          )
                        }
                      >
                        {item.label}
                        <ArrowUpRight className="h-6 w-6 opacity-40" />
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto space-y-3 pt-8">
                <a href={telLink} className="flex items-center gap-3 text-lg font-semibold text-navy-deep">
                  <Phone className="h-5 w-5 text-ember" /> {company.phoneDisplay}
                </a>
                <p className="text-sm text-ink-soft">
                  {company.city}, {company.country}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
