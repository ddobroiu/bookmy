// /app/inregistrare-client/page.js (COD COMPLET - ROL CLIENT)

'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Importă Link
import styles from '../../components/AuthForm.module.css'; 

export default function RegisterClientPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ROLUL ESTE SETAT AUTOMAT LA 'client'
  const role = 'client'; 
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
          text: `Înregistrare Client reușită! ${data.message} Te rugăm să verifici email-ul (${email}).`
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
      <h1>Înregistrare (Client)</h1>
      <p>Creați-vă contul pentru a face programări rapid.</p>

      <form onSubmit={handleSubmit}>
        
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

      {/* Link către login */}
      <div className={styles.authLink}>
        Ai deja un cont? <Link href="/login">Autentifică-te</Link>
      </div>
    </div>
  );
}