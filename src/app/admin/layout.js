// /src/app/admin/layout.js (NOU)

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaChartLine, FaStore, FaUsers, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.clear();
    router.push('/login');
  };

  const linkStyle = (path) => ({
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 15px', borderRadius: '8px',
      color: pathname === path ? 'white' : '#ccc',
      backgroundColor: pathname === path ? '#c0392b' : 'transparent', // Roșu pentru Admin
      textDecoration: 'none', fontWeight: '600', marginBottom: '5px'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Admin */}
      <aside style={{ width: '260px', background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaShieldAlt style={{fontSize: '24px', color: '#c0392b'}}/>
            <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Super Admin</h2>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>Platform Manager</span>
            </div>
        </div>

        <nav style={{ flex: 1 }}>
            <Link href="/admin" style={linkStyle('/admin')}>
                <FaChartLine /> Dashboard
            </Link>
            <Link href="/admin/saloane" style={linkStyle('/admin/saloane')}>
                <FaStore /> Saloane
            </Link>
            <Link href="/admin/users" style={linkStyle('/admin/users')}>
                <FaUsers /> Utilizatori
            </Link>
        </nav>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <FaSignOutAlt /> Deconectare
        </button>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, background: '#ecf0f1', padding: '30px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}