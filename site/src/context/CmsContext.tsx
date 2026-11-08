import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { company as defaultCompany, type CompanySettings } from '@/config/company';
import { services as defaultServices, type Service } from '@/data/services';
import { projects as defaultProjects, type GalleryCategory, type Project } from '@/data/projects';
import { galleryItems as defaultGallery, img, type ImageKey } from '@/data/images';
import { supabase } from '@/lib/supabase';
import {
  generateQuoteReference,
  quoteStatusLabels,
  type QuoteAttachmentRecord,
  type QuoteRequestRecord,
  type QuoteStatus,
} from '@/lib/quotes';

export type { QuoteStatus, QuoteAttachmentRecord, QuoteRequestRecord };
export { quoteStatusLabels, generateQuoteReference };

export interface TestimonialRecord {
  id: string;
  clientName: string;
  roleOrCity?: string;
  content: string;
  rating: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminUserRecord {
  id: string;
  fullName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  createdAt: string;
}

export interface MediaAssetRecord {
  id: string;
  key: string;
  title: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  isIllustration: boolean;
  createdAt: string;
}

export interface ServiceItem extends Omit<Service, 'cover'> {
  cover: ImageKey;
  customCoverUrl?: string;
}

interface CmsState {
  company: CompanySettings & { aboutText: string };
  services: ServiceItem[];
  projects: Project[];
  quotes: QuoteRequestRecord[];
  testimonials: TestimonialRecord[];
  media: MediaAssetRecord[];
  users: AdminUserRecord[];
}

interface CmsContextValue extends CmsState {
  activeServices: ServiceItem[];
  publishedProjects: Project[];
  publishedTestimonials: TestimonialRecord[];
  getServiceBySlug: (slug: string) => ServiceItem | undefined;
  getServiceImageSrc: (s: ServiceItem) => { src: string; alt: string; w: number; h: number };
  updateCompany: (patch: Partial<CmsState['company']>) => Promise<void>;
  upsertService: (svc: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  reorderService: (id: string, dir: -1 | 1) => Promise<void>;
  upsertProject: (proj: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  submitQuoteRequest: (
    input: Omit<QuoteRequestRecord, 'id' | 'reference' | 'status' | 'internalNotes' | 'createdAt' | 'updatedAt'>,
  ) => Promise<QuoteRequestRecord>;
  updateQuoteStatus: (id: string, status: QuoteStatus, internalNotes?: string) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  upsertTestimonial: (t: TestimonialRecord) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addMedia: (m: Omit<MediaAssetRecord, 'id' | 'createdAt'>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  upsertAdminUser: (u: AdminUserRecord) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'arc_master_soudure_cms_v2';

const initialMedia: MediaAssetRecord[] = defaultGallery.map((g, idx) => ({
  id: g.id,
  key: g.image,
  title: g.title,
  src: img[g.image].src,
  alt: img[g.image].alt,
  category: g.category,
  isIllustration: true,
  createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
}));

const initialState: CmsState = {
  company: {
    ...defaultCompany,
    aboutText:
      "ARC MASTER SOUDURE accompagne les particuliers, architectes et entreprises à Cotonou et dans tout le Bénin pour la conception, la fabrication en atelier et la pose d'ouvrages métalliques durables.",
  },
  services: defaultServices,
  projects: defaultProjects,
  quotes: [],
  testimonials: [],
  media: initialMedia,
  users: [
    {
      id: 'usr-1',
      fullName: 'Direction ARC MASTER SOUDURE',
      email: 'admin@arcmastersoudure.bj',
      role: 'SUPER_ADMIN',
      createdAt: new Date().toISOString(),
    },
  ],
};

function loadState(): CmsState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    // Réhydrater les icônes Lucide pour les services depuis defaultServices
    const iconMap = new Map(defaultServices.map((s) => [s.id, s.icon]));
    const fallbackIcon = defaultServices[0].icon;
    const services = (
      Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : initialState.services
    ).map((s) => ({
      ...s,
      icon: iconMap.get(s.id) ?? fallbackIcon,
    }));
    const media =
      Array.isArray(parsed.media) && parsed.media.length > 0 ? parsed.media : initialState.media;

    return {
      company: { ...initialState.company, ...(parsed.company ?? {}) },
      services,
      projects: parsed.projects ?? initialState.projects,
      quotes: parsed.quotes ?? initialState.quotes,
      testimonials: parsed.testimonials ?? initialState.testimonials,
      media,
      users: parsed.users ?? initialState.users,
    };
  } catch {
    return initialState;
  }
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(loadState);

  useEffect(() => {
    try {
      const serializable = {
        ...state,
        services: state.services.map(({ icon: _icon, ...rest }) => rest),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const activeServices = useMemo(
    () => state.services.filter((s) => s.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
    [state.services],
  );

  const publishedProjects = useMemo(() => state.projects.filter((p) => p.isPublished), [state.projects]);

  const publishedTestimonials = useMemo(() => state.testimonials.filter((t) => t.isPublished), [state.testimonials]);

  const getServiceBySlug = useCallback(
    (slug: string) => state.services.find((s) => s.slug === slug),
    [state.services],
  );

  const getServiceImageSrc = useCallback((s: ServiceItem) => {
    if (s.customCoverUrl) {
      return { src: s.customCoverUrl, alt: s.title, w: 1200, h: 900 };
    }
    return img[s.cover] ?? img.hero;
  }, []);

  const updateCompany = useCallback(async (patch: Partial<CmsState['company']>) => {
    setState((prev) => ({ ...prev, company: { ...prev.company, ...patch } }));
    if (supabase) {
      await supabase
        .from('company_settings')
        .upsert({
          id: 1,
          company_name: patch.companyName,
          phone: patch.phoneDisplay,
          whatsapp: patch.whatsapp,
          email: patch.email,
          address: patch.address,
          maps_url: patch.mapsUrl,
          about_text: patch.aboutText,
          updated_at: new Date().toISOString(),
        })
        .select();
    }
  }, []);

  const upsertService = useCallback(async (svc: ServiceItem) => {
    setState((prev) => {
      const exists = prev.services.some((s) => s.id === svc.id);
      const services = exists ? prev.services.map((s) => (s.id === svc.id ? svc : s)) : [...prev.services, svc];
      return { ...prev, services };
    });
  }, []);

  const deleteService = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
  }, []);

  const reorderService = useCallback(async (id: string, dir: -1 | 1) => {
    setState((prev) => {
      const sorted = [...prev.services].sort((a, b) => a.displayOrder - b.displayOrder);
      const idx = sorted.findIndex((s) => s.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[target];
      const next = sorted.map((s) => {
        if (s.id === a.id) return { ...s, displayOrder: b.displayOrder };
        if (s.id === b.id) return { ...s, displayOrder: a.displayOrder };
        return s;
      });
      return { ...prev, services: next };
    });
  }, []);

  const upsertProject = useCallback(async (proj: Project) => {
    setState((prev) => {
      const exists = prev.projects.some((p) => p.id === proj.id);
      const projects = exists ? prev.projects.map((p) => (p.id === proj.id ? proj : p)) : [proj, ...prev.projects];
      return { ...prev, projects };
    });
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  }, []);

  const submitQuoteRequest = useCallback(
    async (
      input: Omit<QuoteRequestRecord, 'id' | 'reference' | 'status' | 'internalNotes' | 'createdAt' | 'updatedAt'>,
    ): Promise<QuoteRequestRecord> => {
      const now = new Date().toISOString();
      const reference = generateQuoteReference();
      const record: QuoteRequestRecord = {
        ...input,
        id: `q-${Date.now()}`,
        reference,
        status: 'NEW',
        internalNotes: '',
        createdAt: now,
        updatedAt: now,
      };

      if (supabase) {
        try {
          await supabase.from('quote_requests').insert({
            reference: record.reference,
            full_name: record.fullName,
            phone: record.phone,
            email: record.email || null,
            service_slug: record.serviceSlug,
            project_description: record.projectDescription,
            location: record.location,
            estimated_budget: record.estimatedBudget || null,
            desired_deadline: record.desiredDeadline || null,
            status: 'NEW',
          });
        } catch {
          // En cas d'absence de table distante configurée, la sauvegarde locale prend le relais sans perte
        }
      }

      setState((prev) => ({ ...prev, quotes: [record, ...prev.quotes] }));
      return record;
    },
    [],
  );

  const updateQuoteStatus = useCallback(async (id: string, status: QuoteStatus, internalNotes?: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      quotes: prev.quotes.map((q) =>
        q.id === id
          ? { ...q, status, internalNotes: internalNotes !== undefined ? internalNotes : q.internalNotes, updatedAt: now }
          : q,
      ),
    }));
    if (supabase) {
      try {
        await supabase
          .from('quote_requests')
          .update({ status, internal_notes: internalNotes, updated_at: now })
          .eq('id', id);
      } catch {
        // fallback local
      }
    }
  }, []);

  const deleteQuote = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, quotes: prev.quotes.filter((q) => q.id !== id) }));
  }, []);

  const upsertTestimonial = useCallback(async (t: TestimonialRecord) => {
    setState((prev) => {
      const exists = prev.testimonials.some((x) => x.id === t.id);
      const testimonials = exists ? prev.testimonials.map((x) => (x.id === t.id ? t : x)) : [t, ...prev.testimonials];
      return { ...prev, testimonials };
    });
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, testimonials: prev.testimonials.filter((t) => t.id !== id) }));
  }, []);

  const addMedia = useCallback(async (m: Omit<MediaAssetRecord, 'id' | 'createdAt'>) => {
    const item: MediaAssetRecord = {
      ...m,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, media: [item, ...prev.media] }));
  }, []);

  const deleteMedia = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, media: prev.media.filter((m) => m.id !== id) }));
  }, []);

  const upsertAdminUser = useCallback(async (u: AdminUserRecord) => {
    setState((prev) => {
      const exists = prev.users.some((x) => x.id === u.id);
      const users = exists ? prev.users.map((x) => (x.id === u.id ? u : x)) : [...prev.users, u];
      return { ...prev, users };
    });
  }, []);

  const deleteAdminUser = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, users: prev.users.filter((u) => u.id !== id) }));
  }, []);

  const resetToDefaults = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  const value = useMemo<CmsContextValue>(
    () => ({
      ...state,
      activeServices,
      publishedProjects,
      publishedTestimonials,
      getServiceBySlug,
      getServiceImageSrc,
      updateCompany,
      upsertService,
      deleteService,
      reorderService,
      upsertProject,
      deleteProject,
      submitQuoteRequest,
      updateQuoteStatus,
      deleteQuote,
      upsertTestimonial,
      deleteTestimonial,
      addMedia,
      deleteMedia,
      upsertAdminUser,
      deleteAdminUser,
      resetToDefaults,
    }),
    [
      state,
      activeServices,
      publishedProjects,
      publishedTestimonials,
      getServiceBySlug,
      getServiceImageSrc,
      updateCompany,
      upsertService,
      deleteService,
      reorderService,
      upsertProject,
      deleteProject,
      submitQuoteRequest,
      updateQuoteStatus,
      deleteQuote,
      upsertTestimonial,
      deleteTestimonial,
      addMedia,
      deleteMedia,
      upsertAdminUser,
      deleteAdminUser,
      resetToDefaults,
    ],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used inside <CmsProvider>');
  return ctx;
}

