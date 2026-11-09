// src/store/useStore.ts
import { create } from 'zustand';
import { Vehicle } from '@/types/Vehicle';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';
import { mockVehicles } from '@/mocks/vehicles';
import { mockReviews } from '@/mocks/reviews';

export interface ReservationItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  status: string;
  amount: number;
  blNumber?: string;
  eta?: string;
  destinationPort?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  vehicleImage?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_admin: boolean;
}

export interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  createdAt: string;
  ordersCount: number;
  totalSpentFCFA: number;
  status: 'Actif' | 'VIP' | 'Nouveau';
  notes?: string;
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'logistics' | 'stock' | 'clients' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  linkTab?: 'vehicles' | 'orders' | 'clients' | 'profile';
  priority?: 'normal' | 'high';
}

export interface ReviewItem {
  id: string;
  user_name: string;
  country_code: string;
  rating: number;
  comment: string;
  created_at: string;
}

const LOCAL_NOTIFS_KEY = 'ice_admin_notifs_cache';

export interface StoreState {
  vehicles: Vehicle[];
  loading: boolean;
  user: UserProfile | null;
  favorites: Vehicle[];
  reservations: ReservationItem[];
  adminOrders: ReservationItem[];
  adminClients: ClientProfile[];
  adminReviews: ReviewItem[];
  adminNotifications: AdminNotification[];
  compareList: Vehicle[];

