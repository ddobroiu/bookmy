// /src/app/profil/setari/page.js (COD COMPLET FUNCTIONAL)

'use client';

import React, { useState, useEffect } from 'react';
import { FaBell, FaLock, FaToggleOn, FaToggleOff, FaSave, FaMoneyBillWave } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        notifEmail: true,
        notifSms: true,
        notifPromo: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    // 1. Fetch setări inițiale din DB
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/user/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    // 2. Handler Toggle (Modificare locală)
    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // 3. Salvare în DB
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                showToast('Setările au fost salvate!', 'success');
            } else {
                showToast('Eroare la salvare.', 'error');
            }
        } catch (error) {
            showToast('Eroare de conexiune.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const sectionStyle = { marginBottom: '40px' };
    const sectionTitle = {
        fontSize: '18px', fontWeight: '700', color: '#1c2e40', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '10px'
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Se încarcă setările...</div>;

    return (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '100%' }}>
             <h1 style={{ fontSize: '24px', marginBottom: '30px', color: '#1c2e40', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                Setări Cont
            </h1>

            {/* 1. Notificări */}
            <div style={sectionStyle}>
                <h2 style={sectionTitle}><FaBell style={{color: '#007bff'}} /> Preferințe Notificări</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Email Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '600' }}>Notificări Email</div>
                            <div style={{ fontSize: '13px', color: '#888' }}>Primește confirmări de rezervare și modificări.</div>
                        </div>
                        <div onClick={() => toggleSetting('notifEmail')} style={{ cursor: 'pointer', fontSize: '32px', color: settings.notifEmail ? '#1aa858' : '#ccc' }}>
                            {settings.notifEmail ? <FaToggleOn /> : <FaToggleOff />}
                        </div>
                    </div>

                    {/* SMS Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '600' }}>Notificări SMS</div>
                            <div style={{ fontSize: '13px', color: '#888' }}>Primește memento-uri cu 24h înainte de programare.</div>
                        </div>
                        <div onClick={() => toggleSetting('notifSms')} style={{ cursor: 'pointer', fontSize: '32px', color: settings.notifSms ? '#1aa858' : '#ccc' }}>
                            {settings.notifSms ? <FaToggleOn /> : <FaToggleOff />}
                        </div>
                    </div>

                    {/* Promo Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '600' }}>Noutăți și Oferte</div>
                            <div style={{ fontSize: '13px', color: '#888' }}>Fii la curent cu reducerile de la saloanele favorite.</div>
                        </div>
                        <div onClick={() => toggleSetting('notifPromo')} style={{ cursor: 'pointer', fontSize: '32px', color: settings.notifPromo ? '#1aa858' : '#ccc' }}>
                            {settings.notifPromo ? <FaToggleOn /> : <FaToggleOff />}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Plăți (Simplificat pentru Cash Only) */}
            <div style={sectionStyle}>
                <h2 style={sectionTitle}><FaMoneyBillWave style={{color: '#007bff'}} /> Metode de Plată</h2>
                
                <div style={{
                    border: '1px solid #e6f4ea', 
                    backgroundColor: '#f0fff4', 
                    padding: '20px', 
                    borderRadius: '8px',
                    color: '#1e7e34'
                }}>
                    <strong>Modul Curent: Plată la Locație (Cash/Card)</strong>
                    <p style={{fontSize: '13px', margin: '5px 0 0 0'}}>
                        Momentan, platforma funcționează exclusiv cu plata direct la salon după efectuarea serviciului. Nu este necesar să adaugi un card bancar.
                    </p>
                </div>
            </div>

            {/* 3. Securitate */}
            <div style={sectionStyle}>
                <h2 style={sectionTitle}><FaLock style={{color: '#007bff'}} /> Securitate</h2>
                <button style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}
                onClick={() => showToast('Funcționalitate de schimbare parolă în lucru.', 'info')}
                >
                    Schimbă Parola
                </button>
            </div>

            {/* Buton Salvare Generală */}
            <button 
                onClick={handleSave}
                disabled={saving}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px'
                }}
            >
                {saving ? 'Se salvează...' : <><FaSave /> Salvează Preferințele</>}
            </button>

        </div>
    );
}