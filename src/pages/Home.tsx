// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabaseClient';
import VehicleCard from '@/components/VehicleCard';
import styles from './Home.module.css';
import {
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  VideoCameraIcon,
  MapPinIcon,
  CheckCircleIcon,
  StarIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { countries } from '@/lib/paymentProvider';
import { mockReviews } from '@/mocks/reviews';

const Home: React.FC = () => {
  const { fetchVehicles, vehicles, loading } = useStore();
  const { scrollY } = useScroll();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchVehicles();
    const fetchReviews = async () => {
      try {
        const { data } = await supabase.from('reviews').select('*').limit(3);
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(mockReviews.slice(0, 3));
        }
      } catch {
        setReviews(mockReviews.slice(0, 3));
      }
    };
    fetchReviews();
  }, [fetchVehicles]);

  const brands = ['BYD', 'Zeekr', 'Changan', 'Li Auto', 'Chery', 'Geely', 'Haval', 'NIO'];
  const stats = [
    { value: '1 200+', label: 'Véhicules livrés' },
    { value: '18-22j', label: 'Délai de mer' },
    { value: '-40%', label: 'Économie vs local' },
    { value: '98%', label: 'Satisfaction' },
  ];

  return (
    <div className="bg-brand-dark">
      {/* ─── HERO SECTION ─── */}
      <section className={styles.hero}>
        <div className={styles.mesh} />
        <div className={styles.heroContent}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge-luxury" style={{ marginBottom: '1rem' }}>
              <SparklesIcon style={{ width: '12px', marginRight: '0.5rem' }} />
              N°1 Import Automobile Chine → Afrique
            </span>
            <h1 className={styles.title}>L'EXCELLENCE <br /><span className="text-shine">SANS FRONTIÈRES</span></h1>
            <p className={styles.description}>Accédez aux marques les plus innovantes au prix direct usine. Transit sécurisé et dédouanement inclus.</p>
            <div className={styles.buttonGroup}>
              <Link to="/cars" className="btn-premium">Explorer le Catalogue</Link>
              <Link to="/tracking" className={styles.secondaryLink}>Suivi Conteneur (BL)</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{stat.value}</p>
              <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NOUVELLE SECTION : AVIS CLIENTS (TOUJOURS VISIBLE) ─── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge-luxury">Témoignages</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '1rem', color: 'var(--text-main)' }}>ILS NOUS FONT CONFIANCE</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {reviews.map((review) => {
              const country = countries.find(c => c.code === review.country_code);
              return (
                <div key={review.id} style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                      {review.user_name[0]}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800 }}>{review.user_name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{country?.flag} {country?.name}</p>
                    </div>
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1rem' }}>"{review.comment}"</p>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => <StarIcon key={i} style={{ width: '1rem' }} />)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
             <Link to="/reviews" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Lire tous les avis →</Link>
          </div>
        </div>
      </section>

      {/* ─── CATALOGUE PREVIEW ─── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>ARRIVAGES RÉCENTS</h2>
            <Link to="/cars" className="btn-primary">Tout voir</Link>
          </div>
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
            {vehicles.slice(0, 3).map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
