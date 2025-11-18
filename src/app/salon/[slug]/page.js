// /src/app/salon/[slug]/page.js (COD COMPLET FINAL)

import { FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaInfoCircle, FaListUl } from 'react-icons/fa';
import styles from '../salon.module.css'; 
// Calea: 3 nivele sus pentru /src/components
import BookingWidget from '../../../components/BookingWidget'; 
import AIChatBooking from '../../../components/AIChatBooking'; 
// Calea: 3 nivele sus pentru /src/db.js
import { getSalonDetails, findSalonServices } from '../../../db'; 


// Funcție asincronă pentru a prelua datele salonului
const fetchSalonData = async (slug) => {
    // Așteptăm răspunsul din baza de date (simulată)
    const salon = getSalonDetails(slug);
    
    if (!salon) {
        return null; 
    }
    
    const services = findSalonServices(salon.id);
    
    return {
        ...salon,
        services: services, 
    };
};


export default async function SalonPage({ params }) {
    const { slug } = params; 
    
    const salonData = await fetchSalonData(slug);
    
    if (!salonData) {
        // Dacă eroarea 404 persistă, verificați căile din fișierele API
        return <div>404 Salonul cu slug-ul '{slug}' nu a fost găsit.</div>; 
    }
    
    // Helper pentru lista statică de servicii de sub widget
    const ServicesList = ({ services }) => (
        <div className={styles.servicesContainer}>
            <h3><FaListUl style={{marginRight: '8px'}} /> Detalii Servicii</h3>
            {services.map(service => (
                <div key={service.id} className={styles.serviceItem}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.priceRange}>{service.price} RON ({service.duration} min)</span>
                </div>
            ))}
        </div>
    );


    return (
        <div className={styles.salonContainer}>
            <div className={styles.header}>
                <h1 className={styles.salonTitle}>{salonData.name}</h1>
                <div className={styles.rating}>
                    <FaStar style={{ color: '#ffc107', marginRight: '5px' }} />
                    {salonData.rating} ({salonData.reviews} Recenzii)
                </div>
            </div>

            <div className={styles.contentGrid}>
                
                {/* Coloana de Informații și CTA (stânga) */}
                <div className={styles.infoColumn}>
                    <div className={styles.card}>
                        <h2><FaInfoCircle /> Informații</h2>
                        <p className={styles.infoDetail}><FaMapMarkerAlt /> {salonData.address}</p>
                        <p className={styles.infoDetail}><FaClock /> {salonData.schedule}</p>
                    </div>

                    <button className={styles.ctaButton}>
                        <FaCalendarAlt /> Programează-te (WhatsApp)
                    </button>
                    
                    <div className={styles.card}>
                        <h2>Despre Noi</h2>
                        <p>{salonData.description}</p>
                    </div>
                </div>

                {/* Coloana de Servicii și Booking (dreapta) */}
                <div className={styles.bookingColumn}>
                    
                    {/* 1. Componenta Booking Widget (Pașii de Programare) */}
                    <BookingWidget services={salonData.services} salonId={salonData.id} />
                    
                    {/* 2. Lista Statică de Servicii */}
                    <div style={{marginTop: '40px'}}>
                        <ServicesList services={salonData.services} />
                    </div>
                </div>
            </div>
            
            {/* 🤖 CHAT BOT FIXAT (Noua poziționare) */}
            {/* Trebuie să aplici clasa .chatBubble din AIChat.module.css aici */}
            <div className="fixedChatWidget"> 
                 <AIChatBooking />
            </div>
            
        </div>
    );
}