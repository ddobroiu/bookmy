// /src/app/dashboard/services/page.js (COD COMPLET ACTUALIZAT)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUser, FaListUl, FaClock, FaTimes, FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from './services.module.css';

// --- MODAL PENTRU PROGRAM ANGAJAT ---
const StaffScheduleModal = ({ staff, onClose, onSave }) => {
    const weekDays = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'];
    
    // Inițializăm cu programul existent sau default
    const [schedule, setSchedule] = useState(staff.schedule && Object.keys(staff.schedule).length > 0 ? staff.schedule : 
        weekDays.reduce((acc, day) => ({
            ...acc,
            [day]: { open: true, start: '09:00', end: '17:00', breaks: [] }
        }), {})
    );

    const handleDayChange = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const addBreak = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { 
                ...prev[day], 
                breaks: [...(prev[day].breaks || []), { start: '13:00', end: '13:30' }] 
            }
        }));
    };

    const removeBreak = (day, index) => {
        setSchedule(prev => {
            const newBreaks = [...prev[day].breaks];
            newBreaks.splice(index, 1);
            return {
                ...prev,
                [day]: { ...prev[day], breaks: newBreaks }
            };
        });
    };

    const updateBreak = (day, index, field, value) => {
        setSchedule(prev => {
            const newBreaks = [...prev[day].breaks];
            newBreaks[index] = { ...newBreaks[index], [field]: value };
            return {
                ...prev,
                [day]: { ...prev[day], breaks: newBreaks }
            };
        });
    };

    return (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
            <div style={{background:'white', padding:'30px', borderRadius:'12px', width:'700px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 5px 20px rgba(0,0,0,0.2)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h2 style={{margin:0, color: '#1c2e40'}}>Program de Lucru: {staff.name}</h2>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px'}}><FaTimes /></button>
                </div>

                <div style={{marginBottom: '20px', padding: '15px', background: '#e6f0ff', borderRadius: '8px', fontSize: '14px', color: '#004085'}}>
                    Setează orele de disponibilitate pentru rezervări online. Pauzele blochează automat calendarul.
                </div>

                {weekDays.map(day => (
                    <div key={day} style={{borderBottom:'1px solid #eee', padding:'15px 0'}}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <input 
                                    type="checkbox" 
                                    checked={schedule[day]?.open} 
                                    onChange={(e) => handleDayChange(day, 'open', e.target.checked)}
                                    style={{width: '18px', height: '18px', cursor: 'pointer'}}
                                />
                                <strong style={{textTransform:'capitalize', width:'80px', fontSize: '15px'}}>{day}</strong>
                            </div>
                            
                            {schedule[day]?.open ? (
                                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <input type="time" value={schedule[day].start} onChange={(e) => handleDayChange(day, 'start', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}/>
                                    <span>la</span>
                                    <input type="time" value={schedule[day].end} onChange={(e) => handleDayChange(day, 'end', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}/>
                                    <button onClick={() => addBreak(day)} style={{fontSize:'13px', color:'#007bff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', marginLeft: '10px'}}>+ Adaugă Pauză</button>
                                </div>
                            ) : (
                                <span style={{color:'#999', fontStyle:'italic'}}>Nu lucrează</span>
                            )}
                        </div>

                        {/* Pauze */}
                        {schedule[day]?.open && schedule[day].breaks?.map((brk, idx) => (
                            <div key={idx} style={{display:'flex', gap:'10px', alignItems:'center', marginLeft:'115px', marginTop:'5px'}}>
                                <span style={{fontSize:'12px', color:'#666'}}>Pauză:</span>
                                <input type="time" value={brk.start} onChange={(e) => updateBreak(day, idx, 'start', e.target.value)} style={{padding:'3px', fontSize:'12px', border:'1px solid #ddd', borderRadius: '3px'}}/>
                                <span>-</span>
                                <input type="time" value={brk.end} onChange={(e) => updateBreak(day, idx, 'end', e.target.value)} style={{padding:'3px', fontSize:'12px', border:'1px solid #ddd', borderRadius: '3px'}}/>
                                <FaTrash onClick={() => removeBreak(day, idx)} style={{color:'#e64c3c', cursor:'pointer', fontSize:'12px', marginLeft: '5px'}} title="Șterge pauza" />
                            </div>
                        ))}
                    </div>
                ))}

                <div style={{marginTop:'20px', display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                    <button onClick={onClose} style={{padding:'12px 20px', background:'#f0f0f0', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight: '600'}}>Anulează</button>
                    <button onClick={() => onSave(staff.id, schedule)} style={{padding:'12px 20px', background:'#007bff', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight: '600'}}>Salvează Programul</button>
                </div>
            </div>
        </div>
    );
};


// Componentă Formular Adăugare
const AddForm = ({ onAdd, title, fields }) => {
    const initialFormData = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    const [formData, setFormData] = useState(initialFormData);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData(initialFormData); 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.addFormContainer}>
            <h3 className={styles.formTitle}>Adaugă {title}</h3>
            <form onSubmit={handleSubmit} className={styles.formRow}>
                {fields.map(field => (
                    <div key={field.name} className={styles.fieldGroup} style={{ flex: field.flex || 1 }}>
                        <label className={styles.label}>{field.label}</label>
                        <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={field.required !== false} // Default required
                            className={styles.input}
                            placeholder={field.placeholder || ''}
                        />
                    </div>
                ))}
                <button type="submit" className={styles.addButton}>
                    <FaPlus /> Adaugă
                </button>
            </form>
        </div>
    );
};

export default function DashboardServicesPage() {
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStaff, setEditingStaff] = useState(null); // Pentru modal

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const servicesRes = await fetch('/api/dashboard/data?type=services');
            const staffRes = await fetch('/api/dashboard/data?type=staff');
            
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (staffRes.ok) setStaff(await staffRes.json());
            
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // Add Logic
    const handleAdd = async (data, type) => {
        try {
            const response = await fetch('/api/dashboard/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: type, data: data }),
            });
            
            if (response.ok) {
                fetchData(); 
            } else {
                alert(`Eroare la adăugarea ${type}!`);
            }
        } catch (error) {
            console.error(`Eroare POST ${type}:`, error);
        }
    };

    // Delete Logic
    const handleDelete = async (id, type) => {
        if (!confirm(`Ești sigur că vrei să ștergi acest ${type}?`)) return;

        try {
            const response = await fetch(`/api/dashboard/data?type=${type}&id=${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                fetchData();
            } else {
                alert(`Eroare la ștergerea ${type}!`);
            }
        } catch (error) {
            console.error(`Eroare DELETE ${type}:`, error);
        }
    };
    
    // Save Schedule Logic (PUT)
    const saveStaffSchedule = async (id, schedule) => {
        try {
            const response = await fetch('/api/dashboard/data', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: 'staff', 
                    id: id, 
                    data: { schedule: schedule } 
                })
            });
            
            if (response.ok) {
                alert('Programul a fost salvat cu succes!');
                setEditingStaff(null);
                fetchData(); // Reîncărcăm datele pentru siguranță
            } else {
                alert('Eroare la salvarea programului.');
            }
        } catch (e) {
            console.error(e);
            alert('Eroare de rețea.');
        }
    };

    // Configurare Câmpuri Formulare
    const serviceFields = [
        { name: 'name', label: 'Nume Serviciu', flex: 2, placeholder: 'ex: Tuns Clasic' },
        { name: 'price', label: 'Preț (RON)', type: 'number', flex: 1, placeholder: '50' },
        { name: 'duration', label: 'Durată (min)', type: 'number', flex: 1, placeholder: '30' },
    ];

    const staffFields = [
        { name: 'name', label: 'Nume Angajat', flex: 2, placeholder: 'ex: Ion Popescu' },
        { name: 'role', label: 'Rol', flex: 1, placeholder: 'ex: Senior Stylist' },
        // Câmpuri noi pentru notificări
        { name: 'email', label: 'Email (Notificări)', flex: 2, placeholder: 'email@exemplu.com', required: false },
        { name: 'phone', label: 'Telefon', flex: 1, placeholder: '07xx...', required: false },
    ];


    if (loading) {
        return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă datele...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>Gestionarea Serviciilor și Angajaților</h1>
            <p className={styles.headerDescription}>
                Definește prețurile, duratele și echipa ta pentru a permite programări online.
            </p>

            {/* Zonă Servicii */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaListUl /> Servicii Oferite</h2>
                
                <AddForm onAdd={(data) => handleAdd(data, 'service')} title="Serviciu Nou" fields={serviceFields} />
                
                {services.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>Niciun serviciu adăugat încă.</p>}

                {services.map(service => (
                    <div key={service.id} className={styles.listItem}>
                        <div>
                            <strong className={styles.itemName}>{service.name}</strong>
                            <span className={styles.itemMetaPrimary}>{service.price} RON</span>
                            <span className={styles.itemMetaSecondary}>({service.duration} min)</span>
                        </div>
                        <div>
                            <button onClick={() => handleDelete(service.id, 'service')} className={`${styles.actionButton} ${styles.deleteBtn}`} title="Șterge"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Zonă Angajați (Staff) */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaUser /> Angajați (Staff)</h2>
                
                <AddForm onAdd={(data) => handleAdd(data, 'staff')} title="Angajat Nou" fields={staffFields} />

                {staff.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>Niciun angajat adăugat încă.</p>}

                {staff.map(member => (
                    <div key={member.id} className={styles.listItem}>
                        <div>
                            <strong className={styles.itemName}>{member.name}</strong>
                            <span className={styles.itemMetaSecondary}>{member.role}</span>
                            {/* Afișăm contact info dacă există */}
                            {(member.email || member.phone) && (
                                <div style={{fontSize: '12px', color: '#888', marginTop: '4px', display: 'flex', gap: '10px'}}>
                                    {member.email && <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FaEnvelope size={10}/> {member.email}</span>}
                                    {member.phone && <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FaPhone size={10}/> {member.phone}</span>}
                                </div>
                            )}
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            {/* Buton Configurare Program */}
                            <button 
                                onClick={() => setEditingStaff(member)} 
                                className={`${styles.actionButton}`} 
                                style={{color: '#007bff', border: '1px solid #007bff', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px'}}
                                title="Configurează Program"
                            >
                                <FaClock /> Program
                            </button>

                            <button onClick={() => handleDelete(member.id, 'staff')} className={`${styles.actionButton} ${styles.deleteBtn}`} title="Șterge"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modalul de Programare (Apare doar când edităm pe cineva) */}
            {editingStaff && (
                <StaffScheduleModal 
                    staff={editingStaff} 
                    onClose={() => setEditingStaff(null)} 
                    onSave={saveStaffSchedule} 
                />
            )}
        </div>
    );
}