// /app/login/page.js (COD COMPLET CU CALEA NOUĂ CSS)

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// ATENȚIE: Noua cale: Ieși din /app/login (..) și intră în /components
import styles from '../../components/AuthForm.module.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userRole = data.user.role;
        setMessage({ type: 'success', text: `Logare reușită! Rol: ${userRole}. Redirecționare...` });

        localStorage.setItem('userRole', userRole);

        if (userRole === 'partner') {
          router.push('/dashboard');
        } else {
          router.push('/'); 
        }
        
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Credențiale invalide.' 
        });
      }
    } catch (error) {
      console.error('Frontend login error:', error);
      setMessage({ type: 'error', text: 'A apărut o eroare de rețea.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h1>Autentificare BooksApp</h1>
      <p>Vă rugăm introduceți datele de logare.</p>

      <form onSubmit={handleLogin}>
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
          {loading ? 'Se autentifică...' : 'Logare'}
        </button>
      </form>

      {/* Mesaje de feedback */}
      {message.text && (
        <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.text}
        </p>
      )}

      <p style={{marginTop: '20px'}}>
          Nu ai cont? <a href="/register" style={{color: '#007bff'}}>Înregistrează-te</a>
      </p>

      {/* Instrucțiuni de Test */}
      <div style={{marginTop: '40px', padding: '10px', borderTop: '1px solid #eee', fontSize: '12px'}}>
          <p>Pentru a testa:</p>
          <p>Client: <strong>client@test.com</strong> / 123</p>
          <p>Partener: <strong>partner@test.com</strong> / 123</p>
      </div>

    </div>
  );
}