  fetchVehicles: () => Promise<void>;
  saveVehicle: (vehicleData: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  subscribeVehiclesRealtime: () => () => void;
  fetchUserSession: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchUserReservations: () => Promise<void>;
  fetchAdminOrders: () => Promise<void>;
  updateAdminOrderStatus: (id: string, status: string, blNumber?: string, eta?: string, destinationPort?: string) => Promise<void>;
  addAdminOrder: (order: Partial<ReservationItem>) => Promise<void>;
  fetchAdminClients: () => Promise<void>;
  saveAdminClient: (client: Partial<ClientProfile>) => Promise<void>;
  deleteAdminClient: (id: string) => Promise<void>;
  fetchAdminReviews: () => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<AdminNotification, 'id' | 'date' | 'read'>) => void;
  addFavorite: (vehicle: Vehicle) => void;
  removeFavorite: (vehicleId: string) => void;
  toggleFavorite: (vehicle: Vehicle) => void;
  isFavorite: (vehicleId: string) => boolean;
  addReservation: (resData: Omit<ReservationItem, 'id' | 'date'>) => Promise<void>;
  toggleCompare: (vehicle: Vehicle) => void;
  clearCompare: () => void;
  logout: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  vehicles: [],
  loading: false,
  user: null,
  favorites: [],
  reservations: [],
  adminOrders: [],
  adminClients: [],
  adminReviews: [],
  adminNotifications: (() => {
    try {
      const stored = localStorage.getItem(LOCAL_NOTIFS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("LocalStorage access issue:", e);
      return [];
    }
  })(),
  compareList: [],

  fetchUserSession: async () => {
    try {
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        console.warn('Erreur récupération session:', sessionErr);
        return;
      }
      if (session?.user) {
        let profile: any = null;
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && data) {
            profile = data;
          }
        } catch (profileErr) {
          console.warn('Profil introuvable ou erreur DB (repli métadonnées session) :', profileErr);
        }

        const isAdmin = !!(
          profile?.is_admin ||
          session.user.email?.toLowerCase() === 'imperial@chinaexport.com' ||
          session.user.user_metadata?.is_admin
        );

        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Utilisateur ICE',
            phone: profile?.phone || session.user.user_metadata?.phone || '',
            is_admin: isAdmin,
          }
        });
      } else {
        set({ user: null });
      }
    } catch (err) {
      console.warn('Session error:', err);
    }
  },

  updateUserProfile: async (data) => {
    const current = get().user;
    if (!current) return;
    try {
      await supabase.from('profiles').update({ full_name: data.full_name, phone: data.phone }).eq('id', current.id);
      set({ user: { ...current, ...data } });
    } catch (err) {
      console.error(err);
    }
  },

  fetchVehicles: async () => {
    set({ loading: true });
    try {
      if (!isSupabaseConfigured) {
        set({ vehicles: mockVehicles, loading: false });
        return;
      }
      const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        const mapped: Vehicle[] = data.map((v: any) => ({
          id: v.id,
          brand: v.brand,
          model: v.model,
          year: v.year,
          fuel: v.fuel,
          transmission: v.transmission,
          seats: v.seats,
          mileage: v.mileage,
          status: v.status,
          totalPriceFCFA: v.price_fcfa,
          images: v.images || [],
          description: v.description,
          badge: v.badge,
          powerHp: v.power_hp,
          rangeKm: v.range_km,
          priceChina: v.price_china || 0,
          freight: v.freight || 0,
          customsFee: v.customs_fee || 0,
          color: v.color || 'Standard',
        }));
        set({ vehicles: mapped });
      } else {
        set({ vehicles: mockVehicles });
      }
      if (error) throw error;
    } catch (err) {
      console.warn("Fetch vehicles error (falling back to mock data):", err);
      set({ vehicles: mockVehicles });
    } finally {
      set({ loading: false });
    }
  },

  subscribeVehiclesRealtime: () => {
    const sub = supabase.channel('v-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => get().fetchVehicles()).subscribe();
    return () => { supabase.removeChannel(sub); };
  },

  saveVehicle: async (vData) => {
    // Mappage camelCase vers snake_case pour la DB
    const dbData: any = {
      brand: vData.brand,
      model: vData.model,
      year: Number(vData.year) || new Date().getFullYear(),
      fuel: vData.fuel,
      transmission: vData.transmission,
      seats: Number(vData.seats) || 5,
      mileage: Number(vData.mileage) || 0,
      status: vData.status || 'En Chine',
      price_fcfa: Number(vData.totalPriceFCFA) || 0,
      images: vData.images && vData.images.length > 0 ? vData.images : ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'],
      description: vData.description || '',
      badge: vData.badge || 'Nouveau',
      power_hp: vData.powerHp ? Number(vData.powerHp) : null,
      range_km: vData.rangeKm ? Number(vData.rangeKm) : null
    };

    if (isSupabaseConfigured) {
      try {
        if (vData.id && !vData.id.startsWith('local-')) {
          const { error } = await supabaseAdmin.from('vehicles').update(dbData).eq('id', vData.id);
          if (error) throw error;
        } else {
          const { error } = await supabaseAdmin.from('vehicles').insert([dbData]);
          if (error) throw error;
        }
        await get().fetchVehicles();
        return vData as Vehicle;
      } catch (err) {
        console.warn('Supabase saveVehicle error, application de la mise à jour locale :', err);
      }
    }

    // Mise à jour locale immédiate pour garantir que l'interface répond toujours instantanément
    const updatedVehicle: Vehicle = {
      id: vData.id || `local-${Date.now()}`,
      brand: vData.brand || 'Marque',
      model: vData.model || 'Modèle',
      year: Number(vData.year) || new Date().getFullYear(),
      priceChina: Number(vData.priceChina) || 0,
      freight: Number(vData.freight) || 0,
      customsFee: Number(vData.customsFee) || 0,
      totalPriceFCFA: Number(vData.totalPriceFCFA) || 0,
      mileage: Number(vData.mileage) || 0,
      fuel: (vData.fuel as any) || 'Électrique',
      transmission: (vData.transmission as any) || 'Automatique',
      seats: Number(vData.seats) || 5,
      color: vData.color || 'Blanc Nacré',
      images: vData.images && vData.images.length > 0 ? vData.images : ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'],
      badge: (vData.badge as any) || 'Nouveau',
      status: (vData.status as any) || 'En Chine',
      powerHp: vData.powerHp ? Number(vData.powerHp) : undefined,
      acceleration: vData.acceleration || '4.5s',
      rangeKm: vData.rangeKm ? Number(vData.rangeKm) : undefined,
      description: vData.description || '',
      portsAvailable: vData.portsAvailable || ['Douala', 'Abidjan', 'Dakar', 'Lomé']
    };

    set(state => {
      const exists = state.vehicles.some(v => v.id === updatedVehicle.id);
      if (exists) {
        return { vehicles: state.vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v) };
      }
      return { vehicles: [updatedVehicle, ...state.vehicles] };
    });

    return updatedVehicle;
  },

  deleteVehicle: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase deleteVehicle error, suppression locale :', err);
      }
    }
    set(state => ({ vehicles: state.vehicles.filter(v => v.id !== id) }));
  },

  fetchUserReservations: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('reservations').select('*, vehicles(brand, model, images)').eq('user_id', user.id);
      if (data) {
        set({ reservations: data.map((r: any) => ({
          id: r.id,
          vehicleId: r.vehicle_id,
          vehicleName: `${r.vehicles?.brand} ${r.vehicles?.model}`,
          date: new Date(r.created_at).toLocaleDateString(),
          status: r.status,
          amount: r.amount,
          blNumber: r.bl_number,
          eta: r.eta,
          destinationPort: r.destination_port
        }))});
      }
    } catch (err) { console.error(err); }
  },

  fetchAdminOrders: async () => {
    try {
      const { data } = await supabaseAdmin.from('reservations').select('*, vehicles(brand, model), profiles(full_name, phone)');
      if (data) {
        set({ adminOrders: data.map((r: any) => ({
          id: r.id,
          vehicleId: r.vehicle_id,
          vehicleName: `${r.vehicles?.brand} ${r.vehicles?.model}`,
          clientName: r.profiles?.full_name,
          clientPhone: r.profiles?.phone,
          amount: r.amount,
          status: r.status,
          date: new Date(r.created_at).toLocaleDateString(),
          blNumber: r.bl_number,
          eta: r.eta,
          destinationPort: r.destination_port
        }))});
      }
    } catch (err) { console.error(err); }
  },

  updateAdminOrderStatus: async (id, status, bl, eta, port) => {
    const { error } = await supabaseAdmin.from('reservations').update({
      status,
      bl_number: bl,
      eta,
      destination_port: port
    }).eq('id', id);
    if (error) throw error;
    await get().fetchAdminOrders();
  },

  addAdminOrder: async (order) => {
    const adminUser = get().user;
    const { error } = await supabaseAdmin.from('reservations').insert([{
      vehicle_id: order.vehicleId,
      amount: order.amount,
      status: order.status,
      destination_port: order.destinationPort,
      bl_number: order.blNumber,
      eta: order.eta,
      user_id: adminUser?.id // Note: idéalement l'ID du client si existant
    }]);
    if (error) throw error;
    await get().fetchAdminOrders();
  },

  fetchAdminClients: async () => {
    try {
      const { data } = await supabaseAdmin.from('profiles').select('*');
      if (data) {
        set({ adminClients: data.map((p: any) => ({
          id: p.id,
          fullName: p.full_name,
          email: p.email,
          phone: p.phone,
          status: p.is_admin ? 'VIP' : 'Actif',
          city: p.city || 'N/A',
          country: p.country || 'N/A'
        } as any))});
      }
    } catch (err) { console.error(err); }
  },

  saveAdminClient: async (c) => {
    if (c.id) {
      const { error } = await supabaseAdmin.from('profiles').update({
        full_name: c.fullName,
        phone: c.phone
      }).eq('id', c.id);
      if (error) throw error;
    }
    await get().fetchAdminClients();
  },

  deleteAdminClient: async (id) => {
    const { error } = await supabaseAdmin.from('profiles').delete().eq('id', id);
    if (error) throw error;
    await get().fetchAdminClients();
  },

  fetchAdminReviews: async () => {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        set({ adminReviews: data });
      } else {
        set({ adminReviews: mockReviews as ReviewItem[] });
      }
      if (error) throw error;
    } catch (err) {
      console.warn("Fetch reviews fallback to mock:", err);
      set({ adminReviews: mockReviews as ReviewItem[] });
    }
  },

  deleteReview: async (id: string) => {
    try {
      const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
      if (error) throw error;
      set(s => ({ adminReviews: s.adminReviews.filter(r => r.id !== id) }));
    } catch (err) {
      console.error("Delete review error:", err);
    }
  },

  markNotificationRead: (id) => {
    const next = get().adminNotifications.map(n => n.id === id ? {...n, read: true} : n);
    set({ adminNotifications: next });
    try { localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(next)); } catch {}
  },

  markAllNotificationsRead: () => {
    const next = get().adminNotifications.map(n => ({...n, read: true}));
    set({ adminNotifications: next });
    try { localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(next)); } catch {}
  },

  deleteNotification: (id) => {
    const next = get().adminNotifications.filter(n => n.id !== id);
    set({ adminNotifications: next });
    try { localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(next)); } catch {}
  },

  addNotification: (n) => {
    const next = [{...n, id: Date.now().toString(), date: 'À l\'instant', read: false}, ...get().adminNotifications];
    set({ adminNotifications: next });
    try { localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(next)); } catch {}
  },

  addReservation: async (r) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('reservations').insert({
      vehicle_id: r.vehicleId,
      amount: r.amount,
      status: r.status,
      destination_port: r.destinationPort,
      user_id: user?.id
    });
    if (error) throw error;
    await get().fetchUserReservations();
  },

  addFavorite: (v) => set(s => ({ favorites: [...s.favorites, v] })),
  removeFavorite: (id) => set(s => ({ favorites: s.favorites.filter(v => v.id !== id) })),
  toggleFavorite: (v) => get().isFavorite(v.id) ? get().removeFavorite(v.id) : get().addFavorite(v),
  isFavorite: (id) => get().favorites.some(v => v.id === id),
  toggleCompare: (v) => set(s => ({ compareList: s.compareList.some(x => x.id === v.id) ? s.compareList.filter(x => x.id !== v.id) : [...s.compareList, v] })),
  clearCompare: () => set({ compareList: [] }),
  logout: async () => { await supabase.auth.signOut(); set({ user: null, reservations: [], favorites: [] }); }
}));
