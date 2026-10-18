// src/pages/Reviews.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import styles from './Reviews.module.css';
import { StarIcon, ChatBubbleLeftRightIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { countries } from '@/lib/paymentProvider';

interface Review {
  id: string;
  user_name: string;
  country_code: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const getCountryInfo = (code: string) => {
    return countries.find(c => c.code === code) || { flag: '🌍', name: 'Afrique' };
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroContent}
          >
            <span className="badge-luxury">Communauté Imperial China Export</span>
            <h1 className={styles.title}>Avis de nos <span className="text-shine">Clients en Afrique</span></h1>
            <p className={styles.description}>
              Découvrez les témoignages de ceux qui nous ont fait confiance pour l'importation de leurs véhicules de Chine vers le Cameroun, la Côte d'Ivoire, le Sénégal et bien plus.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement des avis...</div>
        ) : (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => {
              const country = getCountryInfo(review.country_code);
              return (
                <motion.div
                  key={review.id}
                  className={styles.reviewCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={styles.userName}>{review.user_name}</h3>
                      <div className={styles.countryInfo}>
                        <span className={styles.flag}>{country.flag}</span>
                        <span className={styles.countryName}>{country.name}</span>
                      </div>
                    </div>
                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          style={{ width: '1rem', color: i < review.rating ? '#F59E0B' : '#CBD5E1' }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.commentContent}>
                    <ChatBubbleLeftRightIcon className={styles.quoteIcon} />
                    <p className={styles.commentText}>{review.comment}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.date}>
                      {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className={styles.verified}>
                      <MapPinIcon style={{ width: '0.8rem' }} /> Livraison Port Validée
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
