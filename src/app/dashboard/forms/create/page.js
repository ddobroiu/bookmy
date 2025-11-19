// /src/app/dashboard/forms/create/page.js (ACTUALIZAT - OPTIUNE FORMULAR GENERAL)

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaSave, FaAlignLeft, FaCheckSquare, FaSignature, FaArrowLeft, FaGlobe, FaListUl } from 'react-icons/fa';
import { useToast } from '../../../../context/ToastContext';

export default function CreateFormPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // State Formular
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isGeneral, setIsGeneral] = useState(true); // Default GENERAL (pentru simplitate)
    const [questions, setQuestions] = useState([]);
    const [services, setServices] = useState([]); 
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        async function fetchServices() {
            const res = await fetch('/api/dashboard/data?type=services');
            if (res.ok) setServices(await res.json());
        }
        fetchServices();
    }, []);

    const addQuestion = (type) => {
        const newQ = {
            id: Date.now(),
            text: '',
            type: type,
            isRequired: true,
            options: type === 'CHECKBOX' ? ['Opțiune 1'] : null
        };
        setQuestions([...questions, newQ]);
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const removeQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };

    const handleSave = async () => {
        if (!title) return showToast('Te rugăm să adaugi un titlu.', 'error');
        if (questions.length === 0) return showToast('Adaugă cel puțin o întrebare.', 'error');

        setLoading(true);
        try {
            const payload = {
                title,
                description,
                isRequired: true,
                isGeneral, // Trimitem flag-ul
                questions,
                serviceIds: isGeneral ? [] : selectedServices // Dacă e general, ignorăm serviciile specifice
            };

            const res = await fetch('/api/partner/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast('Formular creat cu succes!', 'success');
                router.push('/dashboard/forms');
            } else {
                showToast('Eroare la salvare.', 'error');
            }
        } catch (e) {
            showToast('Eroare rețea.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Helper Card Întrebare (neschimbat logic, doar stilizat)
    const renderQuestionCard = (q, index) => (
        <div key={q.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '15px', position: 'relative', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {q.type === 'TEXT' && <FaAlignLeft />}
                    {q.type === 'CHECKBOX' && <FaCheckSquare />}
                    {q.type === 'SIGNATURE' && <FaSignature />}
                    {q.type === 'TEXT' ? 'Câmp Text' : q.type === 'CHECKBOX' ? 'Selecție Multiplă' : 'Semnătură'}
                </span>
                <button onClick={() => removeQuestion(index)} style={{ background: 'none', border: 'none', color: '#e64c3c', cursor: 'pointer', padding: '5px' }}><FaTrash /></button>
            </div>

            <input 
                type="text" 
                placeholder="Întrebarea ta (ex: Aveți alergii?)" 
                value={q.text}
                onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '10px', fontSize: '15px' }}
            />

            {q.type === 'CHECKBOX' && (
                <div style={{ marginBottom: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '6px' }}>
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Opțiuni (separate prin virgulă):</label>
                    <input 
                        type="text" 
                        placeholder="Da, Nu, Poate" 
                        value={q.options ? q.options.join(', ') : ''}
                        onChange={(e) => updateQuestion(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #eee' }}
                    />
                </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#555' }}>
                <input 
                    type="checkbox" 
                    checked={q.isRequired} 
                    onChange={(e) => updateQuestion(index, 'isRequired', e.target.checked)}
                />
                Răspuns Obligatoriu
            </label>
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', fontWeight: '500' }}>
                    <FaArrowLeft /> Înapoi la listă
                </button>
                <h1 style={{ fontSize: '28px', color: '#1c2e40', margin: 0 }}>Configurator Formular</h1>
            </div>

            {/* 1. Detalii Generale */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333' }}>Titlu Formular</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Fișă Consimțământ General" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333' }}>Descriere / Instrucțiuni</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Acest formular este necesar pentru..." rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>

                {/* TOGGLE GENERAL vs SPECIFIC */}
                <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px dashed #007bff' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600', color: '#007bff' }}>
                        <input 
                            type="checkbox" 
                            checked={isGeneral} 
                            onChange={(e) => setIsGeneral(e.target.checked)}
                            style={{width: '18px', height: '18px'}}
                        />
                        Acest formular se aplică la TOATE serviciile (General)
                    </label>
                    <p style={{ margin: '5px 0 0 28px', fontSize: '13px', color: '#666' }}>
                        Dacă bifezi asta, formularul va fi trimis automat tuturor clienților, indiferent de serviciul ales (ex: GDPR, Fișă Client).
                    </p>
                </div>
            </div>

            {/* 2. Zona Întrebări */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                    <h3 style={{ color: '#1c2e40', margin: 0 }}>Întrebări ({questions.length})</h3>
                </div>
                
                {questions.map((q, i) => renderQuestionCard(q, i))}

                {/* Bara de Instrumente */}
                <div style={{ background: '#2c3e50', padding: '15px', borderRadius: '12px', display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    <span style={{color:'white', fontWeight:'bold', marginRight:'10px', alignSelf:'center'}}>Adaugă:</span>
                    <button onClick={() => addQuestion('TEXT')} style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'background 0.2s' }}>
                        <FaAlignLeft /> Text
                    </button>
                    <button onClick={() => addQuestion('CHECKBOX')} style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaCheckSquare /> Listă
                    </button>
                    <button onClick={() => addQuestion('SIGNATURE')} style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaSignature /> Semnătură
                    </button>
                </div>
            </div>

            {/* 3. Linkare Servicii (Doar dacă NU e General) */}
            {!isGeneral && (
                <div style={{ marginBottom: '40px', background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaListUl style={{color: '#666'}}/> Alege Serviciile
                    </h3>
                    <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>Bifează serviciile specifice pentru care acest formular este obligatoriu.</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {services.map(svc => (
                            <label key={svc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: selectedServices.includes(svc.id) ? '#e6f0ff' : '#f9f9f9', borderRadius: '8px', cursor: 'pointer', border: selectedServices.includes(svc.id) ? '1px solid #007bff' : '1px solid transparent', transition: 'all 0.2s' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedServices.includes(svc.id)}
                                    onChange={(e) => {
                                        if(e.target.checked) setSelectedServices([...selectedServices, svc.id]);
                                        else setSelectedServices(selectedServices.filter(id => id !== svc.id));
                                    }}
                                />
                                <span style={{fontWeight: selectedServices.includes(svc.id) ? '600' : 'normal', color: selectedServices.includes(svc.id) ? '#007bff' : '#333'}}>{svc.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <button 
                onClick={handleSave} 
                disabled={loading}
                style={{ width: '100%', padding: '16px', background: '#1aa858', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(26, 168, 88, 0.3)', transition: 'transform 0.2s' }}
            >
                {loading ? 'Se salvează...' : <><FaSave style={{marginRight:'10px'}}/> Salvează Formularul</>}
            </button>
        </div>
    );
}