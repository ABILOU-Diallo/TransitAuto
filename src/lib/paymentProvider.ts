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

export const initializeCinetPay = (data: {
  amount: number;
  currency: string;
  transactionId: string;
  description: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhoneNumber: string;
}) => {
  return new Promise((resolve, reject) => {
    if (!(window as any).CinetPay) {
      reject("Le SDK CinetPay n'est pas chargé. Vérifiez votre connexion internet.");
      return;
    }

    const cp = (window as any).CinetPay;

    cp.setConfig({
      apikey: import.meta.env.VITE_CINETPAY_API_KEY,
      site_id: import.meta.env.VITE_CINETPAY_SITE_ID,
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
        resolve(response);
      } else {
        reject(response);
      }
    });

    cp.onError((error: any) => {
      reject(error);
    });
  });
};
