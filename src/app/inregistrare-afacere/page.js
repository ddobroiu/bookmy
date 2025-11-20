// /app/inregistrare-afacere/page.js (COD COMPLET - ROL PARTNER)

'use client';

import React, { useState } from 'react';
import styles from '../../components/AuthForm.module.css'; 

export default function RegisterPartnerPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ROLUL ESTE SETAT AUTOMAT LA 'PARTENER' (majuscule pentru backend)
  const role = 'PARTNER'; 
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
        // Trimitem rolul fix
        body: JSON.stringify({ email, password, role }), 
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Înregistrare Afacere reușită! ${data.message} Te rugăm să verifici email-ul (${email}).`
        });
        setEmail('');
        setPassword('');
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
      <h1>Înregistrare Afacere (Partener)</h1>
      <p>Înregistrați-vă salonul pentru a începe programările online.</p>

      <form onSubmit={handleSubmit}>
        
        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email de Afacere</label>
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
          {loading ? 'Se înregistrează...' : 'Înregistrează Afacerea'}
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