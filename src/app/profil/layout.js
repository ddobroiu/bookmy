// /src/app/profil/layout.js
import React from 'react';
import ClientSidebar from '../../components/ClientSidebar';

export default function ProfilLayout({ children }) {
  return (
    <div className="container" style={{ display: 'flex', gap: '30px', padding: '40px 20px', minHeight: '80vh', alignItems: 'flex-start' }}>
      
      {/* Sidebar (Meniu Stânga) */}
      <div style={{ flexShrink: 0 }}>
          <ClientSidebar />
      </div>
      
      {/* Conținut Principal (Dreapta) */}
      <div style={{ flex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}