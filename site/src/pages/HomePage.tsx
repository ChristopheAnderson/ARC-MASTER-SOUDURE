import { Seo } from '@/components/ui/Seo';
import { Hero } from '@/components/home/Hero';
import { Marquee, Intro } from '@/components/home/Intro';
import { ServicesSection } from '@/components/home/ServicesSection';
import { StructureSection } from '@/components/home/StructureSection';
import { GallerySection } from '@/components/home/GallerySection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { WhyUsSection, TestimonialsSection, CtaSection, ContactSection } from '@/components/home/Sections';

export default function HomePage() {
  return (
    <>
      <Seo
        title="ARC MASTER SOUDURE — Soudure & construction métallique à Cotonou, Bénin"
        description="ARC MASTER SOUDURE à Cotonou (Bénin) : conception, fabrication en atelier et pose de portails métalliques, escaliers, garde-corps, charpentes acier et mobilier sur mesure. Demandez votre devis."
      />
      <Hero />
      <Marquee />
      <Intro />
      <ServicesSection />
      <StructureSection />
      <GallerySection />
      <ProcessSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CtaSection />
      <ContactSection />
    </>
  );
}

