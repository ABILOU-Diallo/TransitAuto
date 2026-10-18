// src/components/StripeCheckout.tsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabaseClient';
import styles from './StripeCheckout.module.css';

interface Props {
  vehicleId: string;
  amount: number; // amount in FCFA
  onSuccess?: () => void;
}

const StripeCheckout: React.FC<Props> = ({ vehicleId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      // Appel à une fonction Edge Supabase réelle (doit être déployée par l'utilisateur)
      const { data, error: functionError } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, vehicleId },
      });

      if (functionError) throw new Error(functionError.message);

      const clientSecret = data?.client_secret;
      if (!clientSecret) throw new Error('Impossible de récupérer le secret de paiement.');

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'Client IMPERIAL CHINA EXPORT' },
        },
      });

      if (result.error) {
        setStatusMessage(result.error.message || 'Erreur lors du paiement.');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setStatusMessage('Paiement réussi ! Votre acompte est validé.');

        // Mise à jour réelle du statut en base de données
        const { error: updateError } = await supabase
          .from('reservations')
          .update({ status: 'Payé (Confirmé)' })
          .eq('vehicle_id', vehicleId);

        if (updateError) console.error('Erreur mise à jour reservation:', updateError);

        onSuccess?.();
      }
    } catch (err: any) {
      setStatusMessage(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>Paiement Sécurisé de l'Acompte</h3>
      <div className={styles.cardElementWrapper}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#38BDF8',
              '::placeholder': { color: '#94A3B8' },
            },
          },
        }} />
      </div>

      {statusMessage && (
        <div className={styles.statusMessage} style={{ color: statusMessage.includes('Erreur') ? '#F43F5E' : 'var(--primary)' }}>
          {statusMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary"
        style={{ width: '100%', padding: '1rem', fontWeight: 700 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
            Traitement...
          </span>
        ) : (
          `Payer l'acompte : ${(amount * 0.1).toLocaleString('fr-FR')} FCFA`
        )}
      </button>
    </form>
  );
};

export default StripeCheckout;
