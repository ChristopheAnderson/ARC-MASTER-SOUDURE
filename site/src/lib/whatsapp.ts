import { company } from '@/config/company';

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultWhatsappMessage =
  "Bonjour ARC MASTER SOUDURE, je souhaite obtenir des informations sur vos prestations de soudure / construction métallique.";

export interface QuoteSummary {
  reference: string;
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  location: string;
  description: string;
  budget?: string;
  deadline?: string;
}

export function buildQuoteMessage(q: QuoteSummary): string {
  const lines = [
    `Bonjour ARC MASTER SOUDURE,`,
    ``,
    `Je viens d'envoyer une demande de devis depuis votre site.`,
    `• Référence : ${q.reference}`,
    `• Nom : ${q.fullName}`,
    `• Téléphone : ${q.phone}`,
    q.email ? `• E-mail : ${q.email}` : null,
    `• Prestation : ${q.service}`,
    `• Lieu du chantier : ${q.location}`,
    q.budget ? `• Budget indicatif : ${q.budget}` : null,
    q.deadline ? `• Délai souhaité : ${q.deadline}` : null,
    ``,
    `Description :`,
    q.description,
  ];
  return lines.filter((l) => l !== null).join('\n');
}
