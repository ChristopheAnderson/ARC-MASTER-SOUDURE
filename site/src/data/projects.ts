import type { ImageKey } from './images';

/**
 * Réalisations RÉELLES de l'entreprise (équivalent des futures tables `projects` + `project_images`).
 * Volontairement vide : aucun chantier ne doit être inventé.
 * Ajoutez ici les projets confirmés par ARC MASTER SOUDURE (ou branchez Supabase plus tard).
 */
export interface Project {
  id: string;
  slug: string;
  title: string;
  categorySlug: GalleryCategory;
  description: string;
  location?: string;
  completionDate?: string; // ISO
  cover: string; // URL de l'image
  images: { url: string; alt: string }[];
  isFeatured: boolean;
  isPublished: boolean;
}

export const projects: Project[] = [];
export const publishedProjects = projects.filter((p) => p.isPublished);
export const getProject = (slug: string) => publishedProjects.find((p) => p.slug === slug);

export type GalleryCategory = 'portails' | 'garde-corps' | 'escaliers' | 'structures' | 'sur-mesure' | 'autres';

export const galleryCategories: { slug: GalleryCategory | 'tous'; label: string }[] = [
  { slug: 'tous', label: 'Tout voir' },
  { slug: 'portails', label: 'Portails et portes' },
  { slug: 'garde-corps', label: 'Garde-corps et rampes' },
  { slug: 'escaliers', label: 'Escaliers métalliques' },
  { slug: 'structures', label: 'Structures métalliques' },
  { slug: 'sur-mesure', label: 'Fabrication sur mesure' },
  { slug: 'autres', label: 'Autres' },
];

/** Galerie d'INSPIRATION : visuels illustratifs, pas des chantiers de l'entreprise. */
export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: ImageKey;
  span?: 'tall' | 'wide';
}
