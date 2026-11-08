import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Expand, MessageCircle } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { Reveal, SplitTitle } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Lightbox } from '@/components/shared/Lightbox';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { useCms } from '@/context/CmsContext';
import { img } from '@/data/images';
import { whatsappUrl } from '@/lib/whatsapp';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getServiceBySlug, activeServices, getServiceImageSrc } = useCms();
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const service = slug ? getServiceBySlug(slug) : undefined;
  if (!service) return <Navigate to="/services" replace />;

  const Icon = service.icon;
  const cover = getServiceImageSrc(service);
  const galleryAssets = service.gallery.map((k) => img[k] ?? img.hero);
  const lbItems = galleryAssets.map((a) => ({
    src: a.src,
    alt: a.alt,
    title: service.title,
    caption: "Visuel d'illustration",
  }));

  const otherServices = activeServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <Seo
        title={`${service.title} à Cotonou — Fabrication sur mesure`}
        description={`${service.shortDescription} Demandez votre devis personnalisé auprès d'ARC MASTER SOUDURE à Cotonou, Bénin.`}
        image={cover.src}
      />

      <section className="relative overflow-hidden border-b border-mist-2 bg-white pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="container-x relative">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ember"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux prestations
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember-soft text-ember">
              <Icon className="h-6 w-6" />
            </span>
            <span className="eyebrow">Prestation sur mesure</span>
          </div>
          <SplitTitle as="h1" text={service.title} className="display-lg mt-4 max-w-4xl text-navy-deep" immediate />
          <p className="lead mt-5 max-w-2xl">{service.shortDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={`/devis?service=${service.slug}`} size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
              Demander un devis pour ce service
            </Button>
            <Button
              href={whatsappUrl(`Bonjour ARC MASTER SOUDURE, je souhaite un devis concernant : ${service.title}.`)}
              external
              size="lg"
              variant="whatsapp"
              icon={<MessageCircle className="h-4 w-4" />}
            >
              Discuter sur WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal className="relative aspect-[16/10] overflow-hidden rounded-xl3 shadow-lift">
              <img src={cover.src} alt={cover.alt} width={cover.w} height={cover.h} className="h-full w-full object-cover" />
              <span className="badge-illus absolute bottom-4 left-4">Visuel d'illustration</span>
            </Reveal>

            <div className="mt-10 space-y-5">
              <h2 className="display-md">Présentation de la prestation</h2>
              {service.description.map((p, idx) => (
                <p key={idx} className="text-base leading-relaxed text-ink-soft sm:text-lg">
                  {p}
                </p>
              ))}
            </div>

            {galleryAssets.length > 1 && (
              <div className="mt-12">
                <h3 className="font-display text-xl font-semibold">Illustrations associées</h3>
                <p className="mt-1 text-sm text-ink-soft">Exemples illustratifs d'ouvrages de cette catégorie.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {galleryAssets.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLbIndex(i)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                    >
                      <img
                        src={g.src}
                        alt={g.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-navy-deep/0 transition-colors group-hover:bg-navy-deep/30" />
                      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-navy-deep opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
                        <Expand className="h-4 w-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 space-y-6 rounded-xl3 border border-mist-2 bg-mist/70 p-8">
              <h3 className="font-display text-xl font-semibold text-navy-deep">Ouvrages réalisés dans cette catégorie</h3>
              <ul className="space-y-3">
                {service.examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-3 rounded-xl bg-white p-3.5 shadow-soft">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ember text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-navy-deep">{ex}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-navy-deep p-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Devis rapide</span>
                <h4 className="mt-2 font-display text-xl font-semibold text-white">Vous avez un projet de {service.title.toLowerCase()} ?</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Indiquez vos dimensions, le lieu du chantier et joignez éventuellement une photo ou un croquis.
                </p>
                <div className="mt-5">
                  <Button to={`/devis?service=${service.slug}`} className="w-full" icon={<ArrowUpRight className="h-4 w-4" />}>
                    Obtenir un devis
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <div className="container-x">
          <h2 className="display-md">Autres prestations</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Lightbox items={lbItems} index={lbIndex} onClose={() => setLbIndex(null)} onChange={setLbIndex} />
    </>
  );
}

