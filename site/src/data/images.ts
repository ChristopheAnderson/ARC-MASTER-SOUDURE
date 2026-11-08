import type { GalleryItem } from './projects';

export interface ImageAsset {
  src: string;
  alt: string;
  w: number;
  h: number;
  position?: string;
  sparkOrigin?: { x: number; y: number };
}

/**
 * Bibliothèque photographique optimisée (WebP).
 * Tous les visuels sont identifiés comme des illustrations des savoir-faire en métallerie et soudure.
 */
export const img = {
  hero: {
    src: '/images/hero.webp',
    alt: 'Soudeurs professionnels africains travaillant sur une structure métallique en atelier (visuel d’illustration)',
    w: 1672,
    h: 941,
    position: 'center 35%',
    sparkOrigin: { x: 0.605, y: 0.655 },
  },
  gate: {
    src: '/images/gate.webp',
    alt: 'Soudure et assemblage d’un portail métallique en acier dans un atelier (visuel d’illustration)',
    w: 1400,
    h: 933,
    sparkOrigin: { x: 0.59, y: 0.75 },
  },
  gate2: {
    src: '/images/gate-2.webp',
    alt: 'Exemples de portails métalliques ajourés, garde-corps et escaliers contemporains (visuel d’illustration)',
    w: 789,
    h: 602,
  },
  stairs: {
    src: '/images/stairs.webp',
    alt: 'Escalier métallique contemporain avec garde-corps en acier et marches bois (visuel d’illustration)',
    w: 1200,
    h: 1800,
  },
  railing: {
    src: '/images/railing.webp',
    alt: 'Garde-corps et rampe métallique au motif géométrique sur escalier architectural (visuel d’illustration)',
    w: 1024,
    h: 1024,
  },
  stairsLaser: {
    src: '/images/stairs-laser.webp',
    alt: 'Escalier architectural avec garde-corps métallique ajouré sur mesure (visuel d’illustration)',
    w: 1200,
    h: 763,
  },
  stairsModern: {
    src: '/images/stairs-modern.webp',
    alt: 'Escalier droit en acier avec garde-corps et main courante métallique (visuel d’illustration)',
    w: 980,
    h: 582,
  },
  stairsSpiral: {
    src: '/images/stairs-spiral.webp',
    alt: 'Escalier hélicoïdal métallique avec garde-corps cintré en acier (visuel d’illustration)',
    w: 900,
    h: 675,
  },
  stairsVilla: {
    src: '/images/stairs-villa.webp',
    alt: 'Escalier intérieur sur limon métallique noir et garde-corps moderne (visuel d’illustration)',
    w: 850,
    h: 567,
  },
  roof: {
    src: '/images/roof.webp',
    alt: 'Charpente métallique de hangar industriel en cours de montage (visuel d’illustration)',
    w: 1200,
    h: 670,
  },
  structure: {
    src: '/images/structure.webp',
    alt: 'Ossature et charpente métallique à plusieurs niveaux pour bâtiment professionnel (visuel d’illustration)',
    w: 800,
    h: 530,
  },
  team: {
    src: '/images/team.webp',
    alt: 'Équipe de professionnels en atelier étudiant les plans d’une structure en acier (visuel d’illustration)',
    w: 1400,
    h: 764,
  },
  weldClose: {
    src: '/images/weld-close.webp',
    alt: 'Artisan soudeur africain en équipement de protection dans un atelier métallique (visuel d’illustration)',
    w: 1200,
    h: 800,
  },
  weldAction: {
    src: '/images/weld-action.webp',
    alt: 'Opération de soudure de précision sur profilés acier avec gerbe d’étincelles (visuel d’illustration)',
    w: 1400,
    h: 788,
    sparkOrigin: { x: 0.52, y: 0.81 },
  },
  weldDetail: {
    src: '/images/weld-detail.webp',
    alt: 'Soudure minutieuse sur poutre métallique en atelier (visuel d’illustration)',
    w: 980,
    h: 551,
  },
  furniture: {
    src: '/images/furniture.webp',
    alt: 'Table et chaises au piètement et structure en acier sur mesure (visuel d’illustration)',
    w: 768,
    h: 558,
  },
  industrial: {
    src: '/images/industrial.webp',
    alt: 'Soudure et assemblage d’un grand ouvrage métallique en atelier industriel (visuel d’illustration)',
    w: 1400,
    h: 782,
  },
  workshop: {
    src: '/images/workshop.webp',
    alt: 'Atelier de métallerie équipé pour la découpe et l’assemblage de profilés acier (visuel d’illustration)',
    w: 515,
    h: 515,
  },
  cotonou: {
    src: '/images/cotonou.webp',
    alt: 'Vue urbaine de Cotonou, Bénin (visuel d’illustration)',
    w: 1200,
    h: 768,
  },
} satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof img;

export const galleryItems: GalleryItem[] = [
  { id: 'gal-1', title: 'Fabrication de portail et grille en acier', category: 'portails', image: 'gate', span: 'wide' },
  { id: 'gal-2', title: 'Charpente métallique grand volume', category: 'structures', image: 'roof', span: 'wide' },
  { id: 'gal-3', title: 'Garde-corps géométrique sur mesure', category: 'garde-corps', image: 'railing', span: 'tall' },
  { id: 'gal-4', title: 'Escalier métallique & bois contemporain', category: 'escaliers', image: 'stairs', span: 'tall' },
  { id: 'gal-5', title: 'Escalier avec garde-corps ajouré', category: 'escaliers', image: 'stairsLaser', span: 'wide' },
  { id: 'gal-6', title: 'Ossature métallique multi-niveaux', category: 'structures', image: 'structure' },
  { id: 'gal-7', title: 'Escalier intérieur sur limon acier', category: 'escaliers', image: 'stairsVilla' },
  { id: 'gal-8', title: 'Soudure de précision sur profilés', category: 'sur-mesure', image: 'weldAction', span: 'wide' },
  { id: 'gal-9', title: 'Portails ajourés & garde-corps', category: 'portails', image: 'gate2' },
  { id: 'gal-10', title: 'Escalier hélicoïdal et rampe cintrée', category: 'garde-corps', image: 'stairsSpiral' },
  { id: 'gal-11', title: 'Mobilier et table en acier sur mesure', category: 'sur-mesure', image: 'furniture' },
  { id: 'gal-12', title: 'Assemblage industriel en atelier', category: 'autres', image: 'industrial', span: 'wide' },
];

