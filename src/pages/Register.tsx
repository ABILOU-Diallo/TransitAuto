// src/pages/Register.tsx
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Register.module.css';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { useStore } from '@/store/useStore';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const fetchUserSession = useStore((state) => state.fetchUserSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: supError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (supError) {
        setError(supError.message);
      } else if (data.user) {
        if (data.session) {
          // Si l'utilisateur est connecté immédiatement (pas de confirmation email requise)
          await fetchUserSession();
          navigate('/dashboard');
        } else {
          // Si une confirmation par email est requise
          alert('Compte créé ! Veuillez vérifier vos emails pour confirmer votre inscription avant de vous connecter.');
          navigate('/login');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glowPrimary} />
      <div className={styles.glowAccent} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.wrapper}
      >
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>ICE</div>
            <span className={styles.title} style={{ fontSize: '1.25rem' }}>
              IMPERIAL <span className="text-gradient-amber">CHINA EXPORT</span>
            </span>
          </Link>
          <h2 className={styles.title}>Créer un Compte</h2>
          <p className={styles.subtitle}>
            Rejoignez la plateforme d'import direct premium
          </p>
        </div>

        <div className={styles.card}>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.error}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nom Complet</label>
              <div className={styles.inputWrapper}>
                <UserIcon className={styles.inputIcon} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Adresse Email</label>
              <div className={styles.inputWrapper}>
                <EnvelopeIcon className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mot de passe</label>
              <div className={styles.inputWrapper}>
                <LockClosedIcon className={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  className={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {loading ? (
                <span style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span>Créer mon compte</span>
                  <ArrowRightIcon style={{ width: '1rem', height: '1rem' }} />
                </div>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem' }}>
            <GoogleLoginButton />
          </div>

          <div className={styles.footer}>
            Déjà inscrit ?{' '}
            <Link to="/login" className={styles.link}>
              Se connecter
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
