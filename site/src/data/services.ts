import type { LucideIcon } from 'lucide-react';
import { DoorOpen, Building2, Footprints, Warehouse, Flame, Armchair, Factory, Wrench } from 'lucide-react';
import { img, type ImageKey } from './images';

/**
 * Catalogue des services (équivalent de la future table `services`).
 * Les textes sont des propositions éditoriales génériques, à valider par l'entreprise.
 */
export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string[];
  examples: string[];
  icon: LucideIcon;
  cover: ImageKey;
  gallery: ImageKey[];
  isActive: boolean;
  displayOrder: number;
}

const all: Service[] = [
  {
    id: 'svc-portails',
    slug: 'portails-portes-metalliques',
    title: 'Portails et portes métalliques',
    shortDescription: 'Portails battants ou coulissants, portes et portillons fabriqués sur mesure.',
    description: [
      "Le portail est la première image de votre propriété. Nous concevons et fabriquons des portails et portes métalliques adaptés à vos dimensions, à votre niveau de sécurité souhaité et au style de votre bâtiment.",
      'Chaque ouvrage est étudié avec vous : choix du modèle, des profilés, du remplissage et de la finition, pour un résultat robuste et soigné.',
    ],
    examples: ['Portails battants', 'Portails coulissants', 'Portes de sécurité', 'Portillons', 'Grilles de protection', 'Clôtures métalliques'],
    icon: DoorOpen,
    cover: 'gate',
    gallery: ['gate', 'gate2', 'weldClose'],
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'svc-construction',
    slug: 'construction-metallique',
    title: 'Construction métallique',
    shortDescription: 'Ossatures, abris, mezzanines et ouvrages en acier pour particuliers et entreprises.',
    description: [
      "La construction métallique permet de réaliser des ouvrages solides, rapides à mettre en œuvre et durables. Nous accompagnons vos projets d'ossatures, d'abris, d'auvents ou d'extensions en acier.",
      "De l'étude des besoins à la pose, chaque élément est fabriqué et assemblé avec précision.",
    ],
    examples: ['Ossatures acier', 'Abris et auvents', 'Mezzanines', 'Extensions', 'Préaux', 'Structures sur mesure'],
    icon: Building2,
    cover: 'structure',
    gallery: ['structure', 'roof', 'industrial'],
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'svc-escaliers',
    slug: 'escaliers-garde-corps',
    title: 'Escaliers et garde-corps',
    shortDescription: 'Escaliers droits ou hélicoïdaux, rampes et garde-corps sécurisés et élégants.',
    description: [
      'Un escalier métallique allie solidité et légèreté visuelle. Nous fabriquons des escaliers, rampes et garde-corps qui sécurisent vos espaces tout en valorisant votre intérieur ou votre façade.',
      'Les dimensions, le dessin et la finition sont adaptés à votre bâtiment.',
    ],
    examples: ['Escaliers droits', 'Escaliers hélicoïdaux', 'Garde-corps de balcon', 'Rampes', "Mains courantes", 'Passerelles'],
    icon: Footprints,
    cover: 'stairs',
    gallery: ['stairs', 'railing'],
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'svc-charpentes',
    slug: 'charpentes-metalliques',
    title: 'Charpentes métalliques',
    shortDescription: 'Charpentes et toitures acier pour hangars, entrepôts, bâtiments et préaux.',
    description: [
      "Les charpentes métalliques offrent de grandes portées et une excellente tenue dans le temps. Nous réalisons des charpentes pour hangars, entrepôts, ateliers, bâtiments commerciaux ou résidentiels.",
      'Fabrication des fermes, pannes et contreventements, assemblage et pose sur site.',
    ],
    examples: ['Hangars', 'Entrepôts', 'Ateliers', 'Toitures', 'Préaux', 'Fermes et pannes'],
    icon: Warehouse,
    cover: 'roof',
    gallery: ['roof', 'structure'],
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'svc-soudure',
    slug: 'soudure-reparation',
    title: 'Soudure et réparation',
    shortDescription: 'Travaux de soudure, renforcement et réparation de pièces et ouvrages métalliques.',
    description: [
      'Un ouvrage abîmé, une pièce cassée, une structure à renforcer ? Nous intervenons pour la soudure, la réparation et la remise en état de vos éléments métalliques.',
      "L'objectif : prolonger la durée de vie de vos équipements avec des assemblages fiables.",
    ],
    examples: ['Soudure à l’arc', 'Réparation de portails', 'Renforcement de structures', 'Remise en état', 'Assemblages', 'Interventions sur site'],
    icon: Flame,
    cover: 'weldAction',
    gallery: ['weldAction', 'weldClose', 'weldDetail'],
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'svc-mobilier',
    slug: 'mobilier-metallique',
    title: 'Mobilier métallique',
    shortDescription: 'Tables, étagères, rayonnages et mobilier industriel fabriqués sur mesure.',
    description: [
      "Le métal permet de créer un mobilier robuste et au design affirmé. Nous fabriquons tables, étagères, rayonnages, piètements et mobilier pour la maison, les commerces ou les bureaux.",
      'Dimensions, finitions et associations de matériaux sont définies selon votre projet.',
    ],
    examples: ['Tables et piètements', 'Étagères', 'Rayonnages', 'Mobilier de commerce', 'Mobilier de bureau', 'Pièces décoratives'],
    icon: Armchair,
    cover: 'furniture',
    gallery: ['furniture'],
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 'svc-industriel',
    slug: 'travaux-industriels',
    title: 'Travaux industriels',
    shortDescription: 'Fabrication et maintenance d’ouvrages métalliques pour sites professionnels.',
    description: [
      "Pour les entreprises et sites professionnels, nous réalisons des travaux de fabrication, d'installation et de maintenance d'éléments métalliques : supports, châssis, passerelles, structures techniques.",
      'Nous nous adaptons aux contraintes de votre activité et de votre site.',
    ],
    examples: ['Châssis et supports', 'Passerelles techniques', 'Plateformes', 'Maintenance', 'Cuves et supports', 'Structures techniques'],
    icon: Factory,
    cover: 'industrial',
    gallery: ['industrial', 'workshop', 'structure'],
    isActive: true,
    displayOrder: 7,
  },
  {
    id: 'svc-autres',
    slug: 'autres-prestations',
    title: 'Autres prestations',
    shortDescription: 'Un projet spécifique ? Parlons-en : nous étudions toute demande en métallerie.',
    description: [
      "Votre besoin ne figure pas dans la liste ? Présentez-nous votre projet : nous étudions chaque demande de fabrication ou d'intervention en métallerie et soudure.",
      'Envoyez une description, des dimensions ou des photos : nous revenons vers vous rapidement.',
    ],
    examples: ['Fabrication sur mesure', 'Pièces spécifiques', 'Aménagements', 'Conseil technique'],
    icon: Wrench,
    cover: 'workshop',
    gallery: ['workshop', 'team'],
    isActive: true,
    displayOrder: 8,
  },
];

export const services = all.filter((s) => s.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceImage = (s: Service) => img[s.cover];
