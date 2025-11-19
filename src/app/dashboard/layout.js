// /src/app/dashboard/layout.js (COD COMPLET - INCLUDE MESAJE)

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
// Importăm toate iconițele necesare
import { 
  FaCalendarAlt, 
  FaListUl, 
  FaImages, 
  FaStar, 
  FaSignOutAlt, 
  FaCrown, 
  FaHome, 
  FaConciergeBell,
  FaCog,
  FaFileContract,
  FaEnvelope // <-- Iconița pentru Mesaje
} from 'react-icons/fa';
import './dashboard.css'; 

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error("Eroare la logout API");
    }
    localStorage.removeItem('userRole');
    localStorage.removeItem('salonSetup');
    router.push('/login');
    router.refresh();
  };

  // Helper pentru stilul link-urilor active
  const getLinkStyle = (path) => {
      const isActive = pathname === path;
      return {
          color: isActive ? '#fff' : '#e6e6e6',
          backgroundColor: isActive ? '#007bff' : 'transparent',
          fontWeight: isActive ? '700' : '500',
          display: 'flex',
          alignItems: 'center',
          padding: '12px 15px',
          borderRadius: '8px',
          textDecoration: 'none',
          marginBottom: '5px',
          transition: 'all 0.2s ease'
      };
  };

  return (
    <aside style={{ 
        width: '260px', 
        flexShrink: 0, 
        backgroundColor: '#1c2e40', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
    }}>
      
      {/* Header Sidebar */}
      <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #3c4a5e' }}>
         <h2 style={{ margin: 0, fontSize: '22px', color: 'white', fontWeight: '800' }}>Admin Panel</h2>
         <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>Gestionează afacerea</p>
      </div>
      
      {/* Meniul de Navigare */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Link href="/dashboard" style={getLinkStyle('/dashboard')}>
            <FaHome style={{marginRight: '10px', fontSize: '18px'}}/> Acasă
        </Link>
        
        <Link href="/dashboard/calendar" style={getLinkStyle('/dashboard/calendar')}>
            <FaCalendarAlt style={{marginRight: '10px', fontSize: '18px'}}/> Calendar
        </Link>

        <Link href="/dashboard/waitlist" style={getLinkStyle('/dashboard/waitlist')}>
            <FaConciergeBell style={{marginRight: '10px', fontSize: '18px'}}/> Listă Așteptare
        </Link>

        {/* --- LINK MESAJE (ADĂUGAT) --- */}
        <Link href="/dashboard/messages" style={getLinkStyle('/dashboard/messages')}>
            <FaEnvelope style={{marginRight: '10px', fontSize: '18px'}}/> Mesaje
        </Link>
        
        <Link href="/dashboard/services" style={getLinkStyle('/dashboard/services')}>
            <FaListUl style={{marginRight: '10px', fontSize: '18px'}}/> Servicii & Staff
        </Link>
        
        <Link href="/dashboard/portfolio" style={getLinkStyle('/dashboard/portfolio')}>
            <FaImages style={{marginRight: '10px', fontSize: '18px'}}/> Portofoliu
        </Link>
        
        <Link href="/dashboard/reviews" style={getLinkStyle('/dashboard/reviews')}>
            <FaStar style={{marginRight: '10px', fontSize: '18px'}}/> Recenzii
        </Link>

        <Link href="/dashboard/forms" style={getLinkStyle('/dashboard/forms')}>
            <FaFileContract style={{marginRight: '10px', fontSize: '18px'}}/> Formulare
        </Link>
        
        <Link href="/dashboard/settings" style={getLinkStyle('/dashboard/settings')}>
            <FaCog style={{marginRight: '10px', fontSize: '18px'}}/> Setări Salon
        </Link>
        
        <Link href="/dashboard/subscription" style={{...getLinkStyle('/dashboard/subscription'), color: '#ffc107'}}>
            <FaCrown style={{marginRight: '10px', fontSize: '18px'}}/> Abonament
        </Link>
      </nav>
      
      {/* Buton Deconectare */}
      <button 
          className="logoutButton" 
          onClick={handleLogout}
          style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              marginTop: '20px',
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#e64c3c',
              border: '1px solid #e64c3c',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background 0.2s'
          }}
      >
          <FaSignOutAlt /> Deconectare
      </button>
    </aside>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />
      <main style={{ flex: 1, backgroundColor: '#f5f7fa', padding: '30px', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}