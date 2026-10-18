// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '@/pages/Home';
import Catalogue from '@/pages/Catalogue';
import VehicleDetail from '@/pages/VehicleDetail';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import Tracking from '@/pages/Tracking';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import Reviews from '@/pages/Reviews';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageTransition from '@/components/PageTransition';

import { useStore } from '@/store/useStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    useStore.getState().fetchVehicles();
    useStore.getState().fetchUserSession();
    const unsubscribe = useStore.getState().subscribeVehiclesRealtime();
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container flex flex-col" style={{ minHeight: '100vh' }}>
      <ScrollToTop />

      {/* N'affiche la NavBar que si on n'est pas en admin */}
      {!isAdminPath && <NavBar />}

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ROUTES PUBLIQUES & CLIENTS */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/cars" element={<PageTransition><Catalogue /></PageTransition>} />
            <Route path="/cars/:id" element={<PageTransition><VehicleDetail /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/tracking" element={<PageTransition><Tracking /></PageTransition>} />
            <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ROUTE ADMIN (Layout totalement indépendant) */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* N'affiche le Footer que si on n'est pas en admin */}
      {!isAdminPath && (
        <>
          <Footer />
          <FloatingWhatsApp />
        </>
      )}
    </div>
  );
};

export default App;
