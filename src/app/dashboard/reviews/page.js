// /src/app/dashboard/reviews/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaStar, FaReply, FaUserCircle } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

export default function PartnerReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Simulare Fetch (înlocuiește cu API-ul real când ai autentificare pe dashboard)
    useEffect(() => {
        // Simulăm datele pentru a vedea interfața (API-ul necesită salonId din sesiune)
        const mockReviews = [
            { id: 1, user: { name: 'Ana Maria' }, rating: 5, comment: 'Servicii excelente! M-am simțit minunat.', createdAt: new Date().toISOString(), reply: null },
            { id: 2, user: { name: 'Mihai D.' }, rating: 4, comment: 'Tuns ok, dar am așteptat 10 minute peste programare.', createdAt: new Date(Date.now() - 86400000).toISOString(), reply: null },
            { id: 3, user: { name: 'Client Anonim' }, rating: 5, comment: 'Recomand cu drag!', createdAt: new Date(Date.now() - 172800000).toISOString(), reply: 'Mulțumim mult!' },
        ];
        
        setTimeout(() => {
            setReviews(mockReviews);
            setLoading(false);
        }, 800);
    }, []);

    const handleReply = (id) => {
        const replyText = prompt("Scrie răspunsul tău pentru client:");
        if (replyText) {
            // Aici ar fi apelul API: POST /api/reviews/reply
            setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r));
            showToast('Răspuns publicat!', 'success');
        }
    };

    const StarDisplay = ({ rating }) => (
        <div style={{ display: 'flex', color: '#ffc107' }}>
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < rating ? '#ffc107' : '#e4e5e9'} />
            ))}
        </div>
    );

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Se încarcă recenziile...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
             <h1 style={{ fontSize: '28px', color: '#1c2e40', marginBottom: '10px' }}>
                Recenzii Clienți
            </h1>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', paddingRight: '20px', borderRight: '1px solid #eee' }}>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#1c2e40' }}>4.8</div>
                    <div style={{ fontSize: '14px', color: '#888' }}>Media Generală</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                     <span style={{ fontSize: '16px', fontWeight: '600', color: '#007bff' }}>{reviews.length} Recenzii Totale</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map(review => (
                    <div key={review.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
                        
                        {/* Header Recenzie */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '24px' }}>
                                    <FaUserCircle />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#333' }}>{review.user.name}</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>{new Date(review.createdAt).toLocaleDateString('ro-RO')}</div>
                                </div>
                            </div>
                            <StarDisplay rating={review.rating} />
                        </div>

                        {/* Text Recenzie */}
                        <p style={{ color: '#555', lineHeight: '1.5', marginBottom: '20px' }}>
                            {review.comment}
                        </p>

                        {/* Zona Răspuns */}
                        {review.reply ? (
                            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '3px solid #007bff', marginLeft: '20px' }}>
                                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '5px', color: '#007bff' }}>Răspunsul tău:</div>
                                <div style={{ fontSize: '14px', color: '#444' }}>{review.reply}</div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => handleReply(review.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#555' }}
                            >
                                <FaReply /> Răspunde
                            </button>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}