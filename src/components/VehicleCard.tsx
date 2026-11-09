// src/components/VehicleCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '@/types/Vehicle';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import styles from './VehicleCard.module.css';
import Watermark from './Watermark';
import {
  MapPinIcon,
  UserGroupIcon,
  BoltIcon,
  HeartIcon as HeartOutline,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

interface Props {
  vehicle: Vehicle;
  onSelect?: (id: string) => void;
}

const badgeColors: Record<string, string> = {
  Nouveau: '#10B981',
  Populaire: '#F59E0B',
  'Offre Spéciale': '#F43F5E',
  'Bateau en cours': '#0EA5E9',
};

const VehicleCard: React.FC<Props> = ({ vehicle, onSelect }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useStore();
  const favorite = isFavorite(vehicle.id);

  const handleClick = () => {
    if (onSelect) onSelect(vehicle.id);
    else navigate(`/cars/${vehicle.id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={handleClick}
      className={styles.card}
    >
      {/* Image avec Zoom Luxe */}
      <div className={styles.imageWrapper}>
        <img
          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay} />
        <Watermark fontSize={1.35} />

        {/* Badges flottants */}
        <div className={styles.badgeContainer}>
          {vehicle.badge && (
            <span
              className={styles.badge}
              style={{ backgroundColor: badgeColors[vehicle.badge] || 'var(--primary)' }}
            >
              {vehicle.badge}
            </span>
          )}
          <span className={styles.yearBadge}>
            {vehicle.year}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(vehicle); }}
          className={styles.favoriteBtn}
        >
          {favorite ? <HeartSolid style={{ width: '20px', height: '20px', color: '#F43F5E' }} /> : <HeartOutline style={{ width: '20px', height: '20px' }} />}
        </button>
      </div>

      {/* Contenu */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className={styles.infoRow}>
              <span className={styles.importBadge}>Import direct</span>
              <span className={styles.transmission}>{vehicle.transmission}</span>
            </div>
          </div>
          <div className={styles.boltIcon}>
             <BoltIcon style={{ width: '20px', height: '20px' }} />
          </div>
        </div>

        {/* Spécifications rapides */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <UserGroupIcon style={{ width: '16px', height: '16px', color: 'var(--neutral-400)', marginBottom: '4px' }} />
            <span className={styles.specLabel}>{vehicle.seats} Pl.</span>
          </div>
          <div className={styles.specItem}>
            <SparklesIcon style={{ width: '16px', height: '16px', color: 'var(--neutral-400)', marginBottom: '4px' }} />
            <span className={styles.specLabel}>{vehicle.fuel}</span>
          </div>
          <div className={styles.specItem}>
            <MapPinIcon style={{ width: '16px', height: '16px', color: 'var(--neutral-400)', marginBottom: '4px' }} />
            <span className={styles.specLabel}>{vehicle.status}</span>
          </div>
        </div>

        {/* Prix et CTA */}
        <div className={styles.footer}>
          <div>
            <p className={styles.priceLabel}>Clé en main port</p>
            <p className={styles.price}>
              {vehicle.totalPriceFCFA.toLocaleString('fr-FR')} <span className={styles.priceCurrency}>FCFA</span>
            </p>
          </div>
          <button className={styles.arrowBtn}>
            <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default VehicleCard;
