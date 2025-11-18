// /src/app/login/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../context/ToastContext';
import styles from '@/components/AuthForm.module.css';

interface UserData {
  role: string;
  name?: string;
}

interface LoginResponse {
  message: string;
  user?: UserData;
}

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        const userRole = data.user?.role;

        if (userRole) {
          showToast(`Logare reușită! Bine ai venit, ${data.user.name || userRole}.`, 'success');
          localStorage.setItem('userRole', userRole);

          if (userRole === 'PARTENER') { // Assuming 'PARTENER' is the correct enum value
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        } else {
          showToast('Logare reușită, dar rolul utilizatorului lipsește.', 'warning');
          router.push('/'); // Default redirect
        }
      } else {
        showToast(data.message || 'Credențiale invalide.', 'error');
      }
    } catch (error: any) {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Parolă</label>
          <input
            type="password"
            id="password"
            className={styles.inputField}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
