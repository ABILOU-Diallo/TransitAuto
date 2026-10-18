// src/components/Footer.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import {
  PaperAirplaneIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const ports = [
  { name: 'Douala', country: 'Cameroun', flag: '🇨🇲', delay: '18-22j' },
  { name: 'Abidjan', country: "Côte d'Ivoire", flag: '🇨🇮', delay: '20-25j' },
  { name: 'Dakar', country: 'Sénégal', flag: '🇸🇳', delay: '22-26j' },
  { name: 'Lomé', country: 'Togo', flag: '🇹🇬', delay: '19-23j' },
  { name: 'Cotonou', country: 'Bénin', flag: '🇧🇯', delay: '20-24j' },
  { name: 'Libreville', country: 'Gabon', flag: '🇬🇦', delay: '22-26j' },
];

const partners = ['COSCO Shipping', 'Maersk Line', 'CMA CGM', 'Grimaldi Lines', 'SGS Inspection'];

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Newsletter & Assurance Banner */}
        <div className={styles.topBanner}>
          <div className={styles.newsletterText}>
            <span className="badge-luxury" style={{ marginBottom: '0.75rem' }}>Newsletter Export Direct</span>
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'white', marginTop: '0.5rem' }}>
              Recevez les arrivages de Chine <span className="text-shine">avant tout le monde</span>
            </h3>
            <p style={{ color: 'var(--neutral-400)', fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '36rem' }}>
              Soyez notifié en temps réel des conteneurs en partance de Guangzhou et bénéficiez de réductions exclusives.
            </p>
          </div>
          <div className={styles.newsletterForm}>
            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '1rem', color: '#10B981', fontSize: '0.875rem' }}>
                <CheckCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Merci ! Vous recevrez nos prochains arrivages par email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email..."
                  required
                  className={styles.input}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.875rem 1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                >
                  <span>S'inscrire</span>
                  <PaperAirplaneIcon style={{ width: '1rem', height: '1rem' }} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className={styles.mainGrid}>
          {/* Brand & mission */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brandLink}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--primary), #0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                ICE
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                IMPERIAL <span className="text-gradient-amber">CHINA EXPORT</span>
              </span>
            </Link>
            <p className={styles.brandDesc}>
              Plateforme pionnière d'importation de véhicules neufs et certifiés depuis la Chine vers l'Afrique subsaharienne. Achat usine, inspection SGS 120 points, et dédouanement portuaire clé en main.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <a
                href="https://wa.me/33745636495"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none' }}
              >
                <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#34D399' }} />
                Concierge WhatsApp (+33 7 45 63 64 95)
              </a>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Réponse &lt; 15 min</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.colTitle}>Navigation</h4>
            <ul className={styles.linkList}>
              <li><Link to="/cars" className={styles.link}>Catalogue complet</Link></li>
              <li><Link to="/services" className={styles.link}>Services & Logistique</Link></li>
              <li><Link to="/tracking" className={styles.link}>Suivi de conteneur (BL)</Link></li>
              <li><Link to="/about" className={styles.link}>Qui sommes-nous</Link></li>
              <li><Link to="/contact" className={styles.link}>Contact & Agences</Link></li>
              <li><Link to="/dashboard" className={styles.link}>Espace Client</Link></li>
            </ul>
          </div>

          {/* Ports & Delays */}
          <div>
            <h4 className={styles.colTitle}>Ports Principaux</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {ports.map((p) => (
                <div key={p.name} className={styles.portItem}>
                  <span style={{ color: 'var(--neutral-300)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span>{p.flag}</span>
                    <span>{p.name}</span>
                  </span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(14, 165, 233, 0.1)', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>{p.delay}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className={styles.colTitle}>Bureaux Internationaux</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPinIcon style={{ width: '1rem', height: '1rem', color: 'var(--primary)', flexShrink: 0 }} />
                <span>
                  <strong style={{ color: 'var(--neutral-200)', display: 'block' }}>Chine (Siège) :</strong>
                  Tianhe District, Guangzhou, Guangdong
                </span>
              </li>
              <li className={styles.contactItem}>
                <MapPinIcon style={{ width: '1rem', height: '1rem', color: 'var(--accent)', flexShrink: 0 }} />
                <span>
                  <strong style={{ color: 'var(--neutral-200)', display: 'block' }}>Hub Afrique :</strong>
                  Akwa, Douala & Plateau, Abidjan
                </span>
              </li>
              <li className={styles.contactItem}>
                <EnvelopeIcon style={{ width: '1rem', height: '1rem', color: 'var(--primary)', flexShrink: 0 }} />
                <a href="mailto:contact@imperialchinaexport.com" className={styles.link}>contact@imperialchinaexport.com</a>
              </li>
              <li className={styles.contactItem}>
                <PhoneIcon style={{ width: '1rem', height: '1rem', color: '#10B981', flexShrink: 0 }} />
                <a href="https://wa.me/33745636495" target="_blank" rel="noreferrer" className={styles.link} style={{ color: '#10B981', fontWeight: 600 }}>WhatsApp : +33 7 45 63 64 95</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Partners Strip */}
        <div className={styles.partnersStrip}>
          <span style={{ fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheckIcon style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} />
            Partenaires maritimes & d'inspection :
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            {partners.map((partner) => (
              <span key={partner} style={{ color: 'var(--neutral-400)', fontWeight: 500 }}>
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} IMPERIAL CHINA EXPORT Ltd. Tous droits réservés. Conçu pour le commerce Asie-Afrique.</p>
          <div className={styles.bottomLinks}>
            <Link to="/contact" className={styles.link}>Mentions Légales</Link>
            <Link to="/contact" className={styles.link}>Politique de Confidentialité</Link>
            <Link to="/contact" className={styles.link}>Conditions Générales de Vente</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
