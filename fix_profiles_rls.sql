-- ============================================================
-- SCRIPT DE CORRECTION DE L'ERREUR 500 (RLS PROFILES SUPABASE)
-- À exécuter dans le "SQL Editor" de votre projet Supabase
-- ============================================================

-- 1. Nettoyer toutes les anciennes politiques récursives sur profiles
DROP POLICY IF EXISTS "Profiles self select" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins select all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles self update" ON public.profiles;
DROP POLICY IF EXISTS "Profiles self insert" ON public.profiles;

-- 2. Recréer la fonction is_admin sans AUCUNE récursion
-- Vérification basée sur le token JWT (zéro appel récursif à la table profiles)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE((auth.jwt() ->> 'email'), '') = 'imperial@chinaexport.com'
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Activer la sécurité RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS sans boucle infinie
-- Chaque utilisateur authentifié peut consulter et modifier son propre profil
CREATE POLICY "Profiles self select" ON public.profiles 
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles self update" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles self insert" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles admin delete" ON public.profiles 
  FOR DELETE USING (public.is_admin());

-- 5. S'assurer que le compte admin actuel dispose de la ligne de profil
INSERT INTO public.profiles (id, email, full_name, is_admin)
VALUES ('d5ce9b90-29d6-45b9-8f97-8b471db6b519', 'imperial@chinaexport.com', 'Admin Imperial', true)
ON CONFLICT (id) DO UPDATE SET is_admin = true, full_name = EXCLUDED.full_name;

-- 6. Contrôle du résultat
SELECT id, email, full_name, is_admin FROM public.profiles;

