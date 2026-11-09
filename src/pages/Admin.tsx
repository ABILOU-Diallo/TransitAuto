// src/pages/Admin.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import styles from './Admin.module.css';
import {
  ChartBarIcon,
  TruckIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import AdminOverview from './admin/AdminOverview';
import AdminVehicles from './admin/AdminVehicles';
import AdminOrders from './admin/AdminOrders';
import AdminClients from './admin/AdminClients';
import AdminReviews from './admin/AdminReviews';
import AdminContacts from './admin/AdminContacts';

type AdminTab = 'overview' | 'vehicles' | 'orders' | 'clients' | 'reviews' | 'contacts' | 'settings';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useStore();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'vehicles', label: 'Stock Véhicules', icon: TruckIcon },
    { id: 'orders', label: 'Commandes & Fret', icon: ShoppingBagIcon },
    { id: 'clients', label: 'Clients', icon: UserGroupIcon },
    { id: 'reviews', label: 'Avis Clients', icon: ChatBubbleLeftRightIcon },
    { id: 'contacts', label: 'Messages', icon: EnvelopeIcon },
    { id: 'settings', label: 'Paramètres', icon: Cog6ToothIcon },
  ];

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className={styles.adminLayout}>
      {/* ─── Backdrop sombre pour écran mobile ─── */}
      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Barre latérale (Sidebar) ─── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.adminLogo}>ICE ADMIN</div>
          <button
            className={styles.closeSidebarBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <XMarkIcon className={styles.navIcon} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id as AdminTab)}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
            >
              <item.icon className={styles.navIcon} />
              <span>{item.label}</span>
              {activeTab === item.id && <motion.div layoutId="activeNav" className={styles.activeIndicator} />}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfile}>
            <div className={styles.adminAvatar}>{user?.full_name?.charAt(0) || 'A'}</div>
            <div style={{ overflow: 'hidden' }}>
              <p className={styles.adminName}>{user?.full_name || 'Admin ICE'}</p>
              <p className={styles.adminRole}>Administrateur</p>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            <ArrowLeftOnRectangleIcon className={styles.navIcon} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ─── Zone principale ─── */}
      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuToggleBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu de navigation"
            >
              <Bars3Icon className={styles.navIcon} />
            </button>
            <div className={styles.headerTitle}>
              {menuItems.find(item => item.id === activeTab)?.label}
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.headerDateBadge}>
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </div>
            <button className={styles.notifBtn} aria-label="Notifications">
              <BellIcon className={styles.navIcon} />
              <span className={styles.notifBadge}>!</span>
            </button>
          </div>
        </header>

        <div className={styles.scrollArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'overview' && <AdminOverview />}
              {activeTab === 'vehicles' && <AdminVehicles />}
              {activeTab === 'orders' && <AdminOrders />}
              {activeTab === 'clients' && <AdminClients />}
              {activeTab === 'reviews' && <AdminReviews />}
              {activeTab === 'contacts' && <AdminContacts />}
              {activeTab === 'settings' && (
                <div className={styles.dashboardCard} style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <Cog6ToothIcon style={{ width: '3rem', margin: '0 auto 1rem', color: '#94a3b8' }} />
                  <h3 className={styles.bold} style={{ fontSize: '1.25rem' }}>Paramètres du Système</h3>
                  <p className={styles.muted} style={{ marginTop: '0.5rem' }}>Configuration de l'API Supabase, Stripe et CinetPay en cours d'optimisation.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
