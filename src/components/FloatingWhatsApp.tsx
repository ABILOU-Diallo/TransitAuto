import React from 'react';
import styles from './FloatingWhatsApp.module.css';

const FloatingWhatsApp: React.FC = () => {
  const phoneNumber = '+33 7 45 63 64 95';
  const waUrl = 'https://wa.me/33745636495?text=' + encodeURIComponent('Bonjour IMPERIAL CHINA EXPORT, je souhaite avoir des informations sur vos services.');

  return (
    <div className={styles.floatingContainer}>
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.whatsappButton}
        aria-label={`Contacter IMPERIAL CHINA EXPORT sur WhatsApp au ${phoneNumber}`}
        title={`WhatsApp Direct: ${phoneNumber}`}
      >
        <div className={styles.pulseRing} />
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.16C10.55 20.16 9.09 19.76 7.82 19L7.52 18.82L4.41 19.64L5.24 16.61L5.04 16.3C4.21 14.98 3.77 13.47 3.77 11.91C3.77 7.36 7.48 3.64 12.04 3.64C14.25 3.64 16.32 4.51 17.89 6.07C19.45 7.64 20.31 9.71 20.31 11.92C20.31 16.47 16.6 20.16 12.04 20.16ZM16.57 14.33C16.32 14.2 15.11 13.61 14.88 13.52C14.65 13.44 14.49 13.4 14.33 13.65C14.16 13.9 13.69 14.46 13.54 14.63C13.4 14.8 13.25 14.82 13 14.7C12.75 14.57 11.71 14.23 10.48 13.14C9.52 12.28 8.87 11.23 8.68 10.98C8.5 10.73 8.66 10.6 8.78 10.48C8.89 10.37 9.03 10.19 9.16 10.04C9.28 9.89 9.32 9.79 9.4 9.62C9.48 9.45 9.44 9.31 9.38 9.18C9.32 9.05 8.82 7.84 8.62 7.33C8.42 6.84 8.21 6.9 8.06 6.9C7.92 6.9 7.75 6.9 7.59 6.9C7.42 6.9 7.15 6.96 6.92 7.21C6.69 7.46 6.05 8.06 6.05 9.28C6.05 10.5 6.94 11.67 7.06 11.84C7.19 12 8.8 14.48 11.26 15.54C11.85 15.79 12.3 15.94 12.66 16.05C13.25 16.24 13.79 16.21 14.22 16.15C14.7 16.08 15.7 15.54 15.91 14.95C16.11 14.36 16.11 13.86 16.05 13.76C15.99 13.66 15.82 13.59 15.57 13.46L16.57 14.33Z" />
          </svg>
        </div>
        <div className={styles.textGroup}>
          <span className={styles.label}>WhatsApp Direct</span>
          <span className={styles.phone}>{phoneNumber}</span>
        </div>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
