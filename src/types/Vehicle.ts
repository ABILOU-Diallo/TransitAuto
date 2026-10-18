// src/types/Vehicle.ts
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceChina: number; // price in CNY
  freight: number; // freight cost in CNY
  customsFee: number; // customs fee in FCFA
  totalPriceFCFA: number; // pre-calculated total price in FCFA
  mileage: number; // km
  fuel: 'Essence' | 'Diesel' | 'Électrique' | 'Hybrid';
  transmission: 'Manuelle' | 'Automatique';
  seats: number;
  color: string;
  images: string[]; // URLs to images
  badge?: 'Nouveau' | 'Populaire' | 'Offre Spéciale' | 'Bateau en cours';
  status: 'En Chine' | 'En transit' | 'Au port' | 'Vendu';
  powerHp?: number;
  acceleration?: string; // e.g. "3.8s 0-100"
  rangeKm?: number; // for EV
  description?: string;
  portsAvailable?: string[];
}
