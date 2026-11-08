# ARC MASTER SOUDURE — Site Web & Back-office Professionnel

> Plateforme web haut de gamme, moderne et immersive pour **ARC MASTER SOUDURE**, entreprise spécialisée en soudure et construction métallique à Cotonou (Bénin).

---

## 🏗️ À propos du projet

Ce site vitrine et applicatif a été conçu selon les standards des agences internationales spécialisées dans l'industrie et le design contemporain :
- **Direction artistique :** *Industrial Premium* en **Light Mode exclusif** (fonds blancs et brume claire, bleu nuit profond, touches cuivrées / braises incandescentes).
- **Immersion visuelle :** Motion design 3D fluide, effets d'étincelles subtiles sur Canvas 2D, interactions magnétiques sur les boutons et cartes avec profondeur 3D (tilt).
- **Orientation conversion :** Formulaire de demande de devis sur mesure avec génération de référence unique et relais direct vers **WhatsApp**.
- **Gestion de contenu (CMS) :** Back-office intégré pour gérer les demandes de devis, les projets, les prestations, les témoignages vérifiés et la médiathèque.

---

## 🛠️ Stack Technique

- **Frontend :** React 19, TypeScript, Vite
- **Styling :** Tailwind CSS v4, polices autohébergées (*Space Grotesk* & *Inter*)
- **Animations & Motion :** Framer Motion, GSAP (ScrollTrigger), Lenis Smooth Scroll
- **Expérience 3D :** Three.js, React Three Fiber (`@react-three/fiber`), Drei
- **Backend & Base de données :** Supabase (PostgreSQL + Row Level Security + Storage) avec mode autonome local (localStorage réhydraté)
- **Icônes :** Lucide React

---

## 📍 Informations sur l'entreprise

- **Nom :** ARC MASTER SOUDURE
- **Secteur :** Soudure & Construction métallique
- **Localisation :** Cotonou, Bénin
- **Téléphone / WhatsApp :** `+229 01 97 78 59 92`
- **Fiche Google Maps :** [Consulter l'emplacement](https://www.google.com/maps/place/?q=place_id:ChIJtSnmnBBVIxARLgVfBzpx7vg)

---

## 🚀 Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- Git

### Installation & Lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/ChristopheAnderson/ARC-MASTER-SOUDURE.git
cd ARC-MASTER-SOUDURE/site

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev
```

L'application est accessible par défaut sur `http://localhost:5173/`.

### Construction pour la production

```bash
npm run build
```

Les fichiers statiques optimisés sont générés dans `site/dist/`.

---

## 📂 Structure du projet

```
ARC-MASTER-SOUDURE/
├── Images/                     # Fichiers sources d'illustration de haute qualité
├── site/                       # Application React / Vite
│   ├── public/                 # Favicon, robots.txt, sitemap.xml, images optimisées
│   ├── scripts/                # Scripts utilitaires (optimisation d'images Sharp)
│   └── src/
│       ├── components/
│       │   ├── effects/        # Toiles Canvas 2D (étincelles et braises animées)
│       │   ├── home/           # Sections dédiées de la page d'accueil
│       │   ├── layout/         # Header, Footer, Menu mobile, SmoothScroll, FAB WhatsApp
│       │   ├── shared/         # Cartes de service, PageHero, Visionneuse Lightbox, Map Google
│       │   ├── three/          # Scène 3D d'assemblage métallique (Three.js / R3F)
│       │   └── ui/             # Boutons magnétiques, Reveal, Logo, SEO, TiltCard
│       ├── config/             # Paramètres entreprise, navigation et liens
│       ├── context/            # CmsContext (gestion d'état centralisée & persistance)
│       ├── data/               # Contenus initiaux (services, réalisations, catégories)
│       ├── lib/                # Client Supabase, formatage WhatsApp, utilitaires
│       └── pages/              # Pages publiques et suite d'administration (Back-office)
└── README.md
```

---

## 🔒 Back-Office Administrateur

Le back-office est accessible via la route `/admin/login`.
- **E-mail par défaut :** `admin@arcmastersoudure.bj`
- **Mot de passe démo :** `ArcMaster2026!` (configurable via `.env`)

---

## 📄 Licence

Tous droits réservés © ARC MASTER SOUDURE.
