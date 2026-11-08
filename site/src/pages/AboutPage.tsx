import { ArrowUpRight, CheckCircle2, Compass, ShieldCheck, Sparkles, Target, Wrench } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { img } from '@/data/images';
import { useCms } from '@/context/CmsContext';
import { CtaSection } from '@/components/home/Sections';

const values = [
  {
    icon: ShieldCheck,
    title: 'Solidité & sécurité',
    text: 'Des profilés dimensionnés avec rigueur et des assemblages soudés pour résister durablement aux usages quotidiens comme aux contraintes climatiques.',
  },
  {
    icon: Sparkles,
    title: 'Soin des finitions',
    text: 'Ébavurage, ponçage des cordons de soudure, alignement précis et protection anti-corrosion avant peinture.',
  },
  {
    icon: Compass,
    title: 'Sur-mesure intégral',
    text: 'Chaque portail, escalier ou charpente est dessiné et fabriqué selon les cotes exactes de votre chantier à Cotonou et au Bénin.',
  },
  {
    icon: Wrench,
    title: 'Accompagnement de proximité',
    text: 'Écoute directe, conseils sur le choix des sections d’acier et suivi jusqu’à la pose finale.',
  },
];

const qualitySteps = [
  'Sélection de profilés, tubes et tôles en acier adaptés à la portée et à l’usage de l’ouvrage.',
  'Relevé de cotes précis et validation des caractéristiques avant lancement en fabrication.',
  'Pointage, contrôle d’équerrage et soudures continues réalisées en atelier.',
  'Meulage soigné des jonctions, préparation des surfaces et application d’une protection antirouille.',
  'Vérification du bon fonctionnement des ouvrants, serrures et fixations lors de la livraison.',
];

export default function AboutPage() {
  const { company } = useCms();

  return (
    <>
      <Seo
        title="À propos — Atelier de soudure & construction métallique à Cotonou"
        description={`Découvrez ${company.companyName}, votre partenaire à ${company.city} (${company.country}) pour tous travaux de soudure, métallerie, portails, escaliers et charpentes en acier.`}
      />
      <PageHero
        eyebrow="À propos"
        title={"Façonner l'acier avec exigence,\npour des ouvrages qui durent."}
        highlight={[2, 7]}
        intro={company.aboutText}
        actions={
          <>
            <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
              Demander un devis
            </Button>
            <Button to="/services" size="lg" variant="ghost">
              Découvrir nos prestations
            </Button>
          </>
        }
      />

      <section className="bg-white py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[16/11] overflow-hidden rounded-xl3 shadow-lift">
              <Img image={img.team} illustration />
            </div>
          </Reveal>
          <div className="lg:col-span-6">
            <span className="eyebrow">Notre identité</span>
            <h2 className="display-md mt-4">Un atelier ancré à {company.city}, au service des particuliers et des professionnels.</h2>
            <p className="lead mt-6">
              Qu'il s'agisse de sécuriser une résidence avec un portail sur mesure, d'habiller un bâtiment d'un escalier métallique
              contemporain ou de monter la charpente en acier d'un entrepôt, <strong className="font-semibold text-navy-deep">{company.companyName}</strong> mobilise son savoir-faire en soudure et construction métallique.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-mist-2 bg-mist/60 p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy-deep text-white">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">Notre mission</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Fournir des ouvrages métalliques fiables, esthétiques et adaptés aux réalités architecturales et climatiques du Bénin.
                </p>
              </div>
              <div className="rounded-2xl border border-mist-2 bg-mist/60 p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ember text-white">
                  <Compass className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">Notre vision</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Allier la maîtrise artisanale de la soudure à une organisation moderne, réactive et orientée satisfaction client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Nos valeurs"
            title={'Quatre piliers au cœur\nde chaque réalisation.'}
            highlight={[1]}
            intro="Nous accordons autant d’importance à la tenue mécanique d’une soudure qu’à la clarté de nos échanges avec vous."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 0.08} className="card p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember-soft text-ember">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{v.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{v.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Approche qualité"
              title={"Le souci du détail,\ndu traçage à la pose."}
              highlight={[3]}
            />
            <ul className="mt-8 space-y-4">
              {qualitySteps.map((step, i) => (
                <Reveal as="li" key={i} delay={i * 0.06} className="flex items-start gap-3.5 rounded-2xl border border-mist-2 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
                  <span className="text-[15px] leading-relaxed text-ink">{step}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal className="lg:col-span-6" delay={0.15}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="aspect-[4/5] overflow-hidden rounded-xl3">
                <Img image={img.weldClose} illustration />
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-xl3 sm:mt-10">
                <Img image={img.weldAction} illustration />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

