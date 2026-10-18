// src/pages/admin/AdminReviews.tsx
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  TrashIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import styles from '../Admin.module.css';
import { countries } from '@/lib/paymentProvider';

const AdminReviews: React.FC = () => {
  const { adminReviews, fetchAdminReviews, deleteReview } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminReviews();
  }, [fetchAdminReviews]);

  const filteredReviews = adminReviews.filter(review =>
    review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.moduleContainer}>
      <div className={styles.moduleHeader}>
        <div>
          <h2 className={styles.tabTitle}>Avis & Témoignages</h2>
          <p className={styles.tabSubtitle}>Modérez les commentaires clients affichés sur le site.</p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.headerSearch}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher dans les avis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.reviewsGrid}>
        {filteredReviews.map((review) => {
          const country = countries.find(c => c.code === review.country_code);
          return (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewCardHeader}>
                <div className={styles.avatar}>
                  {review.user_name.charAt(0)}
                </div>
                <div className={styles.reviewMeta}>
                  <h3 className={styles.bold}>{review.user_name}</h3>
                  <p className={styles.muted}>{country?.flag} {country?.name}</p>
                </div>
                <div className={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ?
                    <StarIconSolid key={i} style={{ width: '1rem', color: '#F59E0B' }} /> :
                    <StarIcon key={i} style={{ width: '1rem', color: '#CBD5E1' }} />
                  ))}
                </div>
              </div>

              <div className={styles.reviewBody}>
                <ChatBubbleLeftRightIcon className={styles.quoteIcon} />
                <p className={styles.reviewText}>{review.comment}</p>
              </div>

              <div className={styles.reviewFooter}>
                <span className={styles.date}>{new Date(review.created_at).toLocaleDateString()}</span>
                <div className={styles.actionBtns}>
                  <button
                    className={styles.iconBtn}
                    style={{ color: '#ef4444' }}
                    onClick={() => { if(window.confirm('Supprimer cet avis ?')) deleteReview(review.id); }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReviews;
