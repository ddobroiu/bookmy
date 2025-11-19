// /src/components/ClientSidebar.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

export default function ClientSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Detalii Profil', href: '/profil', icon: <FaUser /> },
        { name: 'Programările Mele', href: '/profil/programari', icon: <FaCalendarAlt /> },
    ];

    const sidebarStyle = {
        width: '250px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        height: 'fit-content',
        marginRight: '20px',
    };

    const linkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px 15px',
        margin: '8px 0',
        borderRadius: '8px',
        textDecoration: 'none',
        color: isActive ? '#007bff' : '#333',
        backgroundColor: isActive ? '#e6f0ff' : 'transparent',
        fontWeight: isActive ? '600' : '400',
        transition: 'all 0.2s',
    });

    return (
        <div style={sidebarStyle}>
            <h3 style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Meniu Client</h3>
            <nav>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} style={linkStyle(isActive)}>
                            <span style={{ marginRight: '10px' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}