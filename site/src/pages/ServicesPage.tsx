import { ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { useCms } from '@/context/CmsContext';
import { ProcessSection } from '@/components/home/ProcessSection';
import { CtaSection } from '@/components/home/Sections';

export default function ServicesPage() {
  const { activeServices, getServiceImageSrc } = useCms();

  return (
    <>
      <Seo
        title="Nos services — Portails, escaliers, charpentes & soudure à Cotonou"
        description="Catalogue complet des prestations d’ARC MASTER SOUDURE à Cotonou : portails métalliques, construction métallique, escaliers, garde-corps, charpentes, soudure, mobilier et travaux industriels."
      />
      <PageHero
        eyebrow="Nos prestations"
        title={'Solutions complètes en soudure\n& construction métallique.'}
        highlight={[3, 6]}
        intro="Nous concevons et fabriquons des ouvrages métalliques sur mesure pour l’habitat, le commerce et l’industrie au Bénin."
        actions={
          <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
            Demander un devis gratuit
          </Button>
        }
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x space-y-16">
          {activeServices.map((service, i) => {
            const Icon = service.icon;
            const image = getServiceImageSrc(service);
            const reverse = i % 2 === 1;
            return (
              <Reveal
                as="article"
                key={service.id}
                className="grid items-center gap-10 rounded-xl3 border border-mist-2 bg-mist/40 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12"
              >
                <div className={`relative aspect-[16/11] overflow-hidden rounded-2xl lg:col-span-6 ${reverse ? 'lg:order-2' : ''}`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.w}
                    height={image.h}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <span className="badge-illus absolute bottom-3 left-3">Visuel d'illustration</span>
                  <span className="absolute right-4 top-4 rounded-full bg-navy-deep/85 px-3.5 py-1.5 font-display text-xs font-semibold text-white backdrop-blur">
                    0{i + 1}
                  </span>
                </div>

                <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : ''}`}>
                  <div className="inline-flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember-soft text-ember">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-steel">Prestation 0{i + 1}</span>
                  </div>
                  <h2 className="display-md mt-4">
                    <Link to={`/services/${service.slug}`} className="transition-colors hover:text-ember">
                      {service.title}
                    </Link>
                  </h2>
                  {service.description.map((p, idx) => (
                    <p key={idx} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                      {p}
                    </p>
                  ))}

                  {service.examples.length > 0 && (
                    <ul className="mt-6 grid grid-cols-2 gap-2.5">
                      {service.examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-sm font-medium text-navy-deep">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ember/15 text-ember">
                            <Check className="h-3 w-3" />
                          </span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button to={`/devis?service=${service.slug}`} icon={<ArrowUpRight className="h-4 w-4" />}>
                      Demander un devis
                    </Button>
                    <Button to={`/services/${service.slug}`} variant="ghost">
                      Fiche détaillée
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ProcessSection />
      <CtaSection />
    </>
  );
}

