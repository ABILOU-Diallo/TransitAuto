// src/pages/admin/AdminVehicles.tsx
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Vehicle } from '@/types/Vehicle';
import { uploadVehicleImageToStorage } from '@/lib/supabaseStorage';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../Admin.module.css';

interface VehicleFormData {
  id?: string;
  brand: string;
  model: string;
  year: number;
  fuel: 'Électrique' | 'Hybrid' | 'Essence' | 'Diesel';
  transmission: 'Automatique' | 'Manuelle';
  seats: number;
  mileage: number;
  totalPriceFCFA: number;
  status: 'En Chine' | 'En transit' | 'Au port' | 'Vendu';
  badge: 'Nouveau' | 'Populaire' | 'Offre Spéciale' | 'Bateau en cours' | '';
  images: string[];
  rangeKm?: number;
  powerHp?: number;
  color: string;
  description: string;
}

const initialForm: VehicleFormData = {
  brand: 'BYD',
  model: '',
  year: new Date().getFullYear(),
  fuel: 'Électrique',
  transmission: 'Automatique',
  seats: 5,
  mileage: 0,
  totalPriceFCFA: 22000000,
  status: 'En Chine',
  badge: 'Nouveau',
  images: [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
  ],
  rangeKm: undefined,
  powerHp: undefined,
  color: 'Blanc Nacré',
  description: 'Véhicule neuf direct usine, finition luxe avec toutes options incluses.'
};

// Liste exhaustive de marques automobiles classées par ordre alphabétique (A-Z)
const ALL_BRANDS = [
  'Abarth',
  'Acura',
  'Aito',
  'Aiways',
  'Alfa Romeo',
  'Alpine',
  'Aston Martin',
  'Audi',
  'Avatr',
  'BAIC',
  'Baojun',
  'Bentley',
  'BMW',
  'Borgward',
  'Brilliance',
  'Bugatti',
  'Buick',
  'BYD',
  'Cadillac',
  'Changan',
  'Chery',
  'Chevrolet',
  'Chrysler',
  'Citroën',
  'Cupra',
  'Dacia',
  'Daewoo',
  'Daihatsu',
  'Datsun',
  'Deepal',
  'Denza',
  'DFSK',
  'Dodge',
  'Dongfeng',
  'DS Automobiles',
  'Exeed',
  'Fangchengbao',
  'Ferrari',
  'Fiat',
  'Fisker',
  'Ford',
  'Foton',
  'GAC',
  'Geely',
  'Genesis',
  'GMC',
  'Great Wall (GWM)',
  'Haval',
  'HiPhi',
  'Honda',
  'Hongqi',
  'Hummer',
  'Hyundai',
  'IM Motors',
  'Infiniti',
  'Isuzu',
  'Iveco',
  'JAC',
  'Jaecoo',
  'Jaguar',
  'Jeep',
  'Jetour',
  'JMC',
  'Karma',
  'Kia',
  'Koenigsegg',
  'Lada',
  'Lamborghini',
  'Lancia',
  'Land Rover',
  'Leapmotor',
  'Lexus',
  'Li Auto',
  'Lifan',
  'Lincoln',
  'Lotus',
  'Lucid',
  'Lynk & Co',
  'Mahindra',
  'Maserati',
  'Maxus',
  'Maybach',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  'MG',
  'Mini',
  'Mitsubishi',
  'Neta',
  'NIO',
  'Nissan',
  'Omoda',
  'Opel',
  'Ora',
  'Pagani',
  'Peugeot',
  'Polestar',
  'Pontiac',
  'Porsche',
  'Proton',
  'Qoros',
  'Ram',
  'Renault',
  'Rimac',
  'Rivian',
  'Rolls-Royce',
  'Roewe',
  'Saab',
  'Saic',
  'Scion',
  'SEAT',
  'Seres',
  'Škoda',
  'Smart',
  'Soueast',
  'SsangYong',
  'Subaru',
  'Suzuki',
  'Tank',
  'Tata',
  'Tesla',
  'Toyota',
  'VinFast',
  'Volkswagen',
  'Volvo',
  'Voyah',
  'WEY',
  'Wuling',
  'Xiaomi',
  'Xpeng',
  'Yangwang',
  'Zeekr',
  'Zotye'
].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

