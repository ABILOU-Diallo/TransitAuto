// src/pages/admin/AdminContacts.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  EnvelopeIcon,
  TrashIcon,
  CheckCircleIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import styles from '../Admin.module.css';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContacts: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('contacts').update({ is_read: true }).eq('id', id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm('Supprimer ce message ?')) {
      await supabase.from('contacts').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <div className={styles.moduleContainer}>
      <div className={styles.moduleHeader}>
        <div>
          <h2 className={styles.tabTitle}>Messages & Contacts</h2>
          <p className={styles.tabSubtitle}>Gérez les demandes de renseignements des prospects.</p>
        </div>
      </div>

      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.placeholder}>Aucun message reçu.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageCard} ${!msg.is_read ? styles.unreadMessage : ''}`}>
              <div className={styles.messageHeader}>
                <div className={styles.senderInfo}>
                  <div className={styles.avatarMini}>{msg.name.charAt(0)}</div>
                  <div>
                    <h4 className={msg.is_read ? '' : styles.bold}>{msg.name}</h4>
                    <p className={styles.muted}>{msg.email}</p>
                  </div>
                </div>
                <span className={styles.date}>{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>

              <div className={styles.messageBody}>
                <h5 className={styles.bold}>{msg.subject}</h5>
                <p className={styles.textPreview}>{msg.message}</p>
              </div>

              <div className={styles.messageFooter}>
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className={styles.textBtnIcon}>
                    <EnvelopeOpenIcon style={{width: '1rem'}}/> Marquer comme lu
                  </button>
                )}
                <button onClick={() => deleteMessage(msg.id)} className={styles.iconBtn} style={{color: '#ef4444'}}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
