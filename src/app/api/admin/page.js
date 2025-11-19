// /src/app/admin/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaStore, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaTrash } from 'react-icons/fa';

// Componentă Card Statistică
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{ background: 'white', padding: '25px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: '600', textTransform: 'uppercase' }}>{title}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2c3e50', marginTop: '5px' }}>{value}</div>
        </div>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontSize: '24px' }}>
            <Icon />
        </div>
    </div>
);

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            if (res.ok) {
                setData(await res.json());
            } else {
                // Dacă dă eroare (ex: 403), probabil nu e admin
                // alert("Acces interzis");
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteSalon = async (id) => {
        if (!confirm("ATENȚIE: Această acțiune va șterge salonul și toate programările aferente! Continui?")) return;
        
        try {
            const res = await fetch(`/api/admin/dashboard?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Salon șters.");
                fetchData(); // Refresh
            } else {
                alert("Eroare la ștergere.");
            }
        } catch (e) { alert("Eroare rețea"); }
    };

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Se încarcă datele admin...</div>;
    if (!data) return <div style={{padding:'50px', textAlign:'center'}}>Nu aveți acces sau a apărut o eroare.</div>;

    return (
        <div>
            <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Privire de ansamblu</h1>

            {/* Statistici Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
                <StatCard title="Utilizatori" value={data.stats.users} icon={FaUsers} color="#3498db" />
                <StatCard title="Afaceri Active" value={data.stats.salons} icon={FaStore} color="#e67e22" />
                <StatCard title="Rezervări" value={data.stats.appointments} icon={FaCalendarCheck} color="#2ecc71" />
                <StatCard title="Volum Tranzacționat" value={`${data.stats.revenue} RON`} icon={FaMoneyBillWave} color="#9b59b6" />
            </div>

            {/* Tabel Ultimele Saloane */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>Afaceri Recent Înscrise</h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left', color: '#7f8c8d' }}>
                            <th style={{ padding: '15px 10px' }}>Nume Afacere</th>
                            <th style={{ padding: '15px 10px' }}>Proprietar</th>
                            <th style={{ padding: '15px 10px' }}>Categorie</th>
                            <th style={{ padding: '15px 10px' }}>Rating</th>
                            <th style={{ padding: '15px 10px' }}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.salons.map(salon => (
                            <tr key={salon.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '15px 10px', fontWeight: '600' }}>{salon.name}</td>
                                <td style={{ padding: '15px 10px' }}>
                                    {salon.owner?.name || 'Nespecificat'} <br/>
                                    <span style={{fontSize:'12px', color:'#999'}}>{salon.owner?.email}</span>
                                </td>
                                <td style={{ padding: '15px 10px', textTransform:'capitalize' }}>
                                    <span style={{background:'#ecf0f1', padding:'4px 8px', borderRadius:'4px'}}>{salon.category || 'General'}</span>
                                </td>
                                <td style={{ padding: '15px 10px', color:'#f1c40f', fontWeight:'bold' }}>
                                    ★ {salon.averageRating?.toFixed(1)}
                                </td>
                                <td style={{ padding: '15px 10px' }}>
                                    <button 
                                        onClick={() => handleDeleteSalon(salon.id)}
                                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <FaTrash /> Șterge
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}