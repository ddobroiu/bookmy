// /app/register/page.js (COD COMPLET CU LOGICĂ DE ÎNREGISTRARE ȘI RESEND)

'use client';

import React, { useState } from 'react';
import styles from './register.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default: client
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Înregistrare reușită! ${data.message} Te rugăm să verifici email-ul (${email}).`
        });
        // Resetare formular
        setEmail('');
        setPassword('');
        setRole('client');
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Eroare la înregistrare.' 
        });
      }
    } catch (error) {
      console.error('Frontend registration error:', error);
      setMessage({ 
        type: 'error', 
        text: 'A apărut o eroare de rețea. Vă rugăm reîncercați.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h1>Înregistrare BooksApp</h1>
      <p>Alege-ți tipul de cont pentru a continua:</p>

      <form onSubmit={handleSubmit}>
        
        {/* Selector de Rol */}
        <div className={styles.formGroup}>
          <div className={styles.roleSelector}>
            <button
              type="button"
              className={`${styles.roleButton} ${role === 'client' ? styles.active : ''}`}
              onClick={() => setRole('client')}
            >
              Clienți (Vreau să mă programez)
            </button>
            <button
              type="button"
              className={`${styles.roleButton} ${role === 'partner' ? styles.active : ''}`}
              onClick={() => setRole('partner')}
            >
              Parteneri (Vreau să înregistrez un Salon)
            </button>
          </div>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Parolă */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Parolă</label>
          <input
            id="password"
            type="password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Se înregistrează...' : 'Înregistrează-te'}
        </button>
      </form>

      {/* Mesaje de feedback */}
      {message.text && (
        <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.text}
        </p>
      )}

    </div>
  );
}