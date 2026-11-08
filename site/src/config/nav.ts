export interface NavItem {
  to: string;
  hash?: string;
  label: string;
}

export const navItems: NavItem[] = [
  { to: '/', hash: '#accueil', label: 'Accueil' },
  { to: '/a-propos', hash: '#a-propos', label: 'À propos' },
  { to: '/services', hash: '#services', label: 'Services' },
  { to: '/realisations', hash: '#realisations', label: 'Réalisations' },
  { to: '/expertise', hash: '#expertise', label: 'Expertise' },
  { to: '/contact', hash: '#contact', label: 'Contact' },
];

