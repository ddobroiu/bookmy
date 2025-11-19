// /src/app/dashboard/services/page.js (COD COMPLET ACTUALIZAT)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    FaPlus, FaTrash, FaUser, FaListUl, FaClock, FaTimes, 
    FaEnvelope, FaPhone, FaCheckSquare, FaChair, FaMagic, FaCheck, FaInfoCircle, FaCar, FaUtensils, FaStethoscope
} from 'react-icons/fa';
import styles from './services.module.css';
import { useToast } from '../../../context/ToastContext';

// --- 1. CONFIGURARE SUGESTII INTELIGENTE (AI MOCK) ---
// Acestea apar DOAR partenerului pentru a-l ajuta să-și populeze rapid meniul.
const SMART_SUGGESTIONS = {
    'barber': [
        { name: 'Tuns Clasic', price: 50, duration: 45 },
        { name: 'Tuns + Barbă', price: 80, duration: 60 },
        { name: 'Contur Barbă', price: 30, duration: 20 },
        { name: 'Vopsit Barbă', price: 40, duration: 30 }
    ],
    'hair': [
        { name: 'Tuns Damă', price: 80, duration: 60 },
        { name: 'Vopsit Rădăcină', price: 150, duration: 90 },
        { name: 'Coafat Ocazie', price: 200, duration: 60 },
        { name: 'Tratament Keratină', price: 450, duration: 120, requiresApproval: true }
    ],
    'beauty': [
        { name: 'Manichiură Semipermanentă', price: 100, duration: 90 },
        { name: 'Pedichiură', price: 120, duration: 60 },
        { name: 'Pensat', price: 30, duration: 15 },
        { name: 'Masaj Facial', price: 80, duration: 30 }
    ],
    'medical': [
        { name: 'Consultație Generală', price: 200, duration: 30 },
        { name: 'Control', price: 100, duration: 20 },
        { name: 'Ecografie', price: 250, duration: 30 }
    ],
    'restaurant': [
        { name: 'Rezervare Masă (2 Pers)', price: 0, duration: 120, autoAssign: true },
        { name: 'Rezervare Grup (4-6 Pers)', price: 0, duration: 120, requiresApproval: true },
        { name: 'Eveniment Privat', price: 0, duration: 240, requiresApproval: true }
    ],
    'auto': [
        { name: 'Spălare Exterior', price: 35, duration: 20, autoAssign: true },
        { name: 'Spălare Interior + Exterior', price: 60, duration: 45, autoAssign: true },
        { name: 'Polish Faruri', price: 100, duration: 60 },
        { name: 'Schimb Ulei', price: 150, duration: 60, requiresApproval: true }
    ]
};

