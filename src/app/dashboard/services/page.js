// /src/app/dashboard/services/page.js (COD COMPLET FINAL)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUser, FaListUl, FaClock, FaTimes, FaEnvelope, FaPhone, FaCheckSquare, FaCheck, FaChair, FaInfoCircle, FaBell } from 'react-icons/fa';
import styles from './services.module.css';

// --- MODAL PROGRAM (Rămâne neschimbat) ---
const StaffScheduleModal = ({ staff, onClose, onSave }) => {
    const weekDays = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'];
    const [schedule, setSchedule] = useState(staff.schedule && Object.keys(staff.schedule).length > 0 ? staff.schedule : weekDays.reduce((acc, day) => ({...acc, [day]: { open: true, start: '09:00', end: '17:00', breaks: [] }}), {}));
    const handleDayChange = (day, field, value) => { setSchedule(prev => ({...prev, [day]: { ...prev[day], [field]: value }})); };
    const addBreak = (day) => { setSchedule(prev => ({...prev, [day]: { ...prev[day], breaks: [...(prev[day].breaks || []), { start: '13:00', end: '13:30' }] }})); };
    const removeBreak = (day, index) => { setSchedule(prev => { const newBreaks = [...prev[day].breaks]; newBreaks.splice(index, 1); return {...prev, [day]: { ...prev[day], breaks: newBreaks }}; }); };
    const updateBreak = (day, index, field, value) => { setSchedule(prev => { const newBreaks = [...prev[day].breaks]; newBreaks[index] = { ...newBreaks[index], [field]: value }; return {...prev, [day]: { ...prev[day], breaks: newBreaks }}; }); };
    
    return (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
            <div style={{background:'white', padding:'30px', borderRadius:'12px', width:'700px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 5px 20px rgba(0,0,0,0.2)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h2 style={{margin:0, color:'#1c2e40'}}>Program: {staff.name}</h2>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px'}}><FaTimes /></button>
                </div>
                <div style={{marginBottom:'20px', padding:'10px', background:'#e6f0ff', borderRadius:'6px', fontSize:'13px'}}>Setează intervalul orar. Pauzele blochează calendarul.</div>
                {weekDays.map(day => (
                    <div key={day} style={{borderBottom:'1px solid #eee', padding:'15px 0'}}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <input type="checkbox" checked={schedule[day]?.open} onChange={(e) => handleDayChange(day, 'open', e.target.checked)} style={{width:'18px', height:'18px'}} />
                                <strong style={{textTransform:'capitalize', width:'80px'}}>{day}</strong>
                            </div>
                            {schedule[day]?.open ? (
                                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <input type="time" value={schedule[day].start} onChange={(e) => handleDayChange(day, 'start', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}/>
                                    <span>-</span>
                                    <input type="time" value={schedule[day].end} onChange={(e) => handleDayChange(day, 'end', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}/>
                                    <button onClick={() => addBreak(day)} style={{fontSize:'12px', color:'#007bff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>+ Pauză</button>
                                </div>
                            ) : <span style={{color:'#999', fontStyle:'italic'}}>Liber</span>}
                        </div>
                        {schedule[day]?.open && schedule[day].breaks?.map((brk, idx) => (
                            <div key={idx} style={{display:'flex', gap:'10px', alignItems:'center', marginLeft:'110px', marginTop:'5px'}}>
                                <span style={{fontSize:'12px', color:'#666'}}>Pauză:</span>
                                <input type="time" value={brk.start} onChange={(e) => updateBreak(day, idx, 'start', e.target.value)} style={{padding:'3px', fontSize:'12px', border:'1px solid #ddd'}}/>
                                <span>-</span>
                                <input type="time" value={brk.end} onChange={(e) => updateBreak(day, idx, 'end', e.target.value)} style={{padding:'3px', fontSize:'12px', border:'1px solid #ddd'}}/>
                                <FaTrash onClick={() => removeBreak(day, idx)} style={{color:'#e64c3c', cursor:'pointer', fontSize:'12px'}} />
                            </div>
                        ))}
                    </div>
                ))}
                <div style={{marginTop:'20px', display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                    <button onClick={onClose} style={{padding:'10px 20px', background:'#f0f0f0', border:'none', borderRadius:'6px', cursor:'pointer'}}>Anulează</button>
                    <button onClick={() => onSave(staff.id, schedule)} style={{padding:'10px 20px', background:'#007bff', color:'white', border:'none', borderRadius:'6px', cursor:'pointer'}}>Salvează</button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTĂ FORMULAR ADĂUGARE (CU SERVICII & CONTACT) ---
const AddForm = ({ onAdd, title, fields, isStaffForm, availableServices }) => {
    const initialFormData = fields.reduce((acc, field) => ({ 
        ...acc, 
        [field.name]: field.type === 'checkbox' ? (field.defaultValue ?? false) : '' 
    }), {});
    
    if (isStaffForm) {
        initialFormData.useSalonContact = true;
        initialFormData.serviceIds = []; // Array pentru servicii
    }

    const [formData, setFormData] = useState(initialFormData);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validare Contact
        if (isStaffForm && !formData.useSalonContact && !formData.email && !formData.phone) {
            alert("Trebuie să introduci un Email sau Telefon dacă nu folosești contactul recepției.");
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
        const updated = current.includes(id) ? current.filter(s => s !== id) : [...current, id];
        setFormData({ ...formData, serviceIds: updated });
    };

    const inputFields = fields.filter(f => f.type !== 'checkbox');
    const checkboxFields = fields.filter(f => f.type === 'checkbox');

    return (
        <div className={styles.addFormContainer}>
            <h3 className={styles.formTitle}>{title}</h3>
            <form onSubmit={handleSubmit}>
                {/* Câmpuri Text */}
                <div className={styles.formRow}>
                    {inputFields.map(field => {
                        if (isStaffForm && (field.name === 'email' || field.name === 'phone') && formData.useSalonContact) return null;
                        if (isStaffForm && field.name === 'assignedPerson' && formData.isHuman) return null;
                        return (
                            <div key={field.name} className={styles.fieldGroup} style={{ flex: field.flex || 1 }}>
                                <label className={styles.label}>{field.label}</label>
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.required !== false}
                                    className={styles.input}
                                    placeholder={field.placeholder || ''}
                                />
                            </div>
                        );
                    })}
                </div>
                
                {/* Setări Checkbox */}
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {checkboxFields.map(field => (
                        <div key={field.name} style={{background: formData[field.name] ? '#fff3cd' : '#f8f9fa', border: formData[field.name] ? '1px solid #ffeeba' : '1px solid #eee', padding: '15px', borderRadius: '8px'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#333'}}>
                                <input type="checkbox" name={field.name} checked={formData[field.name]} onChange={handleChange} style={{width:'18px', height:'18px'}} />
                                {field.label}
                            </label>
                            <div style={{marginLeft:'28px', fontSize:'12px', color:'#666', marginTop:'5px'}}>{field.description}</div>
                        </div>
                    ))}

                    {/* Toggle Staff Contact */}
                    {isStaffForm && (
                        <div style={{background: formData.useSalonContact ? '#e6f4ea' : '#fff', border: formData.useSalonContact ? '1px solid #1aa858' : '1px dashed #ccc', padding: '15px', borderRadius: '8px'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: formData.useSalonContact ? '#1aa858' : '#333'}}>
                                <input type="checkbox" name="useSalonContact" checked={formData.useSalonContact} onChange={handleChange} style={{width: '18px', height: '18px'}} />
                                Folosește contactul Recepției
                            </label>
                            <div style={{marginLeft: '28px', marginTop: '5px', fontSize: '12px', color: '#555'}}>
                                {formData.useSalonContact ? 'Notificările merg la recepție.' : 'Introdu contactul personal al angajatului.'}
                            </div>
                        </div>
                    )}

                    {/* Selecție Servicii */}
                    {isStaffForm && availableServices && (
                        <div style={{padding: '15px', border: '1px solid #ddd', borderRadius: '8px'}}>
                            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>Ce servicii prestează acest calendar?</label>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                                {availableServices.map(svc => (
                                    <div key={svc.id} onClick={() => toggleService(svc.id)} style={{
                                        padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
                                        background: formData.serviceIds?.includes(svc.id) ? '#007bff' : '#eee',
                                        color: formData.serviceIds?.includes(svc.id) ? 'white' : '#333'
                                    }}>
                                        {svc.name} {formData.serviceIds?.includes(svc.id) && <FaCheck style={{marginLeft: '5px'}}/>}
                                    </div>
                                ))}
                            </div>
                        </div>
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

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const servicesRes = await fetch('/api/dashboard/data?type=services');
            const staffRes = await fetch('/api/dashboard/data?type=staff');
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (staffRes.ok) setStaff(await staffRes.json());
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
            
            if (response.ok) fetchData();
            else {
                const err = await response.json();
                alert(err.message || "Eroare");
            }
        } catch (error) { console.error(error); }
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
            if (response.ok) { alert('Program salvat!'); setEditingStaff(null); fetchData(); }
        } catch (e) { alert('Eroare'); }
    };

    const serviceFields = [
        { name: 'name', label: 'Nume Serviciu', flex: 2, placeholder: 'ex: Tuns' },
        { name: 'price', label: 'Preț (RON)', type: 'number', flex: 1, placeholder: '50' },
        { name: 'duration', label: 'Min', type: 'number', flex: 1, placeholder: '30' },
        { name: 'requiresApproval', label: 'Aprobare Manuală?', type: 'checkbox', description: 'Clientul va aștepta confirmarea.', required: false },
        { name: 'autoAssign', label: 'Alocare Automată?', type: 'checkbox', description: 'Sistemul alege prima resursă liberă.', required: false },
    ];

    const staffFields = [
        { name: 'name', label: 'Nume (Om sau Resursă)', flex: 2, placeholder: 'ex: Ion sau Masa 1' },
        { name: 'role', label: 'Rol', flex: 1, placeholder: 'ex: Stilist' },
        { name: 'isHuman', label: 'Este o persoană?', type: 'checkbox', defaultValue: true, description: 'Debifează dacă e un obiect (masă/boxă).' },
        { name: 'assignedPerson', label: 'Responsabil', flex: 2, placeholder: 'ex: Ion', required: false },
        { name: 'email', label: 'Email', flex: 2, required: false },
        { name: 'phone', label: 'Telefon', flex: 1, required: false },
    ];

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>Gestionare Servicii și Resurse</h1>

            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaListUl /> Servicii</h2>
                <AddForm onAdd={(data) => handleAdd(data, 'service')} title="Adaugă Serviciu" fields={serviceFields} />
                {services.map(s => (
                    <div key={s.id} className={styles.listItem}>
                        <div>
                            <strong>{s.name}</strong> <span className={styles.itemMetaSecondary}>({s.duration} min, {s.price} RON)</span>
                            {s.requiresApproval && <span style={{fontSize:'10px', color:'#e67e22', fontWeight:'bold', marginLeft:'5px'}}>• Necesită Aprobare</span>}
                        </div>
                        <button onClick={() => handleDelete(s.id, 'service')} className={`${styles.actionButton} ${styles.deleteBtn}`}><FaTrash /></button>
                    </div>
                ))}
            </div>

            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaUser /> Echipă / Calendare</h2>
                <AddForm onAdd={(data) => handleAdd(data, 'staff')} title="Adaugă Calendar" fields={staffFields} isStaffForm={true} availableServices={services} />
                
                {staff.map(m => (
                    <div key={m.id} className={styles.listItem}>
                        <div>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                {m.isHuman ? <FaUser color="#007bff"/> : <FaChair color="#666"/>}
                                <strong>{m.name}</strong>
                            </div>
                            <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>
                                {m.services?.length > 0 ? `Servicii: ${m.services.map(s => s.name).join(', ')}` : <span style={{color:'orange'}}>Niciun serviciu alocat</span>}
                            </div>
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <button onClick={() => setEditingStaff(m)} className={styles.actionButton} style={{color:'#007bff', border:'1px solid #007bff', borderRadius:'4px', padding:'5px 10px', display:'flex', alignItems:'center', gap:'5px'}}>
                                <FaClock /> Program
                            </button>
                            <button onClick={() => handleDelete(m.id, 'staff')} className={styles.actionButton} style={{color:'#e64c3c'}}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {editingStaff && <StaffScheduleModal staff={editingStaff} onClose={() => setEditingStaff(null)} onSave={saveStaffSchedule} />}
        </div>
    );
}