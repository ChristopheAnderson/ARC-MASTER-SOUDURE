import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, MessageCircle, Phone, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { company, telLink } from '@/config/company';
import { services } from '@/data/services';
import { whatsappUrl, defaultWhatsappMessage } from '@/lib/whatsapp';
import { navItems } from '@/config/nav';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-mist-2 bg-mist">
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden />
      <div className="container-x relative pb-10 pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Soudure, fabrication et construction métallique à {company.city}. Des ouvrages pensés pour durer, réalisés pour les
              particuliers et les entreprises du {company.country}.
            </p>
            <Link
              to="/devis"
              className="mt-8 inline-flex items-center gap-2 font-display text-lg font-semibold text-navy-deep underline decoration-ember decoration-2 underline-offset-8 transition-colors hover:text-ember"
            >
              Demander un devis <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel">Navigation</h3>
              <ul className="mt-5 space-y-3">
                {navItems.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="text-[15px] text-ink transition-colors hover:text-ember">
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/devis" className="text-[15px] text-ink transition-colors hover:text-ember">
                    Devis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel">Services</h3>
              <ul className="mt-5 space-y-3">
                {services.slice(0, 7).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="text-[15px] text-ink transition-colors hover:text-ember">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel">Contact</h3>
              <ul className="mt-5 space-y-4 text-[15px]">
                <li>
                  <a href={telLink} className="flex items-start gap-3 text-ink hover:text-ember">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ember" /> {company.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={whatsappUrl(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-ink hover:text-ember">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember" /> WhatsApp
                  </a>
                </li>
                {company.email && (
                  <li>
                    <a href={`mailto:${company.email}`} className="flex items-start gap-3 text-ink hover:text-ember">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ember" /> {company.email}
                    </a>
                  </li>
                )}
                <li>
                  <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-ink hover:text-ember">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                    {company.address ?? `${company.city}, ${company.country}`}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 select-none overflow-hidden" aria-hidden>
          <p className="whitespace-nowrap font-display text-[17vw] font-bold leading-[0.8] tracking-[-0.06em] text-white [text-shadow:0_1px_0_#dfe4e9] lg:text-[13.5vw]">
            ARC MASTER
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-steel-light/70 pt-8 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
          <p>© {year} {company.companyName}. Tous droits réservés.</p>
          <p className="text-xs">Les visuels présentés sur ce site sont des illustrations.</p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-ember">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-ember">Confidentialité</Link>
            <Link to="/admin" className="text-steel hover:text-ember">Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
