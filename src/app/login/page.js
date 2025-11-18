// /src/app/login/page.js (COD COMPLET FINAL)

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importă Link
import { useToast } from '../../context/ToastContext'; 
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
        
        showToast(`Logare reușită! Bine ai venit, ${data.user.name || userRole}.`, 'success'); 

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
            type="email"
            id="email"
            className={styles.inputField} // Adăugat clasa
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Parolă</label>
          <input
            type="password"
            id="password"
            className={styles.inputField} // Adăugat clasa
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Se încarcă...' : 'Autentificare'}
        </button>
      </form>

      {/* Link către înregistrare */}
      <div className={styles.authLink}>
        Nu ai un cont? <Link href="/inregistrare-client">Înregistrează-te aici</Link>
      </div>
    </div>
  );
}