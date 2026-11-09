// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL or Anon Key is missing. Check your .env file.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file at the project root.'
  );
}

// Fallback dummy credentials to prevent createClient from crashing React on startup
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

// Un seul client Supabase pour tout le frontend (Sécurisé et évite les conflits)
export const supabase = createClient(
  supabaseUrl && supabaseUrl.trim() !== '' ? supabaseUrl : fallbackUrl,
  supabaseAnonKey && supabaseAnonKey.trim() !== '' ? supabaseAnonKey : fallbackKey
);

// On utilise le même client pour l'admin (les permissions sont gérées par RLS en base de données)
export const supabaseAdmin = supabase;
