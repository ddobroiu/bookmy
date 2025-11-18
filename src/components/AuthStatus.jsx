// /components/AuthStatus.jsx (COD COMPLET)

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css'; // Folosim stilurile Header-ului

export default function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verificăm starea de logare din localStorage (simulare)
    const role = localStorage.getItem('userRole');
    if (role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = async () => {
    // 1. Apelăm API-ul de logout (care șterge cookie-urile)
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error("Eroare la logout API, continuăm deconectarea locală.");
    }

    // 2. Ștergem starea locală
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    
    // 3. Redirecționăm la pagina principală
    router.push('/');
    router.refresh(); // Forțăm reîncărcarea componentelor de server
  };

  if (!isLoggedIn) {
    // Afișăm butoanele standard dacă nu este logat
    return (
      <>
        <Link href="/login" passHref legacyBehavior>
          <button className={styles.loginBtn}>
            Logare
          </button>
        </Link>
        <Link href="/inregistrare-afacere" passHref legacyBehavior>
          <button className={styles.registerBtn}>
            Înregistrează-te
          </button>
        </Link>
      </>
    );
  }

  // Afișăm butonul Deconectare și link-ul specific rolului
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '14px', color: '#333' }}>
        Salut, {userRole === 'partner' ? 'Partener' : 'Client'}
      </span>
      
      {userRole === 'partner' && (
        <Link href="/dashboard" passHref legacyBehavior>
          <button className={styles.loginBtn} style={{ borderColor: '#1aa858', color: '#1aa858' }}>
            Dashboard
          </button>
        </Link>
      )}

      <button onClick={handleLogout} className={styles.registerBtn} style={{ backgroundColor: '#e64c3c' }}>
        Deconectare
      </button>
    </div>
  );
}