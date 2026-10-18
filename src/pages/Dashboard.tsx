// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Dashboard.module.css';
import {
  HeartIcon,
  ShoppingBagIcon,
  ScaleIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, reservations, favorites, removeFavorite, compareList, toggleCompare, clearCompare, fetchUserReservations, logout } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'favorites' | 'compare'>('overview');

  useEffect(() => {
    fetchUserReservations();
  }, [fetchUserReservations]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ─── Sidebar ─── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.profileInfo}>
                <div className={styles.avatar}>
                  {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ICE'}
                </div>
                <h2 className={styles.userName}>{user.full_name}</h2>
                <p className={styles.userEmail}>{user.email}</p>
                <span className={styles.statusBadge}>{user.is_admin ? 'Compte Admin' : 'Client Privilège'}</span>
              </div>

              <nav className={styles.nav}>
                {[
                  { id: 'overview', label: 'Vue d’ensemble', icon: SparklesIcon, badge: null },
                  { id: 'reservations', label: 'Mes Réservations', icon: ShoppingBagIcon, badge: reservations.length },
                  { id: 'favorites', label: 'Favoris', icon: HeartIcon, badge: favorites.length },
                  { id: 'compare', label: 'Comparateur', icon: ScaleIcon, badge: compareList.length },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`}
                    >
                      <div className={styles.navIconWrapper}>
                        <Icon style={{ width: '1.2rem', height: '1.2rem' }} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && item.badge > 0 && (
                        <span className={`${styles.badge} ${isActive ? styles.badgeActive : styles.badgeInactive}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className={styles.divider} />

                <button onClick={handleLogout} className={`${styles.navBtn} ${styles.logoutBtn}`}>
                  <div className={styles.navIconWrapper}>
                    <ArrowRightOnRectangleIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                    <span>Déconnexion</span>
                  </div>
                </button>
              </nav>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <main className={styles.main}>
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <div className={styles.header}>
                    <h1 className={styles.title}>Bienvenue, {user.full_name?.split(' ')[0]}</h1>
                    <p className={styles.subtitle}>Suivez l'avancement de vos dossiers d'importation.</p>
                  </div>

                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <p className={styles.statLabel}>Réservations</p>
                      <div className={styles.statValue}>{reservations.length}</div>
                      <p className={styles.statDesc}>Véhicules bloqués en Chine</p>
                    </div>
                    <div className={styles.statCard}>
                      <p className={styles.statLabel}>Favoris</p>
                      <div className={styles.statValue} style={{ color: 'var(--accent)' }}>{favorites.length}</div>
                      <p className={styles.statDesc}>Modèles à surveiller</p>
                    </div>
                  </div>

                  {reservations.length > 0 ? (
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightHeader}>
                        <div>
                          <span className={styles.tag}>Dernière mise à jour</span>
                          <h3 className={styles.vehicleName}>{reservations[0].vehicleName}</h3>
                        </div>
                        <span className="badge-luxury">{reservations[0].status}</span>
                      </div>
                      <div className={styles.highlightFooter}>
                        <Link to="/tracking" className="btn-primary" style={{ fontSize: '0.8rem' }}>
                          <TruckIcon style={{ width: '1rem', marginRight: '0.5rem' }} /> Suivre mon conteneur
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyCard}>
                      <p>Vous n'avez pas encore de commande active.</p>
                      <Link to="/cars" className="btn-primary" style={{ marginTop: '1rem' }}>Voir le catalogue</Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reservations' && (
                <motion.div key="reservations" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className={styles.title}>Mes Commandes</h2>
                  <div className={styles.resList}>
                    {reservations.map(res => (
                      <div key={res.id} className={styles.resItem}>
                        <div className={styles.resInfo}>
                          <p className={styles.resName}>{res.vehicleName}</p>
                          <p className={styles.resMeta}>Port: {res.destinationPort} • Payé: {res.amount.toLocaleString()} FCFA</p>
                        </div>
                        <span className={styles.statusPill}>{res.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
