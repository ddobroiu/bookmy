// /src/app/dashboard/subscription/page.js (COD COMPLET)

'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaCrown, FaWallet, FaPlusCircle, FaSms, FaWhatsapp } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

// Importăm definițiile locale sau le hardcodăm aici pentru UI
const PLANS = [
    {
        id: 'BASIC', name: 'Basic (Start)', price: '59',
        features: ['1 Calendar (Staff)', 'Servicii Nelimitate', 'Email Gratuit', '50 Credite Incluse/lună'],
        primary: false,
    },
    {
        id: 'STANDARD', name: 'Standard (Growth)', price: '159',
        features: ['Până la 5 Calendare', 'Servicii Nelimitate', 'Email Gratuit', '200 Credite Incluse/lună'],
        primary: true,
    },
    {
        id: 'PREMIUM', name: 'Premium (Pro)', price: '299',
        features: ['Calendare Nelimitate', 'Servicii Nelimitate', 'Email Gratuit', '500 Credite Incluse/lună'],
        primary: false,
    },
];

const PACKAGES = [
    { id: 'URGENT', credits: 100, price: '50 RON', label: 'Mic' },
    { id: 'STANDARD', credits: 500, price: '200 RON', label: 'Best Value', recommended: true },
    { id: 'HORECA', credits: 2000, price: '600 RON', label: 'Volum Mare' },
];

export default function DashboardSubscriptionPage() {
    const [currentPlan, setCurrentPlan] = useState('BASIC');
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/partner/salon');
                if (res.ok) {
                    const data = await res.json();
                    setCredits(data.credits || 0);
                    setCurrentPlan(data.subscriptionPlan || 'BASIC');
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        fetchData();
    }, []);

    const handleUpgrade = async (planId) => {
        if (planId === currentPlan) return;
        // Aici ar veni logica de Stripe Subscription
        showToast(`Upgrade la ${planId} inițiat (Simulare)...`, 'info');
    };

    const handleBuyCredits = async (pack) => {
        if (!confirm(`Cumperi ${pack.credits} credite cu ${pack.price}?`)) return;
        try {
            const res = await fetch('/api/partner/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId: pack.id })
            });
            if (res.ok) {
                const data = await res.json();
                setCredits(data.newBalance);
                showToast('Credite adăugate!', 'success');
            }
        } catch (e) { showToast('Eroare', 'error'); }
    };

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Se încarcă...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#1c2e40', marginBottom: '40px' }}>Abonament & Credite</h1>

            {/* 1. PLANURI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                {PLANS.map(plan => (
                    <div key={plan.id} style={{
                        padding: '30px', borderRadius: '16px', 
                        border: plan.primary ? '2px solid #007bff' : '1px solid #ddd',
                        boxShadow: plan.primary ? '0 10px 30px rgba(0,123,255,0.15)' : '0 4px 10px rgba(0,0,0,0.05)',
                        background: 'white', position: 'relative', transform: plan.primary ? 'scale(1.02)' : 'scale(1)'
                    }}>
                        {plan.primary && <div style={{position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'#ffc107', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>RECOMANDAT</div>}
                        <h2 style={{textAlign:'center', color: '#1c2e40'}}>{plan.name}</h2>
                        <div style={{textAlign:'center', fontSize:'36px', fontWeight:'bold', margin:'15px 0', color:'#007bff'}}>
                            {plan.price} <span style={{fontSize:'16px', color:'#666', fontWeight:'normal'}}>RON/lună</span>
                        </div>
                        <ul style={{listStyle:'none', padding:0, margin:'20px 0'}}>
                            {plan.features.map((feat, i) => (
                                <li key={i} style={{marginBottom:'10px', display:'flex', alignItems:'center', gap:'10px'}}>
                                    <FaCheckCircle style={{color:'#1aa858'}}/> {feat}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleUpgrade(plan.id)} disabled={currentPlan === plan.id} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'none', background: currentPlan === plan.id ? '#e9ecef' : '#007bff', color: currentPlan === plan.id ? '#333' : 'white', fontWeight:'bold', cursor: currentPlan === plan.id ? 'default' : 'pointer'}}>
                            {currentPlan === plan.id ? 'Plan Activ' : 'Alege Planul'}
                        </button>
                    </div>
                ))}
            </div>

            {/* 2. CREDITE */}
            <div style={{ background: '#f0f9ff', padding: '40px', borderRadius: '20px', border: '1px solid #b8daff' }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                    <div>
                        <h2 style={{margin:0, display:'flex', alignItems:'center', gap:'10px', color:'#004085'}}><FaWallet /> Portofel Comunicare</h2>
                        <p style={{margin:'5px 0 0 0', color:'#0056b3'}}>Pentru SMS și WhatsApp automatizat.</p>
                    </div>
                    <div style={{background:'white', padding:'15px 30px', borderRadius:'12px', textAlign:'center'}}>
                        <div style={{fontSize:'12px', color:'#666', fontWeight:'bold'}}>DISPONIBIL</div>
                        <div style={{fontSize:'32px', fontWeight:'bold', color:'#1aa858'}}>{credits}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {PACKAGES.map(pack => (
                        <div key={pack.id} style={{background:'white', padding:'20px', borderRadius:'12px', textAlign:'center', border: pack.recommended ? '2px solid #1aa858' : '1px solid #ddd', cursor:'pointer'}} onClick={() => handleBuyCredits(pack)}>
                            {pack.recommended && <span style={{background:'#1aa858', color:'white', fontSize:'10px', padding:'2px 8px', borderRadius:'10px'}}>BEST VALUE</span>}
                            <div style={{fontSize:'24px', fontWeight:'bold', color:'#333', margin:'10px 0'}}>+{pack.credits} Credite</div>
                            <div style={{fontSize:'20px', fontWeight:'bold', color:'#007bff'}}>{pack.price}</div>
                            <button style={{marginTop:'15px', width:'100%', padding:'8px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius:'6px', fontWeight:'bold', cursor:'pointer'}}>
                                <FaPlusCircle /> Cumpără
                            </button>
                        </div>
                    ))}
                </div>
                
                <div style={{marginTop:'20px', fontSize:'13px', color:'#666', display:'flex', gap:'20px'}}>
                    <span><FaSms/> 1 SMS = 1 Credit</span>
                    <span><FaWhatsapp/> 1 Conversație WhatsApp = 1 Credit</span>
                </div>
            </div>
        </div>
    );
}