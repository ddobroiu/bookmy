// /src/components/BookingWidget.jsx (ACTUALIZAT CU WAITLIST)

'use client';

import React, { useState, useCallback } from 'react';
import { FaCalendarAlt, FaChevronRight, FaClock, FaConciergeBell, FaPaperPlane } from 'react-icons/fa';
import moment from 'moment';
import styles from './AuthForm.module.css'; 

// ... (importurile și datele mock rămân la fel)

export default function BookingWidget({ services: availableServices, salonId }) {
    // ... (state-urile existente)
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); 
    const [selectedTime, setSelectedTime] = useState(null);
    
    // --- STATE NOU PENTRU WAITLIST ---
    const [showWaitlistForm, setShowWaitlistForm] = useState(false);
    const [waitlistData, setWaitlistData] = useState({ name: '', phone: '', email: '', notes: '' });
    const [availableSlots, setAvailableSlots] = useState([]); 
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Funcția de încărcare sloturi (modificată)
    const loadSlots = async (date, serviceId, staffId) => {
        setIsLoadingSlots(true);
        setShowWaitlistForm(false); // Resetăm formularul la schimbarea datei
        try {
            // API-ul returnează { slots: [] }
            const res = await fetch(`/api/slots?date=${date}&serviceId=${serviceId}&staffId=${staffId}&salonId=${salonId}`);
            if (res.ok) {
                const data = await res.json();
                setAvailableSlots(data.slots || []);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoadingSlots(false); }
    };

    const handleWaitlistSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    salonId,
                    serviceId: selectedService.id,
                    staffId: selectedStaff?.id,
                    date: selectedDate,
                    ...waitlistData
                })
            });
            if (res.ok) {
                alert('Te-ai înscris pe lista de așteptare! Te vom contacta dacă se eliberează un loc.');
                setShowWaitlistForm(false);
                // Putem reseta fluxul sau duce la homepage
            } else {
                alert('Eroare la înscriere.');
            }
        } catch (err) { alert('Eroare rețea.'); }
    };

    // ... (restul funcțiilor handleServiceSelect etc. rămân la fel)

    // Render Pasul 3 (Data & Ora) Modificat
    const renderDateTimeStep = () => (
        <div>
             <h3 className={styles.stepHeader} onClick={() => setCurrentStep(2)} style={{cursor:'pointer'}}>&larr; Pas 3: Data & Ora</h3>
             
             <input 
                type="date" 
                className={styles.inputField} 
                value={selectedDate} 
                onChange={(e) => {
                    setSelectedDate(e.target.value);
                    // Reîncărcăm sloturile la schimbarea datei
                    if(selectedService && selectedStaff) loadSlots(e.target.value, selectedService.id, selectedStaff.id);
                }} 
                style={{marginBottom:'20px'}}
            />

             {isLoadingSlots ? (
                 <div style={{textAlign:'center', padding:'20px'}}>Se verifică disponibilitatea...</div>
             ) : (
                 <>
                    {availableSlots.length > 0 ? (
                        <div className={styles.slotsGrid}>
                            {availableSlots.map(time => (
                                <button key={time} className={`${styles.slotButton} ${selectedTime === time ? styles.slotActive : ''}`} onClick={() => setSelectedTime(time)}>
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        // --- ZONA WAITLIST CÂND NU SUNT SLOTURI ---
                        <div style={{textAlign:'center', padding:'20px', background:'#fff5f5', borderRadius:'8px', border:'1px dashed #e64c3c'}}>
                            <p style={{color:'#c0392b', fontWeight:'bold', marginBottom:'10px'}}>Ne pare rău, nu sunt locuri libere pe {moment(selectedDate).format('DD MMM')}.</p>
                            
                            {!showWaitlistForm ? (
                                <button 
                                    onClick={() => setShowWaitlistForm(true)}
                                    style={{background:'#e64c3c', color:'white', border:'none', padding:'10px 20px', borderRadius:'6px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'8px'}}
                                >
                                    <FaConciergeBell /> Anunță-mă dacă se eliberează
                                </button>
                            ) : (
                                <form onSubmit={handleWaitlistSubmit} style={{textAlign:'left', marginTop:'15px'}}>
                                    <h4 style={{marginBottom:'10px'}}>Înscriere Listă Așteptare</h4>
                                    <input 
                                        type="text" placeholder="Numele Tău" required 
                                        className={styles.inputField} style={{marginBottom:'10px'}}
                                        value={waitlistData.name} onChange={e => setWaitlistData({...waitlistData, name: e.target.value})}
                                    />
                                    <input 
                                        type="tel" placeholder="Telefon (pt SMS)" required 
                                        className={styles.inputField} style={{marginBottom:'10px'}}
                                        value={waitlistData.phone} onChange={e => setWaitlistData({...waitlistData, phone: e.target.value})}
                                    />
                                    <input 
                                        type="text" placeholder="Preferințe (ex: după ora 18)" 
                                        className={styles.inputField} style={{marginBottom:'10px'}}
                                        value={waitlistData.notes} onChange={e => setWaitlistData({...waitlistData, notes: e.target.value})}
                                    />
                                    <button type="submit" className={styles.finalButton} style={{marginTop:'0'}}>
                                        <FaPaperPlane /> Trimite Cererea
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                 </>
             )}

             {/* Butonul Continuă apare doar dacă s-a selectat un slot (nu waitlist) */}
             {availableSlots.length > 0 && (
                 <button className={styles.nextButton} onClick={() => setCurrentStep(4)} disabled={!selectedTime} style={{marginTop:'20px'}}>Continuă</button>
             )}
        </div>
    );

    // ... (Restul funcției de render rămâne la fel, asigură-te că păstrezi switch-ul pe currentStep)
    
    return (
        <div className={styles.bookingWidget}>
            {/* ... Header ... */}
             <div className={styles.widgetHeader}>
                <FaCalendarAlt style={{marginRight: '10px'}} /> Rezervare Online
            </div>

            <div className={styles.widgetBody}>
                {currentStep === 1 && ( /* Render Service Selection */ 
                     <div>
                        <h3 className={styles.stepHeader}>Pas 1: Alege Serviciul</h3>
                        {availableServices.map(service => (
                            <div key={service.id} className={styles.selectionItem} onClick={() => { setSelectedService(service); setCurrentStep(2); }}>
                                <span className={styles.serviceName}>{service.name} ({service.duration} min)</span>
                                <span className={styles.servicePrice}>{service.price} RON</span>
                                <FaChevronRight className={styles.chevron} />
                            </div>
                        ))}
                    </div>
                )}
                {currentStep === 2 && ( /* Render Staff Selection */
                     <div>
                        <h3 className={styles.stepHeader} onClick={() => setCurrentStep(1)} style={{cursor:'pointer'}}>&larr; Pas 2: Alege Specialist</h3>
                        {/* Aici ar trebui să filtrăm staff-ul real din props, folosim un placeholder */}
                        <div className={styles.selectionItem} onClick={() => { setSelectedStaff({id: 'any', name: 'Oricare'}); loadSlots(selectedDate, selectedService.id, 'any'); setCurrentStep(3); }}>
                            <span>Oricare disponibil</span><FaChevronRight />
                        </div>
                        {/* Listarea reală ar veni din API */}
                     </div>
                )} 
                
                {currentStep === 3 && renderDateTimeStep()}
                
                {/* ... Pașii 4, 5, 6 (Date, Confirmare) rămân neschimbați ... */}
                {/* Asigură-te că ai copiat logica din pașii anteriori pentru completare */}
                 {currentStep === 4 && (
                    <div>
                        <h3 className={styles.stepHeader} onClick={() => setCurrentStep(3)} style={{cursor:'pointer'}}>&larr; Pas 4: Datele Tale</h3>
                        <div className={styles.formGroup}>
                            <label>Nume:</label>
                            <input type="text" className={styles.inputField} value={clientName} onChange={e => setClientName(e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Telefon:</label>
                            <input type="tel" className={styles.inputField} value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                        </div>
                        <button className={styles.nextButton} onClick={() => setCurrentStep(5)} disabled={!clientName || !clientPhone}>Spre Confirmare &rarr;</button>
                    </div>
                )}

                {currentStep === 5 && (
                     <div>
                        <h3 className={styles.stepHeader} onClick={() => setCurrentStep(4)} style={{cursor: 'pointer'}}>&larr; Pas 5: Confirmare</h3>
                        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
                            <p><strong>{selectedService?.name}</strong> - {moment(selectedDate).format('DD/MM')} la {selectedTime}</p>
                            <p>Plată la locație: <strong>{selectedService?.price} RON</strong></p>
                        </div>
                        <button className={styles.finalButton} onClick={handleFinalBooking} disabled={isSubmitting}>{isSubmitting ? 'Se procesează...' : 'Confirmă'}</button>
                    </div>
                )}
                 {currentStep === 6 && (
                    <div style={{textAlign: 'center', padding: '30px 0'}}>
                        <FaCheckCircle style={{color: '#1aa858', fontSize: '60px', marginBottom: '20px'}} />
                        <h3>Rezervare Confirmată!</h3>
                        <Link href="/profil/programari"><button className={styles.finalButton}>Vezi Programările</button></Link>
                    </div>
                )}
            </div>
        </div>
    );
}