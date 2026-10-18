// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
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

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.adminLogo}>ICE ADMIN</div>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
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
            <div className={styles.adminAvatar}>{user?.full_name?.charAt(0)}</div>
            <div>
              <p className={styles.adminName}>{user?.full_name}</p>
              <p className={styles.adminRole}>Administrateur</p>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            <ArrowLeftOnRectangleIcon className={styles.navIcon} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerTitle}>
            {menuItems.find(item => item.id === activeTab)?.label}
          </div>
          <div className={styles.headerActions}>
            <button className={styles.notifBtn}>
              <BellIcon className={styles.navIcon} />
              <span className={styles.notifBadge}>!</span>
            </button>
          </div>
        </header>

        <div className={styles.scrollArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <AdminOverview />}
              {activeTab === 'vehicles' && <AdminVehicles />}
              {activeTab === 'orders' && <AdminOrders />}
              {activeTab === 'clients' && <AdminClients />}
              {activeTab === 'reviews' && <AdminReviews />}
              {activeTab === 'contacts' && <AdminContacts />}
              {activeTab === 'settings' && <div className={styles.placeholder}>Configuration système...</div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
