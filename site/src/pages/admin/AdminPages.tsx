import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquareQuote,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  Wrench,
  ArrowUp,
  ArrowDown,
  MessageCircle,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Seo } from '@/components/ui/Seo';
import {
  quoteStatusLabels,
  useCms,
  type AdminUserRecord,
  type QuoteRequestRecord,
  type QuoteStatus,
  type ServiceItem,
  type TestimonialRecord,
} from '@/context/CmsContext';
import { galleryCategories, type GalleryCategory, type Project } from '@/data/projects';
import { img, type ImageKey } from '@/data/images';
import { isSupabaseEnabled, supabase } from '@/lib/supabase';
import { cn } from '@/lib/cn';

const AUTH_SESSION_KEY = 'arc_master_admin_session_v1';
const DEFAULT_ADMIN_PASS = import.meta.env.VITE_ADMIN_DEMO_PASSWORD || 'ArcMaster2026!';

interface SessionUser {
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

function getSession(): SessionUser | null {
  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

/* ===========================================================
   1. PAGE CONNEXION ADMIN (/admin/login)
   =========================================================== */
export function AdminLoginPage() {
  const navigate = useNavigate();
  const { users } = useCms();
  const [email, setEmail] = useState('admin@arcmastersoudure.bj');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (supabase) {
        const { data, error: supaErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!supaErr && data.user) {
          const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          window.sessionStorage.setItem(
            AUTH_SESSION_KEY,
            JSON.stringify({
              email: data.user.email ?? email,
              fullName: matched?.fullName ?? 'Administrateur',
              role: matched?.role ?? 'SUPER_ADMIN',
            }),
          );
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }

      // Authentification locale sécurisée (mode autonome ou démo)
      const matched = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (matched && password === DEFAULT_ADMIN_PASS) {
        window.sessionStorage.setItem(
          AUTH_SESSION_KEY,
          JSON.stringify({ email: matched.email, fullName: matched.fullName, role: matched.role }),
        );
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Connexion Administration" description="Accès réservé à l'administration ARC MASTER SOUDURE." noindex />
      <div className="grid min-h-screen place-items-center bg-mist px-4 py-12">
        <div className="w-full max-w-md rounded-xl3 border border-mist-2 bg-white p-8 shadow-lift sm:p-10">
          <div className="flex items-center justify-between">
            <Logo />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ember-soft px-3 py-1 text-xs font-semibold text-ember">
              <Lock className="h-3.5 w-3.5" /> Back-office
            </span>
          </div>

          <h1 className="mt-8 font-display text-2xl font-semibold text-navy-deep">Espace Administrateur</h1>
          <p className="mt-1 text-sm text-ink-soft">Connectez-vous pour gérer les services, réalisations et demandes de devis.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="adm-email" className="label">
                Adresse e-mail
              </label>
              <input
                id="adm-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="adm-pass" className="label">
                Mot de passe
              </label>
              <input
                id="adm-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="field"
              />
            </div>

            {error && <p className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-full bg-ember font-semibold text-white shadow-ember transition-colors hover:bg-ember-dark"
            >
              {loading ? 'Vérification...' : 'Se connecter au back-office'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-mist-2 bg-mist/60 p-4 text-xs text-ink-soft">
            <p className="font-semibold text-navy-deep">Accès initial (environnement local / pré-production) :</p>
            <p className="mt-1">
              E-mail : <code className="rounded bg-white px-1.5 py-0.5 text-navy-deep">admin@arcmastersoudure.bj</code>
            </p>
            <p className="mt-1">
              Mot de passe : <code className="rounded bg-white px-1.5 py-0.5 text-navy-deep">{DEFAULT_ADMIN_PASS}</code>
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@arcmastersoudure.bj');
                setPassword(DEFAULT_ADMIN_PASS);
              }}
              className="mt-2 font-semibold text-ember hover:underline"
            >
              Préremplir les identifiants
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-semibold text-ink-soft hover:text-ember">
              ← Retourner sur le site public
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===========================================================
   2. LAYOUT PROTÉGÉ DU BACK-OFFICE (/admin/*)
   =========================================================== */
const adminNav = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/admin/quotes', label: 'Demandes de devis', icon: FileText },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/projects', label: 'Réalisations', icon: FolderKanban },
  { to: '/admin/media', label: 'Médiathèque', icon: ImageIcon },
  { to: '/admin/testimonials', label: 'Témoignages', icon: MessageSquareQuote },
  { to: '/admin/settings', label: 'Paramètres', icon: Settings },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { quotes } = useCms();
  const session = getSession();

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: pathname }} />;
  }

  const newQuotesCount = quotes.filter((q) => q.status === 'NEW' || q.status === 'PENDING').length;

  const logout = async () => {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    if (supabase) await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <Seo title="Administration — ARC MASTER SOUDURE" description="Back-office de gestion." noindex />
      <div className="min-h-screen bg-mist text-ink lg:grid lg:grid-cols-[270px_1fr]">
        {/* Sidebar Light Mode inspirée du dashboard Symphony */}
        <aside className="flex flex-col justify-between border-b border-mist-2 bg-white p-6 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center justify-between">
              <Logo />
              <span className="rounded-full bg-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-deep">
                Admin
              </span>
            </div>

            <nav className="mt-8 space-y-1" aria-label="Menu administration">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-navy-deep text-white shadow-soft' : 'text-ink-soft hover:bg-mist hover:text-navy-deep',
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.to === '/admin/quotes' && newQuotesCount > 0 && (
                      <span className="rounded-full bg-ember px-2 py-0.5 text-[11px] font-bold text-white">{newQuotesCount}</span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 space-y-3 border-t border-mist-2 pt-5">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-navy-deep">{session.fullName}</p>
                <p className="text-ink-soft">{session.role}</p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  isSupabaseEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800',
                )}
              >
                {isSupabaseEnabled ? 'Supabase actif' : 'Mode local'}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                to="/"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-steel-light bg-white px-3 py-2 text-xs font-semibold text-navy-deep hover:border-ember"
              >
                Voir le site <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-mist px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-red-50 hover:text-red-600"
                title="Se déconnecter"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Zone principale */}
        <main className="p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function AdminHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-mist-2 pb-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-deep sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

/* ===========================================================
   3. TABLEAU DE BORD (/admin/dashboard)
   =========================================================== */
export function AdminDashboardPage() {
  const { quotes, services, projects, activeServices } = useCms();

  const total = quotes.length;
  const pending = quotes.filter((q) => q.status === 'NEW' || q.status === 'PENDING').length;
  const inProgress = quotes.filter((q) => q.status === 'IN_PROGRESS' || q.status === 'SENT').length;
  const accepted = quotes.filter((q) => q.status === 'ACCEPTED').length;
  const closed = quotes.filter((q) => q.status === 'CLOSED' || q.status === 'REFUSED').length;

  const byService = activeServices.map((s) => ({
    title: s.title,
    count: quotes.filter((q) => q.serviceSlug === s.slug).length,
  }));

  const kpis = [
    { label: 'Total demandes de devis', value: total, tone: 'text-navy-deep' },
    { label: 'En attente / Nouvelles', value: pending, tone: 'text-ember' },
    { label: 'En cours de traitement', value: inProgress, tone: 'text-sky-700' },
    { label: 'Devis acceptés', value: accepted, tone: 'text-emerald-700' },
    { label: 'Clôturés / Refusés', value: closed, tone: 'text-ink-soft' },
  ];

  return (
    <div>
      <AdminHeader
        title="Tableau de bord"
        subtitle="Vue synthétique de l'activité commerciale et des contenus d'ARC MASTER SOUDURE."
        action={
          <Link
            to="/admin/quotes"
            className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white shadow-ember"
          >
            Gérer les devis <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <span className="text-xs font-medium text-ink-soft">{k.label}</span>
            <p className={cn('mt-2 font-display text-3xl font-bold', k.tone)}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-deep">Dernières demandes reçues</h2>
            <Link to="/admin/quotes" className="text-xs font-semibold text-ember hover:underline">
              Tout voir →
            </Link>
          </div>
          {quotes.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-mist p-6 text-center text-sm text-ink-soft">
              Aucune demande de devis enregistrée pour le moment. Les soumissions du formulaire public apparaîtront ici en temps réel.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist-2 text-xs uppercase text-steel">
                    <th className="pb-3">Réf.</th>
                    <th className="pb-3">Prospect</th>
                    <th className="pb-3">Prestation</th>
                    <th className="pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-2">
                  {quotes.slice(0, 6).map((q) => (
                    <tr key={q.id}>
                      <td className="py-3 font-mono text-xs text-navy-deep">{q.reference}</td>
                      <td className="py-3">
                        <p className="font-semibold text-navy-deep">{q.fullName}</p>
                        <p className="text-xs text-ink-soft">{q.phone}</p>
                      </td>
                      <td className="py-3 text-ink-soft">{q.serviceTitle}</td>
                      <td className="py-3">
                        <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold', quoteStatusLabels[q.status].badge)}>
                          {quoteStatusLabels[q.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy-deep">Répartition par prestation</h2>
            <ul className="mt-4 space-y-3">
              {byService.map((row) => (
                <li key={row.title} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{row.title}</span>
                  <span className="rounded-full bg-mist px-2.5 py-0.5 font-display text-xs font-bold text-navy-deep">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy-deep">État du catalogue</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-2xl bg-mist p-4">
                <p className="font-display text-2xl font-bold text-navy-deep">
                  {services.filter((s) => s.isActive).length}/{services.length}
                </p>
                <p className="text-xs text-ink-soft">Services actifs</p>
              </div>
              <div className="rounded-2xl bg-mist p-4">
                <p className="font-display text-2xl font-bold text-navy-deep">
                  {projects.filter((p) => p.isPublished).length}
                </p>
                <p className="text-xs text-ink-soft">Projets publiés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   4. GESTION DES DEMANDES DE DEVIS (/admin/quotes)
   =========================================================== */
export function AdminQuotesPage() {
  const { quotes, updateQuoteStatus, deleteQuote } = useCms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<QuoteRequestRecord | null>(null);
  const [notes, setNotes] = useState('');

  const filtered = quotes.filter((q) => {
    const matchStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      q.reference.toLowerCase().includes(term) ||
      q.fullName.toLowerCase().includes(term) ||
      q.phone.toLowerCase().includes(term) ||
      q.serviceTitle.toLowerCase().includes(term) ||
      q.location.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const openQuote = (q: QuoteRequestRecord) => {
    setSelected(q);
    setNotes(q.internalNotes);
  };

  return (
    <div>
      <AdminHeader
        title="Demandes de devis"
        subtitle="Suivi commercial des prospects, statuts, pièces jointes et notes internes."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className=" absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par réf., nom, téléphone, lieu..."
            className="field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['ALL', 'NEW', 'PENDING', 'IN_PROGRESS', 'SENT', 'ACCEPTED', 'REFUSED', 'CLOSED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                statusFilter === st ? 'bg-navy-deep text-white' : 'bg-white text-ink-soft hover:bg-mist-2',
              )}
            >
              {st === 'ALL' ? 'Tous' : quoteStatusLabels[st].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card overflow-hidden lg:col-span-7">
          {filtered.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink-soft">Aucune demande ne correspond à vos critères.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist text-xs uppercase text-steel">
                  <tr>
                    <th className="px-4 py-3.5">Référence</th>
                    <th className="px-4 py-3.5">Prospect</th>
                    <th className="px-4 py-3.5">Prestation & Lieu</th>
                    <th className="px-4 py-3.5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-2">
                  {filtered.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => openQuote(q)}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-mist/70',
                        selected?.id === q.id && 'bg-ember-soft/40',
                      )}
                    >
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-navy-deep">{q.reference}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-navy-deep">{q.fullName}</p>
                        <p className="text-xs text-ink-soft">{q.phone}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-navy-deep">{q.serviceTitle}</p>
                        <p className="text-xs text-ink-soft">{q.location}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold', quoteStatusLabels[q.status].badge)}>
                          {quoteStatusLabels[q.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          {selected ? (
            <div className="card space-y-5 p-6">
              <div className="flex items-start justify-between gap-3 border-b border-mist-2 pb-4">
                <div>
                  <span className="font-mono text-xs font-semibold text-ember">{selected.reference}</span>
                  <h2 className="font-display text-xl font-semibold text-navy-deep">{selected.fullName}</h2>
                  <p className="text-xs text-ink-soft">Reçu le {new Date(selected.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Supprimer définitivement cette demande de devis ?')) {
                      deleteQuote(selected.id);
                      setSelected(null);
                    }
                  }}
                  className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-ink-soft">Téléphone</span>
                  <p className="font-semibold text-navy-deep">{selected.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-ink-soft">Localisation</span>
                  <p className="font-semibold text-navy-deep">{selected.location}</p>
                </div>
                <div>
                  <span className="text-xs text-ink-soft">Prestation</span>
                  <p className="font-semibold text-navy-deep">{selected.serviceTitle}</p>
                </div>
                <div>
                  <span className="text-xs text-ink-soft">Budget / Délai</span>
                  <p className="font-semibold text-navy-deep">
                    {selected.estimatedBudget || '—'} / {selected.desiredDeadline || '—'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-mist p-4 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-steel">Description du projet</span>
                <p className="mt-1.5 whitespace-pre-line text-navy-deep">{selected.projectDescription}</p>
              </div>

              {selected.attachments.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-steel">
                    Pièces jointes privées ({selected.attachments.length})
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2.5">
                    {selected.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.dataUrl}
                        download={att.fileName}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-mist-2 bg-mist"
                      >
                        {att.dataUrl && <img src={att.dataUrl} alt={att.fileName} className="h-full w-full object-cover" />}
                        <span className="absolute inset-x-0 bottom-0 truncate bg-navy-deep/80 px-2 py-1 text-[11px] text-white">
                          {att.fileName}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="label">Statut du dossier</label>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    const next = e.target.value as QuoteStatus;
                    updateQuoteStatus(selected.id, next, notes);
                    setSelected({ ...selected, status: next });
                  }}
                  className="field"
                >
                  {(Object.keys(quoteStatusLabels) as QuoteStatus[]).map((k) => (
                    <option key={k} value={k}>
                      {quoteStatusLabels[k].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Notes internes (privées)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Compte-rendu d'appel, chiffrage, relance..."
                  className="field"
                />
                <button
                  type="button"
                  onClick={() => updateQuoteStatus(selected.id, selected.status, notes)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-navy-deep px-4 py-2 text-xs font-semibold text-white hover:bg-navy"
                >
                  <Check className="h-3.5 w-3.5" /> Enregistrer les notes
                </button>
              </div>

              <div className="flex gap-2 border-t border-mist-2 pt-4">
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Bonjour ${selected.fullName}, suite à votre demande de devis ${selected.reference} chez ARC MASTER SOUDURE :`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1FAF54] px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> Répondre sur WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-sm text-ink-soft">
              Sélectionnez une demande dans la liste pour afficher les détails, les pièces jointes et modifier son statut.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   5. GESTION DES SERVICES (/admin/services)
   =========================================================== */
export function AdminServicesPage() {
  const { services, upsertService, reorderService } = useCms();
  const [editing, setEditing] = useState<ServiceItem | null>(null);

  const sorted = [...services].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <AdminHeader
        title="Gestion des services"
        subtitle="Activez, réordonnez ou modifiez les descriptions des 8 prestations d'ARC MASTER SOUDURE."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          {sorted.map((s, idx) => (
            <div key={s.id} className="card flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <img src={img[s.cover]?.src} alt={s.title} className="h-14 w-16 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-steel">0{idx + 1}</span>
                    <h3 className="font-display font-semibold text-navy-deep">{s.title}</h3>
                    {!s.isActive && (
                      <span className="rounded-full bg-mist-2 px-2 py-0.5 text-[10px] font-semibold text-ink-soft">Masqué</span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{s.shortDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => reorderService(s.id, -1)}
                  disabled={idx === 0}
                  className="rounded-lg p-1.5 text-ink-soft hover:bg-mist disabled:opacity-30"
                  title="Monter"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => reorderService(s.id, 1)}
                  disabled={idx === sorted.length - 1}
                  className="rounded-lg p-1.5 text-ink-soft hover:bg-mist disabled:opacity-30"
                  title="Descendre"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => upsertService({ ...s, isActive: !s.isActive })}
                  className="rounded-lg p-1.5 text-ink-soft hover:bg-mist"
                  title={s.isActive ? 'Désactiver' : 'Activer'}
                >
                  {s.isActive ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(s)}
                  className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-navy-deep hover:bg-ember hover:text-white"
                >
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                upsertService(editing);
                setEditing(null);
              }}
              className="card space-y-4 p-6"
            >
              <h2 className="font-display text-lg font-semibold text-navy-deep">Modifier : {editing.title}</h2>
              <div>
                <label className="label">Titre du service</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="field"
                />
              </div>
              <div>
                <label className="label">Résumé court</label>
                <input
                  type="text"
                  value={editing.shortDescription}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  className="field"
                />
              </div>
              <div>
                <label className="label">Description détaillée (paragraphes séparés par une ligne)</label>
                <textarea
                  rows={5}
                  value={editing.description.join('\n\n')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      description: e.target.value
                        .split(/\n\s*\n/)
                        .map((p) => p.trim())
                        .filter(Boolean),
                    })
                  }
                  className="field"
                />
              </div>
              <div>
                <label className="label">Exemples d'ouvrages (séparés par une virgule)</label>
                <input
                  type="text"
                  value={editing.examples.join(', ')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      examples: e.target.value
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  className="field"
                />
              </div>
              <div>
                <label className="label">Visuel de couverture</label>
                <select
                  value={editing.cover}
                  onChange={(e) => setEditing({ ...editing, cover: e.target.value as ImageKey })}
                  className="field"
                >
                  {(Object.keys(img) as ImageKey[]).map((k) => (
                    <option key={k} value={k}>
                      {k} — {img[k].alt.slice(0, 48)}...
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-steel-light px-4 py-2 text-xs font-semibold text-ink-soft"
                >
                  Annuler
                </button>
                <button type="submit" className="rounded-full bg-ember px-5 py-2 text-xs font-semibold text-white">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          ) : (
            <div className="card p-8 text-center text-sm text-ink-soft">
              Cliquez sur « Modifier » en face d'une prestation pour personnaliser son texte, ses exemples ou son image de couverture.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   6. GESTION DES RÉALISATIONS (/admin/projects)
   =========================================================== */
export function AdminProjectsPage() {
  const { projects, upsertProject, deleteProject } = useCms();
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState<GalleryCategory>('portails');
  const [location, setLocation] = useState('Cotonou');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<string>(img.gate.src);

  const onCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
    const proj: Project = {
      id: `proj-${Date.now()}`,
      slug,
      title: title.trim(),
      categorySlug,
      location: location.trim(),
      description: description.trim(),
      cover,
      images: [{ url: cover, alt: title.trim() }],
      isFeatured: true,
      isPublished: true,
    };
    upsertProject(proj);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <AdminHeader
        title="Gestion des réalisations"
        subtitle="Publiez les chantiers réels d'ARC MASTER SOUDURE dès qu'ils sont réceptionnés et photographiés."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {projects.length === 0 ? (
            <div className="card p-8 text-center text-sm text-ink-soft">
              Aucun chantier réel n'est encore publié (conformément à la règle de sincérité éditoriale). Utilisez le formulaire ci-contre
              pour ajouter vos réalisations confirmées.
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="card flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <img src={p.cover} alt={p.title} className="h-16 w-20 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-display font-semibold text-navy-deep">{p.title}</h3>
                    <p className="text-xs text-ember">{p.location}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{p.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => upsertProject({ ...p, isPublished: !p.isPublished })}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      p.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-mist-2 text-ink-soft',
                    )}
                  >
                    {p.isPublished ? 'Publié' : 'Brouillon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(p.id)}
                    className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={onCreate} className="card space-y-4 p-6 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-navy-deep">Ajouter une réalisation</h2>
          <div>
            <label className="label">Titre du projet *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. : Portail coulissant motorisable à Cotonou"
              className="field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Catégorie</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value as GalleryCategory)}
                className="field"
              >
                {galleryCategories
                  .filter((c) => c.slug !== 'tous')
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label">Lieu</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="field" />
            </div>
          </div>
          <div>
            <label className="label">Image (URL ou sélection bibliothèque)</label>
            <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Description des travaux réalisés</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dimensions, matériaux utilisés, finitions..."
              className="field"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember py-3 text-xs font-semibold text-white shadow-ember"
          >
            <Plus className="h-4 w-4" /> Publier la réalisation
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===========================================================
   7. MÉDIATHÈQUE (/admin/media)
   =========================================================== */
export function AdminMediaPage() {
  const { media, addMedia, deleteMedia } = useCms();
  const [title, setTitle] = useState('');
  const [src, setSrc] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('portails');
  const [isIllustration, setIsIllustration] = useState(true);

  const onAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !src.trim()) return;
    addMedia({
      key: `custom-${Date.now()}`,
      title: title.trim(),
      src: src.trim(),
      alt: title.trim(),
      category,
      isIllustration,
    });
    setTitle('');
    setSrc('');
  };

  return (
    <div>
      <AdminHeader
        title="Médiathèque"
        subtitle="Gérez les photographies de la galerie et remplacez progressivement les visuels d'illustration par vos photos."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {media.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img src={m.src} alt={m.alt} className="h-full w-full object-cover" />
                {m.isIllustration && <span className="badge-illus absolute left-3 top-3">Illustration</span>}
              </div>
              <div className="flex items-center justify-between gap-2 p-4">
                <div>
                  <p className="font-display text-sm font-semibold text-navy-deep">{m.title}</p>
                  <p className="text-xs text-ink-soft">{m.src}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMedia(m.id)}
                  className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                  title="Retirer de la galerie"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onAdd} className="card h-fit space-y-4 p-6 lg:col-span-4">
          <h2 className="font-display text-lg font-semibold text-navy-deep">Ajouter un visuel</h2>
          <div>
            <label className="label">Titre / Légende *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">URL de l'image *</label>
            <input
              type="text"
              required
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="/images/gate.webp ou https://..."
              className="field"
            />
          </div>
          <div>
            <label className="label">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className="field">
              {galleryCategories
                .filter((c) => c.slug !== 'tous')
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-ink">
            <input
              type="checkbox"
              checked={isIllustration}
              onChange={(e) => setIsIllustration(e.target.checked)}
              className="accent-ember"
            />
            Marquer comme « Visuel d'illustration »
          </label>
          <button type="submit" className="w-full rounded-full bg-ember py-3 text-xs font-semibold text-white">
            Ajouter à la galerie
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===========================================================
   8. TÉMOIGNAGES (/admin/testimonials)
   =========================================================== */
export function AdminTestimonialsPage() {
  const { testimonials, upsertTestimonial, deleteTestimonial } = useCms();
  const [clientName, setClientName] = useState('');
  const [roleOrCity, setRoleOrCity] = useState('Cotonou');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const onAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !content.trim()) return;
    const rec: TestimonialRecord = {
      id: `test-${Date.now()}`,
      clientName: clientName.trim(),
      roleOrCity: roleOrCity.trim(),
      content: content.trim(),
      rating,
      isPublished: true,
      createdAt: new Date().toISOString(),
    };
    upsertTestimonial(rec);
    setClientName('');
    setContent('');
  };

  return (
    <div>
      <AdminHeader
        title="Témoignages clients"
        subtitle="Publiez uniquement des avis clients réels et vérifiés. Lorsqu'aucun avis n'est publié, la section reste masquée sur le site public."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {testimonials.length === 0 ? (
            <div className="card p-8 text-center text-sm text-ink-soft">
              Aucun témoignage publié. Ajoutez un témoignage vérifié ci-contre pour activer automatiquement la section sur la page
              d'accueil.
            </div>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="card flex items-start justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-navy-deep">{t.clientName}</span>
                    <span className="text-xs text-ink-soft">({t.roleOrCity})</span>
                    <span className="flex text-ember">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-ember" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">« {t.content} »</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTestimonial(t.id)}
                  className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={onAdd} className="card h-fit space-y-4 p-6 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-navy-deep">Ajouter un témoignage vérifié</h2>
          <div>
            <label className="label">Nom du client / Entreprise *</label>
            <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} className="field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Ville ou fonction</label>
              <input type="text" value={roleOrCity} onChange={(e) => setRoleOrCity(e.target.value)} className="field" />
            </div>
            <div>
              <label className="label">Note (/5)</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="field">
                {[5, 4, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} étoiles
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Contenu du témoignage *</label>
            <textarea rows={3} required value={content} onChange={(e) => setContent(e.target.value)} className="field" />
          </div>
          <button type="submit" className="w-full rounded-full bg-ember py-3 text-xs font-semibold text-white">
            Publier le témoignage
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===========================================================
   9. PARAMÈTRES DE L'ENTREPRISE (/admin/settings)
   =========================================================== */
export function AdminSettingsPage() {
  const { company, updateCompany, resetToDefaults } = useCms();
  const [companyName, setCompanyName] = useState(company.companyName);
  const [phoneDisplay, setPhoneDisplay] = useState(company.phoneDisplay);
  const [whatsapp, setWhatsapp] = useState(company.whatsapp);
  const [email, setEmail] = useState(company.email ?? '');
  const [address, setAddress] = useState(company.address ?? '');
  const [mapsUrl, setMapsUrl] = useState(company.mapsUrl);
  const [aboutText, setAboutText] = useState(company.aboutText);
  const [saved, setSaved] = useState(false);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    await updateCompany({
      companyName: companyName.trim(),
      phoneDisplay: phoneDisplay.trim(),
      phoneE164: '+' + phoneDisplay.replace(/\D/g, ''),
      whatsapp: whatsapp.replace(/\D/g, ''),
      email: email.trim() || null,
      address: address.trim() || null,
      mapsUrl: mapsUrl.trim(),
      aboutText: aboutText.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <AdminHeader
        title="Paramètres & Coordonnées"
        subtitle="Centralisez le numéro WhatsApp, le téléphone, l'adresse et le texte de présentation d'ARC MASTER SOUDURE."
      />

      <form onSubmit={onSave} className="card max-w-3xl space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Nom de l'entreprise</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Téléphone affiché</label>
            <input type="text" value={phoneDisplay} onChange={(e) => setPhoneDisplay(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Numéro WhatsApp (chiffres avec indicatif)</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">E-mail officiel (laisser vide si non défini)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@..." className="field" />
          </div>
        </div>

        <div>
          <label className="label">Adresse précise à Cotonou (laisser vide si non confirmée)</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quartier, rue, repère à Cotonou..."
            className="field"
          />
        </div>

        <div>
          <label className="label">Lien Google Maps officiel</label>
          <input type="url" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} className="field" />
        </div>

        <div>
          <label className="label">Texte de présentation générale</label>
          <textarea rows={4} value={aboutText} onChange={(e) => setAboutText(e.target.value)} className="field" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mist-2 pt-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Réinitialiser toutes les données locales aux valeurs par défaut ?')) {
                resetToDefaults();
              }
            }}
            className="text-xs font-semibold text-ink-soft hover:text-red-600"
          >
            Réinitialiser les valeurs par défaut
          </button>

          <div className="flex items-center gap-3">
            {saved && <span className="text-xs font-semibold text-emerald-600">✓ Paramètres enregistrés</span>}
            <button type="submit" className="rounded-full bg-ember px-6 py-3 text-xs font-semibold text-white shadow-ember">
              Enregistrer les paramètres
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ===========================================================
   10. GESTION DES UTILISATEURS (/admin/users)
   =========================================================== */
export function AdminUsersPage() {
  const { users, upsertAdminUser, deleteAdminUser } = useCms();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN'>('ADMIN');

  const onAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    const u: AdminUserRecord = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      createdAt: new Date().toISOString(),
    };
    upsertAdminUser(u);
    setFullName('');
    setEmail('');
  };

  return (
    <div>
      <AdminHeader
        title="Administrateurs & Rôles"
        subtitle="Gérez les comptes autorisés (SUPER_ADMIN et ADMIN) pour l'administration de la plateforme."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          {users.map((u) => (
            <div key={u.id} className="card flex items-center justify-between p-5">
              <div className="flex items-center gap-3.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-deep text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display font-semibold text-navy-deep">{u.fullName}</p>
                  <p className="text-xs text-ink-soft">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-ember-soft px-3 py-1 text-xs font-bold text-ember-dark">{u.role}</span>
                {users.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteAdminUser(u.id)}
                    className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onAdd} className="card h-fit space-y-4 p-6 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-navy-deep">Autoriser un administrateur</h2>
          <div>
            <label className="label">Nom complet *</label>
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Adresse e-mail *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Rôle</label>
            <select value={role} onChange={(e) => setRole(e.target.value as 'SUPER_ADMIN' | 'ADMIN')} className="field">
              <option value="ADMIN">ADMIN (Gestion courante)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Accès complet)</option>
            </select>
          </div>
          <button type="submit" className="w-full rounded-full bg-ember py-3 text-xs font-semibold text-white">
            Ajouter le compte
          </button>
        </form>
      </div>
    </div>
  );
}

