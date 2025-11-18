// /app/login/page.js (COD COMPLET CU CALEA ABSOLUTĂ @/)

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext'; // Calea contextului
// CORECTAT: FOLOSIM CALEA ABSOLUTĂ CĂTRE COMPONENTA COMUNĂ DE STILURI
import styles from '@/components/AuthForm.module.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userRole = data.user.role;
        showToast(`Logare reușită! Bine ai venit, ${userRole}.`, 'success'); 

        localStorage.setItem('userRole', userRole);

        if (userRole === 'partner') {
          router.push('/dashboard');
        } else {
          router.push('/'); 
        }
        
      } else {
        showToast(data.message || 'Credențiale invalide.', 'error');
      }
    } catch (error) {
      console.error('Frontend login error:', error);
      showToast('A apărut o eroare de rețea. Vă rugăm reîncercați.', 'error');
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
      
      <p style={{marginTop: '20px'}}>
          Nu ai cont? <a href="/inregistrare-client" style={{color: '#007bff'}}>Înregistrează-te</a>
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