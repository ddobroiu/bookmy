// /components/BookingWidget.jsx (COD COMPLET FINAL)

'use client';

import React, { useState, useCallback } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaChevronRight, FaClock, FaUser } from 'react-icons/fa';
import moment from 'moment';
import styles from './AuthForm.module.css'; 
import Link from 'next/link'; 

// Simulare: Date Angajați (Aceasta ar fi preluată de la un API în producție)
const mockStaff = [
    { id: 101, name: 'Maria Popescu (Stilist)', available: true },
    { id: 102, name: 'Ion Vasile (Barber)', available: true },
    { id: 103, name: 'Orice Angajat Disponibil', available: true, preferred: true },
];

// Logica de simulare a sloturilor (înlocuiește funcția locală din versiunile anterioare)
const fetchAvailableSlots = (serviceId, staffId, date) => {
    // Simulare API Call NOU: Aici ar fi apelul GET la /api/slots
    const baseSlots = staffId === 102 ? ['10:30', '11:30', '16:00'] : ['09:00', '10:00', '14:30', '15:30'];
    
    return baseSlots.map(time => ({ 
        time, 
        available: Math.random() > 0.1 
    })); 
};

export default function BookingWidget({ services: availableServices, salonId }) {
    
    // Pașii booking-ului
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); 
    const [selectedTime, setSelectedTime] = useState(null);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [availableSlots, setAvailableSlots] = useState([]);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    
    // Logica de încărcare sloturi
    const loadSlots = useCallback(async (date, serviceId, staffId) => {
        setIsFetchingSlots(true);
        setSelectedTime(null); 
        
        try {
            // NOU: Apelăm API Route-ul Slots (care folosește logica din backend)
            // const response = await fetch(`/api/slots?date=${date}&staffId=${staffId}&serviceId=${serviceId}`);
            // if (response.ok) { ... }
            
            // Folosim simularea locală până când API-ul este gata
            const slots = await fetchAvailableSlots(serviceId, staffId, date);
            
            setAvailableSlots(slots);
            setSelectedDate(date);
        } catch (error) {
            console.error("Eroare la încărcarea sloturilor:", error);
            setAvailableSlots([]);
        } finally {
            setIsFetchingSlots(false);
        }
    }, []);

    // Logica de navigare la Pasul 3 (Data/Ora)
    const handleStaffSelect = (staffMember) => {
        setSelectedStaff(staffMember);
        setCurrentStep(3); // Trecem la Pasul 3 (Data/Ora)
        loadSlots(selectedDate, selectedService.id, staffMember.id); 
    };

    // Logica de navigare la Pasul 2 (Angajat)
    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setCurrentStep(2); 
    };

    // Trimiterea Programării (API Call)
    const handleFinalBooking = async () => {
        if (!clientName || !clientPhone || !selectedService || !selectedDate || !selectedTime || !selectedStaff) {
            alert('Te rugăm să completezi toate câmpurile.');
            return;
        }

        setIsSubmitting(true);
        
        const bookingData = {
            service: selectedService,
            staff: selectedStaff, 
            date: selectedDate,
            time: selectedTime,
            clientName: clientName,
            clientPhone: clientPhone,
            salonId: salonId || 'salon-de-lux-central',
        };
        
        try {
            // APEL FINAL LA /api/booking/route.js
            const response = { ok: true }; // Simulare succes
            // const response = await fetch('/api/booking', { ... }); 

            if (response.ok) {
                setBookingSuccess(true);
                setCurrentStep(5); 
            } else {
                alert('Eroare la salvarea programării!');
            }
        } catch (error) {
            console.error('Final Booking Error:', error);
            alert('Eroare de rețea. Verifică conexiunea.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Funcție pentru generarea mesajului WhatsApp
    const generateWhatsAppMessage = () => {
        const formattedDate = moment(selectedDate).format('DD MMM');
        const message = `Buna ziua! Aș dori să fac o programare la ${selectedService.name} cu angajatul ${selectedStaff.name} pe data de ${formattedDate}, la ora ${selectedTime}. Nume: ${clientName}, Telefon: ${clientPhone}.`;
        
        return encodeURIComponent(message);
    };


    // --- RENDERIZAREA PAȘILOR ---

    // Pasul 1: Selecția Serviciului
    const renderServiceStep = () => (
        <div>
            <h3 className={styles.stepHeader}>Pas 1: Alege Serviciul</h3>
            {availableServices.map(service => (
                <div 
                    key={service.id}
                    className={styles.selectionItem}
                    onClick={() => handleServiceSelect(service)} 
                >
                    <span className={styles.serviceName}>{service.name} (Durata: {service.duration} min)</span>
                    <span className={styles.servicePrice}>{service.price} RON</span>
                    <FaChevronRight className={styles.chevron} />
                </div>
            ))}
        </div>
    );
    
    // Pasul 2 NOU: Selecția Angajatului
    const renderStaffStep = () => (
        <div>
            <h3 className={styles.stepHeader} onClick={() => setCurrentStep(1)} style={{cursor: 'pointer'}}>
                &larr; Pas 2: Alege Angajatul
            </h3>
            
            <p style={{marginBottom: '10px'}}>Pentru {selectedService.name}:</p>
            
            {mockStaff.map(staff => (
                <div 
                    key={staff.id}
                    className={styles.selectionItem}
                    onClick={() => handleStaffSelect(staff)} 
                >
                    <span className={styles.serviceName}>{staff.name}</span>
                    <span className={styles.servicePrice}>
                        {staff.preferred && <span style={{color: '#ffc107', marginRight: '5px'}}>⭐</span>}
                        {staff.available ? 'Disponibil' : 'Ocupat'}
                    </span>
                    <FaChevronRight className={styles.chevron} />
                </div>
            ))}
        </div>
    );


    // Pasul 3: Selecția Data/Ora
    const renderDateTimeStep = () => (
        <div>
            <h3 className={styles.stepHeader} onClick={() => setCurrentStep(2)} style={{cursor: 'pointer'}}>
                &larr; Pas 3: Data & Ora ({selectedStaff.name})
            </h3>
            
            <p style={{marginBottom: '10px'}}>Selectează o dată:</p>
            <input 
                type="date"
                value={selectedDate}
                // Trimitem ID-ul Angajatului la loadSlots
                onChange={(e) => loadSlots(e.target.value, selectedService.id, selectedStaff.id)}
                className={styles.inputField}
                style={{marginBottom: '20px'}}
            />

            <h4 style={{fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                <FaClock style={{marginRight: '8px'}} /> Sloturi Libere ({moment(selectedDate).format('DD MMM')})
            </h4>

            {isFetchingSlots ? (
                <div style={{textAlign: 'center', padding: '30px'}}>Se încarcă sloturile...</div>
            ) : (
                <div className={styles.slotsGrid}>
                    {availableSlots.length > 0 ? availableSlots.map(slot => (
                        <button
                            key={slot.time}
                            className={`${styles.slotButton} ${selectedTime === slot.time ? styles.slotActive : ''} ${!slot.available ? styles.slotDisabled : ''}`}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                        >
                            {slot.time}
                        </button>
                    )) : (
                        <p style={{color: '#999'}}>Niciun slot liber pentru această dată.</p>
                    )}
                </div>
            )}
            
            {/* Navigare Pasul 4 */}
            <button 
                className={styles.nextButton}
                onClick={() => selectedTime && setCurrentStep(4)}
                disabled={!selectedTime}
                style={{width: '100%', marginTop: '20px'}}
            >
                Continuă &rarr;
            </button>
        </div>
    );

    // Pasul 4 (Detalii Client)
    const renderClientDetailsStep = () => (
        <div>
            <h3 className={styles.stepHeader} onClick={() => setCurrentStep(3)} style={{cursor: 'pointer'}}>
                &larr; Pas 4: Detaliile tale
            </h3>
            <p className={styles.summaryItem}>Serviciu: <strong>{selectedService.name}</strong></p>
            <p className={styles.summaryItem}>Angajat: <strong>{selectedStaff.name}</strong></p>
            <p className={styles.summaryItem}>Data/Ora: <strong>{moment(selectedDate).format('DD MMM YYYY')} la {selectedTime}</strong></p>

            <div className={styles.formGroup} style={{marginTop: '30px'}}>
                <label>Numele și Prenumele:</label>
                <input 
                    type="text" 
                    className={styles.inputField} 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="Ion Popescu"
                />
            </div>
            <div className={styles.formGroup}> 
                <label>Număr de Telefon (pentru confirmare):</label>
                <input 
                    type="tel" 
                    className={styles.inputField} 
                    value={clientPhone} 
                    onChange={(e) => setClientPhone(e.target.value)} 
                    placeholder="07xxxxxxxx"
                />
            </div>

            <button 
                className={styles.finalButton} 
                onClick={handleFinalBooking} 
                disabled={isSubmitting || !clientName || clientPhone.length < 8}
            >
                {isSubmitting ? 'Se salvează...' : 'Finalizează Programarea'}
            </button>
        </div>
    );

    // Pasul 5 (Confirmare Finală)
    const renderFinalConfirmationStep = () => (
        <div style={{textAlign: 'center'}}>
            <FaCheckCircle 
                style={{
                    color: 'var(--success-color)', 
                    fontSize: '50px', 
                    marginBottom: '20px'
                }} 
            />
            
            <h3 style={{color: 'var(--success-color)'}}>Programare Salavată!</h3>
            <p style={{fontSize: '18px', marginBottom: '30px'}}>
                Programarea ta a fost salvată în calendarul salonului.
            </p>
            
            <p>
                **Acum, te rugăm să apeși pe butonul de mai jos pentru a trimite un mesaj de confirmare rapid pe WhatsApp către salon, folosind datele salvate.**
            </p>

            <Link 
                href={`https://wa.me/407xxxxxxxx?text=${generateWhatsAppMessage()}`} 
                target="_blank" 
                className={styles.finalButton}
                style={{backgroundColor: '#25d366', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}
            >
                <FaCalendarAlt /> Trimite Confirmarea pe WhatsApp
            </Link>

            <button className={styles.backButton} onClick={() => window.location.reload()} style={{marginTop: '20px'}}>
                &larr; Fă o altă programare
            </button>
        </div>
    );


    return (
        <div className={styles.bookingWidget}>
            <div className={styles.widgetHeader}>
                <FaCalendarAlt style={{marginRight: '10px'}} /> Fă o Programare
            </div>
            
            <div className={styles.widgetBody}>
                {currentStep === 1 && renderServiceStep()}
                {currentStep === 2 && selectedService && renderStaffStep()}
                {currentStep === 3 && selectedService && selectedStaff && renderDateTimeStep()}
                {currentStep === 4 && selectedService && selectedStaff && renderClientDetailsStep()}
                {currentStep === 5 && bookingSuccess && renderFinalConfirmationStep()}
            </div>
        </div>
    );
}