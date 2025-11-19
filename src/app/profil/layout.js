// /src/app/profil/layout.js
import React from 'react';
import ClientSidebar from '../../components/ClientSidebar';

export default function ProfilLayout({ children }) {
  return (
    <div className="container" style={{ display: 'flex', padding: '40px 20px', minHeight: '80vh', backgroundColor: '#f5f7fa' }}>
      {/* Meniul Lateral */}
      <ClientSidebar />
      
      {/* Conținutul Paginii (Profil sau Programări) */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}