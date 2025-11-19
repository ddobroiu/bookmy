// /src/components/ClientSidebar.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

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
    ];

    const sidebarStyle = {
        width: '250px',
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
    };

    const linkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px 15px',
        margin: '5px 0',
        borderRadius: '8px',
        textDecoration: 'none',
        color: isActive ? '#007bff' : '#555',
        backgroundColor: isActive ? '#e6f0ff' : 'transparent',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s',
    });

    return (
        <aside style={sidebarStyle}>
            <div style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1c2e40' }}>Panou Client</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>Gestionează contul tău</p>
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
                    marginTop: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    border: '1px solid #ffebee',
                    backgroundColor: '#fff5f5',
                    color: '#e64c3c',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    width: '100%'
                }}
            >
                <FaSignOutAlt style={{ marginRight: '12px' }} /> Deconectare
            </button>
        </aside>
    );
}