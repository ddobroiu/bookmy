// /src/app/dashboard/layout.js (COD COMPLET - CU INFO ABONAMENT)

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaListUl, FaImages, FaStar, FaSignOutAlt, FaCrown, FaHome, FaConciergeBell, FaCog, FaFileContract, FaEnvelope, FaWallet } from 'react-icons/fa';
import './dashboard.css'; 

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // State pentru info abonament
  const [salonInfo, setSalonInfo] = useState({ plan: 'BASIC', credits: 0 });

  useEffect(() => {
      async function fetchInfo() {
          try {
              const res = await fetch('/api/partner/salon');
              if (res.ok) {
                  const data = await res.json();
                  setSalonInfo({ 
                      plan: data.subscriptionPlan, 
                      credits: data.credits 
                  });
              }
          } catch (e) {}
      }
      fetchInfo();
  }, [pathname]); // Re-fetch la schimbarea paginii (poate a cumpărat credite)

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.clear();
    router.push('/login');
  };

  const getLinkStyle = (path) => ({
      color: pathname === path ? '#fff' : '#e6e6e6',
      backgroundColor: pathname === path ? '#007bff' : 'transparent',
      fontWeight: pathname === path ? '700' : '500',
      display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '8px', marginBottom: '5px', textDecoration: 'none'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: '260px', flexShrink: 0, backgroundColor: '#1c2e40', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
            
            <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #3c4a5e' }}>
                <h2 style={{ margin: 0, fontSize: '22px', color: 'white', fontWeight: '800' }}>Admin Panel</h2>
                
                {/* INFO ABONAMENT ÎN SIDEBAR */}
                <div style={{marginTop: '15px', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#aaa', marginBottom:'5px'}}>
                        <span>Plan:</span> <span style={{color: '#ffc107', fontWeight:'bold'}}>{salonInfo.plan}</span>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'12px', color:'#aaa'}}><FaWallet/> Credite:</span>
                        <span style={{fontSize:'16px', fontWeight:'bold', color:'white'}}>{salonInfo.credits}</span>
                    </div>
                </div>
            </div>
            
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Link href="/dashboard" style={getLinkStyle('/dashboard')}><FaHome style={{marginRight:'10px'}}/> Acasă</Link>
                <Link href="/dashboard/calendar" style={getLinkStyle('/dashboard/calendar')}><FaCalendarAlt style={{marginRight:'10px'}}/> Calendar</Link>
                <Link href="/dashboard/waitlist" style={getLinkStyle('/dashboard/waitlist')}><FaConciergeBell style={{marginRight:'10px'}}/> Listă Așteptare</Link>
                <Link href="/dashboard/messages" style={getLinkStyle('/dashboard/messages')}><FaEnvelope style={{marginRight:'10px'}}/> Mesaje</Link>
                <Link href="/dashboard/services" style={getLinkStyle('/dashboard/services')}><FaListUl style={{marginRight:'10px'}}/> Servicii & Resurse</Link>
                <Link href="/dashboard/portfolio" style={getLinkStyle('/dashboard/portfolio')}><FaImages style={{marginRight:'10px'}}/> Portofoliu</Link>
                <Link href="/dashboard/reviews" style={getLinkStyle('/dashboard/reviews')}><FaStar style={{marginRight:'10px'}}/> Recenzii</Link>
                <Link href="/dashboard/forms" style={getLinkStyle('/dashboard/forms')}><FaFileContract style={{marginRight:'10px'}}/> Formulare</Link>
                <Link href="/dashboard/settings" style={getLinkStyle('/dashboard/settings')}><FaCog style={{marginRight:'10px'}}/> Setări Salon</Link>
                <Link href="/dashboard/subscription" style={{...getLinkStyle('/dashboard/subscription'), color: '#ffc107'}}><FaCrown style={{marginRight:'10px'}}/> Abonament</Link>
            </nav>
            
            <button className="logoutButton" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#e64c3c', border: '1px solid #e64c3c', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                <FaSignOutAlt /> Deconectare
            </button>
        </aside>

        <main style={{ flex: 1, backgroundColor: '#f5f7fa', padding: '30px', overflowX: 'hidden' }}>
            {children}
        </main>
    </div>
  );
}