// /app/salon/[slug]/page.js (Pagina Detalii Salon - COD COMPLET CORECTAT)

'use client'; 

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { FaMapMarkerAlt, FaWhatsapp, FaStar, FaClock } from 'react-icons/fa';
import styles from '../salon.module.css'; // CORECTAT: Ieșim din directorul [slug]

// Date de exemplu pentru un singur salon
const fetchSalonDetails = (slug) => {
  // Aici se face o interogare la baza de date pe baza 'slug'-ului
  const salons = {
    'salon-de-lux-central': {
      title: 'Salon de Lux Central',
      address: 'Strada Exemplului, Nr. 15, București',
      phone: '40722123456', // Numărul de telefon pentru WhatsApp
      rating: 4.8,
      services: ['Tuns Bărbați', 'Vopsit', 'Manichiură'],
      schedule: 'Luni - Sâmbătă: 09:00 - 20:00',
    },
    'barber-shop-urban': {
        title: 'Barber Shop Urban',
        address: 'Bulevardul Viitorului, Nr. 3, Cluj-Napoca',
        phone: '40722654321', 
        rating: 4.5,
        services: ['Tuns', 'Bărbierit Tradițional', 'Contur'],
        schedule: 'Luni - Vineri: 10:00 - 19:00',
    },
  };
  return salons[slug];
};

export default function SalonDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const salon = fetchSalonDetails(slug);

  if (!salon) {
    return notFound();
  }
  
  // Link dinamic pentru WhatsApp
  const whatsappLink = `https://wa.me/${salon.phone}?text=Bună ziua! Vreau să fac o programare la ${salon.title} pentru serviciul de ${salon.services[0]}.`;

  return (
    <div className={styles.salonContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>{salon.title}</h1>
        <div className={styles.rating}>
          <FaStar style={{ color: 'gold', marginRight: '5px' }} /> 
          {salon.rating} (120 Recenzii)
        </div>
      </header>
      
      <div className={styles.content}>
        
        {/* Sidebar Informații */}
        <aside className={styles.sidebar}>
          <div className={styles.infoBox}>
            <h2>Informații</h2>
            <p><FaMapMarkerAlt /> {salon.address}</p>
            <p><FaClock /> {salon.schedule}</p>
          </div>
          
          {/* Buton WhatsApp */}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <FaWhatsapp style={{marginRight: '10px'}} /> 
            Programează-te (WhatsApp)
          </a>
        </aside>
        
        {/* Secțiunea principală */}
        <section className={styles.mainSection}>
          <h2>Servicii Disponibile</h2>
          <ul className={styles.serviceList}>
            {salon.services.map((service, index) => (
              <li key={index} className={styles.serviceItem}>
                {service}
                <span className={styles.servicePrice}>50 - 150 RON</span>
              </li>
            ))}
          </ul>

          <h2>Despre Noi</h2>
          <p>Suntem un salon modern care oferă servicii de înaltă calitate...</p>
        </section>
      </div>
    </div>
  );
}