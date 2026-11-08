import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Expand, FolderKanban, Info } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageHero } from '@/components/shared/PageHero';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { Lightbox } from '@/components/shared/Lightbox';
import { galleryCategories, type GalleryCategory } from '@/data/projects';
import { useCms } from '@/context/CmsContext';
import { CtaSection } from '@/components/home/Sections';
import { cn } from '@/lib/cn';

export default function RealisationsPage() {
  const { publishedProjects, media } = useCms();
  const [cat, setCat] = useState<GalleryCategory | 'tous'>('tous');
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const filteredProjects = useMemo(
    () => (cat === 'tous' ? publishedProjects : publishedProjects.filter((p) => p.categorySlug === cat)),
    [publishedProjects, cat],
  );

  const filteredMedia = useMemo(
    () => (cat === 'tous' ? media : media.filter((m) => m.category === cat)),
    [media, cat],
  );

  const lbItems = useMemo(
    () =>
      filteredMedia.map((m) => ({
        src: m.src,
        alt: m.alt,
        title: m.title,
        caption: m.isIllustration ? "Visuel d'illustration — Galerie d'inspiration" : 'Réalisation ARC MASTER SOUDURE',
      })),
    [filteredMedia],
  );

  const catLabel = (c: string) => galleryCategories.find((g) => g.slug === c)?.label ?? c;

  return (
    <>
      <Seo
        title="Réalisations & Galerie — Ouvrages métalliques à Cotonou"
        description="Explorez les réalisations et la galerie d'inspiration d'ARC MASTER SOUDURE : portails, garde-corps, escaliers métalliques, charpentes et fabrications sur mesure."
      />
      <PageHero
        eyebrow="Nos réalisations"
        title={"Portails, escaliers, charpentes\u00A0:\nl'acier façonné avec précision."}
        highlight={[3]}
        intro="Filtrez par catégorie d'ouvrage et cliquez sur chaque visuel pour l'observer en plein écran."
        actions={
          <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
            Soumettre votre projet
          </Button>
        }
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrer par catégorie">
            {galleryCategories.map((c) => {
              const active = cat === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c.slug)}
                  className={cn(
                    'relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                    active ? 'bg-navy-deep text-white shadow-soft' : 'bg-mist text-ink-soft hover:bg-mist-2 hover:text-navy-deep',
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Section 1 : Chantiers réels publiés depuis le back-office */}
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mist-2 pb-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-navy-deep">Projets & chantiers publiés</h2>
                <p className="text-sm text-ink-soft">Réalisations enregistrées et validées par l'entreprise.</p>
              </div>
              <span className="rounded-full bg-mist px-3.5 py-1 text-xs font-semibold text-navy-deep">
                {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
              </span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-steel-light bg-mist/50 p-6 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                  <FolderKanban className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
                  <div>
                    <p className="font-display text-sm font-semibold text-navy-deep">
                      Les photographies des chantiers récents d'ARC MASTER SOUDURE sont en cours de catalogage.
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Aucun faux projet n'est affiché. Vous pouvez consulter ci-dessous notre catalogue d'inspirations par type d'ouvrage ou
                      ajouter des projets depuis le back-office administrateur.
                    </p>
                  </div>
                </div>
                <Button to="/devis" size="md" variant="secondary">
                  Demander une étude
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((p) => (
                  <TiltCard key={p.id} max={5}>
                    <article className="card flex h-full flex-col overflow-hidden">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={p.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                        <span className="absolute left-3 top-3 rounded-full bg-navy-deep/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                          {catLabel(p.categorySlug)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-xl font-semibold text-navy-deep">{p.title}</h3>
                        {p.location && <p className="mt-1 text-xs font-medium text-ember">{p.location}</p>}
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                      </div>
                    </article>
                  </TiltCard>
                ))}
              </div>
            )}
          </div>

          {/* Section 2 : Galerie d'inspiration interactive */}
          <div className="mt-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Catalogue visuel</span>
                <h2 className="display-md mt-2">Inspirations & typologies d'ouvrages</h2>
              </div>
              <p className="inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-xs text-ink-soft">
                <Info className="h-4 w-4 text-ember" /> Visuels d'illustration présentant les modèles réalisables sur mesure
              </p>
            </div>

            <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredMedia.map((item, idx) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <TiltCard max={6} className="group rounded-xl3">
                      <button
                        type="button"
                        onClick={() => setLbIndex(idx)}
                        className="card relative block w-full overflow-hidden text-left transition-shadow duration-500 hover:shadow-lift"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/15 to-transparent" />
                          {item.isIllustration && <span className="badge-illus absolute left-4 top-4">Illustration</span>}
                          <span className="absolute right-4 top-4 grid h-10 w-10 scale-90 place-items-center rounded-full bg-white text-navy-deep opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <Expand className="h-4 w-4" />
                          </span>
                          <div className="absolute inset-x-0 bottom-0 p-6">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
                              {catLabel(item.category)}
                            </span>
                            <h3 className="mt-1 font-display text-xl font-semibold text-white">{item.title}</h3>
                          </div>
                        </div>
                      </button>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <CtaSection />
      <Lightbox items={lbItems} index={lbIndex} onClose={() => setLbIndex(null)} onChange={setLbIndex} />
    </>
  );
}

