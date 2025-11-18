// /src/app/salon/[slug]/page.js (COD FINAL - CLIENT SIDE FETCH)

'use client'; // Acum este un Client Component

import React, { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaInfoCircle, FaListUl } from 'react-icons/fa';
import styles from '../salon.module.css'; 
import BookingWidget from '../../../components/BookingWidget'; 
import AIChatBooking from '../../../components/AIChatBooking'; 

export default function SalonPage({ params }) {
    const { slug } = params; 
    const [salonData, setSalonData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetData = async () => {
            try {
                // APEL NOU: Apelează API Route-ul (Backend)
                const response = await fetch(`/api/salon?slug=${slug}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setSalonData(data);
                } else {
                    // Dacă API-ul dă 404
                    setSalonData(null); 
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setSalonData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndSetData();
    }, [slug]);

    if (isLoading) {
        return <div className={styles.loadingContainer}>Se încarcă datele salonului...</div>;
    }

    if (!salonData) {
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
            {/* Restul codului de randare folosește salonData */}
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