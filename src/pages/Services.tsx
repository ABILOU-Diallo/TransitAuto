// src/pages/Services.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import {
  TruckIcon,
  ClipboardDocumentCheckIcon,
  CheckBadgeIcon,
  CheckIcon,
  ChevronDownIcon,
  SparklesIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

const servicePillars = [
  {
    id: 'fret',
    title: 'Fret Maritime & Logistique Sécurisée',
    icon: TruckIcon,
    tag: 'Liaison Directe',
    shortDesc: 'Affrètement maritime spécialisé en RORO (Roll-on/Roll-off) ou conteneurs 40 pieds scellés depuis les ports de Guangzhou, Shanghai et Ningbo.',
    features: [
      'Conteneurs 40ft High Cube individuels ou partagés',
      'Liaisons maritimes régulières avec COSCO, CMA CGM et Maersk',
      'Assurance maritime tous risques tous dommages incluse (All Risks)',
      'Suivi satellite par numéro de connaissement (Bill of Lading - BL)',
    ],
    stats: { num: '18 à 25j', label: 'Délai moyen de transit' },
  },
  {
    id: 'inspection',
    title: 'Audit & Inspection Vidéo 120 Points',
    icon: VideoCameraIcon,
    tag: 'Zéro Mauvaise Surprise',
    shortDesc: 'Avant chaque embarquement, notre équipe d\'ingénieurs certifiés effectue un contrôle approfondi en usine ou en concession en Chine.',
    features: [
      'Contrôle complet de la batterie de traction et cycle de santé (SOH pour EV)',
      'Vérification châssis, carrosserie et mesure électronique de l\'épaisseur de peinture',
      'Rapport PDF complet de 20 pages avec 60 photos haute résolution',
      'Session d\'appel vidéo direct (WhatsApp / FaceTime) autour de votre véhicule',
    ],
    stats: { num: '120 points', label: 'Contrôlés rigoureusement' },
  },
  {
    id: 'douane',
    title: 'Dédouanement Clé en Main & Fiscalité',
    icon: ClipboardDocumentCheckIcon,
    tag: 'Sans Tracas',
    shortDesc: 'Nos déclarants en douane agréés prennent en charge l\'intégralité des formalités portuaires et vous remettent les documents officiels.',
    features: [
      'Calcul transparent des taxes douanières sans frais imprévus',
      'Traitement accéléré des déclarations sous 72h à l\'arrivée au quai',
      'Obtention de la quittance douanière officielle et immatriculation',
      'Option de livraison convoyée ou porte-char jusqu\'à votre domicile',
    ],
    stats: { num: '72h', label: 'Délai de dédouanement quai' },
  },
  {
    id: 'sav',
    title: 'Garantie Constructeur & Pièces de Rechange',
    icon: WrenchScrewdriverIcon,
    tag: 'Sérénité Durable',
    shortDesc: 'Un accompagnement post-livraison avec garantie pièces et main d\'œuvre, couplé à notre chaîne d\'approvisionnement express de pièces d\'origine.',
    features: [
      'Garantie mécanique et batterie jusqu\'à 2 ans ou 50 000 km',
      'Accès prioritaire aux pièces détachées d\'origine expédiées par avion sous 7 jours',
      'Réseau de garages et ateliers partenaires certifiés dans chaque capitale',
      'Support technique et diagnostic distant pour véhicules électriques chinois',
    ],
    stats: { num: '2 ans', label: 'Garantie pièces & batterie' },
  },
];

const steps = [
  {
    step: '01',
    title: 'Sélection & Devis',
    desc: 'Choisissez votre véhicule sur notre catalogue ou envoyez-nous le modèle de vos rêves avec vos options souhaitées.',
  },
  {
    step: '02',
    title: 'Acompte & Réservation',
    desc: 'Versement de l\'acompte de sécurité de 10% par virement bancaire local ou paiement en ligne sécurisé.',
  },
  {
    step: '03',
    title: 'Inspection en Chine',
    desc: 'Rapport d\'expertise 120 points + appel vidéo en direct depuis Guangzhou avant validation finale.',
  },
  {
    step: '04',
    title: 'Embarquement Maritime',
    desc: 'Chargement en conteneur sécurisé et émission de votre connaissement maritime officiel (Bill of Lading).',
  },
  {
    step: '05',
    title: 'Dédouanement & Clés',
    desc: 'Arrivée au port, formalités administratives et remise en mains propres de votre véhicule prêt à rouler.',
  },
];

