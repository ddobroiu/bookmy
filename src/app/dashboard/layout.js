// /app/dashboard/layout.js (COD COMPLET CU ABONAMENT ȘI LOGOUT)

'use client'; // Necesită Client Component pentru a folosi useRouter și funcții

import React from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css'; 

// Componenta de Sidebar (acum cu link Abonament și Log Out)
const DashboardSidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Apel API pentru a șterge cookie-ul 
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error("Eroare la logout API, continuăm ștergerea locală.");
    }

    // 2. Ștergem starea locală
    localStorage.removeItem('userRole');
    localStorage.removeItem('salonSetup');
    
    // 3. Redirecționăm la pagina de logare
    router.push('/login');
    router.refresh(); // Forțăm reîncărcarea componentelor
  };

  return (
    <aside>
      <h2>BooksApp Admin</h2>
      <nav>
        <a href="/dashboard">Acasă</a>
        <a href="/dashboard/calendar">Calendar</a>
        <a href="/dashboard/services">Servicii</a>
        {/* LINK NOU: Pagina de abonament */}
        <a href="/dashboard/subscription" style={{fontWeight: 700, color: '#ffc107'}}>Abonament</a> 
      </nav>
      
      {/* Noul buton Log Out (folosește clasa CSS "logoutButton") */}
      <button 
          className="logoutButton" 
          onClick={handleLogout}
      >
          Deconectare
      </button>
    </aside>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <DashboardSidebar />
      <main>
        {children}
      </main>
    </div>
  );
}