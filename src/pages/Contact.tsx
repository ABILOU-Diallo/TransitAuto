// src/pages/Contact.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const offices = [
  {
    city: 'Guangzhou (Chine)',
    role: 'Siège Opérations Asie & Inspection',
    address: 'Tianhe District, Zhujiang New Town, Guangzhou, Guangdong',
    phone: '+33 7 45 63 64 95',
    email: 'guangzhou@imperialchinaexport.com',
    hours: 'Lun - Ven : 08h00 - 18h00 (Heure de Chine)',
    flag: '🇨🇳',
  },
  {
    city: 'Douala (Cameroun)',
    role: 'Hub Logistique Afrique Centrale',
    address: 'Boulevard de la Liberté, Akwa, Douala',
    phone: '+33 7 45 63 64 95 / +237 600 000 000',
    email: 'douala@imperialchinaexport.com',
    hours: 'Lun - Sam : 08h30 - 18h00 (GMT+1)',
    flag: '🇨🇲',
  },
  {
    city: 'Abidjan (Côte d’Ivoire)',
    role: 'Hub Logistique Afrique de l’Ouest',
    address: 'Avenue Chardy, Plateau, Abidjan',
    phone: '+33 7 45 63 64 95 / +225 07 00 00 00 00',
    email: 'abidjan@imperialchinaexport.com',
    hours: 'Lun - Ven : 08h30 - 17h30 (GMT)',
    flag: '🇨🇮',
  },
];

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Devis importation véhicule',
    destinationPort: 'Douala',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Devis importation véhicule',
        destinationPort: 'Douala',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className={styles.page}>
      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '350px', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none' }} />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="badge-luxury"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
            >
              <ChatBubbleLeftRightIcon style={{ width: '1rem', height: '1rem' }} />
              <span>Support & Devis Express</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.heroTitle}
            >
              Parlons de Votre <span className="text-shine">Projet Automobile</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.heroDesc}
            >
              Que vous cherchiez un modèle précis, une estimation douanière détaillée ou une commande de flotte, nos équipes vous répondent sous 2 heures.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.grid}>
            {/* Left Column: Contact Form */}
            <div className={styles.formColumn}>
              <div className={styles.card}>
                <h2 className={styles.formTitle}>Envoyez-nous votre demande</h2>
                <p className={styles.formSubtitle}>Obtenez une cotation CIF gratuite et personnalisée.</p>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={styles.successCard}>
                    <div style={{ width: '4rem', height: '4rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <CheckCircleIcon style={{ width: '2.5rem', height: '2.5rem' }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981', marginBottom: '0.5rem' }}>Message Transmis</h3>
                    <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Votre conseiller vous recontactera très prochainement.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className={styles.formRow}>
                      <div>
                        <label className={styles.label}>Nom & Prénom *</label>
                        <input
                          type="text"
                          required
                          placeholder="Jean Dupont"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-premium"
                          style={{ fontSize: '0.875rem', padding: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <label className={styles.label}>Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="jean.dupont@exemple.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-premium"
                          style={{ fontSize: '0.875rem', padding: '0.75rem' }}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div>
                        <label className={styles.label}>WhatsApp / Téléphone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+237 6XX XX XX XX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-premium"
                          style={{ fontSize: '0.875rem', padding: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <label className={styles.label}>Port de livraison</label>
                        <select
                          value={formData.destinationPort}
                          onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                          className={styles.select}
                        >
                          <option value="Douala">Port de Douala (Cameroun)</option>
                          <option value="Abidjan">Port d'Abidjan (Côte d'Ivoire)</option>
                          <option value="Dakar">Port de Dakar (Sénégal)</option>
                          <option value="Lomé">Port de Lomé (Togo)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={styles.label}>Objet</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={styles.select}
                      >
                        <option value="Devis importation véhicule">Devis d'importation d'un véhicule</option>
                        <option value="Recherche modèle spécifique">Recherche d'un modèle non listé</option>
                        <option value="Question douanière">Question administrative ou douanière</option>
                      </select>
                    </div>

                    <div>
                      <label className={styles.label}>Détails de votre projet *</label>
                      <textarea
                        required
                        placeholder="Précisez la marque, l'année, le budget souhaité..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={styles.textarea}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontWeight: 700 }}>
                      <PaperAirplaneIcon style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      <span>Envoyer ma demande</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: WhatsApp & Offices */}
            <div className={styles.infoColumn}>
              <div className={styles.whatsAppCard}>
                <span className="badge-luxury" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', marginBottom: '1rem' }}>Canal Prioritaire</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>WhatsApp Direct</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '1.5rem' }}>Réponse immédiate de nos conseillers 7j/7.</p>
                <a href="https://wa.me/33745636495" target="_blank" rel="noreferrer" className="btn-primary" style={{ background: '#10B981', border: 'none', width: '100%', padding: '1rem' }}>
                   Ouvrir WhatsApp (+33 7 45 63 64 95)
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--neutral-500)', letterSpacing: '0.1em' }}>Nos Agences :</h4>
                {offices.map((office) => (
                  <div key={office.city} className={styles.officeCard}>
                    <div className={styles.officeHeader}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{office.flag} {office.city}</span>
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>AGENCE</span>
                    </div>
                    <div className={styles.officeInfo}>
                      <div className={styles.infoItem}>
                        <MapPinIcon style={{ width: '1rem', height: '1rem', color: 'var(--primary)', flexShrink: 0 }} />
                        <span>{office.address}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <PhoneIcon style={{ width: '1rem', height: '1rem', color: '#10B981', flexShrink: 0 }} />
                        <span>{office.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
