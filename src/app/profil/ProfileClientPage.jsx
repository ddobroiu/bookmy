// /src/app/profil/ProfileClientPage.jsx (COD COMPLET ACTUALIZAT CU ÎNCĂRCARE POZĂ)

'use client';

import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import styles from './profile.module.css';
import { FaUserEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

export default function ProfileClientPage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', email: '', phoneNumber: '', role: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null); // Referință către input-ul ascuns
  const { showToast } = useToast();

  // Fetch date utilizator
  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Populăm și editedData cu avatarul existent
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
    setEditedData(userData); // Resetăm la datele originale
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gestionarea încărcării imaginii
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validare simplă mărime (max 2MB pentru base64)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Imaginea este prea mare (max 2MB).', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        // Setăm string-ul Base64 în starea editedData
        setEditedData((prev) => ({
            ...prev,
            avatarUrl: reader.result
        }));
    };
    reader.readAsDataURL(file);
  };

  // Trigger pentru input-ul de fișier ascuns
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
          avatarUrl: editedData.avatarUrl, // Trimitem și imaginea
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
  if (!userData) return <div className={styles.error}>Nu ești autentificat.</div>;

  return (
    <div className={styles.profileCard}>
      
      {/* Header cu Avatar */}
      <div className={styles.header}>
        
        {/* Wrapper Avatar */}
        <div className={styles.avatarWrapper} onClick={triggerFileInput}>
            <div className={styles.avatarCircle}>
              {editedData.avatarUrl ? (
                  <img src={editedData.avatarUrl} alt="Avatar" className={styles.avatarImage} />
              ) : (
                  userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            
            {/* Iconița de editare apare doar în modul editare */}
            {isEditing && (
                <div className={styles.uploadOverlay}>
                    <FaCamera />
                </div>
            )}
            
            {/* Input ascuns pentru fișier */}
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

      {/* Formular Date */}
      <h2 className={styles.sectionTitle}>Date Personale</h2>
      
      <div className={styles.formGrid}>
        
        {/* Nume */}
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

        {/* Telefon */}
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

        {/* Email (Read-only) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Adresă Email</label>
          <input 
            type="text" 
            value={userData.email} 
            disabled 
            className={`${styles.inputField} ${styles.readOnlyField}`} 
          />
        </div>

        {/* Tip Cont (Read-only) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tip Cont</label>
          <div className={styles.valueText} style={{ textTransform: 'capitalize' }}>
            {userData.role?.toLowerCase()}
          </div>
        </div>

        {/* Butoane Acțiune */}
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