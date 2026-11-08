-- =============================================================================
-- ARC MASTER SOUDURE — Schéma PostgreSQL / Supabase & Politiques RLS
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. PROFILES (Administrateurs avec rôles SUPER_ADMIN / ADMIN)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null default 'ADMIN' check (role in ('SUPER_ADMIN', 'ADMIN')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fonction utilitaire de vérification de rôle admin (côté serveur)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('SUPER_ADMIN', 'ADMIN')
  );
$$;

-- 2. SERVICES (8 catégories administrables)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  cover_image text,
  is_active boolean not null default true,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. PROJECTS (Réalisations réelles de l'entreprise)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.services(id) on delete set null,
  category_slug text not null default 'autres',
  description text not null,
  location text,
  cover_image text not null,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  completion_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. PROJECT_IMAGES (Galerie multi-photos par projet)
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- 5. QUOTE_REQUESTS (Demandes de devis clients)
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  phone text not null check (char_length(trim(phone)) >= 8),
  email text,
  service_id uuid references public.services(id) on delete set null,
  service_slug text,
  project_description text not null check (char_length(trim(project_description)) >= 10),
  location text not null,
  estimated_budget text,
  desired_deadline text,
  status text not null default 'NEW' check (status in ('NEW', 'PENDING', 'IN_PROGRESS', 'SENT', 'ACCEPTED', 'REFUSED', 'CLOSED')),
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quote_requests_status on public.quote_requests(status);
create index if not exists idx_quote_requests_created_at on public.quote_requests(created_at desc);

-- 6. QUOTE_ATTACHMENTS (Pièces jointes privées des demandes de devis)
create table if not exists public.quote_attachments (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

-- 7. TESTIMONIALS (Témoignages vérifiés uniquement)
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  content text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 8. COMPANY_SETTINGS (Paramètres centralisés de l'entreprise)
create table if not exists public.company_settings (
  id integer primary key default 1 check (id = 1),
  company_name text not null default 'ARC MASTER SOUDURE',
  phone text not null default '+229 01 97 78 59 92',
  whatsapp text not null default '2290197785992',
  email text,
  address text,
  maps_url text not null default 'https://www.google.com/maps/place/?q=place_id:ChIJtSnmnBBVIxARLgVfBzpx7vg',
  opening_hours jsonb,
  about_text text,
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_attachments enable row level security;
alter table public.testimonials enable row level security;
alter table public.company_settings enable row level security;

-- Lecture publique uniquement sur les contenus publiés / actifs
create policy "Public read active services" on public.services
  for select using (is_active = true or public.is_admin());

create policy "Public read published projects" on public.projects
  for select using (is_published = true or public.is_admin());

create policy "Public read project images" on public.project_images
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and (p.is_published = true or public.is_admin())
    )
  );

create policy "Public read published testimonials" on public.testimonials
  for select using (is_published = true or public.is_admin());

create policy "Public read company settings" on public.company_settings
  for select using (true);

-- Soumission anonyme de devis autorisée, mais AUCUNE lecture publique des devis d'autres clients
create policy "Visitors can insert quote requests" on public.quote_requests
  for insert with check (status = 'NEW');

create policy "Only admins can read or update quote requests" on public.quote_requests
  for all using (public.is_admin());

create policy "Visitors can attach files to quotes" on public.quote_attachments
  for insert with check (true);

create policy "Only admins can read quote attachments" on public.quote_attachments
  for select using (public.is_admin());

-- Gestion complète réservée aux administrateurs
create policy "Admins manage profiles" on public.profiles
  for all using (public.is_admin());

create policy "Admins manage services" on public.services
  for all using (public.is_admin());

create policy "Admins manage projects" on public.projects
  for all using (public.is_admin());

create policy "Admins manage project images" on public.project_images
  for all using (public.is_admin());

create policy "Admins manage testimonials" on public.testimonials
  for all using (public.is_admin());

create policy "Admins manage company settings" on public.company_settings
  for all using (public.is_admin());

-- =============================================================================
-- SUPABASE STORAGE BUCKETS
-- =============================================================================
insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('service-images', 'service-images', true),
  ('company-assets', 'company-assets', true),
  ('quote-attachments', 'quote-attachments', false)
on conflict (id) do nothing;

