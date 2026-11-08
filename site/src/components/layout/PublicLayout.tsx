import { Outlet } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFab } from './WhatsAppFab';
import { SmoothScroll } from './SmoothScroll';

export function PublicLayout() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Header />
      <main id="main" className="relative">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </MotionConfig>
  );
}