const AdminVehicles: React.FC = () => {
  const { vehicles, deleteVehicle, saveVehicle } = useStore();
  const [searchTerm, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualBrand, setIsManualBrand] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>(initialForm);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = vehicles.filter(v =>
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setFormData(initialForm);
    setIsManualBrand(false);
    setNewImageUrl('');
    setIsModalOpen(true);
    setSuccessMsg('');
  };

  const handleOpenEdit = (v: Vehicle) => {
    const isKnownBrand = ALL_BRANDS.includes(v.brand);
    setIsManualBrand(!isKnownBrand);
    setFormData({
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      fuel: v.fuel,
      transmission: v.transmission,
      seats: v.seats,
      mileage: v.mileage,
      totalPriceFCFA: v.totalPriceFCFA,
      status: v.status,
      badge: v.badge || '',
      images: v.images && v.images.length > 0 ? v.images.slice(0, 5) : [...initialForm.images],
      rangeKm: v.rangeKm,
      powerHp: v.powerHp,
      color: v.color || 'Blanc',
      description: v.description || ''
    });
    setNewImageUrl('');
    setIsModalOpen(true);
    setSuccessMsg('');
  };

  // Ajout d'une image par URL
  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (formData.images.length >= 5) {
      alert('Vous ne pouvez pas ajouter plus de 5 images au total.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, trimmed].slice(0, 5)
    }));
    setNewImageUrl('');
  };

  // Téléversement multiple de fichiers (jusqu'à 5 au total)
  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - formData.images.length;
    if (availableSlots <= 0) {
      alert('La limite de 5 images est déjà atteinte pour ce véhicule.');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      alert(`Seules les ${availableSlots} premières photos ont été retenues pour respecter la limite maximale de 5.`);
    }

    setUploadingImage(true);
    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        try {
          return await uploadVehicleImageToStorage(file, `vehicule-${formData.brand.toLowerCase()}`);
        } catch {
          // Repli en DataURL local
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve((event.target?.result as string) || '');
            reader.readAsDataURL(file);
          });
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => Boolean(url));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validUrls].slice(0, 5)
      }));
    } catch (err) {
      console.warn('Erreur téléversement multiple :', err);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Suppression d'une image
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Définir une image comme photo principale (position 0)
  const handleSetPrimaryImage = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    setFormData(prev => {
      const selected = prev.images[indexToPrimary];
      const others = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [selected, ...others]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.model) {
      alert('Veuillez renseigner au moins la marque et le modèle.');
      return;
    }

    if (formData.images.length === 0) {
      alert('Veuillez ajouter au moins une photo pour le véhicule (maximum 5).');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveVehicle({
        id: formData.id,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        fuel: formData.fuel,
        transmission: formData.transmission,
        seats: Number(formData.seats),
        mileage: Number(formData.mileage),
        totalPriceFCFA: Number(formData.totalPriceFCFA),
        status: formData.status,
        badge: formData.badge ? formData.badge : undefined,
        images: formData.images.slice(0, 5),
        rangeKm: formData.rangeKm ? Number(formData.rangeKm) : undefined,
        powerHp: formData.powerHp ? Number(formData.powerHp) : undefined,
        color: formData.color,
        description: formData.description
      });

      setSuccessMsg(formData.id ? 'Fiche véhicule mise à jour avec succès !' : 'Véhicule publié avec succès avec ses photos !');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      alert(`Erreur lors de l'enregistrement : ${err?.message || 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.moduleContainer}>
      <header className={styles.moduleHeader}>
        <div>
          <h2 className={styles.tabTitle}>Gestion du Stock</h2>
          <p className={styles.tabSubtitle}>Administrez votre catalogue de véhicules et les disponibilités usine.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px', padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', cursor: 'pointer' }}
        >
          <PlusIcon style={{ width: '1.2rem' }} />
          Publier un véhicule
        </button>
      </header>

      <div className={styles.dashboardCard} style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div className={styles.headerSearch}>
          <MagnifyingGlassIcon style={{ width: '1.1rem', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher une marque, un modèle, un prix..."
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Véhicule & Détails</th>
              <th>Énergie / Modèle</th>
              <th>Prix Clé en Main</th>
              <th>Statut Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={v.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=150&q=80'}
                        alt={v.model}
                        className={styles.miniThumb}
                        style={{ width: '4.5rem', height: '3rem', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <Watermark fontSize={0.45} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-5px',
                          right: '-5px',
                          background: 'white',
                          borderRadius: '10px',
                          padding: '1px 5px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: '#0ea5e9'
                        }}
                      >
                        <PhotoIcon style={{ width: '0.75rem' }} />
                        {v.images?.length || 1}
                      </div>
                    </div>
                    <div>
                      <p className={styles.bold} style={{ fontSize: '0.95rem' }}>{v.brand} {v.model}</p>
                      <p className={styles.muted} style={{ fontSize: '0.75rem' }}>{v.mileage.toLocaleString()} km parcourus</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v.fuel}</p>
                  <p className={styles.muted}>Année {v.year}</p>
                </td>
                <td>
                  <span className={styles.priceTag} style={{ fontSize: '1.05rem', fontWeight: 800 }}>{v.totalPriceFCFA.toLocaleString()} FCFA</span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${v.status === 'En Chine' ? styles.statusChine : v.status === 'Au port' ? styles.statusPort : styles.statusTransit}`}>
                    {v.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <a href={`/cars/${v.id}`} target="_blank" rel="noreferrer" className={styles.iconBtn} title="Voir sur le site">
                      <ArrowTopRightOnSquareIcon style={{ width: '1.1rem' }} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(v)}
                      className={styles.iconBtn}
                      title="Modifier la fiche"
                    >
                      <PencilSquareIcon style={{ width: '1.1rem' }} />
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      style={{ color: '#f43f5e' }}
                      title="Supprimer du stock"
                      onClick={() => window.confirm(`Voulez-vous vraiment supprimer le véhicule ${v.brand} ${v.model} ?`) && deleteVehicle(v.id)}
                    >
                      <TrashIcon style={{ width: '1.1rem' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                  Aucun véhicule ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Modal de Publication / Modification Véhicule ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <motion.div
              className={styles.dashboardCard}
              style={{
                width: '100%',
                maxWidth: '750px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <h3 className={styles.bold} style={{ fontSize: '1.3rem' }}>
                    {formData.id ? 'Modifier la fiche véhicule' : 'Publier un nouveau véhicule'}
                  </h3>
                  <p className={styles.muted} style={{ fontSize: '0.85rem' }}>
                    Ajoutez jusqu'à 5 photos haute résolution pour valoriser le véhicule.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px' }}
                >
                  <XMarkIcon style={{ width: '1.5rem', color: '#64748b' }} />
                </button>
              </div>

              {successMsg && (
                <div style={{ background: '#ecfdf5', color: '#047857', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                  <CheckCircleIcon style={{ width: '1.3rem' }} />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* ─── Section Photos du véhicule (Jusqu'à 5 photos) ─── */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }} className="dark-bg-subtle">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <label className={styles.bold} style={{ fontSize: '0.95rem' }}>
                        Photos du véhicule ({formData.images.length}/5)
                      </label>
                      <p className={styles.muted} style={{ fontSize: '0.78rem', marginTop: '0.1rem' }}>
                        La 1ère photo avec l'étoile est la photo principale affichée dans le catalogue.
                      </p>
                    </div>
                    <span className={styles.headerDateBadge} style={{ fontSize: '0.75rem', color: formData.images.length === 5 ? '#10b981' : '#64748b' }}>
                      {formData.images.length === 5 ? '✓ Maximum 5 photos atteint' : `${5 - formData.images.length} emplacement(s) restant(s)`}
                    </span>
                  </div>

                  {/* Galerie visuelle des vignettes (1 à 5 photos) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    {formData.images.map((imgUrl, index) => (
                      <div
                        key={`${imgUrl}-${index}`}
                        style={{
                          position: 'relative',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: index === 0 ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                          background: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Photo ${index + 1}`}
                          style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                        />
                        {/* Badge numéro / Principale */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: index === 0 ? '#0ea5e9' : 'rgba(15, 23, 42, 0.75)',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '6px'
                          }}
                        >
                          {index === 0 ? '★ Principale' : `#${index + 1}`}
                        </div>

                        {/* Actions : mettre en principale ou supprimer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                          {index > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0ea5e9', display: 'flex', alignItems: 'center', padding: '2px' }}
                              title="Définir comme photo principale"
                            >
                              <StarIcon style={{ width: '1rem' }} />
                            </button>
                          ) : (
                            <span style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center' }}>
                              <StarIconSolid style={{ width: '1rem' }} />
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: '2px' }}
                            title="Supprimer cette photo"
                          >
                            <TrashIcon style={{ width: '1rem' }} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Emplacement vide "+ Ajouter photo" */}
                    {formData.images.length < 5 && (
                      <label
                        style={{
                          border: '2px dashed #94a3b8',
                          borderRadius: '12px',
                          minHeight: '108px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem',
                          cursor: uploadingImage ? 'wait' : 'pointer',
                          background: 'rgba(241, 245, 249, 0.5)',
                          color: '#64748b',
                          transition: 'all 0.2s'
                        }}
                        title="Cliquez pour ajouter des photos depuis votre appareil"
                      >
                        <ArrowUpTrayIcon style={{ width: '1.25rem', color: '#0ea5e9' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, textAlign: 'center', padding: '0 0.5rem' }}>
                          {uploadingImage ? 'Téléversement...' : '+ Ajouter photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFilesUpload}
                          style={{ display: 'none' }}
                          disabled={uploadingImage || formData.images.length >= 5}
                        />
                      </label>
                    )}
                  </div>

                  {/* Contrôles d'ajout d'image (URL ou Fichiers) */}
                  {formData.images.length < 5 && (
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '0.4rem' }}>
                        <input
                          type="url"
                          placeholder="Coller l'URL d'une image (ex: https://...)"
                          value={newImageUrl}
                          onChange={e => setNewImageUrl(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                          className="input-premium"
                          style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          disabled={!newImageUrl.trim() || formData.images.length >= 5}
                          className="btn-primary"
                          style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap', borderRadius: '10px' }}
                        >
                          Ajouter URL
                        </button>
                      </div>

                      <label
                        className={styles.iconBtn}
                        style={{ width: 'auto', padding: '0.55rem 1rem', gap: '0.4rem', cursor: uploadingImage ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}
                        title="Sélectionner des fichiers depuis votre appareil"
                      >
                        <PhotoIcon style={{ width: '1.1rem', color: '#0ea5e9' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          {uploadingImage ? 'Téléversement...' : 'Parcourir fichiers...'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFilesUpload}
                          style={{ display: 'none' }}
                          disabled={uploadingImage || formData.images.length >= 5}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* ─── Ligne 1 : Marque & Modèle ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className={styles.bold} style={{ fontSize: '0.85rem' }}>
                        Marque *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isManualBrand;
                          setIsManualBrand(next);
                          if (!next && !ALL_BRANDS.includes(formData.brand)) {
                            setFormData(prev => ({ ...prev, brand: 'BYD' }));
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0ea5e9',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isManualBrand ? '📋 Choisir dans la liste (A-Z)' : '✏️ Saisie manuelle'}
                      </button>
                    </div>

                    {isManualBrand ? (
                      <input
                        type="text"
                        required
                        placeholder="Saisissez le nom de la marque..."
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        className="input-premium"
                        style={{ padding: '0.75rem 1rem' }}
                        autoFocus
                      />
                    ) : (
                      <select
                        value={ALL_BRANDS.includes(formData.brand) ? formData.brand : 'AUTRE'}
                        onChange={e => {
                          if (e.target.value === 'AUTRE') {
                            setIsManualBrand(true);
                            setFormData({ ...formData, brand: '' });
                          } else {
                            setFormData({ ...formData, brand: e.target.value });
                          }
                        }}
                        className="input-premium"
                        style={{ padding: '0.75rem 1rem' }}
                      >
                        <option value="" disabled>-- Choisir une marque (Classées A-Z) --</option>
                        {ALL_BRANDS.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        <option value="AUTRE">➕ Autre marque (Saisie manuelle)...</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Modèle exact *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Tang EV 4WD, 001 Shooting Brake..."
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>
                </div>

                {/* ─── Ligne 2 : Prix & Année & Kilométrage ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Prix Clé en Main (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1000000}
                      step={100000}
                      placeholder="Ex: 24500000"
                      value={formData.totalPriceFCFA}
                      onChange={e => setFormData({ ...formData, totalPriceFCFA: Number(e.target.value) })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Année
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 2024, 2016, 2005..."
                      value={formData.year || ''}
                      onChange={e => setFormData({ ...formData, year: e.target.value ? Number(e.target.value) : ('' as any) })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Kilométrage (km)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.mileage}
                      onChange={e => setFormData({ ...formData, mileage: Number(e.target.value) })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>
                </div>

                {/* ─── Ligne 3 : Énergie, Transmission, Places ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Énergie
                    </label>
                    <select
                      value={formData.fuel}
                      onChange={e => setFormData({ ...formData, fuel: e.target.value as any })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      <option value="Électrique">Électrique (EV)</option>
                      <option value="Hybrid">Hybride / PHEV</option>
                      <option value="Essence">Essence</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Transmission
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={e => setFormData({ ...formData, transmission: e.target.value as any })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      <option value="Automatique">Automatique</option>
                      <option value="Manuelle">Manuelle</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Places assises
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={9}
                      value={formData.seats}
                      onChange={e => setFormData({ ...formData, seats: Number(e.target.value) })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>
                </div>

                {/* ─── Ligne 4 : Statut & Badge ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Statut Logistique
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      <option value="En Chine">En Chine (Dispo usine)</option>
                      <option value="En transit">En transit maritime</option>
                      <option value="Au port">Au port d'accostage</option>
                      <option value="Vendu">Vendu</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Badge promotionnel
                    </label>
                    <select
                      value={formData.badge}
                      onChange={e => setFormData({ ...formData, badge: e.target.value as any })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      <option value="">Aucun badge</option>
                      <option value="Nouveau">Nouveau</option>
                      <option value="Populaire">Populaire</option>
                      <option value="Offre Spéciale">Offre Spéciale</option>
                      <option value="Bateau en cours">Bateau en cours</option>
                    </select>
                  </div>
                </div>

                {/* ─── Ligne 5 : Puissance, Autonomie & Couleur ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Puissance (ch)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 517"
                      value={formData.powerHp || ''}
                      onChange={e => setFormData({ ...formData, powerHp: e.target.value ? Number(e.target.value) : undefined })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Autonomie EV (km) <span style={{ fontWeight: 400, color: `#94a3b8`, fontSize: `0.78rem` }}>(optionnel)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 635"
                      value={formData.rangeKm || ''}
                      onChange={e => setFormData({ ...formData, rangeKm: e.target.value ? Number(e.target.value) : undefined })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>

                  <div>
                    <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Couleur
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Blanc Nacré, Noir Ébène"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="input-premium"
                      style={{ padding: '0.75rem 1rem' }}
                    />
                  </div>
                </div>

                {/* ─── Ligne 6 : Description ─── */}
                <div>
                  <label className={styles.bold} style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Description & Équipements inclus
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Détails du véhicule, sellerie cuir, système d'infodivertissement, garanties..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="input-premium"
                    style={{ padding: '0.75rem 1rem', resize: 'vertical' }}
                  />
                </div>

                {/* ─── Boutons de validation ─── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.logoutBtn}
                    style={{ width: 'auto', background: '#f1f5f9', color: '#64748b' }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                    className="btn-primary"
                    style={{ padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Enregistrement en cours...' : formData.id ? 'Mettre à jour' : `Publier le véhicule (${formData.images.length} photo${formData.images.length > 1 ? 's' : ''})`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVehicles;

