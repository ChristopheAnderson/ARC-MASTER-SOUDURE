import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CmsProvider } from '@/context/CmsContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageLoader } from '@/components/ui/PageLoader';

// Pages publiques chargées directement pour une navigation instantanée (0 délai, aucune anomalie de chargement)
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import RealisationsPage from '@/pages/RealisationsPage';
import ExpertisePage from '@/pages/ExpertisePage';
import QuotePage from '@/pages/QuotePage';
import ContactPage from '@/pages/ContactPage';
import { MentionsLegalesPage, ConfidentialitePage, NotFoundPage } from '@/pages/LegalPages';

// Espace d'administration chargé à la demande
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminLayout = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminLayout })),
);
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminQuotesPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminQuotesPage })),
);
const AdminServicesPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminServicesPage })),
);
const AdminProjectsPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminProjectsPage })),
);
const AdminMediaPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminMediaPage })),
);
const AdminTestimonialsPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminTestimonialsPage })),
);
const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminSettingsPage })),
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminUsersPage })),
);

export function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <Routes>
          {/* Espace Public */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="realisations" element={<RealisationsPage />} />
            <Route path="projets" element={<Navigate to="/realisations" replace />} />
            <Route path="expertise" element={<ExpertisePage />} />
            <Route path="devis" element={<QuotePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="confidentialite" element={<ConfidentialitePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Espace Administration */}
          <Route
            path="admin/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminLoginPage />
              </Suspense>
            }
          />
          <Route
            path="admin"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="testimonials" element={<AdminTestimonialsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CmsProvider>
  );
}
export default App;
