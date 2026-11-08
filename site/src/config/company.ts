/**
 * Paramètres centralisés de l'entreprise (équivalent de la future table `company_settings`).
 * Toute information non vérifiée est laissée à `null` : elle n'est alors jamais affichée.
 * Les valeurs peuvent être surchargées via les variables d'environnement Vite (.env).
 */
const env = import.meta.env;

export interface CompanySettings {
  companyName: string;
  shortTagline: string;
  city: string;
  country: string;
  /** Téléphone affiché (format lisible). */
  phoneDisplay: string;
  /** Téléphone au format E.164 pour les liens tel: */
  phoneE164: string;
  /** Numéro WhatsApp (chiffres uniquement, indicatif inclus). */
  whatsapp: string;
  email: string | null;
  address: string | null;
  mapsUrl: string;
  mapsEmbedQuery: string;
  openingHours: { label: string; value: string }[] | null;
  socialLinks: { label: string; url: string }[];
  siteUrl: string;
}

export const company: CompanySettings = {
  companyName: 'ARC MASTER SOUDURE',
  shortTagline: 'Soudure & construction métallique',
  city: 'Cotonou',
  country: 'Bénin',
  phoneDisplay: env.VITE_PHONE_DISPLAY || '+229 01 97 78 59 92',
  phoneE164: env.VITE_PHONE_E164 || '+2290197785992',
  whatsapp: env.VITE_WHATSAPP_NUMBER || '2290197785992',
  email: env.VITE_CONTACT_EMAIL || null,
  address: env.VITE_ADDRESS || null,
  mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJtSnmnBBVIxARLgVfBzpx7vg',
  mapsEmbedQuery: 'ARC MASTER SOUDURE Cotonou',
  openingHours: null,
  socialLinks: [],
  siteUrl: env.VITE_SITE_URL || 'https://arcmastersoudure.bj',
};

export const telLink = `tel:${company.phoneE164}`;
