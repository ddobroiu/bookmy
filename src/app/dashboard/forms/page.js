// /src/app/dashboard/forms/page.js (COD COMPLET CORECTAT)

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // <-- ACESTA LIPSEA sau nu era definit în scope
import { FaPlus, FaFileContract, FaTrash, FaArchive } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

export default function FormsListPage() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchForms = async () => {
        try {
            const res = await fetch('/api/partner/forms');
            if (res.ok) setForms(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei să ștergi acest formular?')) return;
        try {
            const res = await fetch(`/api/partner/forms?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Formular șters.', 'info');
                fetchForms();
            } else {
                showToast('Eroare la ștergere.', 'error');
            }
        } catch (e) { showToast('Eroare rețea.', 'error'); }
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Se încarcă formularele...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Header cu titlu și butoane */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', color: '#1c2e40', margin: 0 }}>Formulare Digitale</h1>
                
                <div style={{display: 'flex', gap: '10px'}}>
                    {/* Buton Arhivă */}
                    <Link href="/dashboard/forms/submissions">
                        <button style={{
                            padding: '12px 20px', backgroundColor: '#fff', color: '#007bff', border: '1px solid #007bff', borderRadius: '8px',
                            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <FaArchive /> Arhivă Răspunsuri
                        </button>
                    </Link>
                    
                    {/* Buton Creează */}
                    <Link href="/dashboard/forms/create">
                        <button style={{
                            padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px',
                            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <FaPlus /> Creează Formular
                        </button>
                    </Link>
                </div>
            </div>

            {/* Lista de Formulare */}
            {forms.length === 0 ? (
                <div style={{ background: 'white', padding: '50px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <FaFileContract style={{ fontSize: '50px', color: '#ddd', marginBottom: '20px' }} />
                    <h3 style={{ color: '#555' }}>Nu ai creat niciun formular.</h3>
                    <p style={{ color: '#888', marginBottom: '20px' }}>Creează fișe de consimțământ sau chestionare pentru clienți.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {forms.map(form => (
                        <div key={form.id} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#1c2e40' }}>{form.title}</h3>
                                    {form.isGeneral && <span style={{fontSize:'10px', background:'#e6f0ff', color:'#007bff', padding:'3px 6px', borderRadius:'4px', fontWeight:'bold'}}>GENERAL</span>}
                                </div>
                                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '15px' }}>
                                    {form.description || 'Fără descriere.'}
                                </p>
                                <div style={{ fontSize: '12px', background: '#f9f9f9', color: '#555', padding: '5px 10px', borderRadius: '4px', display: 'inline-block', marginBottom: '15px', border: '1px solid #eee' }}>
                                    {form.questions.length} Întrebări
                                </div>
                            </div>
                            
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button 
                                    onClick={() => handleDelete(form.id)}
                                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}
                                >
                                    <FaTrash /> Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}