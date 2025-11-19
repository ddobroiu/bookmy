// /src/app/dashboard/waitlist/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaPhone, FaCalendarDay } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/ro';

export default function WaitlistPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/waitlist');
            if (res.ok) setRequests(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await fetch('/api/waitlist', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            fetchRequests(); // Refresh
        } catch (e) { alert('Eroare'); }
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Se încarcă lista de așteptare...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', color: '#1c2e40', marginBottom: '10px' }}>Listă de Așteptare</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Clienți care așteaptă un loc liber.</p>

            {requests.length === 0 ? (
                <div style={{background:'white', padding:'40px', borderRadius:'12px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
                    <h3 style={{color:'#888'}}>Nicio cerere în așteptare.</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {requests.map(req => (
                        <div key={req.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #f39c12' }}>
                            <div>
                                <div style={{fontSize:'18px', fontWeight:'bold', color:'#333'}}>{req.clientName}</div>
                                <div style={{color:'#007bff', display:'flex', alignItems:'center', gap:'5px', marginTop:'5px'}}>
                                    <FaPhone size={12}/> <a href={`tel:${req.clientPhone}`} style={{textDecoration:'none', color:'#007bff'}}>{req.clientPhone}</a>
                                </div>
                                <div style={{marginTop:'10px', fontSize:'14px'}}>
                                    <strong>Dorește:</strong> {req.service.name} {req.staff ? `cu ${req.staff.name}` : ''} <br/>
                                    <strong>Data:</strong> <FaCalendarDay style={{marginRight:'5px', color:'#666'}}/> {moment(req.date).format('DD MMMM YYYY')}
                                </div>
                                {req.notes && (
                                    <div style={{marginTop:'10px', background:'#f9f9f9', padding:'8px', borderRadius:'4px', fontSize:'13px', fontStyle:'italic'}}>
                                        "{req.notes}"
                                    </div>
                                )}
                            </div>
                            
                            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                                <button 
                                    onClick={() => handleStatusChange(req.id, 'CONTACTED')}
                                    style={{padding:'8px 15px', background:'#1aa858', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}
                                >
                                    <FaCheck /> Rezolvat (Am sunat)
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(req.id, 'RESOLVED')}
                                    style={{padding:'8px 15px', background:'#e64c3c', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}
                                >
                                    <FaTimes /> Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}