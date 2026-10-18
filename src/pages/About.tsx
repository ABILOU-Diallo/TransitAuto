// src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import {
  GlobeAsiaAustraliaIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const milestones = [
  {
    year: '2020',
    title: 'Bureau à Guangzhou',
    desc: 'Implantation au cœur du Guangdong pour établir des accords directs avec les usines chinoises.',
  },
  {
    year: '2022',
    title: 'Hub Afrique Centrale',
    desc: 'Ouverture de l\'agence de Douala et accords de dédouanement préférentiels.',
  },
  {
    year: '2024',
    title: 'Expansion Électrique',
    desc: 'Certification pour l\'export de véhicules BYD, Zeekr et Li Auto avec support technique.',
  },
  {
    year: '2026',
    title: 'Leader Import',
    desc: 'Plus de 1 200 véhicules acheminés avec 98% de satisfaction client.',
  },
];

const team = [
  {
    name: 'Chen Wei',
    role: 'Dir. Logistique Asie',
    desc: '15 ans d\'expertise en affrètement maritime et relations usines chinoises.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Samuel Ebanda',
    role: 'Dir. Opérations Afrique',
    desc: 'Spécialiste de la fiscalité douanière et du transit portuaire en zone CEMAC.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Amina Diop',
    role: 'Qualité & Inspection',
    desc: 'Supervise les audits techniques 120 points et la conformité des batteries.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

const About: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* ─── Hero Section ─── */}
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
              <GlobeAsiaAustraliaIcon style={{ width: '1rem', height: '1rem' }} />
              <span>Notre Histoire & Mission</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.heroTitle}
            >
              Le Pont Automobile Direct <span className="text-shine">Chine - Afrique</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.heroDesc}
            >
              IMPERIAL CHINA EXPORT est né d'une ambition claire : démocratiser l'accès aux véhicules les plus innovants du monde en connectant directement les acheteurs africains aux meilleures usines de Chine.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ─── Story & Vision ─── */}
      <section className={styles.container}>
        <div className={styles.storySection}>
          <div className={styles.storyCard}>
            <div className={styles.storyGrid}>
              <div className={styles.storyText}>
                <span className="badge-luxury">Pourquoi IMPERIAL CHINA EXPORT ?</span>
                <h2 className={styles.sectionTitle}>
                  Supprimer les marges excessives des concessionnaires traditionnels
                </h2>
                <p className={styles.paragraph}>
                  Pendant des décennies, acheter une voiture neuve en Afrique signifiait payer jusqu'à deux fois le prix d'usine à cause d'une chaîne interminable de revendeurs.
                </p>
                <p className={styles.paragraph}>
                  Grâce à nos bureaux physiques basés à <strong>Guangzhou</strong> et nos représentations locales, nous négocions directement auprès des constructeurs.
                </p>

                <div className={styles.statsRow}>
                  <div>
                    <p className={styles.statValue}>1 200+</p>
                    <p className={styles.statLabel}>Véhicules livrés</p>
                  </div>
                  <div>
                    <p className={styles.statValue}>-40%</p>
                    <p className={styles.statLabel}>Économie moyenne</p>
                  </div>
                  <div>
                    <p className={styles.statValue} style={{ color: '#10B981' }}>98%</p>
                    <p className={styles.statLabel}>Satisfaction</p>
                  </div>
                </div>
              </div>

              <div className={styles.storyImageWrapper}>
                <div className={styles.imageContainer}>
                  <div className={styles.mainImage}>
                    <img
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80"
                      alt="Équipe IMPERIAL CHINA EXPORT"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.floatingBadge}>
                    <CheckBadgeIcon style={{ width: '2rem', height: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>Présence physique permanente en Chine et sur les ports africains.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className={styles.container}>
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <span className="badge-luxury" style={{ marginBottom: '1rem' }}>Historique</span>
          <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>Les grandes étapes de notre croissance</h2>
        </div>

        <div className={styles.milestoneGrid}>
          {milestones.map((m, idx) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={styles.milestoneCard}
            >
              <span className={styles.milestoneYear}>{m.year}</span>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{m.title}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', lineHeight: 1.6 }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Leadership Team ─── */}
      <section className={styles.container}>
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <span className="badge-luxury" style={{ marginBottom: '1rem' }}>Équipe Dirigeante</span>
          <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>Experts du commerce Asie - Afrique</h2>
        </div>

        <div className={styles.teamGrid}>
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={styles.teamCard}
            >
              <div className={styles.teamImageWrapper}>
                <img src={member.img} alt={member.name} className={styles.teamImage} />
              </div>
              <div className={styles.teamInfo}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{member.name}</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>{member.role}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', lineHeight: 1.6 }}>{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Call to action ─── */}
      <section className={styles.container} style={{ marginTop: '6rem' }}>
        <div className={styles.ctaSection}>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '42rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Envie de concrétiser votre projet d'importation ?
            </h2>
            <p style={{ opacity: 0.9, marginBottom: '2rem' }}>
              Consultez nos modèles disponibles ou échangez directement avec nos conseillers basés en Chine.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/cars" className={styles.btnWhite}>Explorer le catalogue</Link>
              <Link to="/contact" className={styles.btnOutline}>Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
