// src/components/MobileMoneyCheckout.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { initializeCinetPay, countries, isCinetPayConfigured } from '@/lib/paymentProvider';
import styles from './StripeCheckout.module.css';
import { ExclamationTriangleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Vehicle } from '@/types/Vehicle';

interface Props {
  vehicle: Vehicle;
  destinationPort: string;
  destinationPortName: string;
  deliveryDays: string;
  amount: number;
  onSuccess?: (whatsappUrl: string) => void;
  userProfile?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

const MobileMoneyCheckout: React.FC<Props> = ({ vehicle, destinationPort, destinationPortName, deliveryDays, amount, onSuccess, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const vehicleName = [vehicle.brand, vehicle.model].map((part) => part.trim()).filter(Boolean).join(' ');
  const vehicleDetails = [
    `*Nom du véhicule :* ${vehicleName}`,
    `*Marque :* ${vehicle.brand.trim()}`,
    `*Modèle :* ${vehicle.model.trim()}`,
    `*Année :* ${vehicle.year}`,
    `*État :* ${vehicle.status}`,
    `*Énergie :* ${vehicle.fuel}`,
    `*Transmission :* ${vehicle.transmission}`,
    `*Kilométrage :* ${vehicle.mileage.toLocaleString('fr-FR')} km`,
    `*Nombre de places :* ${vehicle.seats}`,
    `*Couleur :* ${vehicle.color}`,
    vehicle.badge ? `*Badge :* ${vehicle.badge}` : null,
    vehicle.powerHp ? `*Puissance :* ${vehicle.powerHp} ch` : null,
    vehicle.acceleration ? `*Accélération :* ${vehicle.acceleration}` : null,
    vehicle.rangeKm ? `*Autonomie :* ${vehicle.rangeKm} km` : null,
    vehicle.portsAvailable?.length ? `*Ports disponibles :* ${vehicle.portsAvailable.map((port) => port.trim()).join(', ')}` : null,
    vehicle.description?.trim() ? `*Description :*\n_${vehicle.description.trim()}_` : null,
  ].filter((line): line is string => Boolean(line));
  const vehicleOrderMessage = [
    '🚘 *DEMANDE DE COMMANDE*',
    '_Imperial China Export_',
    '',
    `Bonjour, je souhaite finaliser la commande du véhicule *${vehicleName}* vers le port de *${destinationPort}*.`,
    '',
    '📋 *DÉTAILS DU VÉHICULE*',
    ...vehicleDetails,
    '',
    '💰 *TARIFICATION*',
    `Prix d'achat en Chine : ${vehicle.priceChina.toLocaleString('fr-FR')} CNY`,
    `Fret : ${vehicle.freight.toLocaleString('fr-FR')} CNY`,
    `Frais de douane : ${vehicle.customsFee.toLocaleString('fr-FR')} FCFA`,
    `*Prix total estimé : ${vehicle.totalPriceFCFA.toLocaleString('fr-FR')} FCFA*`,
    '',
    '🔗 *PUBLICATION DU VÉHICULE*',
    `Voir l’annonce complète et ses photos : ${window.location.origin}/cars/${vehicle.id}`,
    '',
    '🚢 *LIVRAISON*',
    `*Destination :* ${destinationPort} - ${destinationPortName}`,
    deliveryDays ? `*Délai estimé :* ${deliveryDays}` : null,
  ].filter((line): line is string => Boolean(line)).join('\n');

  useEffect(() => {
    if (userProfile?.phone) {
      setPhoneNumber(userProfile.phone.replace(/[^0-9]/g, ''));
    }
  }, [userProfile]);

  const validatePhone = (value: string) => {
    const cleanNumber = value.replace(/[^0-9]/g, '');
    setPhoneNumber(cleanNumber);

    if (!selectedCountry.phonePattern.test(cleanNumber)) {
      setPhoneError(`Format incorrect pour le ${selectedCountry.name}. Attendu : ${selectedCountry.phonePlaceholder}`);
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handlePayment = async () => {
    if (!isCinetPayConfigured) {
      setStatus('error');
      setMessage('Le paiement Mobile Money est indisponible pour le moment. Contactez notre équipe pour finaliser votre commande.');
      return;
    }

    if (!validatePhone(phoneNumber)) return;

    setLoading(true);
    setStatus('idle');
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Veuillez vous connecter pour réserver.");

      const transactionId = `ICE-${Date.now()}`;
      const depositAmount = Math.round(amount * 0.1);

      const response: any = await initializeCinetPay({
        amount: depositAmount,
        currency: selectedCountry.currency,
        transactionId: transactionId,
        description: `Acompte 10% pour ${vehicleName}`,
        customerName: userProfile?.full_name?.split(' ')[0] || 'Client',
        customerSurname: userProfile?.full_name?.split(' ')[1] || 'ICE',
        customerEmail: user.email || '',
        customerPhoneNumber: phoneNumber,
      });

      if (response.status === 'ACCEPTED') {
        const { error: dbError } = await supabase.from('reservations').insert([{
          user_id: user.id,
          vehicle_id: vehicle.id,
          amount: depositAmount,
          status: 'Payé (Acompte)',
          destination_port: destinationPort,
          bl_number: transactionId
        }]);

        if (dbError) throw dbError;

        const orderDetails = [
          vehicleOrderMessage,
          '',
          '👤 *CLIENT*',
          `*Nom :* ${userProfile?.full_name || 'Non renseigné'}`,
          `*E-mail :* ${user.email || userProfile?.email || 'Non renseigné'}`,
          `*Téléphone de paiement :* ${phoneNumber} (${selectedCountry.name})`,
          '',
          '💳 *PAIEMENT CONFIRMÉ*',
          `*Référence :* ${transactionId}`,
          `*Acompte payé :* ${depositAmount.toLocaleString('fr-FR')} ${selectedCountry.currency}`,
          `*Montant total estimé :* ${amount.toLocaleString('fr-FR')} FCFA`,
          '_Paiement confirmé par CinetPay._',
        ].filter((line): line is string => Boolean(line));
        const whatsappUrl = `https://wa.me/33745636495?text=${encodeURIComponent(orderDetails.join('\n'))}`;

        setStatus('success');
        setMessage('Paiement validé ! Votre véhicule est réservé.');
        onSuccess?.(whatsappUrl);
      } else {
        throw new Error('Le paiement n’a pas été confirmé par l’opérateur.');
      }
    } catch (err: any) {
      console.error('Payment Error:', err);
      setStatus('error');
      setMessage(err.message || 'Le paiement a été annulé ou a échoué.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h3 className={styles.title}>Paiement de l'Acompte (10%)</h3>

      {/* 1. Sélecteur avec Drapeau */}
      <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
        <label className={styles.label}>VOTRE PAYS</label>
        <div style={{ position: 'relative' }}>
          <select
            className="input-premium"
            value={selectedCountry.code}
            onChange={(e) => {
              const country = countries.find(c => c.code === e.target.value) || countries[0];
              setSelectedCountry(country);
              setPhoneError(null);
            }}
            style={{ paddingLeft: '3.5rem' }}
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem' }}>
            {selectedCountry.flag}
          </span>
        </div>
      </div>

      {/* 2. Champ Numéro Téléphone */}
      <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
        <label className={styles.label}>NUMÉRO MOBILE MONEY</label>
        <div style={{ position: 'relative' }}>
          <input
            type="tel"
            className="input-premium"
            placeholder={selectedCountry.phonePlaceholder}
            value={phoneNumber}
            onChange={(e) => validatePhone(e.target.value)}
            style={{ paddingLeft: '3.5rem', borderColor: phoneError ? '#F43F5E' : '' }}
          />
          <PhoneIcon style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', color: 'var(--text-muted)' }} />
        </div>
        {phoneError && <p style={{ color: '#F43F5E', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 600 }}>{phoneError}</p>}
      </div>

      <div style={{ padding: '1.25rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Montant conversion :</span>
          <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.25rem' }}>
            {(amount * 0.1).toLocaleString()} {selectedCountry.currency}
          </span>
        </div>
      </div>

      {!isCinetPayConfigured && (
        <div className={styles.paymentUnavailable} role="status">
          <p>Le paiement Mobile Money n’est pas encore configuré. Contactez notre équipe pour finaliser la commande.</p>
          <a
            href={`https://wa.me/33745636495?text=${encodeURIComponent(vehicleOrderMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contacter l’équipe sur WhatsApp
          </a>
        </div>
      )}

      {status === 'error' && message && (
        <p role="alert" style={{ color: '#F43F5E', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ExclamationTriangleIcon style={{ width: '1.25rem', flexShrink: 0 }} />
          {message}
        </p>
      )}

      <button
        onClick={handlePayment}
        disabled={loading || !isCinetPayConfigured}
        className="btn-primary"
        style={{ width: '100%', height: '4rem', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: isCinetPayConfigured ? 1 : 0.55, cursor: isCinetPayConfigured ? 'pointer' : 'not-allowed' }}
      >
        {loading ? 'En attente de l’opérateur...' : isCinetPayConfigured ? `PAYER AVEC ${selectedCountry.flag}` : 'Paiement indisponible'}
      </button>
    </div>
  );
};

export default MobileMoneyCheckout;
