// /src/app/login/page.js (COD COMPLET - REDIRECȚIONARE CLIENT + OCHI PAROLĂ)

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { useToast } from '../../context/ToastContext'; 
import styles from '@/components/AuthForm.module.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        const userRole = data.user.role; // 'client' sau 'partner' (lowercase din API)
        
        showToast(`Logare reușită! Bine ai venit, ${data.user.name || userRole}.`, 'success'); 

        // Salvăm rolul pentru AuthStatus (componenta Header)
        localStorage.setItem('userRole', userRole);

        // Forțăm o reîmprospătare a router-ului pentru a actualiza cookie-urile/sesiunea în middleware
        router.refresh();

        // LOGICA DE REDIRECȚIONARE ACTUALIZATĂ
        if (userRole === 'partner') {
          router.push('/dashboard');
        } else {
          // ACUM TE TRIMITE DIRECT LA PROFIL
          router.push('/profil'); 
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
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password cu buton de vizualizare */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Parolă</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '40px' }} 
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                padding: '0',
                top: '15px'
              }}
              tabIndex="-1"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Se încarcă...' : 'Autentificare'}
        </button>
      </form>

      <div className={styles.authLink}>
        Nu ai un cont? <Link href="/inregistrare-client">Înregistrează-te aici</Link>
      </div>
    </div>
  );
}