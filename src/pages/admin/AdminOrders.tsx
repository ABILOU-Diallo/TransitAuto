// src/pages/admin/AdminOrders.tsx
import React, { useState } from 'react';
import { useStore, ReservationItem } from '@/store/useStore';
import {
  PencilSquareIcon,
  MapPinIcon,
  TruckIcon,
  PhoneIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../Admin.module.css';

const AdminOrders: React.FC = () => {
  const { adminOrders, updateAdminOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState<ReservationItem | null>(null);

  // États temporaires pour l'édition
  const [tempStatus, setTempStatus] = useState('');
  const [tempBL, setTempBL] = useState('');
  const [tempETA, setTempETA] = useState('');
  const [tempPort, setTempPort] = useState('');

  const statusOptions = ['En attente', 'Confirmée', 'En mer', 'Au port', 'Livrée', 'Annulée'];

  const filtered = adminOrders.filter(o =>
    o.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.clientName && o.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openEditModal = (order: ReservationItem) => {
    setEditingOrder(order);
    setTempStatus(order.status);
    setTempBL(order.blNumber || '');
    setTempETA(order.eta || '');
    setTempPort(order.destinationPort || 'Douala');
  };

  const handleSave = async () => {
    if (editingOrder) {
      await updateAdminOrderStatus(editingOrder.id, tempStatus, tempBL, tempETA, tempPort);
      setEditingOrder(null);
    }
  };

  return (
    <div className={styles.moduleContainer}>
      <header className={styles.moduleHeader}>
        <div>
          <h2 className={styles.tabTitle}>Commandes & Logistique</h2>
          <p className={styles.tabSubtitle}>Suivi des imports, BL maritimes et dates d'accostage.</p>
        </div>
        <button className={styles.iconBtn} style={{ width: 'auto', padding: '0.5rem 1rem', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <DocumentArrowDownIcon style={{ width: '1.1rem' }} />
          <span>Rapport PDF</span>
        </button>
      </header>

      <div className={styles.dashboardCard} style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div className={styles.headerSearch}>
          <MagnifyingGlassIcon style={{ width: '1.1rem', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par client, véhicule ou n° de dossier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Dossier</th>
              <th>Client / Contact</th>
              <th>Véhicule</th>
              <th>Logistique Portuaire</th>
              <th>Montant</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td><span className={styles.bold} style={{ fontFamily: 'monospace', color: '#64748b' }}>#{order.id.substring(0, 8)}</span></td>
                <td>
                  <p className={styles.bold}>{order.clientName || 'N/A'}</p>
                  <p className={styles.muted} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <PhoneIcon style={{ width: '0.8rem' }} /> {order.clientPhone || 'N/A'}
                  </p>
                </td>
                <td><p style={{ fontWeight: 600 }}>{order.vehicleName}</p></td>
                <td>
                  <div>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700 }}>
                      <MapPinIcon style={{ width: '0.9rem', color: 'var(--primary)' }} />
                      {order.destinationPort || 'Douala'}
                    </p>
                    <p className={styles.muted} style={{ fontSize: '0.7rem' }}>BL: {order.blNumber || 'En cours'}</p>
                  </div>
                </td>
                <td><span className={styles.bold}>{order.amount.toLocaleString()} FCFA</span></td>
                <td>
                  <span className={`${styles.statusBadge} ${order.status === 'Livrée' ? styles.statusPort : styles.statusTransit}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={styles.iconBtn} onClick={() => openEditModal(order)} title="Mettre à jour la logistique">
                    <PencilSquareIcon style={{ width: '1.1rem' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Modal d'Édition Logistique ─── */}
      <AnimatePresence>
        {editingOrder && (
          <div className={styles.modalOverlay} onClick={() => setEditingOrder(null)}>
            <motion.div
              className={styles.dashboardCard}
              style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 className={styles.bold}>Éditer le Dossier Logistique</h3>
                <button onClick={() => setEditingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <XMarkIcon style={{ width: '1.5rem' }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className={styles.muted} style={{ display: 'block', marginBottom: '0.5rem' }}>Statut de la commande</label>
                  <select value={tempStatus} onChange={e => setTempStatus(e.target.value)} className="input-premium">
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={styles.muted} style={{ display: 'block', marginBottom: '0.5rem' }}>N° Connaissement (Bill of Lading)</label>
                  <input type="text" value={tempBL} onChange={e => setTempBL(e.target.value)} className="input-premium" placeholder="Ex: COSCO-SH-DLA-123" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className={styles.muted} style={{ display: 'block', marginBottom: '0.5rem' }}>Port</label>
                    <input type="text" value={tempPort} onChange={e => setTempPort(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label className={styles.muted} style={{ display: 'block', marginBottom: '0.5rem' }}>ETA (Arrivée)</label>
                    <input type="text" value={tempETA} onChange={e => setTempETA(e.target.value)} className="input-premium" placeholder="Sous 20 jours" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => setEditingOrder(null)} className={styles.logoutBtn} style={{ background: '#f1f5f9', color: '#64748b' }}>Annuler</button>
                <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Enregistrer les modifications</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