const faqs = [
  {
    q: 'Comment s\'assurer de l\'état réel du véhicule avant le départ de Chine ?',
    a: 'Chaque véhicule fait l\'objet d\'un audit technique officiel par nos ingénieurs à Guangzhou. Vous recevez un rapport détaillé de 120 points, une inspection vidéo complète et vous pouvez assister à une démonstration en direct par visioconférence avant le chargement sur le navire.',
  },
  {
    q: 'Quels sont les modes de paiement acceptés pour l\'acompte et le solde ?',
    a: 'Nous proposons un échelonnement sécurisé en 3 tranches (10% à la réservation, 40% à l\'embarquement, 50% à l\'arrivée au port). Les paiements peuvent s\'effectuer par virement bancaire sur nos comptes partenaires en Afrique, en euros, en USD ou par carte bancaire sécurisée.',
  },
  {
    q: 'Que se passe-t-il en cas de dommage durant la traversée maritime ?',
    a: 'Tous nos chargements sont couverts par une assurance maritime internationale tous risques (All Risks Policy). En cas de moindre dommage ou incident en mer, la police d\'assurance indemnise à 100% la valeur du véhicule.',
  },
  {
    q: 'Comment sont gérées les pièces de rechange pour les voitures électriques chinoises (BYD, Zeekr...) ?',
    a: 'IMPERIAL CHINA EXPORT dispose d\'un canal d\'approvisionnement dédié en pièces détachées d\'origine en partenariat direct avec les constructeurs. Nous expédions les pièces de rechange par fret aérien express sous 5 à 7 jours vers vos villes.',
  },
];

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fret');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentService = servicePillars.find((s) => s.id === activeTab) || servicePillars[0];

  return (
    <div className={styles.page}>
      {/* ─── Header Hero ─── */}
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
              <span>Excellence Logistique Asie - Afrique</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.heroTitle}
            >
              Solutions Clés en Main <span className="text-shine">de Chine au Port</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.heroDesc}
            >
              Nous supprimons tous les intermédiaires coûteux et gérons la logistique internationale de A à Z. Votre seule tâche : choisir votre modèle et récupérer vos clés.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ─── 4 Pillars Interactive Tabs ─── */}
      <section className={styles.container}>
        <div className={styles.tabsSection}>
          <div className={styles.tabsCard}>
            {/* Tab Navigation */}
            <div className={styles.tabNav}>
              {servicePillars.map((service) => {
                const Icon = service.icon;
                const isActive = activeTab === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : styles.tabButtonInactive}`}
                  >
                    <Icon style={{ width: '1.75rem', height: '1.75rem', marginBottom: '0.75rem' }} />
                    <div>
                      <span className={styles.tabTag} style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }}>
                        {service.tag}
                      </span>
                      <span className={styles.tabTitle}>{service.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <motion.div
              key={currentService.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.tabContentGrid}
            >
              <div className={styles.tabMainText}>
                <span className="badge-luxury" style={{ marginBottom: '1rem' }}>{currentService.tag}</span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                  {currentService.title}
                </h2>
                <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {currentService.shortDesc}
                </p>

                <div className={styles.featureList}>
                  {currentService.features.map((feat, i) => (
                    <div key={i} className={styles.featureItem}>
                      <div className={styles.checkIcon}>
                        <CheckIcon style={{ width: '0.875rem', height: '0.875rem', strokeWidth: 3 }} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.statsCard}>
                <div>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Performance Garantie</p>
                  <div className={styles.statNumber}>
                    {currentService.stats.num}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                    {currentService.stats.label}
                  </p>
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Prêt à importer ?</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>Consultez les véhicules</p>
                  </div>
                  <Link to="/cars" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    Voir Catalogue
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Step by Step Process ─── */}
      <section className={styles.container} style={{ marginTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge-luxury" style={{ marginBottom: '0.75rem' }}>Parcours Client</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>
            De la commande à la livraison en <span className="text-shine">5 étapes simples</span>
          </h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Un cheminement transparent où vous suivez chaque étape en direct.
          </p>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={styles.stepCard}
            >
              <div>
                <div className={styles.stepNumber}>{s.step}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--primary)' }}>
                <span>Étape vérifiée</span>
                <CheckBadgeIcon style={{ width: '0.875rem', height: '0.875rem', marginLeft: '0.25rem' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Comparative Table ─── */}
      <section className={styles.container} style={{ marginTop: '6rem' }}>
        <div className={styles.tabsCard} style={{ padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge-luxury" style={{ marginBottom: '0.5rem' }}>Comparatif Marché</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Pourquoi choisir l'importation directe IMPERIAL CHINA EXPORT ?</h2>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Critères</th>
                  <th className={`${styles.th} ${styles.tdHighlight}`} style={{ color: 'var(--primary)', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
                    IMPERIAL CHINA EXPORT (Direct Chine)
                  </th>
                  <th className={styles.th}>Importateur traditionnel</th>
                  <th className={styles.th}>Concessionnaire local</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>Économie sur le prix</td>
                  <td className={`${styles.td} ${styles.tdHighlight}`} style={{ color: '#10B981' }}>30% à 45% moins cher</td>
                  <td className={styles.td}>10% à 15% (Intermédiaires)</td>
                  <td className={styles.td} style={{ color: '#F43F5E' }}>Prix catalogue majoré</td>
                </tr>
                <tr>
                  <td className={styles.td}>Transparence des coûts</td>
                  <td className={`${styles.td} ${styles.tdHighlight}`} style={{ color: '#10B981' }}>Devis tout inclus avant départ</td>
                  <td className={styles.td}>Surcoûts fréquents au port</td>
                  <td className={styles.td}>Prix fixe mais élevé</td>
                </tr>
                <tr>
                  <td className={styles.td}>Inspection & Audit vidéo</td>
                  <td className={`${styles.td} ${styles.tdHighlight}`} style={{ color: '#10B981' }}>120 points + appel live</td>
                  <td className={styles.td}>Quelques photos</td>
                  <td className={styles.td}>Véhicule en parc seulement</td>
                </tr>
                <tr>
                  <td className={styles.td}>Suivi du conteneur</td>
                  <td className={`${styles.td} ${styles.tdHighlight}`} style={{ color: '#10B981' }}>Suivi satellite en direct</td>
                  <td className={styles.td}>Mises à jour sporadiques</td>
                  <td className={styles.td}>Non applicable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={styles.faqContainer}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge-luxury" style={{ marginBottom: '0.5rem' }}>Foire Aux Questions</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Tout ce que vous devez savoir</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={styles.faqButton}
                >
                  <span>{faq.q}</span>
                  <ChevronDownIcon
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: 'var(--primary)',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.faqAnswer}
                    >
                      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Services;
