// /src/app/profil/ProfileClientPage.jsx (COD COMPLET ACTUALIZAT CU CSS MODULES)

'use client';

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import styles from './profile.module.css'; // Importăm stilurile noi

export default function ProfileClientPage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', email: '', phoneNumber: '', role: '' });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditedData(data);
        } else {
          setUserData(null);
        }
      } catch {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

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

  const handleSaveClick = async () => {
    if (!editedData.name || !editedData.phoneNumber) {
      showToast('Numele și numărul de telefon sunt obligatorii!', 'error');
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedData.name,
          phoneNumber: editedData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la actualizarea profilului');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setIsEditing(false);
      showToast('Profil actualizat cu succes!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast(error.message || 'Eroare la actualizarea profilului.', 'error');
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Se încarcă profilul...</div>;
  }
  if (!userData) {
    return <div className={styles.errorContainer}>Nu s-au găsit date de profil. Te rugăm să te autentifici.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.profileCard}>
          
          {/* Header Profil */}
          <div className={styles.header}>
            <div className={styles.avatarCircle}>
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className={styles.userName}>{userData.name || 'Utilizator'}</h1>
            <p className={styles.userEmail}>{userData.email}</p>
          </div>

          {/* Formular Detalii */}
          <div className={styles.detailsSection}>
            <h2 className={styles.sectionTitle}>Detalii Profil</h2>
            
            {/* Câmp Nume */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Nume:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedData.name || ''}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <p className={styles.valueText}>{userData.name}</p>
              )}
            </div>

            {/* Câmp Email (Read-only) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email:</label>
              <p className={styles.valueText}>{userData.email}</p>
            </div>

            {/* Câmp Telefon */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phoneNumber">Număr de telefon:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editedData.phoneNumber || ''}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <p className={styles.valueText}>{userData.phoneNumber || 'N/A'}</p>
              )}
            </div>

            {/* Câmp Rol (Read-only) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Rol:</label>
              <p className={styles.valueText}>{userData.role}</p>
            </div>

            {/* Butoane Acțiune */}
            <div className={styles.buttonGroup}>
              {isEditing ? (
                <>
                  <button className={`${styles.btn} ${styles.saveBtn}`} onClick={handleSaveClick}>
                    Salvează
                  </button>
                  <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={handleCancelClick}>
                    Anulează
                  </button>
                </>
              ) : (
                <button className={`${styles.btn} ${styles.editBtn}`} onClick={handleEditClick}>
                  Editează Profilul
                </button>
              )}
            </div>

          </div> 
        </div>
      </div>
    </div>
  );
}