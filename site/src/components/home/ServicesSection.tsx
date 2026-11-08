import { ArrowUpRight } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { SectionHeading } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/shared/ServiceCard';

export function ServicesSection() {
  const { activeServices } = useCms();
  return (
    <section id="services" className="relative scroll-mt-24 bg-mist py-24 sm:py-32" aria-labelledby="services-title">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Nos services"
            title={'Huit savoir-faire,\nune même exigence.'}
            highlight={[3]}
            intro="De la porte d'entrée à la charpente d'un hangar, nous fabriquons des ouvrages métalliques adaptés à chaque usage."
          />
          <div className="shrink-0">
            <Button to="/services" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" />}>
              Tous les services
            </Button>
          </div>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activeServices.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
