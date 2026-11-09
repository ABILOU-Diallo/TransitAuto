// src/mocks/reviews.ts
export interface ReviewMock {
  id: string;
  user_name: string;
  country_code: string;
  city?: string;
  vehicle_model?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const mockReviews: ReviewMock[] = [
  {
    id: 'rev-01',
    user_name: 'Jean-Paul K.',
    country_code: 'CI',
    city: 'Abidjan',
    vehicle_model: 'BYD Tang EV 4WD',
    rating: 5,
    comment: 'Ma BYD Tang est arrivée au port d\'Abidjan en exactement 21 jours. Le dédouanement a été pris en charge de A à Z par l\'équipe locale. Voiture en état neuf impeccable, autonomie testée à plus de 580 km ! Service 5 étoiles.',
    created_at: '2026-10-24T14:32:00Z',
  },
  {
    id: 'rev-02',
    user_name: 'Moussa S.',
    country_code: 'SN',
    city: 'Dakar',
    vehicle_model: 'Zeekr 001 Shooting Brake',
    rating: 5,
    comment: 'Très sceptique au début concernant l\'import direct depuis la Chine, mais le suivi conteneur en temps réel avec le numéro BL m\'a totalement rassuré. Récupérée au môle 2 de Dakar sans aucun frais caché.',
    created_at: '2026-10-18T10:15:00Z',
  },
  {
    id: 'rev-03',
    user_name: 'Christian B.',
    country_code: 'CM',
    city: 'Douala',
    vehicle_model: 'Changan UNI-K 2.0T AWD',
    rating: 5,
    comment: 'Économie de plus de 11 millions FCFA par rapport au prix concessionnaire à Bonanjo ! Véhicule robuste, intérieur cuir spacieux et climatisation tropicalisée parfaitement adaptée à nos routes.',
    created_at: '2026-10-15T09:45:00Z',
  },
  {
    id: 'rev-04',
    user_name: 'Kevin M.',
    country_code: 'GA',
    city: 'Libreville',
    vehicle_model: 'Li Auto L9 Ultra',
    rating: 5,
    comment: 'Le SUV hybride le plus confortable que j\'ai jamais conduit. Écrans arrière OLED pour les enfants, suspension pneumatique magique sur les routes gabonaises. Arrivé au port d\'Owendo sans une égratignure.',
    created_at: '2026-10-10T16:20:00Z',
  },
  {
    id: 'rev-05',
    user_name: 'Fatou C.',
    country_code: 'SN',
    city: 'Dakar',
    vehicle_model: 'Chery Tiggo 8 Pro Max',
    rating: 5,
    comment: 'Sept vraies places pour ma grande famille. J\'ai payé l\'acompte en ligne via Mobile Money Orange Money de façon très sécurisée. L\'équipe m\'a envoyé des vidéos de l\'inspection au port de Shanghai avant l\'embarquement.',
    created_at: '2026-10-05T11:00:00Z',
  },
  {
    id: 'rev-06',
    user_name: 'Arnaud N.',
    country_code: 'CM',
    city: 'Yaoundé',
    vehicle_model: 'Jetour Dashing 1.6T',
    rating: 4,
    comment: 'Design futuriste et tenue de route surprenante sur l\'axe lourd Douala-Yaoundé. Petit retard de 3 jours au niveau de la douane à Douala à cause de la congestion, mais le transitaire a tout débloqué avec professionnalisme.',
    created_at: '2026-09-28T08:10:00Z',
  },
  {
    id: 'rev-07',
    user_name: 'Amadou D.',
    country_code: 'CI',
    city: 'San Pedro',
    vehicle_model: 'BYD Song Plus EV',
    rating: 5,
    comment: 'Première voiture électrique pour moi en Côte d\'Ivoire. Je recharge à domicile la nuit, le coût au km est divisé par 4 par rapport à mon ancien diesel. Imperial China Export est le partenaire idéal.',
    created_at: '2026-09-20T17:40:00Z',
  },
  {
    id: 'rev-08',
    user_name: 'Kodjo A.',
    country_code: 'TG',
    city: 'Lomé',
    vehicle_model: 'Geely Monjaro 4WD',
    rating: 5,
    comment: 'Retiré au Port Autonome de Lomé. Châssis d\'origine Volvo, finition luxe et motorisation nerveuse. Communication irréprochable avec le conseiller commercial sur WhatsApp.',
    created_at: '2026-09-14T13:25:00Z',
  },
  {
    id: 'rev-09',
    user_name: 'Rodrigue K.',
    country_code: 'BJ',
    city: 'Cotonou',
    vehicle_model: 'BYD Seal Performance',
    rating: 5,
    comment: 'Une véritable fusée (0-100 en 3.8s) ! Tout le monde se retourne sur la Haie Vive. Formalités de transit vers Cotonou très fluides. Bravo à toute l\'équipe.',
    created_at: '2026-09-02T15:05:00Z',
  },
  {
    id: 'rev-10',
    user_name: 'Serge M.',
    country_code: 'CG',
    city: 'Pointe-Noire',
    vehicle_model: 'Haval H6 GT',
    rating: 5,
    comment: 'Livraison réussie au port de Pointe-Noire. Véhicule 100% conforme aux photos et à la fiche technique. Je prépare déjà la commande d\'une seconde voiture pour ma société.',
    created_at: '2026-08-25T18:30:00Z',
  },
  {
    id: 'rev-11',
    user_name: 'Ange-Patrick Y.',
    country_code: 'CI',
    city: 'Abidjan',
    vehicle_model: 'NIO ES6 100kWh',
    rating: 5,
    comment: 'L\'assistant vocal NOMI et la technologie de conduite semi-autonome sont bluffants. La livraison au port d\'Abidjan s\'est déroulée avec toutes les fiches d\'inspection chinoises fournies traduites.',
    created_at: '2026-08-18T12:00:00Z',
  },
  {
    id: 'rev-12',
    user_name: 'Samuel E.',
    country_code: 'CM',
    city: 'Douala',
    vehicle_model: 'Changan CS75 Plus',
    rating: 5,
    comment: 'Superbe rapport qualité-prix. Paiement en deux tranches (acompte puis solde à l\'embarquement) qui m\'a permis de planifier ma trésorerie sereinement.',
    created_at: '2026-08-10T09:15:00Z',
  }
];

