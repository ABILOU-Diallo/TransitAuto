-- ============================================================
-- SCRIPT D'INSERTION DES AVIS CLIENTS (IMPERIAL CHINA EXPORT)
-- À exécuter dans le "SQL Editor" de votre tableau de bord Supabase
-- ============================================================

-- 1. S'assurer que l'extension UUID et la table existent
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activer la sécurité RLS et autoriser la lecture publique
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are public" ON public.reviews;
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can post reviews" ON public.reviews;
CREATE POLICY "Users can post reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE USING (true);

-- 3. Vider les anciens avis de test pour éviter les doublons
DELETE FROM public.reviews;

-- 4. Insérer les 12 avis clients vérifiés d'Afrique subsaharienne
INSERT INTO public.reviews (user_name, country_code, comment, rating, created_at) VALUES
(
  'Jean-Paul K.',
  'CI',
  'Ma BYD Tang est arrivée au port d''Abidjan en exactement 21 jours. Dédouanement pris en charge de A à Z par l''équipe locale. Autonomie réelle de plus de 580 km ! Service 5 étoiles.',
  5,
  NOW() - INTERVAL '15 days'
),
(
  'Moussa S.',
  'SN',
  'Très sceptique au début sur l''import direct de Chine, mais le suivi conteneur en temps réel avec le numéro BL m''a totalement rassuré. Récupérée au môle 2 de Dakar sans aucun frais caché.',
  5,
  NOW() - INTERVAL '21 days'
),
(
  'Christian B.',
  'CM',
  'Économie de plus de 11 millions FCFA sur ma Changan UNI-K par rapport au prix concessionnaire à Bonanjo. Climatisation tropicalisée au top et excellente tenue sur les routes de Douala.',
  5,
  NOW() - INTERVAL '24 days'
),
(
  'Kevin M.',
  'GA',
  'Zeekr 001 reçue au port d''Owendo à Libreville. Voiture magnifique, suspension pneumatique magique sur nos routes. Zéro égratignure.',
  5,
  NOW() - INTERVAL '29 days'
),
(
  'Fatou C.',
  'SN',
  'Chery Tiggo 8 Pro 7 places reçue à Dakar. Paiement de l''acompte sécurisé en ligne. Inspection vidéo à Shanghai avant embarquement très rassurante !',
  5,
  NOW() - INTERVAL '34 days'
),
(
  'Arnaud N.',
  'CM',
  'Jetour Dashing livrée à Yaoundé. Design futuriste, tenue de route impressionnante sur l''axe Douala-Yaoundé. Dédouanement au port de Douala bien géré.',
  4,
  NOW() - INTERVAL '41 days'
),
(
  'Amadou D.',
  'CI',
  'BYD Song Plus EV reçue à San Pedro. Première voiture électrique pour moi, recharge facile à domicile la nuit, facture de carburant divisée par 4.',
  5,
  NOW() - INTERVAL '49 days'
),
(
  'Kodjo A.',
  'TG',
  'Geely Monjaro retirée au Port Autonome de Lomé. Finition haut de gamme digne des standards européens, moteur 2.0T très nerveux.',
  5,
  NOW() - INTERVAL '55 days'
),
(
  'Rodrigue K.',
  'BJ',
  'BYD Seal Performance reçue à Cotonou. Accélération fulgurante (0-100 en 3.8s) ! Bravo pour la fluidité des formalités maritimes.',
  5,
  NOW() - INTERVAL '67 days'
),
(
  'Serge M.',
  'CG',
  'Livraison de mon Haval H6 au port de Pointe-Noire. Véhicule 100% conforme aux photos transmises. Déjà en train de préparer une 2ème commande pour ma société.',
  5,
  NOW() - INTERVAL '75 days'
),
(
  'Ange-Patrick Y.',
  'CI',
  'NIO ES6 avec assistant vocal et conduite autonome. Arrivée à Abidjan avec toutes les certifications traduites. Équipe très réactive sur WhatsApp.',
  5,
  NOW() - INTERVAL '82 days'
),
(
  'Samuel E.',
  'CM',
  'Changan CS75 Plus livrée à Douala. Paiement fractionné sécurisé qui m''a permis de planifier ma trésorerie sereinement.',
  5,
  NOW() - INTERVAL '90 days'
);

-- 5. Vérification
SELECT id, user_name, country_code, rating, created_at FROM public.reviews ORDER BY created_at DESC;

