-- ==========================================
-- 1. NETTOYAGE DES POLITIQUES EXISTANTES
-- ==========================================
DROP POLICY IF EXISTS "Profiles self select" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Vehicles public select" ON public.vehicles;
DROP POLICY IF EXISTS "Vehicles admin manage" ON public.vehicles;
DROP POLICY IF EXISTS "Reservations self select" ON public.reservations;
DROP POLICY IF EXISTS "Reservations self insert" ON public.reservations;
DROP POLICY IF EXISTS "Reservations admin manage" ON public.reservations;
DROP POLICY IF EXISTS "Reviews are public" ON public.reviews;
DROP POLICY IF EXISTS "Users can post reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins manage contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;

-- ==========================================
-- 2. DÉFINITION DES TABLES
-- ==========================================

-- Table des profils (Clients & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  country TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des véhicules (Stock)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  fuel TEXT,
  transmission TEXT,
  seats INTEGER,
  mileage INTEGER,
  status TEXT DEFAULT 'En Chine',
  price_fcfa BIGINT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  badge TEXT,
  power_hp INTEGER,
  range_km INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations (Commandes)
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles ON DELETE SET NULL,
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'En attente',
  destination_port TEXT,
  bl_number TEXT,
  eta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des avis (Témoignages)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages (Formulaire de contact)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications système
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT, -- 'order', 'stock', 'system'
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. FONCTIONS & SÉCURITÉ
-- ==========================================

-- Fonction admin sans récursion (utilise directement le token JWT, aucune requête récursive)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE((auth.jwt() ->> 'email'), '') = 'imperial@chinaexport.com'
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activation RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. POLITIQUES DE SÉCURITÉ (RLS)
-- ==========================================

-- Profiles (sécurisé sans boucle de récursion)
CREATE POLICY "Profiles self select" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles self insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles admin delete" ON public.profiles FOR DELETE USING (public.is_admin());

-- Vehicles
CREATE POLICY "Vehicles public select" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Vehicles admin manage" ON public.vehicles FOR ALL USING (public.is_admin());

-- Reservations
CREATE POLICY "Reservations self select" ON public.reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Reservations self insert" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reservations admin manage" ON public.reservations FOR ALL USING (public.is_admin());

-- Reviews
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can post reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Contacts
CREATE POLICY "Public insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage contacts" ON public.contacts FOR ALL USING (public.is_admin());

-- Notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage notifications" ON public.notifications FOR ALL USING (public.is_admin());

-- ==========================================
-- 5. TRIGGERS & AUTOMATISATION
-- ==========================================

-- Création automatique du profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 6. DONNÉES DE TEST & BUCKET
-- ==========================================

-- Bucket pour les images de véhicules
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicles', 'vehicles', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Storage Access" ON storage.objects FOR SELECT USING (bucket_id = 'vehicles');
CREATE POLICY "Admin Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicles' AND public.is_admin());

-- Insertion de nombreux avis clients réalistes (Afrique subsaharienne)
DELETE FROM public.reviews;
INSERT INTO public.reviews (user_name, country_code, comment, rating) VALUES
('Jean-Paul K.', 'CI', 'Ma BYD Tang est arrivée au port d''Abidjan en exactement 21 jours. Dédouanement pris en charge de A à Z. Autonomie réelle de plus de 580 km ! 🇨🇮', 5),
('Moussa S.', 'SN', 'Très sceptique au début sur l''import direct de Chine, mais le suivi conteneur en temps réel avec le numéro BL m''a totalement rassuré. Port de Dakar validé ! 🇸🇳', 5),
('Christian B.', 'CM', 'Économie de plus de 11 millions FCFA sur ma Changan UNI-K par rapport au prix concessionnaire à Bonanjo. Climatisation tropicalisée au top pour Douala. 🇨🇲', 5),
('Kevin M.', 'GA', 'Zeekr 001 reçue au port d''Owendo à Libreville. Voiture magnifique, suspension pneumatique magique sur nos routes. 🇬🇦', 5),
('Fatou C.', 'SN', 'Chery Tiggo 8 Pro 7 places reçue à Dakar. Paiement de l''acompte sécurisé en ligne. Inspection vidéo à Shanghai avant embarquement très rassurante ! 🇸🇳', 5),
('Arnaud N.', 'CM', 'Jetour Dashing livrée à Yaoundé. Design futuriste, tenue de route impressionnante sur l''axe Douala-Yaoundé. Dédouanement bien géré. 🇨🇲', 4),
('Amadou D.', 'CI', 'BYD Song Plus EV reçue à San Pedro. Première voiture électrique pour moi, recharge facile la nuit, facture de transport divisée par 4. 🇨🇮', 5),
('Kodjo A.', 'TG', 'Geely Monjaro retirée au Port Autonome de Lomé. Finition haut de gamme digne des standards européens, moteur très nerveux. 🇹🇬', 5),
('Rodrigue K.', 'BJ', 'BYD Seal Performance reçue à Cotonou. Accélération fulgurante (0-100 en 3.8s) ! Bravo pour la fluidité des formalités maritimes. 🇧🇯', 5),
('Serge M.', 'CG', 'Livraison de mon Haval H6 au port de Pointe-Noire. Véhicule 100% conforme aux photos transmises. Déjà en train de préparer une 2ème commande. 🇨🇬', 5),
('Ange-Patrick Y.', 'CI', 'NIO ES6 avec assistant vocal et conduite autonome. Arrivée à Abidjan avec toutes les certifications traduites. Équipe très réactive sur WhatsApp. 🇨🇮', 5),
('Samuel E.', 'CM', 'Changan CS75 Plus livrée à Douala. Paiement fractionné sécurisé qui m''a permis de planifier ma trésorerie sereinement. 🇨🇲', 5);
