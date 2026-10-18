// src/pages/Catalogue.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import VehicleCard from '@/components/VehicleCard';
import styles from './Catalogue.module.css';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  SparklesIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const fuelFilters = ['Tous', 'Électrique', 'Hybrid', 'Essence', 'Diesel'];
const priceRanges = [
  { label: 'Tous budgets', min: 0, max: Infinity },
  { label: '< 18M FCFA', min: 0, max: 18000000 },
  { label: '18M - 25M FCFA', min: 18000000, max: 25000000 },
  { label: '> 25M FCFA', min: 25000000, max: Infinity },
];

const Catalogue: React.FC = () => {
  const { fetchVehicles, vehicles, loading, compareList, clearCompare } = useStore();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Toutes');
  const [selectedFuel, setSelectedFuel] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous les statuts');
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc'>('price-asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const brands = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.brand));
    return ['Toutes', ...Array.from(set)];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const matchesSearch =
          v.brand.toLowerCase().includes(search.toLowerCase()) ||
          v.model.toLowerCase().includes(search.toLowerCase()) ||
          (v.description && v.description.toLowerCase().includes(search.toLowerCase()));

        const matchesBrand = selectedBrand === 'Toutes' || v.brand === selectedBrand;
        const matchesFuel = selectedFuel === 'Tous' || v.fuel === selectedFuel;
        const matchesStatus = selectedStatus === 'Tous les statuts' || v.status === selectedStatus;
        const price = v.totalPriceFCFA;
        const currentRange = priceRanges[selectedPriceIdx];
        const matchesPrice = price >= currentRange.min && price <= currentRange.max;

        return matchesSearch && matchesBrand && matchesFuel && matchesStatus && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.totalPriceFCFA - b.totalPriceFCFA;
        if (sortBy === 'price-desc') return b.totalPriceFCFA - a.totalPriceFCFA;
        if (sortBy === 'year-desc') return b.year - a.year;
        return 0;
      });
  }, [vehicles, search, selectedBrand, selectedFuel, selectedStatus, selectedPriceIdx, sortBy]);

  const resetAllFilters = () => {
    setSearch('');
    setSelectedBrand('Toutes');
    setSelectedFuel('Tous');
    setSelectedStatus('Tous les statuts');
    setSelectedPriceIdx(0);
    setSortBy('price-asc');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedBrand !== 'Toutes' ||
    selectedFuel !== 'Tous' ||
    selectedStatus !== 'Tous les statuts' ||
    selectedPriceIdx !== 0;

  return (
    <div className={styles.page}>
      {/* ─── Hero Header ─── */}
      <section className={styles.hero}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '350px', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none' }} />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="badge-luxury"
              style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <SparklesIcon style={{ width: '1rem', height: '1rem' }} />
              <span>Catalogue Officiel IMPERIAL CHINA EXPORT</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.heroTitle}
            >
              Véhicules d'Élite <span className="text-shine">Importés de Chine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.heroDesc}
            >
              Électriques haute autonomie, hybrides ultra-économiques et SUV premiums. Prix direct usine, inspection SGS garantie et acheminement portuaire sécurisé.
            </motion.p>

            <div className={styles.statusBar}>
              <span className={styles.statusItem}>
                <span className={styles.dot} style={{ backgroundColor: '#34D399' }} />
                {vehicles.filter((v) => v.status === 'En Chine').length} Disponibles usine
              </span>
              <span className={styles.statusItem}>
                <span className={styles.dot} style={{ backgroundColor: '#38BDF8' }} />
                {vehicles.filter((v) => v.status === 'En transit').length} En traversée maritime
              </span>
              <span className={styles.statusItem}>
                <span className={styles.dot} style={{ backgroundColor: '#FBBF24' }} />
                {vehicles.filter((v) => v.status === 'Au port').length} Dédouanement en cours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Search & Primary Control Bar ─── */}
      <div className={styles.container}>
        <div className={styles.controlBarWrapper}>
          <div className={styles.controlBar}>
            <div className={styles.searchSortRow}>
              <div className={styles.searchBox}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Rechercher par modèle, marque..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer' }}
                  >
                    <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
                  </button>
                )}
              </div>

              <div className={styles.sortBox}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={styles.select}
                  >
                    <option value="price-asc">Prix : Croissant</option>
                    <option value="price-desc">Prix : Décroissant</option>
                    <option value="year-desc">Année : Plus récent</option>
                  </select>
                  <AdjustmentsHorizontalIcon style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--neutral-400)', pointerEvents: 'none' }} />
                </div>

                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`${styles.filterToggle} ${showMobileFilters ? styles.activeToggle : ''}`}
                >
                  <FunnelIcon style={{ width: '1rem', height: '1rem' }} />
                  <span>Filtres</span>
                </button>
              </div>
            </div>

            <div className={`${styles.detailedFilters} ${showMobileFilters ? '' : styles.hiddenMd}`}>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Marques :</span>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`${styles.chip} ${selectedBrand === b ? styles.chipActive : styles.chipInactive}`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Énergie :</span>
                  {fuelFilters.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => setSelectedFuel(fuel)}
                      className={`${styles.chip} ${selectedFuel === fuel ? styles.chipSecondary : styles.chipInactive}`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>

                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Budget :</span>
                  {priceRanges.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceIdx(idx)}
                      className={`${styles.chip} ${selectedPriceIdx === idx ? styles.chipDark : styles.chipInactive}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Vehicles Grid Section ─── */}
      <div className={styles.container} style={{ marginTop: '2.5rem' }}>
        <div className={styles.resultsHeader}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Résultats disponibles{' '}
              <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--neutral-500)' }}>
                ({filteredVehicles.length} véhicules)
              </span>
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-500)', cursor: 'pointer' }}
            >
              <ArrowPathIcon style={{ width: '1rem', height: '1rem' }} />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-premium" style={{ height: '420px' }} />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
              <MagnifyingGlassIcon style={{ width: '2rem', height: '2rem' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aucun véhicule trouvé</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Essayez d'ajuster vos filtres ou votre budget.
            </p>
            <button onClick={resetAllFilters} className="btn-primary">
              Afficher tout
            </button>
          </div>
        ) : (
          <motion.div layout className={styles.grid}>
            <AnimatePresence>
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  layout
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ─── Floating Compare Bar ─── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={styles.compareBar}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', marginLeft: '0.75rem' }}>
                {compareList.map((c, i) => (
                  <img
                    key={c.id}
                    src={c.images[0]}
                    alt={c.model}
                    style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.3)', marginLeft: i > 0 ? '-0.75rem' : 0 }}
                  />
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {compareList.length} véhicule{compareList.length > 1 ? 's' : ''} à comparer
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={clearCompare}
                style={{ background: 'none', border: 'none', color: 'var(--neutral-400)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Vider
              </button>
              <Link to="/dashboard" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                Comparer
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalogue;
