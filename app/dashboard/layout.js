// /app/dashboard/layout.js (COD COMPLET ACTUALIZAT)
import React from 'react';
import './dashboard.css'; // Acum acest fișier există și nu mai dă eroare

// Componenta simplă de Sidebar 
const DashboardSidebar = () => {
  return (
    <aside>
      <h2>BooksApp Admin</h2>
      <nav>
        <a href="/dashboard">Acasă</a>
        <a href="/dashboard/calendar">Calendar</a>
        <a href="/dashboard/services">Servicii</a>
        <a href="/">Ieșire (Client View)</a>
      </nav>
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