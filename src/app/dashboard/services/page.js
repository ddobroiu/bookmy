// /src/app/dashboard/services/page.js (ACTUALIZAT CU MANAGEMENT PROGRAM)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUser, FaListUl, FaClock, FaTimes } from 'react-icons/fa';
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

    const handleSave = () => {
        onSave(staff.id, schedule);
    };

    return (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
            <div style={{background:'white', padding:'30px', borderRadius:'12px', width:'700px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 5px 20px rgba(0,0,0,0.2)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h2 style={{margin:0}}>Program {staff.name}</h2>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px'}}><FaTimes /></button>
                </div>

                {weekDays.map(day => (
                    <div key={day} style={{borderBottom:'1px solid #eee', padding:'15px 0'}}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <input 
                                    type="checkbox" 
                                    checked={schedule[day]?.open} 
                                    onChange={(e) => handleDayChange(day, 'open', e.target.checked)}
                                />
                                <strong style={{textTransform:'capitalize', width:'80px'}}>{day}</strong>
                            </div>
                            
                            {schedule[day]?.open ? (
                                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <input type="time" value={schedule[day].start} onChange={(e) => handleDayChange(day, 'start', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}/>
                                    <span>-</span>
                                    <input type="time" value={schedule[day].end} onChange={(e) => handleDayChange(day, 'end', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}/>
                                    <button onClick={() => addBreak(day)} style={{fontSize:'12px', color:'#007bff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>+ Pauză</button>
                                </div>
                            ) : (
                                <span style={{color:'#999', fontStyle:'italic'}}>Liber</span>
                            )}
                        </div>

                        {/* Pauze */}
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
                    <button onClick={handleSave} style={{padding:'10px 20px', background:'#007bff', color:'white', border:'none', borderRadius:'6px', cursor:'pointer'}}>Salvează Programul</button>
                </div>
            </div>
        </div>
    );
};


// Componentă Formular Adăugare (Refolosită)
const AddForm = ({ onAdd, title, fields }) => {
    const initialFormData = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    const [formData, setFormData] = useState(initialFormData);
    const handleSubmit = (e) => { e.preventDefault(); onAdd(formData); setFormData(initialFormData); };
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    return (
        <div className={styles.addFormContainer}>
            <h3 className={styles.formTitle}>Adaugă {title}</h3>
            <form onSubmit={handleSubmit} className={styles.formRow}>
                {fields.map(field => (
                    <div key={field.name} className={styles.fieldGroup} style={{ flex: field.flex || 1 }}>
                        <label className={styles.label}>{field.label}</label>
                        <input type={field.type || 'text'} name={field.name} value={formData[field.name]} onChange={handleChange} required className={styles.input} placeholder={field.placeholder || ''} />
                    </div>
                ))}
                <button type="submit" className={styles.addButton}><FaPlus /> Adaugă</button>
            </form>
        </div>
    );
};

export default function DashboardServicesPage() {
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStaff, setEditingStaff] = useState(null); // Pentru modal

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
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id, type) => {
        if (!confirm('Sigur?')) return;
        try {
            const response = await fetch(`/api/dashboard/data?type=${type}&id=${id}`, { method: 'DELETE' });
            if (response.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    // Salvare Program Angajat
    const saveStaffSchedule = async (id, schedule) => {
        try {
            const response = await fetch('/api/dashboard/data', {
                method: 'PUT', // Metodă nouă în API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'staff', id, data: { schedule } })
            });
            if (response.ok) {
                alert('Program salvat!');
                setEditingStaff(null);
                fetchData();
            } else {
                alert('Eroare la salvare.');
            }
        } catch (e) { console.error(e); alert('Eroare rețea.'); }
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>Servicii și Echipă</h1>

            {/* Servicii */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaListUl /> Servicii</h2>
                <AddForm onAdd={(data) => handleAdd(data, 'service')} title="Serviciu" fields={[
                    { name: 'name', label: 'Nume', flex: 2 }, { name: 'price', label: 'Preț', type: 'number', flex: 1 }, { name: 'duration', label: 'Min', type: 'number', flex: 1 }
                ]} />
                {services.map(s => (
                    <div key={s.id} className={styles.listItem}>
                        <span><strong>{s.name}</strong> - {s.price} RON ({s.duration} min)</span>
                        <button onClick={() => handleDelete(s.id, 'service')} className={styles.actionButton} style={{color:'#e64c3c'}}><FaTrash /></button>
                    </div>
                ))}
            </div>

            {/* Staff */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaUser /> Echipă</h2>
                <AddForm onAdd={(data) => handleAdd(data, 'staff')} title="Angajat" fields={[
                    { name: 'name', label: 'Nume', flex: 2 }, { name: 'role', label: 'Rol', flex: 1 }
                ]} />
                {staff.map(m => (
                    <div key={m.id} className={styles.listItem}>
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <strong>{m.name}</strong>
                            <span style={{fontSize:'12px', color:'#666'}}>{m.role}</span>
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            {/* Buton Program */}
                            <button 
                                onClick={() => setEditingStaff(m)}
                                className={styles.actionButton} 
                                style={{color:'#007bff', border:'1px solid #007bff', padding:'5px 10px', borderRadius:'4px', display:'flex', alignItems:'center', gap:'5px'}}
                            >
                                <FaClock /> Program
                            </button>
                            <button onClick={() => handleDelete(m.id, 'staff')} className={styles.actionButton} style={{color:'#e64c3c'}}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Program */}
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