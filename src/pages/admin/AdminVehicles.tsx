// src/pages/admin/AdminVehicles.tsx
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import styles from '../Admin.module.css';

const AdminVehicles: React.FC = () => {
  const { vehicles, deleteVehicle } = useStore();
  const [searchTerm, setSearch] = useState('');

  const filtered = vehicles.filter(v =>
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.moduleContainer}>
      <header className={styles.moduleHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className={styles.tabTitle}>Gestion du Stock</h2>
          <p className={styles.tabSubtitle}>Administrez votre catalogue de véhicules et les disponibilités usine.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
          <PlusIcon style={{ width: '1.2rem' }} />
          Publier un véhicule
        </button>
      </header>

      <div className={styles.dashboardCard} style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div className={styles.headerSearch}>
          <MagnifyingGlassIcon style={{ width: '1.1rem', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher une marque, un modèle, un prix..."
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Véhicule & Détails</th>
              <th>Énergie / Modèle</th>
              <th>Prix Clé en Main</th>
              <th>Statut Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={v.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=150&q=80'}
                        alt={v.model}
                        className={styles.miniThumb}
                        style={{ width: '4.5rem', height: '3rem', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'white', borderRadius: '50%', padding: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex' }}>
                        <PhotoIcon style={{ width: '0.8rem', color: '#64748b' }} />
                      </div>
                    </div>
                    <div>
                      <p className={styles.bold} style={{ fontSize: '0.95rem' }}>{v.brand} {v.model}</p>
                      <p className={styles.muted} style={{ fontSize: '0.75rem' }}>{v.mileage.toLocaleString()} km parcourus</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v.fuel}</p>
                  <p className={styles.muted}>Année {v.year}</p>
                </td>
                <td>
                  <span className={styles.priceTag} style={{ fontSize: '1.05rem', fontWeight: 800 }}>{v.totalPriceFCFA.toLocaleString()} FCFA</span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${v.status === 'En Chine' ? styles.statusChine : v.status === 'Au port' ? styles.statusPort : styles.statusTransit}`}>
                    {v.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <a href={`/cars/${v.id}`} target="_blank" rel="noreferrer" className={styles.iconBtn} title="Voir en ligne">
                      <ArrowTopRightOnSquareIcon style={{ width: '1.1rem' }} />
                    </a>
                    <button className={styles.iconBtn} title="Modifier la fiche"><PencilSquareIcon style={{ width: '1.1rem' }} /></button>
                    <button
                      className={styles.iconBtn}
                      style={{ color: '#f43f5e' }}
                      title="Supprimer du stock"
                      onClick={() => window.confirm(`Voulez-vous vraiment supprimer le véhicule ${v.brand} ${v.model} ?`) && deleteVehicle(v.id)}
                    >
                      <TrashIcon style={{ width: '1.1rem' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                  Aucun véhicule ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVehicles;
