# TransitAuto - Import Direct Chine-Afrique

Plateforme d'importation de véhicules premium depuis la Chine vers l'Afrique subsaharienne (Douala, Abidjan, Dakar, Lomé).

## 🚀 Installation & Configuration Backend

Le projet utilise **Supabase** pour l'authentification et la base de données, et **Stripe** pour les paiements d'acompte.

### 1. Variables d'Environnement
Assurez-vous que le fichier `.env` à la racine contient les informations suivantes (déjà configurées) :
```env
VITE_SUPABASE_URL=https://iyfxcaqrrnxvdcfjathr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_STRIPE_PUBLISHABLE_KEY=sb_publishable_...
```

### 2. Initialisation de la Base de Données
Pour que le système fonctionne, vous devez exécuter le script SQL suivant dans le **SQL Editor** de votre tableau de bord Supabase :

Exécutez le contenu du fichier `supabase_schema.sql` présent à la racine du projet. Ce script :
- Crée les tables `profiles`, `vehicles` et `reservations`.
- Active la sécurité (RLS) pour protéger les données utilisateurs.
- Ajoute un déclencheur (trigger) pour créer automatiquement un profil à l'inscription.

### 3. Authentification Google (Optionnel)
Pour activer la connexion Google :
1. Allez dans **Authentication > Providers** sur Supabase.
2. Activez **Google**.
3. Configurez les identifiants Client ID et Client Secret (obtenus sur la console Google Cloud).

### 4. Stripe (Paiement)
Le système est configuré en mode démo. Pour le mode réel :
- Remplacez la clé dans `.env`.
- Déployez une Edge Function Supabase pour gérer `create-payment-intent`.

## 🛠 Technologies utilisées
- **Frontend** : React 18, TypeScript, Vite, CSS Modules.
- **State Management** : Zustand.
- **Backend** : Supabase (Auth, DB, Storage).
- **Paiement** : Stripe.
- **Animations** : Framer Motion.
- **Icônes** : Heroicons.

## 📦 Lancement
```bash
npm install
npm run dev
```
