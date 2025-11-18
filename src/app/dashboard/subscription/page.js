// /app/dashboard/subscription/page.js

'use client';

import React, { useState } from 'react';
import { FaCheckCircle, FaStar, FaCrown, FaWrench, FaArrowUp } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext'; // Presupunem că ToastProvider funcționează

// Datele pentru cele trei pachete de abonament
const subscriptionPlans = [
    {
        id: 'free',
        name: 'Free (Basic)',
        price: '0',
        features: [
            '1 Angajat / 5 Servicii',
            'Calendar Online',
            'Pagina Publică Salon',
            'Suport Comunitar',
        ],
        primary: false,
    },
    {
        id: 'standard',
        name: 'Standard',
        price: '49',
        features: [
            'Până la 5 Angajați / Servicii Nelimitate',
            'Notificări SMS & WhatsApp (Limitat)',
            'Analiză de Bază a Programărilor',
            'Prioritate la Suport',
        ],
        primary: true, // Marcăm acest pachet ca fiind cel mai recomandat
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '99',
        features: [
            'Angajați și Servicii Nelimitate',
            'Notificări SMS & WhatsApp (Nelimitat)',
            'Statistici Avansate & Marketing',
            'Integrare POS (Simulată)',
        ],
        primary: false,
    },
];

// Componentă re-utilizabilă pentru a afișa un singur pachet
const SubscriptionCard = ({ plan, onSelect, currentPlanId }) => {
    const { name, price, features, primary, id } = plan;
    const isCurrent = id === currentPlanId;
    
    // Stilizare dinamică
    const cardStyle = {
        padding: '30px',
        borderRadius: '12px',
        boxShadow: primary ? '0 10px 20px rgba(0, 123, 255, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: primary ? '2px solid #007bff' : '1px solid #ddd',
        textAlign: 'center',
        backgroundColor: 'white',
        position: 'relative',
        transform: primary ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s',
    };

    return (
        <div style={cardStyle}>
            {primary && (
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ffc107', color: 'black', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    Recomandat
                </div>
            )}
            
            <h2 style={{ fontSize: '24px', color: primary ? '#007bff' : '#1c2e40' }}>{name}</h2>
            <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '15px 0' }}>
                {price} <span style={{ fontSize: '18px', fontWeight: 'normal' }}>RON/lună</span>
            </div>

            <button 
                onClick={() => onSelect(id)}
                disabled={isCurrent}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: isCurrent ? '#1aa858' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    cursor: isCurrent ? 'default' : 'pointer',
                    marginTop: '20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}
            >
                {isCurrent ? <><FaCheckCircle /> Plan Curent</> : <><FaArrowUp /> Selectează Planul</>}
            </button>

            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                {features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '10px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                        <FaCheckCircle style={{ color: '#1aa858' }} /> {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default function DashboardSubscriptionPage() {
    // Simulare: Starea planului curent al partenerului
    const [currentPlanId, setCurrentPlanId] = useState('free');
    const { showToast } = useToast();

    const handlePlanSelection = (planId) => {
        if (planId === currentPlanId) return;

        showToast(`Ai selectat planul ${planId.toUpperCase()}. Simulare plată...`, 'info');
        
        // --- AICI SE FACE INTEGRAREA CU UN PROCESATOR DE PLATĂ (ex: Stripe, Netopia) ---
        
        // Simulare de succes după plată
        setTimeout(() => {
            setCurrentPlanId(planId);
            showToast(`Upgrade la planul ${planId.toUpperCase()} reușit!`, 'success');
        }, 1500);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#1c2e40', marginBottom: '10px' }}>
                <FaCrown style={{ marginRight: '10px', color: '#ffc107' }} /> Alege Planul Tău BooksApp
            </h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
                Deblochează funcționalități esențiale pentru creșterea afacerii tale.
            </p>

            {/* Gridul cu pachetele de prețuri */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                {subscriptionPlans.map(plan => (
                    <SubscriptionCard 
                        key={plan.id}
                        plan={plan}
                        onSelect={handlePlanSelection}
                        currentPlanId={currentPlanId}
                    />
                ))}
            </div>
            
            <div style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>
                    *Toate prețurile sunt în RON. Plățile se procesează securizat (Simulare).
                </p>
            </div>
        </div>
    );
}