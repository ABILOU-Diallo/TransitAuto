// src/pages/admin/AdminClients.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  ShoppingBagIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import styles from '../Admin.module.css';

const AdminClients: React.FC = () => {
  const { adminClients, fetchAdminClients, deleteAdminClient } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminClients();
  }, [fetchAdminClients]);

  const filteredClients = adminClients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className={styles.moduleContainer}>
      <header className={styles.moduleHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className={styles.tabTitle}>Portefeuille Clients</h2>
          <p className={styles.tabSubtitle}>Gérez vos relations commerciales et suivez l'activité de vos importateurs.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
          <UserPlusIcon style={{ width: '1.2rem' }} />
          Nouveau Client
        </button>
      </header>

      <div className={styles.dashboardCard} style={{ marginBottom: '2.5rem', padding: '1rem' }}>
        <div className={styles.headerSearch}>
          <MagnifyingGlassIcon style={{ width: '1.1rem', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ville ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className={styles.clientsGrid}>
        {filteredClients.map((client) => (
          <div key={client.id} className={styles.clientCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className={styles.avatarLarge}>
                {client.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h3 className={styles.bold} style={{ fontSize: '1.1rem' }}>{client.fullName}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className={`${styles.statusBadge} ${client.status === 'VIP' ? styles.statusVIP : styles.statusActif}`}>
                    {client.status}
                  </span>
                  <span className={styles.muted} style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MapPinIcon style={{ width: '0.8rem' }} /> {client.city}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }} className="dark-bg-subtle">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <EnvelopeIcon style={{ width: '1rem', color: '#64748b' }} />
                <span style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <PhoneIcon style={{ width: '1rem', color: '#10b981' }} />
                <span style={{ fontWeight: 600 }}>{client.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className={styles.iconBtn} title="Contacter par WhatsApp">
                    <ChatBubbleBottomCenterTextIcon style={{ width: '1rem', color: '#10b981' }} />
                  </button>
                  <button className={styles.iconBtn} title="Voir l'historique d'achats">
                    <ShoppingBagIcon style={{ width: '1rem' }} />
                  </button>
               </div>
               <button
                  className={styles.iconBtn}
                  style={{ color: '#f43f5e', border: 'none' }}
                  onClick={() => window.confirm('Supprimer définitivement ce client ?') && deleteAdminClient(client.id)}
                >
                  <TrashIcon style={{ width: '1.1rem' }} />
                </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '20px' }}>
            <p className={styles.muted}>Aucun client trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;
