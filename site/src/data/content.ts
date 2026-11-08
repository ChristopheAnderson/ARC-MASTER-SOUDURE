import { MessagesSquare, Ruler, FileText, Hammer, ShieldCheck } from 'lucide-react';

/** Processus de travail — proposition éditoriale à confirmer avec l'entreprise. */
export const processSteps = [
  {
    n: '01',
    title: 'Écoute du besoin',
    text: 'Vous nous présentez votre projet par téléphone, WhatsApp ou via le formulaire : usage, dimensions, contraintes, photos.',
    icon: MessagesSquare,
  },
  {
    n: '02',
    title: 'Étude du projet',
    text: 'Nous analysons la faisabilité, prenons les mesures nécessaires et définissons les solutions techniques adaptées.',
    icon: Ruler,
  },
  {
    n: '03',
    title: 'Proposition et devis',
    text: 'Vous recevez une proposition claire : choix des matériaux, finitions, délais et devis détaillé.',
    icon: FileText,
  },
  {
    n: '04',
    title: 'Fabrication et réalisation',
    text: "Découpe, assemblage, soudure et finitions en atelier, puis pose ou installation sur site.",
    icon: Hammer,
  },
  {
    n: '05',
    title: 'Livraison et suivi',
    text: "Contrôle de l'ouvrage, livraison et conseils d'entretien pour une durabilité optimale.",
    icon: ShieldCheck,
  },
];

/** Engagements — formulés comme une démarche, sans chiffres ni certifications inventés. */
export const commitments = [
  { title: 'Travail sur mesure', text: 'Chaque ouvrage est conçu selon vos dimensions, votre usage et votre budget.' },
  { title: 'Soin des finitions', text: 'Soudures propres, ponçage, traitement et peinture pour un rendu net et durable.' },
  { title: 'Conseil technique', text: 'Nous vous orientons vers les solutions et matériaux les plus adaptés à votre projet.' },
  { title: 'Communication directe', text: 'Un échange simple par téléphone ou WhatsApp, du devis à la livraison.' },
];
