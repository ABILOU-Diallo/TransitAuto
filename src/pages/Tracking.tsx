// src/pages/Tracking.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Tracking.module.css';
import { supabase } from '@/lib/supabaseClient';
import {
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface TrackingData {
  bl: string;
  vehicleName: string;
  vesselName: string;
  carrier: string;
  departurePort: string;
  arrivalPort: string;
  departureDate: string;
  eta: string;
  currentLocation: string;
  containerNumber: string;
  currentStep: number;
}

const steps = [
  { id: 1, title: 'Prise en charge & Scellage', desc: 'Véhicule inspecté à Guangzhou et scellé dans conteneur 40ft' },
  { id: 2, title: 'Embarquement au port de départ', desc: 'Conteneur chargé à bord du porte-conteneurs et documents BL validés' },
  { id: 3, title: 'En mer (Traversée maritime)', desc: 'Navire en transit avec suivi satellite régulier' },
  { id: 4, title: 'Arrivée & Dédouanement portuaire', desc: 'Déchargement au quai et formalités douanières en cours' },
  { id: 5, title: 'Prêt pour enlèvement / Clés', desc: 'Quittance douanière délivrée, remise des clés au client' },
];

const Tracking: React.FC = () => {
  const [blInput, setBlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (blToSearch: string) => {
    const trimmed = blToSearch.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*, vehicles(brand, model)')
        .eq('bl_number', trimmed)
        .single();

      if (fetchError || !data) {
        setError("Aucune expédition trouvée pour ce numéro de connaissement (BL).");
        return;
      }

      // Determine current step based on status
      let currentStep = 1;
      if (data.status.includes('mer') || data.status.includes('transit')) currentStep = 3;
      if (data.status.includes('port') || data.status.includes('douane')) currentStep = 4;
      if (data.status.includes('Livre') || data.status.includes('Prêt')) currentStep = 5;

      setTrackingData({
        bl: data.bl_number,
        vehicleName: data.vehicles ? `${data.vehicles.brand} ${data.vehicles.model}` : 'Véhicule en cours d’importation',
        vesselName: 'PORTE-CONTENEUR INTERNATIONAL',
        carrier: 'Ligne Maritime Partenaire',
        departurePort: 'Port de Nansha, Guangzhou (Chine)',
        arrivalPort: `Port de ${data.destination_port || 'Destination'}`,
        departureDate: new Date(data.created_at).toLocaleDateString('fr-FR'),
        eta: data.eta || 'À confirmer',
        currentLocation: 'En cours de mise à jour satellite...',
        containerNumber: 'TTAU-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        currentStep: currentStep,
      });
    } catch (err) {
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '350px', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none' }} />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="badge-luxury"
              style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <SparklesIcon style={{ width: '1rem', height: '1rem' }} />
              <span>Suivi Satellite International</span>
            </motion.div>

            <h1 className={styles.heroTitle}>
              TRAÇABILITÉ <span className="text-shine">EN TEMPS RÉEL</span>
            </h1>

            <p className={styles.heroDesc}>
              Saisissez votre numéro de connaissement (Bill of Lading) pour localiser votre véhicule.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.searchSection}>
          <div className={styles.searchCard}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(blInput);
              }}
              className={styles.searchForm}
            >
              <div className={styles.inputWrapper}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Ex: COSCO-TA-99281..."
                  value={blInput}
                  onChange={(e) => setBlInput(e.target.value)}
                  required
                  className="input-premium"
                  style={{ paddingLeft: '3.5rem' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-premium"
                style={{ minWidth: '200px' }}
              >
                {loading ? (
                  <div style={{ width: '1.5rem', height: '1.5rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suivre le navire</span>
                )}
              </button>
            </form>

            {error && (
              <p style={{ color: '#F43F5E', fontSize: '0.875rem', marginTop: '1rem', fontWeight: 600 }}>{error}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {trackingData && (
              <motion.div
                key={trackingData.bl}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={styles.resultsArea}
              >
                <div className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)', marginBottom: '0.5rem', display: 'block' }}>Cargaison Confirmée</span>
                      <h2 className={styles.vehicleName}>
                        {trackingData.vehicleName}
                      </h2>
                      <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        N° BL : <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{trackingData.bl}</span>
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className={styles.etaLabel}>Arrivée estimée (ETA)</p>
                      <p className={styles.etaValue}>{trackingData.eta}</p>
                    </div>
                  </div>

                  <div className={styles.logisticsGrid}>
                    <div className={styles.logisticsItem}>
                      <span className={styles.itemLabel}>Port de départ</span>
                      <span className={styles.itemValue}>{trackingData.departurePort}</span>
                    </div>
                    <div className={styles.logisticsItem}>
                      <span className={styles.itemLabel}>Port d'arrivée</span>
                      <span className={styles.itemValue}>{trackingData.arrivalPort}</span>
                    </div>
                    <div className={styles.logisticsItem}>
                      <span className={styles.itemLabel}>Vaisseau & Ligne</span>
                      <span className={styles.itemValue}>{trackingData.vesselName}</span>
                    </div>
                    <div className={styles.logisticsItem}>
                      <span className={styles.itemLabel}>Position Actuelle</span>
                      <span className={styles.itemValue} style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '0.5rem', height: '0.5rem', background: '#10B981', borderRadius: '50%' }} />
                        {trackingData.currentLocation}
                      </span>
                    </div>
                  </div>

                  <div className={styles.timeline}>
                    <h3 className={styles.timelineTitle}>Étapes du Transit Maritime</h3>
                    <div className={styles.stepList}>
                      {steps.map((step) => {
                        const isDone = step.id < trackingData.currentStep;
                        const isCurrent = step.id === trackingData.currentStep;

                        return (
                          <div key={step.id} className={styles.stepItem}>
                            {step.id < steps.length && (
                              <div className={`${styles.stepLine} ${isDone ? styles.lineDone : styles.linePending}`} />
                            )}
                            <div className={`${styles.stepIcon} ${isDone ? styles.stepDone : isCurrent ? styles.stepCurrent : styles.stepPending}`}>
                              {isDone ? <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem' }} /> : step.id}
                            </div>
                            <div className={styles.stepContent}>
                              <div className={styles.stepHeader}>
                                <h4 className={styles.stepTitle} style={{ color: isCurrent ? 'var(--primary)' : isDone ? 'white' : 'var(--neutral-500)' }}>
                                  {step.title}
                                </h4>
                                {isCurrent && <span className="badge-luxury" style={{ padding: '0.25rem 0.5rem' }}>En Cours</span>}
                              </div>
                              <p className={styles.stepDesc}>{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.footerActions}>
                    <button className={styles.downloadBtn} onClick={() => alert('Génération du rapport en cours...')}>
                      <DocumentArrowDownIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                      Rapport SGS (PDF)
                    </button>
                    <a href="https://wa.me/33745636495" target="_blank" rel="noreferrer" className="btn-premium" style={{ padding: '1rem 2rem', fontSize: '10px' }}>
                      <ChatBubbleLeftRightIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                      Agent Logistique (+33 7 45 63 64 95)
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
