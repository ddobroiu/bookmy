// /src/components/ClientSidebar.jsx (ACTUALIZAT CU FAVORITE ȘI SETĂRI)
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaSignOutAlt, FaHeart, FaCog, FaWallet } from 'react-icons/fa';

export default function ClientSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            localStorage.removeItem('userRole');
            localStorage.removeItem('salonSetup');
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Eroare la logout", error);
        }
    };

    const menuItems = [
        { name: 'Detalii Profil', href: '/profil', icon: <FaUser /> },
        { name: 'Istoric Programări', href: '/profil/programari', icon: <FaCalendarAlt /> },
        { name: 'Locații Favorite', href: '/profil/favorite', icon: <FaHeart /> }, // NOU
        { name: 'Setări & Plăți', href: '/profil/setari', icon: <FaCog /> }, // NOU
    ];

    const sidebarStyle = {
        width: '280px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #f0f0f0'
    };

    const linkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '14px 18px',
        margin: '8px 0',
        borderRadius: '10px',
        textDecoration: 'none',
        color: isActive ? '#007bff' : '#555',
        backgroundColor: isActive ? '#e6f0ff' : 'transparent',
        fontWeight: isActive ? '700' : '500',
        transition: 'all 0.2s',
        border: isActive ? '1px solid rgba(0, 123, 255, 0.1)' : '1px solid transparent'
    });

    return (
        <aside style={sidebarStyle}>
            <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#1c2e40', fontWeight: '800' }}>Contul Meu</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#888' }}>Gestionează preferințele</p>
            </div>
            
            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} style={linkStyle(isActive)}>
                            <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <button 
                onClick={handleLogout}
                style={{
                    marginTop: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px',
                    border: '1px solid #ffebee',
                    backgroundColor: '#fff5f5',
                    color: '#e64c3c',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    width: '100%',
                    transition: 'background 0.2s'
                }}
            >
                <FaSignOutAlt style={{ marginRight: '10px' }} /> Deconectare
            </button>
        </aside>
    );
}