import { ArrowUpRight, Check, MessageCircle, Phone, MapPin, Clock, Star, Quote } from 'lucide-react';
import { commitments } from '@/data/content';
import { img } from '@/data/images';
import { useCms } from '@/context/CmsContext';
import { whatsappUrl, defaultWhatsappMessage } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { Reveal, SectionHeading, SplitTitle } from '@/components/ui/Reveal';
import { Sparks } from '@/components/effects/Sparks';
import { MapEmbed } from '@/components/shared/MapEmbed';
import { Img } from '@/components/ui/Img';

export function WhyUsSection() {
  return (
    <section id="pourquoi-nous" className="bg-white py-24 sm:py-32 scroll-mt-24" aria-labelledby="why-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl3 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Img image={img.weldClose} illustration />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden w-60 rounded-2xl bg-white p-5 shadow-lift sm:block lg:-right-8">
            <p className="font-display text-sm font-semibold text-navy-deep">Un interlocuteur direct</p>
            <p className="mt-1 text-sm text-ink-soft">Du premier échange jusqu'à la livraison de votre ouvrage.</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="Pourquoi nous choisir"
            title={'La rigueur d’un atelier,\nle soin d’un artisan.'}
            highlight={[6]}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {commitments.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.08} className="rounded-2xl border border-mist-2 bg-mist/60 p-6 transition-colors hover:border-ember/40 hover:bg-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ember-soft text-ember">
                  <Check className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{c.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Témoignages clients — affiché UNIQUEMENT lorsque des témoignages vérifiés ont été publiés depuis le back-office.
 */
export function TestimonialsSection() {
  const { publishedTestimonials } = useCms();
  if (publishedTestimonials.length === 0) return null;

  return (
    <section className="bg-mist py-24 sm:py-32" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Témoignages vérifiés"
          title={'La confiance de\nnos clients.'}
          highlight={[3]}
          intro="Retours authentiques publiés après réception et validation des ouvrages."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedTestimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="card relative flex flex-col justify-between p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-ember" aria-label={`Note ${t.rating} sur 5`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'fill-ember' : 'opacity-25'}`} />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-steel-light" />
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-ink">« {t.content} »</p>
              </div>
              <div className="mt-6 border-t border-mist-2 pt-4">
                <p className="font-display text-base font-semibold text-navy-deep">{t.clientName}</p>
                {t.roleOrCity && <p className="text-xs text-ink-soft">{t.roleOrCity}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  const { company } = useCms();
  return (
    <section className="bg-white px-4 py-10 sm:px-6" aria-labelledby="cta-title">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-navy-deep px-6 py-20 sm:px-12 sm:py-28">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px]" aria-hidden />
        <Sparks origin={{ x: 0.86, y: 0.82 }} rate={2} className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative max-w-3xl">
          <span className="eyebrow">Votre projet</span>
          <SplitTitle text={'Un projet en acier ?\nParlons-en dès aujourd’hui.'} className="display-lg mt-5 text-white" highlight={[4]} />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Décrivez votre besoin en quelques lignes, joignez vos dimensions ou une photo : nous revenons vers vous pour étudier votre
              projet.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
                Demander un devis
              </Button>
              <Button
                href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(defaultWhatsappMessage)}`}
                external
                size="lg"
                variant="whatsapp"
                icon={<MessageCircle className="h-4 w-4" />}
              >
                WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const { company } = useCms();
  const rows = [
    { icon: Phone, label: 'Téléphone', value: company.phoneDisplay, href: `tel:${company.phoneE164}` },
    { icon: MessageCircle, label: 'WhatsApp', value: company.phoneDisplay, href: whatsappUrl(defaultWhatsappMessage), ext: true },
    { icon: MapPin, label: 'Localisation', value: company.address ?? `${company.city}, ${company.country}`, href: company.mapsUrl, ext: true },
  ];
  return (
    <section id="contact" className="bg-white py-24 sm:py-32 scroll-mt-24" aria-labelledby="contact-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Contact" title={'Passez nous voir\nou appelez-nous.'} highlight={[3]} />
          <ul className="mt-10 divide-y divide-mist-2 border-y border-mist-2">
            {rows.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  {...(r.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-5 py-5"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-navy-deep transition-colors group-hover:bg-ember group-hover:text-white">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-steel">{r.label}</span>
                    <span className="mt-1 block font-display text-lg font-semibold text-navy-deep">{r.value}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-steel transition-all group-hover:rotate-45 group-hover:text-ember" />
                </a>
              </li>
            ))}
            {company.openingHours && (
              <li className="flex items-start gap-5 py-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-navy-deep">
                  <Clock className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-steel">Horaires</span>
                  {company.openingHours.map((h) => (
                    <span key={h.label} className="mt-1 block text-[15px] text-navy-deep">
                      {h.label} : {h.value}
                    </span>
                  ))}
                </span>
              </li>
            )}
          </ul>
        </div>
        <Reveal className="lg:col-span-7" delay={0.1}>
          <MapEmbed className="h-[420px] lg:h-full lg:min-h-[480px]" />
        </Reveal>
      </div>
    </section>
  );
}
