// src/pages/VehicleDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Vehicle } from '@/types/Vehicle';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './VehicleDetail.module.css';
import MobileMoneyCheckout from '@/components/MobileMoneyCheckout';
import {
  ShieldCheckIcon,
  TruckIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  VideoCameraIcon,
  MapPinIcon,
  BoltIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const portPricing: Record<string, { customsRate: number; days: string; portName: string }> = {
  Douala: { customsRate: 1.0, days: '18-22 jours', portName: 'Port Autonome de Douala (Cameroun)' },
  Abidjan: { customsRate: 1.05, days: '20-25 jours', portName: "Port Autonome d'Abidjan (Côte d'Ivoire)" },
  Dakar: { customsRate: 1.08, days: '22-26 jours', portName: 'Port Autonome de Dakar (Sénégal)' },
  Lomé: { customsRate: 0.98, days: '19-23 jours', portName: 'Port Autonome de Lomé (Togo)' },
  Libreville: { customsRate: 1.12, days: '25-30 jours', portName: "Port d'Owendo (Gabon)" },
  Cotonou: { customsRate: 1.02, days: '20-24 jours', portName: 'Port de Cotonou (Bénin)' },
};

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicles, fetchVehicles, user } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPort, setSelectedPort] = useState('Douala');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (vehicles.length === 0) fetchVehicles();
  }, [vehicles.length, fetchVehicles]);

  const vehicle = vehicles.find((v) => v.id === id) as Vehicle | undefined;

  if (!vehicle) {
    return (
      <div className={styles.notFound}>
        <MagnifyingGlassIcon style={{ width: '4rem', height: '4rem', color: 'var(--primary)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Véhicule introuvable</h2>
        <Link to="/cars" className="btn-premium">Retour au catalogue</Link>
      </div>
    );
  }

  const portConfig = portPricing[selectedPort] || portPricing.Douala;
  const totalPortFCFA = Math.round(vehicle.totalPriceFCFA * (portConfig.customsRate || 1));

  const galleryImages = vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className={styles.page}>
      <div className={styles.headerContainer}>
        <Link to="/cars" className={styles.backLink}>
          <ChevronLeftIcon style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          Retour au catalogue
        </Link>

        <div className={styles.titleRow}>
          <div className={styles.titleInfo}>
            <span className="badge-luxury" style={{ marginBottom: '1rem' }}>Certifié IMPERIAL CHINA EXPORT</span>
            <h1 className={styles.mainTitle}>
              {vehicle.brand} <span style={{ color: 'var(--primary)' }}>{vehicle.model}</span>
            </h1>
          </div>
          <div className={styles.priceCol}>
            <p className={styles.priceLabel}>Prix Estimé Port</p>
            <p className={styles.priceValue}>
              {totalPortFCFA.toLocaleString('fr-FR')} <span className={styles.priceUnit}>FCFA</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.mainImageWrapper}>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={galleryImages[selectedImage]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className={styles.mainImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </AnimatePresence>

            {galleryImages.length > 1 && (
              <div className={styles.navButtons}>
                <button onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : galleryImages.length - 1)} className={styles.navBtn}>
                  <ChevronLeftIcon style={{ width: '1.5rem' }} />
                </button>
                <button onClick={() => setSelectedImage(prev => prev < galleryImages.length - 1 ? prev + 1 : 0)} className={styles.navBtn}>
                  <ChevronRightIcon style={{ width: '1.5rem' }} />
                </button>
              </div>
            )}
          </div>

          <div className={styles.thumbnailRow}>
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`${styles.thumbBtn} ${selectedImage === idx ? styles.activeThumb : ''}`}
              >
                <img src={img} alt="Miniature" />
              </button>
            ))}
          </div>

          <div className={styles.descriptionSection}>
             <h2 className={styles.sectionTitle}>Description du véhicule</h2>
             <p className={styles.descriptionText}>{vehicle.description || "Aucune description détaillée disponible pour le moment."}</p>

             <div className={styles.specGrid}>
               <div className={styles.specItem}>
                 <BoltIcon className={styles.specIcon} />
                 <div>
                   <p className={styles.specLabel}>Énergie</p>
                   <p className={styles.specValue}>{vehicle.fuel}</p>
                 </div>
               </div>
               <div className={styles.specItem}>
                 <SparklesIcon className={styles.specIcon} />
                 <div>
                   <p className={styles.specLabel}>Année</p>
                   <p className={styles.specValue}>{vehicle.year}</p>
                 </div>
               </div>
               <div className={styles.specItem}>
                 <TruckIcon className={styles.specIcon} />
                 <div>
                   <p className={styles.specLabel}>Kilométrage</p>
                   <p className={styles.specValue}>{vehicle.mileage.toLocaleString()} km</p>
                 </div>
               </div>
               <div className={styles.specItem}>
                 <UserGroupIcon className={styles.specIcon} />
                 <div>
                   <p className={styles.specLabel}>Places</p>
                   <p className={styles.specValue}>{vehicle.seats} sièges</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.orderCard}>
            <h3 className={styles.cardTitle}>Livraison & Dédouanement</h3>

            <div className={styles.formGroup}>
              <label>Port de destination</label>
              <select
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                className="input-premium"
              >
                {Object.keys(portPricing).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className={styles.infoRow}>
              <MapPinIcon style={{ width: '1.2rem', color: 'var(--primary)' }} />
              <span>{portConfig.portName}</span>
            </div>
            <div className={styles.infoRow}>
              <TruckIcon style={{ width: '1.2rem', color: 'var(--primary)' }} />
              <span>Délai maritime : <strong>{portConfig.days}</strong></span>
            </div>

            <div className={styles.priceSummary}>
              <div className={styles.summaryRow}>
                <span>Prix véhicule (Chine)</span>
                <span>{vehicle.totalPriceFCFA.toLocaleString()} FCFA</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Frais port & douane ({selectedPort})</span>
                <span>{Math.round(totalPortFCFA - vehicle.totalPriceFCFA).toLocaleString()} FCFA</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total estimé</span>
                <span>{totalPortFCFA.toLocaleString()} FCFA</span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '1.2rem', marginTop: '1.5rem' }}
              onClick={() => setShowOrderModal(true)}
            >
              Réserver & Payer l'acompte
            </button>

            <p className={styles.securityNote}>
              <ShieldCheckIcon style={{ width: '1rem' }} />
              Paiement sécurisé. Véhicule inspecté avant départ.
            </p>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showOrderModal && (
          <div className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
            <motion.div
              className={styles.modalContent}
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button className={styles.closeBtn} onClick={() => setShowOrderModal(false)}>
                <XMarkIcon style={{ width: '1.5rem' }} />
              </button>

              {orderSuccess ? (
                <div className={styles.successState}>
                  <CheckCircleIcon style={{ width: '4rem', color: '#10B981', marginBottom: '1rem' }} />
                  <h2>Réservation Confirmée !</h2>
                  <p>Votre paiement a été validé. Nos agents en Chine préparent l'inspection vidéo.</p>
                  <Link to="/dashboard" className="btn-primary" style={{ marginTop: '2rem' }}>Voir mon suivi</Link>
                </div>
              ) : (
                <MobileMoneyCheckout
                  vehicleId={vehicle.id}
                  vehicleName={`${vehicle.brand} ${vehicle.model}`}
                  amount={totalPortFCFA}
                  userProfile={user || undefined}
                  onSuccess={() => setOrderSuccess(true)}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleDetail;
