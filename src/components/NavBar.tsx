// src/components/NavBar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, UserCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NavBar.module.css';
import { useStore } from '@/store/useStore';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/cars', label: 'Catalogue' },
  { to: '/reviews', label: 'Avis' }, // Nouveau lien ajouté
  { to: '/tracking', label: 'Suivi BL' },
  { to: '/about', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const { user, logout, fetchUserSession } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSession();
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchUserSession]);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className="logo-icon" style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, var(--primary), #0284C7)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)'
          }}>
            ICE
          </div>
          <span className="logo-text" style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            IMPERIAL <span className="text-gradient-amber">CHINA EXPORT</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Changer de theme"
          >
            {isDark ? (
              <SunIcon style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
            ) : (
              <MoonIcon style={{ width: '20px', height: '20px' }} />
            )}
          </button>

          {user ? (
            <div className={styles.userActions}>
              <Link
                to={user.is_admin ? '/admin' : '/dashboard'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.875rem'
                }}
              >
                <UserCircleIcon style={{ width: '22px', height: '22px', color: 'var(--primary)' }} />
                <span className={styles.userName}>{user.full_name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem', color: '#F43F5E' }}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className={styles.desktopAuth}>
              <Link to="/login" className="btn-ghost" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600 }}>Connexion</Link>
              <Link to="/cars" className="btn-primary" style={{ fontSize: '0.875rem' }}>Commander</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className={styles.mobileToggle}>
          <button onClick={() => setIsOpen(!isOpen)} className={styles.themeToggle} aria-label="Menu">
             {isOpen ? <XMarkIcon style={{ width: '24px', height: '24px' }} /> : <Bars3Icon style={{ width: '24px', height: '24px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.mobileMenu}
            style={{
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden'
            }}
          >
            <div className={styles.mobileMenuContent}>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    fontSize: '1rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    padding: '0.25rem 0'
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />
              {!user && (
                <div className={styles.mobileAuth}>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-ghost">Connexion</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary">Créer un compte</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
