// /src/app/dashboard/settings/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaStore, FaClock, FaImage, FaSave, FaWifi, FaParking, FaCreditCard, FaWheelchair, FaCoffee } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

const WEEK_DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'];

const AVAILABLE_FACILITIES = [
    { id: 'wifi', label: 'Wi-Fi Gratuit', icon: FaWifi },
    { id: 'parcare', label: 'Parcare', icon: FaParking },
    { id: 'card', label: 'Plată Card', icon: FaCreditCard },
    { id: 'acces', label: 'Acces Dizabilități', icon: FaWheelchair },
    { id: 'cafea', label: 'Cafea/Ceai', icon: FaCoffee },
];

export default function SalonSettingsPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // general, schedule, visual

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        description: '',
        category: '',
        coverImage: '',
        schedule: {},
        facilities: []
    });

    // 1. Fetch date inițiale
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch('/api/partner/salon');
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        // Fallback pentru schedule dacă e gol
                        schedule: data.schedule && Object.keys(data.schedule).length > 0 ? data.schedule : 
                            WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: { open: true, start: '09:00', end: '17:00' } }), {})
                    }));
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        loadData();
    }, []);

    // 2. Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleScheduleChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: { ...prev.schedule[day], [field]: value }
            }
        }));
    };

    const toggleFacility = (id) => {
        setFormData(prev => {
            const current = prev.facilities || [];
            const exists = current.includes(id);
            return {
                ...prev,
                facilities: exists ? current.filter(f => f !== id) : [...current, id]
            };
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, coverImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/partner/salon', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) showToast('Setările au fost actualizate!', 'success');
            else showToast('Eroare la salvare.', 'error');
        } catch (e) {
            showToast('Eroare de rețea.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // --- Stiluri ---
    const tabStyle = (tab) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        borderBottom: activeTab === tab ? '2px solid #007bff' : '2px solid transparent',
        color: activeTab === tab ? '#007bff' : '#666',
        fontWeight: '600',
        display: 'flex', alignItems: 'center', gap: '8px'
    });

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Se încarcă setările...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h1 style={{ fontSize: '28px', color: '#1c2e40', margin: 0 }}>Setări Salon</h1>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    style={{background:'#1aa858', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px'}}
                >
                    <FaSave /> {saving ? 'Se salvează...' : 'Salvează Tot'}
                </button>
            </div>

            {/* Tabs Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '30px' }}>
                <div onClick={() => setActiveTab('general')} style={tabStyle('general')}><FaStore /> General</div>
                <div onClick={() => setActiveTab('schedule')} style={tabStyle('schedule')}><FaClock /> Program</div>
                <div onClick={() => setActiveTab('visual')} style={tabStyle('visual')}><FaImage /> Vizual & Facilități</div>
            </div>

            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                
                {/* TAB 1: GENERAL */}
                {activeTab === 'general' && (
                    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        <div>
                            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Nume Salon</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                        </div>
                        <div>
                            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Adresă</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                        </div>
                        <div>
                            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Telefon Contact</label>
                            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="07xx xxx xxx" style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                        </div>
                        <div>
                            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Descriere (Despre noi)</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="5" style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                        </div>
                    </div>
                )}

                {/* TAB 2: PROGRAM */}
                {activeTab === 'schedule' && (
                    <div>
                        <p style={{marginBottom:'20px', color:'#666'}}>Definește programul general de funcționare al afacerii.</p>
                        {WEEK_DAYS.map(day => {
                            const isOpen = formData.schedule[day]?.open;
                            return (
                                <div key={day} style={{display:'flex', alignItems:'center', padding:'10px 0', borderBottom:'1px dashed #eee'}}>
                                    <div style={{width:'100px', textTransform:'capitalize', fontWeight:'600'}}>{day}</div>
                                    <label style={{marginRight:'20px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}>
                                        <input type="checkbox" checked={isOpen} onChange={(e) => handleScheduleChange(day, 'open', e.target.checked)} />
                                        {isOpen ? 'Deschis' : 'Închis'}
                                    </label>
                                    {isOpen && (
                                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                            <input type="time" value={formData.schedule[day]?.start} onChange={(e) => handleScheduleChange(day, 'start', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ddd'}} />
                                            <span>-</span>
                                            <input type="time" value={formData.schedule[day]?.end} onChange={(e) => handleScheduleChange(day, 'end', e.target.value)} style={{padding:'5px', borderRadius:'4px', border:'1px solid #ddd'}} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* TAB 3: VIZUAL & FACILITĂȚI */}
                {activeTab === 'visual' && (
                    <div>
                        <div style={{marginBottom:'30px'}}>
                            <h3 style={{fontSize:'16px', marginBottom:'15px'}}>Imagine Copertă</h3>
                            <div style={{width:'100%', height:'200px', borderRadius:'10px', backgroundColor:'#f0f0f0', overflow:'hidden', position:'relative', border:'2px dashed #ddd'}}>
                                {formData.coverImage ? (
                                    <img src={formData.coverImage} alt="Cover" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                ) : (
                                    <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>Nicio imagine selectată</div>
                                )}
                                <input 
                                    type="file" 
                                    onChange={handleImageUpload} 
                                    style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer'}} 
                                />
                                <div style={{position:'absolute', bottom:'10px', right:'10px', background:'rgba(0,0,0,0.6)', color:'white', padding:'5px 10px', borderRadius:'5px', fontSize:'12px', pointerEvents:'none'}}>
                                    Click pentru a schimba
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{fontSize:'16px', marginBottom:'15px'}}>Facilități</h3>
                            <div style={{display:'flex', flexWrap:'wrap', gap:'15px'}}>
                                {AVAILABLE_FACILITIES.map(fac => {
                                    const Icon = fac.icon;
                                    const isSelected = formData.facilities?.includes(fac.id);
                                    return (
                                        <div 
                                            key={fac.id} 
                                            onClick={() => toggleFacility(fac.id)}
                                            style={{
                                                padding:'10px 15px', 
                                                borderRadius:'8px', 
                                                border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                                                backgroundColor: isSelected ? '#e6f0ff' : 'white',
                                                color: isSelected ? '#007bff' : '#555',
                                                cursor:'pointer',
                                                display:'flex', alignItems:'center', gap:'8px', fontWeight:'600'
                                            }}
                                        >
                                            <Icon /> {fac.label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}