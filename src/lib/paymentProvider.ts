// src/lib/paymentProvider.ts

/**
 * Liste exhaustive des pays avec drapeaux, devises et formats de numéros
 */
export const countries = [
  {
    code: 'CI',
    name: 'Côte d’Ivoire',
    flag: '🇨🇮',
    currency: 'XOF',
    phonePattern: /^[0-9]{10}$/,
    phonePlaceholder: '01 02 03 04 05 (10 chiffres)'
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    currency: 'XAF',
    phonePattern: /^[0-9]{9}$/,
    phonePlaceholder: '6XXXXXXXX (9 chiffres)'
  },
  {
    code: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    currency: 'XOF',
    phonePattern: /^[0-9]{9}$/,
    phonePlaceholder: '7XXXXXXXX (9 chiffres)'
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    currency: 'XAF',
    phonePattern: /^[0-9]{8,9}$/,
    phonePlaceholder: '0XXXXXXXX (8-9 chiffres)'
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    currency: 'XOF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'BJ',
    name: 'Bénin',
    flag: '🇧🇯',
    currency: 'XOF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    currency: 'XOF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    currency: 'XOF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    currency: 'XOF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'GN',
    name: 'Guinée Conakry',
    flag: '🇬🇳',
    currency: 'GNF',
    phonePattern: /^[0-9]{9}$/,
    phonePlaceholder: '6XXXXXXXX (9 chiffres)'
  },
  {
    code: 'CD',
    name: 'RDC (Kinshasa)',
    flag: '🇨🇩',
    currency: 'CDF',
    phonePattern: /^[0-9]{9}$/,
    phonePlaceholder: '8XXXXXXXX (9 chiffres)'
  },
  {
    code: 'CG',
    name: 'Congo Brazzaville',
    flag: '🇨🇬',
    currency: 'XAF',
    phonePattern: /^[0-9]{9}$/,
    phonePlaceholder: '0XXXXXXXX (9 chiffres)'
  },
  {
    code: 'TD',
    name: 'Tchad',
    flag: '🇹🇩',
    currency: 'XAF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'CF',
    name: 'Centrafrique',
    flag: '🇨🇫',
    currency: 'XAF',
    phonePattern: /^[0-9]{8}$/,
    phonePlaceholder: 'XXXXXXXX (8 chiffres)'
  },
  {
    code: 'GQ',
    name: 'Guinée Équatoriale',
    flag: '🇬🇶',
    currency: 'XAF',
    phonePattern: /^[0-9]{9}$/,
    phonePlaceholder: 'XXXXXXXXX (9 chiffres)'
  },
];

const cinetPayApiKey = import.meta.env.VITE_CINETPAY_API_KEY?.trim();
const cinetPaySiteId = import.meta.env.VITE_CINETPAY_SITE_ID?.trim();

export const isCinetPayConfigured = Boolean(
  cinetPayApiKey &&
  cinetPaySiteId &&
  !cinetPayApiKey.toLowerCase().includes('placeholder') &&
  !cinetPaySiteId.toLowerCase().includes('placeholder')
);

// Chargement dynamique et asynchrone du SDK CinetPay à la demande
const loadCinetPayScript = (): Promise<void> => {
  if (typeof window !== 'undefined' && (window as any).CinetPay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId: number;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      if (error) reject(error);
      else if ((window as any).CinetPay) resolve();
      else reject(new Error("Le SDK CinetPay n'a pas pu être initialisé."));
    };
    const handleLoad = () => finish();
    const handleError = () => finish(new Error("Impossible de joindre le serveur CinetPay."));

    timeoutId = window.setTimeout(
      () => finish(new Error("Le service de paiement met trop de temps à répondre. Vérifiez votre connexion puis réessayez.")),
      15000
    );

    const existing = document.getElementById('cinetpay-sdk');
    if (existing) {
      if ((window as any).CinetPay) return finish();
      existing.addEventListener('load', handleLoad, { once: true });
      existing.addEventListener('error', handleError, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'cinetpay-sdk';
    script.src = 'https://checkout.cinetpay.com/sdk/v1/cinetpay.js';
    script.async = true;
    script.onload = handleLoad;
    script.onerror = handleError;
    document.body.appendChild(script);
  });
};

export const initializeCinetPay = async (data: {
  amount: number;
  currency: string;
  transactionId: string;
  description: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhoneNumber: string;
}) => {
  if (!isCinetPayConfigured) {
    throw new Error('Le paiement Mobile Money est indisponible pour le moment. Contactez notre équipe pour finaliser votre commande.');
  }

  await loadCinetPayScript();

  return new Promise((resolve, reject) => {
    if (!(window as any).CinetPay) {
      reject("Le SDK CinetPay n'a pas pu être initialisé.");
      return;
    }

    const cp = (window as any).CinetPay;
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("Aucune réponse de l'opérateur après 90 secondes. Vérifiez l'état de votre paiement avant de réessayer."));
    }, 90000);
    const finish = (callback: (value: any) => void, value: any) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      callback(value);
    };

    try {
      cp.setConfig({
        apikey: cinetPayApiKey,
        site_id: cinetPaySiteId,
        notify_url: 'https://votre-domaine.com/api/payment-notify',
        mode: 'PRODUCTION'
      });

      cp.getCheckout({
        transaction_id: data.transactionId,
        amount: data.amount,
        currency: data.currency,
        channels: 'ALL',
        description: data.description,
        customer_name: data.customerName,
        customer_surname: data.customerSurname,
        customer_email: data.customerEmail,
        customer_phone_number: data.customerPhoneNumber,
        customer_address: 'AD',
        customer_city: 'City',
        customer_country: 'CI',
        customer_state: 'ST',
        customer_zip_code: '00225',
      });

      cp.waitResponse((response: any) => {
        if (response.status === 'ACCEPTED') {
          finish(resolve, response);
        } else {
          finish(reject, new Error("Le paiement n'a pas été confirmé par l'opérateur."));
        }
      });

      cp.onError((error: any) => {
        finish(reject, new Error(error?.message || "Le service de paiement a rencontré une erreur."));
      });
    } catch (error) {
      finish(reject, error instanceof Error ? error : new Error("Impossible de démarrer le paiement."));
    }
  });
};
