// src/components/MobileMoneyCheckout.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { initializeCinetPay, countries } from '@/lib/paymentProvider';
import styles from './StripeCheckout.module.css';
import { CheckCircleIcon, ExclamationTriangleIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface Props {
  vehicleId: string;
  vehicleName: string;
  amount: number;
  onSuccess?: () => void;
  userProfile?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

const MobileMoneyCheckout: React.FC<Props> = ({ vehicleId, vehicleName, amount, onSuccess, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

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
          vehicle_id: vehicleId,
          amount: depositAmount,
          status: 'Payé (Acompte)',
          destination_port: `Port de ${selectedCountry.name}`,
          bl_number: transactionId
        }]);

        if (dbError) throw dbError;
        setStatus('success');
        setMessage('Paiement validé ! Votre véhicule est réservé.');
        onSuccess?.();
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

      <button
        onClick={handlePayment}
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', height: '4rem', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
      >
        {loading ? 'Connexion opérateur...' : `PAYER AVEC ${selectedCountry.flag}`}
      </button>
    </div>
  );
};

export default MobileMoneyCheckout;
