// src/components/ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const { user, fetchUserSession } = useStore();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await fetchUserSession();
      }
      setLoading(false);
    };
    checkAuth();
  }, [user, fetchUserSession]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // 1. Si non connecté, redirection vers login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si route Admin et l'utilisateur n'est pas Admin -> redirection vers Dashboard Client
  if (adminOnly && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Si route Client (Dashboard) et l'utilisateur est Admin
  // -> On redirige l'admin vers son propre espace pour éviter les erreurs de données
  if (!adminOnly && user.is_admin && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
