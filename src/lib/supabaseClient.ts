// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your .env file.');
}

// Un seul client Supabase pour tout le frontend (Sécurisé et évite les conflits)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// On utilise le même client pour l'admin (les permissions sont gérées par RLS en base de données)
export const supabaseAdmin = supabase;
