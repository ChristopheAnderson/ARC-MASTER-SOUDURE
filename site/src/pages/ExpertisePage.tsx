import { ArrowUpRight, Flame, Layers, Ruler, ShieldCheck } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { img } from '@/data/images';
import { StructureSection } from '@/components/home/StructureSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { CtaSection } from '@/components/home/Sections';

const pillars = [
  {
    icon: Ruler,
    title: 'Étude & dimensionnement',
    text: 'Analyse des portées, prise de cotes sur chantier et choix des sections (tubes carrés, rectangulaires, fers plats, profilés IPE/IPN, tôles).',
  },
  {
    icon: Layers,
    title: 'Débit & préparation',
    text: 'Découpe précise aux angles, grugeage, perçage et préparation des chanfreins pour garantir une pénétration optimale de la soudure.',
  },
  {
    icon: Flame,
    title: 'Soudure & assemblage',
    text: 'Pointage sur table de montage, contrôle des diagonales et de l’équerrage, puis réalisation des cordons de soudure continus.',
  },
  {
    icon: ShieldCheck,
    title: 'Protection & finitions',
    text: 'Meulage fin, dégraissage, traitement antirouille et application de peinture adaptée aux conditions climatiques côtières de Cotonou.',
  },
];

export default function ExpertisePage() {
  return (
    <>
      <Seo
        title="Notre méthode & expertise — Soudure et métallerie à Cotonou"
        description="Découvrez le processus de travail et le savoir-faire technique d'ARC MASTER SOUDURE : étude, découpe, assemblage, soudure et finitions durables au Bénin."
      />
      <PageHero
        eyebrow="Expertise & Méthode"
        title={'Un savoir-faire technique\nau service de la durabilité.'}
        highlight={[2, 7]}
        intro="De la sélection de l’acier jusqu’à la pose sur votre chantier, nous appliquons une méthode rigoureuse pour chaque ouvrage."
        actions={
          <Button to="/devis" size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
            Parler de votre projet
          </Button>
        }
      />

      <ProcessSection />

      <StructureSection />

      <section className="bg-mist py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Maîtrise technique"
            title={"Les fondamentaux d'un\nouvrage bien exécuté."}
            highlight={[4]}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.08} className="card p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-deep text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            <Reveal className="aspect-[16/10] overflow-hidden rounded-xl3">
              <Img image={img.weldAction} illustration />
            </Reveal>
            <Reveal delay={0.1} className="aspect-[16/10] overflow-hidden rounded-xl3">
              <Img image={img.weldDetail} illustration />
            </Reveal>
            <Reveal delay={0.2} className="aspect-[16/10] overflow-hidden rounded-xl3">
              <Img image={img.industrial} illustration />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

