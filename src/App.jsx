import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/layout/Header';
import AdminBar from './components/admin/AdminBar';
import LoginPage from './components/admin/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import Hero from './components/sections/Hero';
import ProductGrid from './components/sections/ProductGrid';
import PromoSection from './components/sections/PromoSection';
import Keunggulan from './components/sections/Keunggulan';
import KreditSimulation from './components/sections/KreditSimulation';
import TestDrive from './components/sections/TestDrive';
import TradeIn from './components/sections/TradeIn';
import Testimoni from './components/sections/Testimoni';
import Berita from './components/sections/Berita';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import { FloatingWhatsApp, FloatingCallCenter, BackToTop } from './components/layout/FloatingContact';

function AppContent() {
  const { showDashboard, showLogin } = useAuth();

  if (showDashboard) {
    return (
      <>
        <AdminBar />
        <AdminDashboard />
      </>
    );
  }

  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminBar />
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <PromoSection />
        <Keunggulan />
        <KreditSimulation />
        <TestDrive />
        <TradeIn />
        <Testimoni />
        <Berita />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingCallCenter />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