// --- 2. MODAL PROGRAM (StaffScheduleModal) ---
const StaffScheduleModal = ({ staff, onClose, onSave }) => {
    const weekDays = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'];
    const [schedule, setSchedule] = useState(staff.schedule && Object.keys(staff.schedule).length > 0 ? staff.schedule : weekDays.reduce((acc, day) => ({...acc, [day]: { open: true, start: '09:00', end: '17:00', breaks: [] }}), {}));
    
    const handleDayChange = (day, field, value) => setSchedule(prev => ({...prev, [day]: { ...prev[day], [field]: value }}));
    const addBreak = (day) => setSchedule(prev => ({...prev, [day]: { ...prev[day], breaks: [...(prev[day].breaks || []), { start: '13:00', end: '13:30' }] }}));
    const removeBreak = (day, index) => setSchedule(prev => { const b = [...prev[day].breaks]; b.splice(index, 1); return {...prev, [day]: { ...prev[day], breaks: b }}; });
    const updateBreak = (day, index, field, value) => setSchedule(prev => { const b = [...prev[day].breaks]; b[index][field] = value; return {...prev, [day]: { ...prev[day], breaks: b }}; });

    return (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
            <div style={{background:'white', padding:'30px', borderRadius:'12px', width:'700px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 5px 20px rgba(0,0,0,0.2)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h2 style={{margin:0, color:'#1c2e40'}}>Orar Calendar: {staff.name}</h2>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px'}}><FaTimes /></button>
                </div>
                <div style={{marginBottom:'20px', padding:'10px', background:'#e6f0ff', borderRadius:'6px', fontSize:'13px', color:'#004085'}}>
                    Definește intervalul orar și pauzele pentru această resursă. Calendarul se va bloca automat în timpul pauzelor.
                </div>
                {weekDays.map(day => (
                    <div key={day} style={{borderBottom:'1px solid #eee', padding:'10px 0', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                            <input type="checkbox" checked={schedule[day]?.open} onChange={e => handleDayChange(day, 'open', e.target.checked)} style={{width:'18px', height:'18px'}} />
                            <strong style={{textTransform:'capitalize', width:'80px'}}>{day}</strong>
                        </div>
                        {schedule[day]?.open ? (
                            <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                                <input type="time" value={schedule[day].start} onChange={e => handleDayChange(day, 'start', e.target.value)} style={{padding:'5px', border:'1px solid #ddd', borderRadius:'4px'}}/> - 
                                <input type="time" value={schedule[day].end} onChange={e => handleDayChange(day, 'end', e.target.value)} style={{padding:'5px', border:'1px solid #ddd', borderRadius:'4px'}}/>
                                <button onClick={() => addBreak(day)} style={{marginLeft:'10px', color:'#007bff', background:'none', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'bold'}}>+ Pauză</button>
                            </div>
                        ) : <span style={{color:'#999', fontStyle:'italic'}}>Închis</span>}
                        
                        {/* Randare Pauze */}
                        {schedule[day]?.open && schedule[day].breaks?.length > 0 && (
                            <div style={{display:'flex', flexDirection:'column', gap:'5px', marginLeft:'15px'}}>
                                {schedule[day].breaks.map((brk, idx) => (
                                    <div key={idx} style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', background:'#f9f9f9', padding:'2px 5px', borderRadius:'4px'}}>
                                        <span>P: {brk.start}-{brk.end}</span>
                                        <FaTimes onClick={() => removeBreak(day, idx)} style={{color:'red', cursor:'pointer'}} size={10}/>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div style={{marginTop:'20px', textAlign:'right'}}>
                    <button onClick={() => onSave(staff.id, schedule)} style={{padding:'10px 20px', background:'#007bff', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}>Salvează Orarul</button>
                </div>
            </div>
        </div>
    );
};

// --- 3. COMPONENTĂ ADĂUGARE (FLEXIBILĂ) ---
const AddForm = ({ onAdd, title, fields, isStaffForm, availableServices }) => {
    const initialFormData = fields.reduce((acc, field) => ({ 
        ...acc, 
        [field.name]: field.type === 'checkbox' ? (field.defaultValue ?? false) : '' 
    }), {});
    
    if (isStaffForm) {
        initialFormData.useSalonContact = true;
        initialFormData.serviceIds = [];
    }

    const [formData, setFormData] = useState(initialFormData);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validare Contact doar dacă e om și nu folosește recepția
        if (isStaffForm && formData.isHuman && !formData.useSalonContact && !formData.email && !formData.phone) {
            alert("Te rugăm să introduci un Email sau Telefon de contact pentru acest angajat.");
            return;
        }
        onAdd(formData);
        setFormData(initialFormData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const toggleService = (id) => {
        const current = formData.serviceIds || [];
        setFormData({ ...formData, serviceIds: current.includes(id) ? current.filter(s => s !== id) : [...current, id] });
    };

    return (
        <div className={styles.addFormContainer}>
            <h3 className={styles.formTitle}>{title}</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    {fields.map(field => {
                         // Ascundem câmpuri condiționale
                         if (isStaffForm && (field.name === 'email' || field.name === 'phone') && formData.useSalonContact) return null;
                         if (isStaffForm && field.name === 'assignedPerson' && formData.isHuman) return null;
                         if (field.type === 'checkbox') return null; // Randăm separat

                         return (
                            <div key={field.name} className={styles.fieldGroup} style={{ flex: field.flex || 1 }}>
                                <label className={styles.label}>{field.label}</label>
                                <input
                                    type={field.type || 'text'} name={field.name} value={formData[field.name]}
                                    onChange={handleChange} required={field.required !== false}
                                    className={styles.input} placeholder={field.placeholder || ''}
                                />
                            </div>
                         );
                    })}
                </div>

                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {fields.filter(f => f.type === 'checkbox' && f.name !== 'isHuman').map(field => (
                        <div key={field.name} style={{background: formData[field.name] ? '#fff3cd' : '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #eee'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#333'}}>
                                <input type="checkbox" name={field.name} checked={formData[field.name]} onChange={handleChange} style={{width:'16px', height:'16px'}} />
                                {field.label}
                            </label>
                            {field.description && <p style={{marginLeft:'26px', fontSize:'12px', color:'#666', marginTop:'4px'}}>{field.description}</p>}
                        </div>
                    ))}

                    {/* Setări Calendar */}
                    {isStaffForm && (
                        <>
                            {/* Tip Resursă */}
                            <div style={{background: 'white', padding: '15px', border: '1px solid #ddd', borderRadius: '8px'}}>
                                <label className={styles.label} style={{marginBottom:'10px'}}>Tipul Resursei</label>
                                <div style={{display:'flex', gap:'20px'}}>
                                    <label style={{display:'flex', alignItems:'center', gap:'5px', cursor:'pointer'}}>
                                        <input type="radio" name="isHuman" checked={formData.isHuman === true} onChange={() => setFormData({...formData, isHuman: true})} />
                                        <FaUser /> Angajat (Om)
                                    </label>
                                    <label style={{display:'flex', alignItems:'center', gap:'5px', cursor:'pointer'}}>
                                        <input type="radio" name="isHuman" checked={formData.isHuman === false} onChange={() => setFormData({...formData, isHuman: false})} />
                                        <FaChair /> Obiect (Masă/Boxă/Cameră)
                                    </label>
                                </div>
                            </div>

                            {/* Contact */}
                            {formData.isHuman && (
                                <div style={{background: formData.useSalonContact ? '#e6f4ea' : '#fff', border: formData.useSalonContact ? '1px solid #1aa858' : '1px dashed #ccc', padding: '15px', borderRadius: '8px'}}>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: formData.useSalonContact ? '#1aa858' : '#333'}}>
                                        <input type="checkbox" name="useSalonContact" checked={formData.useSalonContact} onChange={handleChange} style={{width: '16px', height: '16px'}} />
                                        Folosește contactul Recepției pentru notificări
                                    </label>
                                    <div style={{marginLeft: '26px', marginTop: '5px', fontSize: '12px', color: '#555'}}>
                                        {formData.useSalonContact ? 'Notificările merg la adresa centrală.' : 'Vei introduce datele personale ale angajatului.'}
                                    </div>
                                </div>
                            )}

                            {/* Selecție Servicii */}
                            {availableServices && availableServices.length > 0 && (
                                <div style={{padding: '15px', border: '1px solid #007bff', borderRadius: '8px', background: '#f0f9ff'}}>
                                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px', color: '#007bff'}}>
                                        <FaListUl style={{marginRight: '5px'}}/> Ce servicii oferă acest calendar?
                                    </label>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                                        {availableServices.map(svc => (
                                            <div key={svc.id} onClick={() => toggleService(svc.id)} style={{
                                                padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
                                                background: formData.serviceIds?.includes(svc.id) ? '#007bff' : 'white',
                                                color: formData.serviceIds?.includes(svc.id) ? 'white' : '#333',
                                                border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                            }}>
                                                {svc.name} {formData.serviceIds?.includes(svc.id) && <FaCheck style={{marginLeft: '5px'}}/>}
                                            </div>
                                        ))}
                                    </div>
                                    {formData.serviceIds.length === 0 && <p style={{fontSize:'12px', color:'red', marginTop:'5px'}}>* Selectează cel puțin un serviciu.</p>}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <button type="submit" className={styles.addButton} style={{marginTop: '20px', width: '100%', justifyContent: 'center'}}>
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
    const [editingStaff, setEditingStaff] = useState(null);
    const [salonCategory, setSalonCategory] = useState(''); 
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const servicesRes = await fetch('/api/dashboard/data?type=services');
            const staffRes = await fetch('/api/dashboard/data?type=staff');
            const salonRes = await fetch('/api/partner/salon');
            
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (staffRes.ok) setStaff(await staffRes.json());
            if (salonRes.ok) {
                const sData = await salonRes.json();
                const cat = sData.category?.toLowerCase() || '';
                if (cat.includes('barber')) setSalonCategory('barber');
                else if (cat.includes('medical')) setSalonCategory('medical');
                else if (cat.includes('restaurant')) setSalonCategory('restaurant');
                else if (cat.includes('auto')) setSalonCategory('auto');
                else setSalonCategory('beauty');
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAdd = async (data, type) => {
        try {
            const response = await fetch('/api/dashboard/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data }),
            });
            
            if (response.ok) {
                showToast('Adăugat cu succes!', 'success');
                fetchData();
            } else {
                const err = await response.json();
                showToast(err.message || "Eroare", 'error');
            }
        } catch (error) { console.error(error); }
    };

    const handleAddSuggestion = async (suggestion) => {
        await handleAdd(suggestion, 'service');
    };

    const handleDelete = async (id, type) => {
        if (!confirm('Sigur?')) return;
        try {
            const response = await fetch(`/api/dashboard/data?type=${type}&id=${id}`, { method: 'DELETE' });
            if (response.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const saveStaffSchedule = async (id, schedule) => {
        try {
            const response = await fetch('/api/dashboard/data', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'staff', id, data: { schedule } })
            });
            if (response.ok) { showToast('Orar salvat!', 'success'); setEditingStaff(null); fetchData(); }
        } catch (e) { showToast('Eroare', 'error'); }
    };

    // --- CONFIGURARE CÂMPURI ---
    const serviceFields = [
        { name: 'name', label: 'Denumire Serviciu', flex: 2, placeholder: 'ex: Tuns' },
        { name: 'price', label: 'Preț (RON)', type: 'number', flex: 1 },
        { name: 'duration', label: 'Durată (min)', type: 'number', flex: 1 },
        { name: 'requiresApproval', label: 'Aprobare Manuală?', type: 'checkbox', description: 'Clientul așteaptă confirmarea ta.' },
        { name: 'autoAssign', label: 'Alocare Automată?', type: 'checkbox', description: 'Sistemul alege prima resursă liberă (util pt Mese/Boxe).' },
    ];

    const staffFields = [
        { name: 'name', label: 'Nume Calendar (Resursă)', flex: 2, placeholder: 'ex: Ion sau Masa 1' },
        { name: 'role', label: 'Etichetă', flex: 1, placeholder: 'ex: Stilist' },
        { name: 'assignedPerson', label: 'Responsabil (Opțional)', flex: 2, placeholder: 'Cine răspunde de acest obiect?', required: false },
        { name: 'email', label: 'Email', flex: 2, required: false },
        { name: 'phone', label: 'Telefon', flex: 1, required: false },
    ];

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>Configurare Resurse & Servicii</h1>
            <p className={styles.headerDescription}>Pasul 1: Definește ce oferi. Pasul 2: Definește cine/ce prestează (Calendarele).</p>

            {/* 1. MENIU SERVICII */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaListUl /> Meniu Servicii</h2>
                
                {/* Smart Suggestions - Apar doar dacă lista e goală sau mică */}
                {services.length < 2 && SMART_SUGGESTIONS[salonCategory] && (
                    <div style={{marginBottom: '20px', padding: '15px', background: '#fff8e1', borderRadius: '8px', border: '1px dashed #ffc107'}}>
                        <h4 style={{margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#856404'}}>
                            <FaMagic /> Recomandări pentru afacerea ta ({salonCategory})
                        </h4>
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                            {SMART_SUGGESTIONS[salonCategory].map((sug, i) => (
                                <button key={i} onClick={() => handleAddSuggestion(sug)} style={{padding: '8px 12px', background: 'white', border: '1px solid #ffc107', borderRadius: '20px', cursor: 'pointer', color: '#856404', fontSize: '13px', fontWeight: '600'}}>
                                    + {sug.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <AddForm onAdd={(data) => handleAdd(data, 'service')} title="Adaugă Serviciu" fields={serviceFields} />
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px'}}>
                    {services.map(s => (
                        <div key={s.id} className={styles.listItem} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                <div>
                                    <strong style={{fontSize: '16px'}}>{s.name}</strong>
                                    <div style={{fontSize: '13px', color: '#666'}}>
                                        {s.duration} min • <span style={{color: '#1aa858', fontWeight: 'bold'}}>{s.price} RON</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(s.id, 'service')} className={`${styles.actionButton} ${styles.deleteBtn}`}><FaTrash /></button>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {s.requiresApproval && <span style={{fontSize:'10px', background:'#fff3cd', padding:'2px 6px', borderRadius:'4px', color:'#856404'}}>Aprobare Manuală</span>}
                                {s.autoAssign && <span style={{fontSize:'10px', background:'#d1ecf1', padding:'2px 6px', borderRadius:'4px', color:'#0c5460'}}>Alocare Automată</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. CALENDARE */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaUser /> Calendare (Resurse Active)</h2>
                <div style={{marginBottom: '20px', fontSize: '14px', color: '#555'}}>
                    Fiecare calendar reprezintă o capacitate de rezervare (ex: un angajat sau o masă).
                    <br/><strong>Important:</strong> Asociază servicii fiecărui calendar.
                </div>

                <AddForm 
                    onAdd={(data) => handleAdd(data, 'staff')} 
                    title="Adaugă Calendar Nou" 
                    fields={staffFields} 
                    isStaffForm={true} 
                    availableServices={services} 
                />
                
                <div style={{display: 'grid', gap: '15px'}}>
                    {staff.map(m => (
                        <div key={m.id} className={styles.listItem} style={{background: '#fff', borderLeft: '4px solid #007bff'}}>
                            <div style={{flex: 1}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                                    {m.isHuman ? <FaUser size={18} color="#007bff"/> : <FaChair size={18} color="#666"/>}
                                    <strong style={{fontSize: '18px'}}>{m.name}</strong>
                                    <span style={{fontSize: '12px', background: '#eee', padding: '2px 8px', borderRadius: '10px'}}>{m.role}</span>
                                    {!m.isHuman && m.assignedPerson && <span style={{fontSize: '12px', color:'#888'}}>(Resp: {m.assignedPerson})</span>}
                                </div>
                                
                                <div style={{fontSize: '13px', color: '#555', marginBottom: '5px'}}>
                                    <strong>Servicii Oferite:</strong> {m.services && m.services.length > 0 
                                        ? m.services.map(s => s.name).join(', ') 
                                        : <span style={{color: 'red', fontWeight:'bold'}}>Niciun serviciu alocat! (Inactiv)</span>}
                                </div>

                                <div style={{fontSize: '12px', color: '#888', display: 'flex', gap: '15px'}}>
                                    {m.useSalonContact ? (
                                        <span style={{color: '#1aa858'}}><FaCheckCircle style={{verticalAlign:'middle'}}/> Notificări la Recepție</span>
                                    ) : (
                                        <>
                                            {m.email && <span><FaEnvelope/> {m.email}</span>}
                                            {m.phone && <span><FaPhone/> {m.phone}</span>}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                <button onClick={() => setEditingStaff(m)} className={styles.actionButton} style={{background: '#e6f0ff', color: '#007bff', fontSize: '14px', width: '100%', textAlign: 'center'}}>
                                    <FaClock /> Orar
                                </button>
                                <button onClick={() => handleDelete(m.id, 'staff')} className={styles.actionButton} style={{color: '#e64c3c', fontSize: '14px', width: '100%', textAlign: 'center'}}>
                                    <FaTrash /> Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingStaff && <StaffScheduleModal staff={editingStaff} onClose={() => setEditingStaff(null)} onSave={saveStaffSchedule} />}
        </div>
    );
}