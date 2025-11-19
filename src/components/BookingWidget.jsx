// /src/components/BookingWidget.jsx (ACTUALIZAT CU FORMULARE DIGITALE)

'use client';

import React, { useState, useCallback } from 'react';
import { FaCalendarAlt, FaChevronRight, FaClock, FaStore, FaInfoCircle, FaFileSignature, FaCheckSquare, FaSignature } from 'react-icons/fa';
import moment from 'moment';
import styles from './AuthForm.module.css'; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';

const mockStaff = [
    { id: "staff-1", name: 'Oricare Specialist', available: true },
    { id: "staff-2", name: 'Maria Popescu', available: true },
    { id: "staff-3", name: 'Ion Vasile', available: true },
];

export default function BookingWidget({ services: availableServices, salonId }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    
    // State-uri Booking
    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); 
    const [selectedTime, setSelectedTime] = useState(null);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    
    // --- STATE NOU PENTRU FORMULARE ---
    const [requiredForms, setRequiredForms] = useState([]);
    const [formAnswers, setFormAnswers] = useState({}); // { formId: { questionId: "Raspuns" } }
    const [isLoadingForms, setIsLoadingForms] = useState(false);
    // ----------------------------------

    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableSlots, setAvailableSlots] = useState(['10:00', '11:30', '14:00', '16:30']);

    // 1. Verificăm dacă există formulare necesare
    const fetchRequiredForms = async (serviceId) => {
        setIsLoadingForms(true);
        try {
            const res = await fetch(`/api/forms/check?salonId=${salonId}&serviceId=${serviceId}`);
            if (res.ok) {
                const forms = await res.json();
                setRequiredForms(forms);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoadingForms(false); }
    };

    // 2. Handler completare răspunsuri
    const handleAnswerChange = (formId, questionId, value) => {
        setFormAnswers(prev => ({
            ...prev,
            [formId]: {
                ...(prev[formId] || {}),
                [questionId]: value
            }
        }));
    };

    // 3. Validare formular
    const validateForms = () => {
        for (const form of requiredForms) {
            for (const q of form.questions) {
                if (q.isRequired) {
                    const answer = formAnswers[form.id]?.[q.id];
                    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                        alert(`Te rugăm să răspunzi la întrebarea: "${q.text}"`);
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const handleFinalBooking = async () => {
        setIsSubmitting(true);
        try {
            // Pasul 1: Trimitem Rezervarea
            const bookingResponse = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: selectedService,
                    staff: selectedStaff,
                    date: selectedDate,
                    time: selectedTime,
                    clientName,
                    clientPhone,
                    salonId,
                    paymentMethod: 'CASH'
                })
            });
            
            const bookingData = await bookingResponse.json();

            if (bookingResponse.ok) {
                // Pasul 2: Trimitem Formularele (dacă există)
                if (requiredForms.length > 0) {
                    // Pentru fiecare formular completat, trimitem un request
                    for (const form of requiredForms) {
                        await fetch('/api/forms/submit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                appointmentId: bookingData.appointmentId,
                                formTemplateId: form.id,
                                answers: formAnswers[form.id] || {}
                            })
                        });
                    }
                }

                setBookingSuccess(true);
                setCurrentStep(7); // Pas Succes (Acum e 7 din cauza pasului extra)
            } else {
                alert(bookingData.message || 'Eroare la rezervare.');
                if (bookingResponse.status === 401) router.push('/login');
            }
        } catch (error) {
            console.error(error);
            alert('Eroare de rețea.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Helper pentru Întrebări ---
    const renderQuestionInput = (formId, q) => {
        const currentVal = formAnswers[formId]?.[q.id];

        if (q.type === 'TEXT') {
            return (
                <input 
                    type="text" 
                    className={styles.inputField}
                    placeholder="Răspunsul tău..."
                    value={currentVal || ''}
                    onChange={e => handleAnswerChange(formId, q.id, e.target.value)}
                />
            );
        }
        if (q.type === 'CHECKBOX') {
            // Presupunem opțiuni separate prin virgulă în JSON sau string
            const options = q.options ? JSON.parse(q.options) : [];
            return (
                <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                    {options.map(opt => (
                        <label key={opt} style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'14px'}}>
                            <input 
                                type="checkbox"
                                checked={currentVal?.includes(opt) || false}
                                onChange={e => {
                                    const oldArr = Array.isArray(currentVal) ? currentVal : [];
                                    const newArr = e.target.checked ? [...oldArr, opt] : oldArr.filter(x => x !== opt);
                                    handleAnswerChange(formId, q.id, newArr);
                                }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            );
        }
        if (q.type === 'SIGNATURE') {
            return (
                <div style={{marginTop:'5px'}}>
                    <input 
                        type="text" 
                        className={styles.inputField}
                        placeholder="Scrie numele complet pentru a semna"
                        style={{fontFamily: 'cursive', fontStyle: 'italic'}}
                        value={currentVal || ''}
                        onChange={e => handleAnswerChange(formId, q.id, e.target.value)}
                    />
                    <p style={{fontSize:'11px', color:'#888', marginTop:'2px'}}>Prin scrierea numelui, confirmi legal acest document.</p>
                </div>
            );
        }
        return null;
    };

    // --- Render Pas Formular ---
    const renderFormsStep = () => (
        <div>
             <h3 className={styles.stepHeader} onClick={() => setCurrentStep(4)} style={{cursor:'pointer'}}>
                &larr; Pas 5: Informații Necesare
            </h3>
            <p style={{fontSize:'14px', color:'#666', marginBottom:'20px'}}>
                Te rugăm să completezi următoarele informații înainte de finalizare.
            </p>

            {requiredForms.map(form => (
                <div key={form.id} style={{background:'#fff', border:'1px solid #ddd', borderRadius:'8px', padding:'20px', marginBottom:'20px'}}>
                    <h4 style={{margin:'0 0 10px 0', color:'#007bff', display:'flex', alignItems:'center', gap:'8px'}}>
                        <FaFileSignature /> {form.title}
                    </h4>
                    {form.description && <p style={{fontSize:'13px', color:'#555', marginBottom:'15px', fontStyle:'italic'}}>{form.description}</p>}

                    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        {form.questions.map(q => (
                            <div key={q.id}>
                                <label style={{fontWeight:'600', fontSize:'14px', display:'block', marginBottom:'5px'}}>
                                    {q.text} {q.isRequired && <span style={{color:'red'}}>*</span>}
                                </label>
                                {renderQuestionInput(form.id, q)}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button 
                className={styles.nextButton} 
                onClick={() => {
                    if (validateForms()) setCurrentStep(6);
                }}
            >
                Salvează și Continuă
            </button>
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className={styles.bookingWidget}>
            <div className={styles.widgetHeader}>
                <FaCalendarAlt style={{marginRight: '10px'}} /> Rezervare Online
            </div>
            
            <div className={styles.widgetBody}>
                {/* PAS 1: SERVICII */}
                {currentStep === 1 && (
                    <div>
                        <h3 className={styles.stepHeader}>Pas 1: Alege Serviciul</h3>
                        {availableServices.map(service => (
                            <div key={service.id} className={styles.selectionItem} onClick={() => { 
                                setSelectedService(service); 
                                fetchRequiredForms(service.id); // VERIFICĂM FORMULARELE AICI
                                setCurrentStep(2); 
                            }}>
                                <span className={styles.serviceName}>{service.name} ({service.duration} min)</span>
                                <span className={styles.servicePrice}>{service.price} RON</span>
                                <FaChevronRight className={styles.chevron} />
                            </div>
                        ))}
                    </div>
                )}

                {/* PAS 2: STAFF */}
                {currentStep === 2 && (
                     <div>
                        <h3 className={styles.stepHeader} onClick={() => setCurrentStep(1)} style={{cursor:'pointer'}}>&larr; Pas 2: Alege Specialist</h3>
                        {mockStaff.map(staff => (
                            <div key={staff.id} className={styles.selectionItem} onClick={() => { setSelectedStaff(staff); setCurrentStep(3); }}>
                                <span>{staff.name}</span>
                                <FaChevronRight className={styles.chevron} />
                            </div>
                        ))}
                     </div>
                )} 
                
                {/* PAS 3: DATA */}
                {currentStep === 3 && (
                    <div>
                         <h3 className={styles.stepHeader} onClick={() => setCurrentStep(2)} style={{cursor:'pointer'}}>&larr; Pas 3: Data & Ora</h3>
                         <input type="date" className={styles.inputField} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{marginBottom:'15px'}}/>
                         <div className={styles.slotsGrid}>
                            {availableSlots.map(time => (
                                <button key={time} className={`${styles.slotButton} ${selectedTime === time ? styles.slotActive : ''}`} onClick={() => setSelectedTime(time)}>
                                    {time}
                                </button>
                            ))}
                         </div>
                         <button className={styles.nextButton} onClick={() => setCurrentStep(4)} disabled={!selectedTime} style={{marginTop:'15px'}}>Continuă</button>
                    </div>
                )}
                
                {/* PAS 4: DATE CLIENT */}
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
                        <button 
                            className={styles.nextButton} 
                            onClick={() => {
                                // Dacă avem formulare, mergem la Pasul 5 (Formular), altfel direct la 6 (Confirmare)
                                if (requiredForms.length > 0) setCurrentStep(5);
                                else setCurrentStep(6);
                            }} 
                            disabled={!clientName || !clientPhone}
                        >
                            Continuă &rarr;
                        </button>
                    </div>
                )}

                {/* PAS 5: FORMULARE (Dacă există) */}
                {currentStep === 5 && requiredForms.length > 0 && renderFormsStep()}

                {/* PAS 6: CONFIRMARE (Fostul Pas 5) */}
                {(currentStep === 6 || (currentStep === 5 && requiredForms.length === 0)) && (
                     <div>
                        <h3 className={styles.stepHeader} onClick={() => setCurrentStep(requiredForms.length > 0 ? 5 : 4)} style={{cursor: 'pointer'}}>&larr; Confirmare</h3>
                        
                        {/* Sumar scurt */}
                        <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                            <p><strong>Serviciu:</strong> {selectedService?.name}</p>
                            <p><strong>Total:</strong> {selectedService?.price} RON (Plată la locație)</p>
                            {requiredForms.length > 0 && <p style={{color: '#1aa858', fontSize: '13px'}}><FaCheckSquare /> Documente completate</p>}
                        </div>

                        <button className={styles.finalButton} onClick={handleFinalBooking} disabled={isSubmitting}>{isSubmitting ? 'Se procesează...' : 'Confirmă Rezervarea'}</button>
                    </div>
                )}

                {/* PAS 7: SUCCES */}
                 {currentStep === 7 && (
                    <div style={{textAlign: 'center', padding: '30px 0'}}>
                        <FaCheckCircle style={{color: '#1aa858', fontSize: '60px', marginBottom: '20px'}} />
                        <h3>Gata! Rezervare Confirmată.</h3>
                        <p style={{color:'#666'}}>Formularele tale au fost salvate în siguranță.</p>
                        <Link href="/profil/programari"><button className={styles.finalButton}>Vezi Programările</button></Link>
                    </div>
                )}
            </div>
        </div>
    );
}