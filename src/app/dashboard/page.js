// /app/dashboard/page.js (COD COMPLET CU PICTOGRAME REACT ICONS)

import React from 'react';
import PartnerCalendar from '../../components/PartnerCalendar';
// Importăm stilurile pentru a le folosi în JSX
import '../dashboard/dashboard.css'; 
// Importăm pictograme moderne!
import { FaCalendarCheck, FaEuroSign, FaStar, FaClock } from 'react-icons/fa'; 

// Componenta pentru cardurile de metrici
const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="metricCard">
    <div>
      <div className="metricTitle">{title}</div>
      <div className="metricValue" style={{color: color}}>{value}</div>
    </div>
    {/* Pictograma modernă este acum aici */}
    <div style={{fontSize: '30px', color: color}}>
      <Icon />
    </div>
  </div>
);

// Componenta pentru programările recente
const RecentAppointments = () => {
  const appointments = [
    { time: '10:00', client: 'Andrei P.', service: 'Tuns' },
    { time: '11:30', client: 'Maria C.', service: 'Manichiură' },
    { time: '14:00', client: 'Cristian V.', service: 'Bărbierit' },
    { time: '15:30', client: 'Elena T.', service: 'Vopsit' },
  ];

  return (
    <div className="recentAppointments">
      <h2 style={{marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
        <FaClock style={{marginRight: '8px', color: '#555'}} /> Programări Recente
      </h2>
      {appointments.map((app, index) => (
        <div key={index} className="appointmentItem">
          <span className="appointmentTime">{app.time}</span> - {app.client} ({app.service})
        </div>
      ))}
    </div>
  );
};


export default function PartnerDashboardPage() {
  return (
    <div style={{ padding: '0 20px', maxWidth: '1600px', margin: '0 auto' }}>
      <h1>Tablou de Bord Partener 👋</h1>
      <p style={{ marginBottom: '25px', color: '#666' }}>O imagine rapidă a performanței salonului tău.</p>

      {/* 1. Metric Cards Grid */}
      <div className="metricGrid">
        <MetricCard 
          title="Programări Săptămânale" 
          value="45" 
          icon={FaCalendarCheck} 
          color="#007bff" 
        />
        <MetricCard 
          title="Venit Estimativ" 
          value="5,200 RON" 
          icon={FaEuroSign} 
          color="#1aa858" // Verde pentru venit
        />
        <MetricCard 
          title="Rating Mediu" 
          value="4.7/5" 
          icon={FaStar} 
          color="#ffc107" // Galben pentru rating
        />
      </div>

      {/* 2. Main Layout Grid (Calendar + Programări Recente) */}
      <div className="dashboardGrid">
        
        {/* Stânga: Calendarul Principal */}
        <div>
            <h2 style={{fontSize: '22px', marginBottom: '15px'}}>Calendarul Tău</h2>
            <PartnerCalendar />
        </div>
        
        {/* Dreapta: Programări Recente */}
        <RecentAppointments />
      </div>

      
    </div>
  );
}