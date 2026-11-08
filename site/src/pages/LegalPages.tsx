import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { useCms } from '@/context/CmsContext';
import { Button } from '@/components/ui/Button';

export function MentionsLegalesPage() {
  const { company } = useCms();
  return (
    <>
      <Seo title="Mentions légales" description={`Mentions légales du site ${company.companyName}.`} />
      <section className="bg-white pb-24 pt-36 sm:pt-44">
        <div className="container-x max-w-3xl space-y-6">
          <span className="eyebrow">Informations légales</span>
          <h1 className="display-md">Mentions légales</h1>
          <div className="card space-y-5 p-8 text-[15px] leading-relaxed text-ink-soft">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-deep">1. Éditeur du site</h2>
              <p className="mt-2">
                Nom de l'entreprise : <strong className="text-navy-deep">{company.companyName}</strong>
                <br />
                Activité : Soudure et construction métallique
                <br />
                Localisation : {company.address ?? `${company.city}, ${company.country}`}
                <br />
                Téléphone : {company.phoneDisplay}
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-deep">2. Propriété intellectuelle & visuels</h2>
              <p className="mt-2">
                La structure générale, les textes, animations et éléments graphiques de ce site sont réservés à {company.companyName}. Les
                photographies portant la mention « Visuel d'illustration » sont utilisées à titre d'illustration générique des métiers de
                la soudure et de la métallerie et ne constituent pas des photographies contractuelles des équipes ou chantiers de
                l'entreprise, sauf mention explicite contraire.
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-deep">3. Contact</h2>
              <p className="mt-2">
                Pour toute question, vous pouvez nous joindre par téléphone au {company.phoneDisplay} ou via la page Contact.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ConfidentialitePage() {
  const { company } = useCms();
  return (
    <>
      <Seo title="Politique de confidentialité" description={`Politique de confidentialité de ${company.companyName}.`} />
      <section className="bg-white pb-24 pt-36 sm:pt-44">
        <div className="container-x max-w-3xl space-y-6">
          <span className="eyebrow">Protection des données</span>
          <h1 className="display-md">Politique de confidentialité</h1>
          <div className="card space-y-5 p-8 text-[15px] leading-relaxed text-ink-soft">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-deep">1. Données collectées</h2>
              <p className="mt-2">
                Dans le cadre du formulaire de demande de devis, <strong className="text-navy-deep">{company.companyName}</strong> collecte
                uniquement les informations strictement nécessaires à l'étude de votre projet : nom, téléphone, adresse e-mail facultative,
                type de prestation, localisation du chantier, description et pièces jointes éventuelles.
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-deep">2. Finalité et sécurité</h2>
              <p className="mt-2">
                Ces données sont exclusivement destinées au traitement commercial et technique de votre demande par {company.companyName}.
                Elles ne sont ni vendues ni cédées à des tiers. Les demandes des clients sont isolées et ne sont jamais accessibles
                publiquement.
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-deep">3. Vos droits</h2>
              <p className="mt-2">
                Vous pouvez à tout moment demander la modification ou la suppression de vos informations en nous contactant au{' '}
                {company.phoneDisplay}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page introuvable" description="La page demandée n'existe pas." noindex />
      <section className="bg-white pb-28 pt-40 text-center">
        <div className="container-x max-w-xl">
          <span className="eyebrow justify-center">Erreur 404</span>
          <h1 className="display-lg mt-4">Cette page est introuvable.</h1>
          <p className="lead mt-4">Le lien que vous avez suivi n'existe plus ou a été déplacé.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button to="/" icon={<ArrowLeft className="h-4 w-4" />}>
              Retour à l'accueil
            </Button>
            <Link to="/devis" className="inline-flex h-11 items-center rounded-full border border-steel-light px-5 text-sm font-semibold text-navy-deep hover:border-ember">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

