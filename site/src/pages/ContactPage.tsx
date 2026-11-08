import { ArrowUpRight, Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageHero } from '@/components/shared/PageHero';
import { Button } from '@/components/ui/Button';
import { MapEmbed } from '@/components/shared/MapEmbed';
import { useCms } from '@/context/CmsContext';
import { defaultWhatsappMessage, whatsappUrl } from '@/lib/whatsapp';

export default function ContactPage() {
  const { company } = useCms();

  return (
    <>
      <Seo
        title="Contact & Localisation — ARC MASTER SOUDURE à Cotonou, Bénin"
        description={`Contactez ${company.companyName} à ${company.city} (${company.country}) par téléphone au ${company.phoneDisplay} ou sur WhatsApp. Consultez notre localisation sur Google Maps.`}
      />
      <PageHero
        eyebrow="Contact"
        title={'Parlons de votre ouvrage\nmétallique à Cotonou.'}
        highlight={[4]}
        intro="Appelez-nous directement, écrivez-nous sur WhatsApp ou envoyez une demande de devis détaillée."
        actions={
          <>
            <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
              Formulaire de devis
            </Button>
            <Button href={whatsappUrl(defaultWhatsappMessage)} external size="lg" variant="whatsapp" icon={<MessageCircle className="h-4 w-4" />}>
              WhatsApp direct
            </Button>
          </>
        }
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <a
              href={`tel:${company.phoneE164}`}
              className="card group flex items-center justify-between p-6 transition-all hover:border-ember/40 hover:shadow-lift"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-navy-deep transition-colors group-hover:bg-ember group-hover:text-white">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">Téléphone direct</span>
                  <p className="mt-1 font-display text-xl font-semibold text-navy-deep">{company.phoneDisplay}</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-steel transition-transform group-hover:rotate-45 group-hover:text-ember" />
            </a>

            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex items-center justify-between p-6 transition-all hover:border-[#1FAF54]/40 hover:shadow-lift"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1FAF54]/10 text-[#1FAF54] transition-colors group-hover:bg-[#1FAF54] group-hover:text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">Messagerie instantanée</span>
                  <p className="mt-1 font-display text-xl font-semibold text-navy-deep">WhatsApp : {company.phoneDisplay}</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-steel transition-transform group-hover:rotate-45 group-hover:text-[#1FAF54]" />
            </a>

            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="card group flex items-center justify-between p-6 transition-all hover:border-ember/40 hover:shadow-lift"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-navy-deep transition-colors group-hover:bg-ember group-hover:text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">E-mail</span>
                    <p className="mt-1 font-display text-lg font-semibold text-navy-deep">{company.email}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-steel" />
              </a>
            )}

            <div className="card p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-navy-deep">
                  <MapPin className="h-5 w-5 text-ember" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">Localisation</span>
                  <p className="mt-1 font-display text-lg font-semibold text-navy-deep">
                    {company.address ?? `${company.city}, ${company.country}`}
                  </p>
                  <a
                    href={company.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ember hover:underline"
                  >
                    Ouvrir l'emplacement exact dans Google Maps <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {company.openingHours && company.openingHours.length > 0 && (
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-navy-deep">
                    <Clock className="h-5 w-5 text-ember" />
                  </span>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">Horaires</span>
                    <ul className="mt-2 space-y-1 text-sm">
                      {company.openingHours.map((h) => (
                        <li key={h.label} className="flex justify-between">
                          <span className="text-ink-soft">{h.label}</span>
                          <span className="font-semibold text-navy-deep">{h.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <MapEmbed className="h-[460px] lg:h-full lg:min-h-[520px]" />
          </div>
        </div>
      </section>
    </>
  );
}

