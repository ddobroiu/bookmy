// /src/app/salon/[slug]/page.js (COD COMPLET - DINAMIC PENTRU ORICE SERVICIU)

'use client';

import React, { useState, useEffect } from 'react';
import { 
    FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaInfoCircle, 
    FaListUl, FaCamera, FaUtensils, FaHeart, FaShareAlt, FaPhoneAlt 
} from 'react-icons/fa';
import styles from '../salon.module.css'; // Putem păstra numele fișierului CSS, dar clasele sunt generice
import BookingWidget from '../../../components/BookingWidget'; 
import AIChatBooking from '../../../components/AIChatBooking';
import Reviews from '../../../components/Reviews';

// Helper pentru a determina tipul afacerii
const getVenueType = (category) => {
    const cat = category ? category.toLowerCase() : '';
    if (cat.includes('restaurant') || cat.includes('bar') || cat.includes('cafenea')) return 'food';
    if (cat.includes('medical') || cat.includes('clinic') || cat.includes('dentist')) return 'health';
    if (cat.includes('auto') || cat.includes('service')) return 'auto';
    return 'beauty'; // Default
};

export default function VenuePage({ params }) {
    const { slug } = params;
    
    const [venueData, setVenueData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        const fetchAndSetData = async () => {
            try {
                const response = await fetch(`/api/salon?slug=${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setVenueData(data);
                } else {
                    setVenueData(null); 
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setVenueData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndSetData();
    }, [slug]);

    if (isLoading) return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă detaliile...</div>;
    if (!venueData) return <div style={{padding: '50px', textAlign: 'center'}}>404 - Locația nu a fost găsită.</div>; 

    const venueType = getVenueType(venueData.category);

    // Etichete dinamice în funcție de tipul afacerii
    const labels = {
        servicesTab: venueType === 'food' ? 'Meniu / Rezervări' : (venueType === 'health' ? 'Consultații' : 'Servicii'),
        portfolioTab: venueType === 'food' ? 'Galerie & Atmosferă' : 'Portofoliu',
        ctaButton: venueType === 'food' ? 'Rezervă Masă' : 'Programează-te',
        staffLabel: venueType === 'health' ? 'Medici' : 'Echipă',
    };

    // Simulare Imagini (Placeholder)
    const galleryImages = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80", // Restaurant vibe
        "https://images.unsplash.com/photo-1559333086-b08d33726f9a?auto=format&fit=crop&w=400&q=80", // Office/Clinic
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&q=80", // General
    ];

    // --- Componente Interne ---

    const TabNavigation = () => (
        <div className={styles.tabsNav}>
            <button 
                className={`${styles.tabButton} ${activeTab === 'services' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('services')}
            >
                {labels.servicesTab}
            </button>
            <button 
                className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('reviews')}
            >
                Recenzii ({venueData.reviews || 0})
            </button>
            <button 
                className={`${styles.tabButton} ${activeTab === 'portfolio' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('portfolio')}
            >
                {labels.portfolioTab}
            </button>
            <button 
                className={`${styles.tabButton} ${activeTab === 'about' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('about')}
            >
                Info & Contact
            </button>
        </div>
    );

    const ServicesTab = () => (
        <div className={styles.servicesContainer}>
            <div className={styles.serviceCategory}>
                <h3 className={styles.categoryTitle}>
                    {venueType === 'food' ? <FaUtensils style={{marginRight: '8px'}}/> : null}
                    Oferta Noastră
                </h3>
                
                {venueData.services.length === 0 ? (
                    <p>Nu există opțiuni listate momentan.</p>
                ) : (
                    venueData.services.map(service => (
                        <div key={service.id} className={styles.serviceItem}>
                            <div>
                                <span className={styles.serviceName}>{service.name}</span>
                                <span className={styles.serviceDuration}>
                                    {venueType === 'food' ? 'Preț estimativ' : `${service.duration} min`}
                                </span>
                            </div>
                            <div className={styles.priceContainer}>
                                <span className={styles.priceTag}>{service.price} RON</span>
                                <button className={styles.bookBtnSmall}>{labels.ctaButton}</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const GalleryTab = () => (
        <div className={styles.servicesContainer}>
            <h3 className={styles.sectionTitle}><FaCamera /> Galerie Foto</h3>
            <div className={styles.portfolioGrid}>
                {galleryImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`Galerie ${idx}`} className={styles.portfolioImage} />
                ))}
            </div>
        </div>
    );

    const AboutTab = () => (
        <div className={styles.servicesContainer}>
             <h3 className={styles.sectionTitle}><FaInfoCircle /> Despre {venueData.name}</h3>
             <p style={{lineHeight: '1.6', color: '#444', marginBottom: '20px'}}>
                 {venueData.description || "Vă invităm să descoperiți serviciile noastre de calitate. Fie că este vorba de relaxare, o masă delicioasă sau o necesitate, suntem aici pentru dumneavoastră."}
             </p>
             
             <div className={styles.card} style={{boxShadow: 'none', border: '1px solid #eee'}}>
                <div className={styles.infoDetail}>
                    <FaMapMarkerAlt style={{color: '#007bff'}}/> <strong>Adresă:</strong> {venueData.address}
                </div>
                <div className={styles.infoDetail}>
                    <FaPhoneAlt style={{color: '#007bff'}}/> <strong>Telefon:</strong> 07xx xxx xxx
                </div>
             </div>

             <h4 className={styles.categoryTitle}>Facilități</h4>
             <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                 {['Wi-Fi', 'Parcare', 'Card Acceptat', 'Accesibil scaun rulant'].map(tag => (
                     <span key={tag} style={{background: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '13px'}}>{tag}</span>
                 ))}
             </div>
        </div>
    );

    return (
        <div className={styles.salonContainer}>
            
            {/* 1. Hero / Cover */}
            <div className={styles.coverImage} style={{
                // Schimbăm culoarea gradientului în funcție de tip (Restaurant = Portocaliu, Medical = Albastru/Verde, etc.)
                background: venueType === 'food' ? 'linear-gradient(90deg, #ff9966, #ff5e62)' : 
                            venueType === 'health' ? 'linear-gradient(90deg, #11998e, #38ef7d)' : 
                            'linear-gradient(90deg, #007bff, #00d2ff)'
            }}></div>

            {/* 2. Header Venue */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.salonTitle}>{venueData.name}</h1>
                        <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
                            <div className={styles.rating}>
                                <FaStar style={{ color: '#ffc107' }} />
                                <strong>{venueData.averageRating || '5.0'}</strong> 
                                <span style={{color: '#999'}}>({venueData.reviews || 0} recenzii)</span>
                            </div>
                            <span className={styles.infoDetail}>
                                {venueData.category ? venueData.category.toUpperCase() : 'DIVERS'}
                            </span>
                            <span className={styles.infoDetail}><FaMapMarkerAlt /> {venueData.address}</span>
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                         <button className={styles.bookBtnSmall} style={{background: 'white', color: '#333', border: '1px solid #ddd'}}>
                             <FaHeart /> Salvează
                         </button>
                         <button className={styles.bookBtnSmall} style={{background: 'white', color: '#333', border: '1px solid #ddd'}}>
                             <FaShareAlt /> Distribuie
                         </button>
                    </div>
                </div>
            </div>

            {/* 3. Content Grid */}
            <div className={styles.contentGrid}>
                
                {/* Coloana Stânga */}
                <div className={styles.mainColumn}>
                    <TabNavigation />

                    {activeTab === 'services' && <ServicesTab />}
                    {activeTab === 'reviews' && (
                        <div className={styles.servicesContainer}>
                            <Reviews salonId={venueData.id} />
                        </div>
                    )}
                    {activeTab === 'portfolio' && <GalleryTab />}
                    {activeTab === 'about' && <AboutTab />}
                </div>

                {/* Coloana Dreapta (Sticky Booking) */}
                <div className={styles.bookingColumn}>
                    
                    <div className={styles.card}>
                        <h3 style={{margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <FaClock style={{color: '#007bff'}}/> Program
                        </h3>
                        <div style={{fontSize: '14px'}}>
                            {Object.entries(venueData.schedule || {}).map(([day, hours]) => (
                                <div key={day} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', textTransform: 'capitalize'}}>
                                    <span>{day}</span>
                                    <span style={{fontWeight: hours.open ? '600' : 'normal', color: hours.open ? '#333' : '#e64c3c'}}>
                                        {hours.open ? `${hours.start} - ${hours.end}` : 'Închis'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Widget-ul de rezervare adaptat pentru servicii generice */}
                    <BookingWidget services={venueData.services} salonId={venueData.id} />
                    
                    <div style={{marginTop: '20px'}}>
                        <AIChatBooking />
                    </div>

                </div>
            </div>
        </div>
    );
}