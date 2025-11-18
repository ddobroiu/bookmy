// /src/app/salon/[slug]/page.js (COD COMPLET FINAL FĂRĂ DB.JS)

import { FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaInfoCircle, FaListUl } from 'react-icons/fa';
import styles from '../salon.module.css'; 
import BookingWidget from '../../../components/BookingWidget'; 
import AIChatBooking from '../../../components/AIChatBooking'; 
// ATENȚIE: Nu mai importăm db.js aici.

// --- BAZA DE DATE SIMULATĂ MUTATĂ DIRECT ÎN COMPONENTĂ ---
const salonsDB = [
    {
        id: 'salon-de-lux-central', 
        name: 'Salon de Lux Central',
        rating: 4.8,
        reviews: 120,
        address: 'Strada Exemplului, Nr. 15, București',
        schedule: 'Luni - Sâmbătă: 09:00 - 20:00',
        description: 'Suntem un salon modern care oferă servicii de înaltă calitate.',
        category: 'salon',
    }
];

const servicesDB = [
    { id: 1, salonId: 'salon-de-lux-central', name: 'Tuns Bărbați', price: 80, duration: 45 },
    { id: 2, salonId: 'salon-de-lux-central', name: 'Vopsit', price: 150, duration: 90 },
    { id: 3, salonId: 'salon-de-lux-central', name: 'Manichiură', price: 80, duration: 60 },
];
// --- Sfârșit Bază de Date ---


// Funcții Helper locale
const getSalonDetails = (slug) => {
    return salonsDB.find(s => s.id === slug);
};

const findSalonServices = (salonId) => {
    return servicesDB.filter(s => s.salonId === salonId);
};


// Funcție asincronă pentru a prelua datele salonului
const fetchSalonData = async (slug) => {
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
        // Dacă eroarea 404 persistă, înseamnă că Server Componentul eșuează
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
                    
                    {/* 2. Chat Botul AI (Metoda Conversațională) */}
                    <div style={{marginTop: '40px'}}>
                         <AIChatBooking />
                    </div>

                    {/* 3. Lista Statică de Servicii */}
                    <div style={{marginTop: '40px'}}>
                        <ServicesList services={salonData.services} />
                    </div>
                </div>
            </div>
        </div>
    );
}