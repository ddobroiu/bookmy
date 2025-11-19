// /src/app/dashboard/layout.js (ACTUALIZAT CU LINK-URI NOI)

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaListUl, FaStore, FaImages, FaStar, FaSignOutAlt, FaCrown, FaHome } from 'react-icons/fa';
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
      };
  };

  return (
    <aside style={{ width: '260px', flexShrink: 0 }}>
      <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #3c4a5e' }}>
         <h2 style={{ margin: 0, fontSize: '20px' }}>Admin Panel</h2>
         <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Gestionează afacerea</p>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Link href="/dashboard" style={getLinkStyle('/dashboard')}>
            <FaHome style={{marginRight: '10px'}}/> Acasă
        </Link>
        
        <Link href="/dashboard/calendar" style={getLinkStyle('/dashboard/calendar')}>
            <FaCalendarAlt style={{marginRight: '10px'}}/> Calendar
        </Link>
        
        <Link href="/dashboard/services" style={getLinkStyle('/dashboard/services')}>
            <FaListUl style={{marginRight: '10px'}}/> Servicii & Staff
        </Link>
        
        {/* LINK-URI NOI */}
        <Link href="/dashboard/portfolio" style={getLinkStyle('/dashboard/portfolio')}>
            <FaImages style={{marginRight: '10px'}}/> Portofoliu
        </Link>
        
        <Link href="/dashboard/reviews" style={getLinkStyle('/dashboard/reviews')}>
            <FaStar style={{marginRight: '10px'}}/> Recenzii
        </Link>
        
        <Link href="/dashboard/onboarding" style={getLinkStyle('/dashboard/onboarding')}>
            <FaStore style={{marginRight: '10px'}}/> Profil Afacere
        </Link>
        
        <Link href="/dashboard/subscription" style={{...getLinkStyle('/dashboard/subscription'), color: '#ffc107'}}>
            <FaCrown style={{marginRight: '10px'}}/> Abonament
        </Link>
      </nav>
      
      <button 
          className="logoutButton" 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
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
      <main style={{ flex: 1, backgroundColor: '#f5f7fa', padding: '30px' }}>
        {children}
      </main>
    </div>
  );
}