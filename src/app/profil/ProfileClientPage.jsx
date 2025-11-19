// /src/app/profil/ProfileClientPage.jsx (COD COMPLET FINAL - FĂRĂ CACHE)

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext';
import styles from './profile.module.css';
import { FaUserEdit, FaSave, FaTimes, FaCamera, FaSignInAlt } from 'react-icons/fa';

export default function ProfileClientPage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', email: '', phoneNumber: '', role: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  const { showToast } = useToast();
  const router = useRouter();

  // Fetch date utilizator
  useEffect(() => {
    async function fetchProfile() {
      try {
        // MODIFICARE CRITICĂ AICI:
        // Adăugăm opțiuni pentru a preveni cache-ul browserului
        const response = await fetch('/api/user/profile', {
            cache: 'no-store',
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (response.status === 401) {
            // Dacă primim 401, înseamnă că sesiunea chiar a expirat sau lipsește
            setUserData(null);
            return;
        }

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditedData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleGoToLogin = () => {
      localStorage.removeItem('userRole');
      router.push('/login');
      router.refresh();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('Imaginea este prea mare (max 2MB).', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setEditedData((prev) => ({
            ...prev,
            avatarUrl: reader.result
        }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
      if (isEditing && fileInputRef.current) {
          fileInputRef.current.click();
      }
  };

  const handleSaveClick = async () => {
    if (!editedData.name || !editedData.phoneNumber) {
      showToast('Numele și numărul de telefon sunt obligatorii!', 'error');
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedData.name,
          phoneNumber: editedData.phoneNumber,
          avatarUrl: editedData.avatarUrl,
        }),
      });

      if (!response.ok) throw new Error('Eroare la actualizare');

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setIsEditing(false);
      showToast('Profil actualizat cu succes!', 'success');
    } catch (error) {
      showToast('Nu am putut actualiza profilul.', 'error');
    }
  };

  if (loading) return <div className={styles.loading}>Se încarcă datele...</div>;

  // --- STARE DE EROARE / SESIUNE EXPIRATĂ ---
  if (!userData) {
    return (
        <div className={styles.profileCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
            <h2 style={{ color: '#e64c3c', marginBottom: '20px' }}>Sesiune Expirată</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Te rugăm să te autentifici din nou pentru a accesa profilul.</p>
            <button 
                onClick={handleGoToLogin}
                className={styles.saveBtn} 
                style={{ padding: '12px 25px', fontSize: '16px' }}
            >
                <FaSignInAlt style={{ marginRight: '8px' }} /> Mergi la Autentificare
            </button>
        </div>
    );
  }

  // --- CONȚINUT NORMAL (LOGAT) ---
  return (
    <div className={styles.profileCard}>
      
      <div className={styles.header}>
        <div className={styles.avatarWrapper} onClick={triggerFileInput} title={isEditing ? "Schimbă poza" : ""} style={{ cursor: isEditing ? 'pointer' : 'default' }}>
            <div className={styles.avatarCircle}>
              {editedData.avatarUrl || userData.avatarUrl ? (
                  <img 
                    src={isEditing ? editedData.avatarUrl : userData.avatarUrl} 
                    alt="Avatar" 
                    className={styles.avatarImage} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
              ) : (
                  userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            
            {isEditing && (
                <div className={styles.uploadOverlay}>
                    <FaCamera />
                </div>
            )}
            
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleImageUpload}
            />
        </div>

        <div>
          <h1 className={styles.userName}>{userData.name || 'Utilizator'}</h1>
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Date Personale</h2>
      
      <div className={styles.formGrid}>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Nume și Prenume</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedData.name || ''}
              onChange={handleChange}
              className={styles.inputField}
            />
          ) : (
            <div className={styles.valueText}>{userData.name || '-'}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Număr Telefon</label>
          {isEditing ? (
            <input
              type="text"
              name="phoneNumber"
              value={editedData.phoneNumber || ''}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="07xx xxx xxx"
            />
          ) : (
            <div className={styles.valueText}>{userData.phoneNumber || 'Nespecificat'}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Adresă Email</label>
          <input 
            type="text" 
            value={userData.email} 
            disabled 
            className={`${styles.inputField} ${styles.readOnlyField}`} 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tip Cont</label>
          <div className={styles.valueText} style={{ textTransform: 'capitalize' }}>
            {userData.role?.toLowerCase()}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button className={`${styles.btn} ${styles.saveBtn}`} onClick={handleSaveClick}>
                <FaSave /> Salvează Modificările
              </button>
              <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={handleCancelClick}>
                <FaTimes /> Anulează
              </button>
            </>
          ) : (
            <button className={`${styles.btn} ${styles.editBtn}`} onClick={handleEditClick}>
              <FaUserEdit /> Editează Profilul
            </button>
          )}
        </div>

      </div>
    </div>
  );
}