// src/pages/admin/AdminOverview.tsx
import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import styles from '../Admin.module.css';

const AdminOverview: React.FC = () => {
  const { vehicles, adminOrders, adminClients } = useStore();

  const totalStockValue = useMemo(() =>
    vehicles.reduce((acc, v) => acc + (v.totalPriceFCFA || 0), 0), [vehicles]);

  const activeOrders = adminOrders.filter(o => o.status !== 'Livrée' && o.status !== 'Annulée');

  const stats = [
    { label: 'Valeur du Stock', value: `${(totalStockValue / 1000000).toFixed(1)}M`, unit: 'FCFA', icon: CurrencyDollarIcon, color: '#0ea5e9' },
    { label: 'Commandes Actives', value: activeOrders.length, unit: 'dossiers', icon: ShoppingBagIcon, color: '#f59e0b' },
    { label: 'Clients Totaux', value: adminClients.length, unit: 'comptes', icon: UserGroupIcon, color: '#10b981' },
    { label: 'En Transit', value: vehicles.filter(v => v.status === 'En transit').length, unit: 'unités', icon: TruckIcon, color: '#8b5cf6' },
  ];

  return (
    <div className={styles.moduleContainer}>
      <header className={styles.moduleHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 className={styles.tabTitle}>Tableau de bord</h2>
          <p className={styles.tabSubtitle}>Aperçu global de l'activité d'Imperial China Export.</p>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '12px',
              backgroundColor: `${stat.color}10`,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1.25rem'
            }}>
              <stat.icon style={{ width: '1.5rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Dernières Commandes</h3>
            <button style={{ background: 'transparent', border: 'none', color: '#0ea5e9', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Voir tout</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {adminOrders.slice(0, 5).map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '12px', background: '#f8fafc' }}>
                <div>
                  <p className={styles.bold}>{order.clientName || 'Client'}</p>
                  <p className={styles.muted}>{order.vehicleName}</p>
                </div>
                <span className={`${styles.statusBadge} ${styles.statusChine}`} style={{ fontSize: '0.7rem' }}>{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Alertes Logistiques</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vehicles.filter(v => v.status === 'Au port').length > 0 ? (
              vehicles.filter(v => v.status === 'Au port').map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <p style={{ fontSize: '0.85rem' }}><strong>{v.brand} {v.model}</strong> est arrivé au port.</p>
                </div>
              ))
            ) : (
              <p className={styles.muted} style={{ textAlign: 'center', padding: '2rem' }}>Aucune alerte urgente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
