// src/pages/Auth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // will be created later
import { GoogleLoginButton } from '@/components/GoogleLoginButton'; // placeholder component

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Vérifiez votre email pour confirmer l\'inscription');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <section className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-title text-primary mb-6 text-center">
        {isRegister ? 'Créer un compte' : 'Connexion'}
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="rounded-md border border-neutral-300 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="rounded-md border border-neutral-300 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white font-medium rounded hover:bg-primary/90 transition"
        >
          {isRegister ? 'S\'inscrire' : 'Se connecter'}
        </button>
      </form>
      <div className="my-4 text-center">ou</div>
      {/* Google login placeholder */}
      <GoogleLoginButton />
      <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
        {isRegister ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-primary underline"
        >
          {isRegister ? 'Connexion' : 'Inscription'}
        </button>
      </p>
    </section>
  );
};

export default Auth;
