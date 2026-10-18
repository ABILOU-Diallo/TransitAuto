// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import styles from './Login.module.css';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { useStore } from '@/store/useStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fetchUserSession = useStore((state) => state.fetchUserSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        // Détection robuste du rôle administrateur
        const isAdmin = Boolean(
          email.toLowerCase() === 'imperial@chinaexport.com' ||
          data.user.app_metadata?.is_admin ||
          data.user.user_metadata?.is_admin
        );

        // Mettre à jour le store global
        await fetchUserSession();

        // Logique de redirection par rôle
        if (isAdmin) {
          const from = (location.state as any)?.from?.pathname;
          if (from && from.startsWith('/admin')) {
            navigate(from, { replace: true });
          } else {
            navigate('/admin');
          }
        } else {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
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
          <h2 className={styles.title}>Connexion</h2>
          <p className={styles.subtitle}>
            Accédez à votre espace sécurisé
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label}>Mot de passe</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Réinitialisation envoyée.'); }} className={styles.forgotLink}>
                  Oublié ?
                </a>
              </div>
              <div className={styles.inputWrapper}>
                <LockClosedIcon className={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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
                  <span>Se connecter</span>
                  <ArrowRightIcon style={{ width: '1rem', height: '1rem' }} />
                </div>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem' }}>
            <GoogleLoginButton />
          </div>

          <div className={styles.footer}>
            Vous n'avez pas encore de compte ?{' '}
            <Link to="/register" className={styles.link}>
              Créer un compte
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
