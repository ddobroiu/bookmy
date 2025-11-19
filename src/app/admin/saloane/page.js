// /src/app/admin/saloane/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminSalonsPage() {
    const [salons, setSalons] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchSalons = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/salons?search=${search}`);
            if (res.ok) setSalons(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSalons(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('ATENȚIE: Se șterge salonul și toate programările! Continui?')) return;
        try {
            const res = await fetch(`/api/admin/dashboard?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchSalons();
            else alert('Eroare');
        } catch (e) { alert('Eroare'); }
    };

    return (
        <div>
            <h1 style={{color:'#2c3e50', marginBottom:'30px'}}>Gestiune Afaceri (Saloane)</h1>

            <div style={{background:'white', padding:'20px', borderRadius:'12px', marginBottom:'20px', display:'flex', gap:'15px', alignItems:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
                <div style={{position:'relative', flex:1}}>
                    <FaSearch style={{position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#999'}}/>
                    <input 
                        type="text" 
                        placeholder="Caută salon..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchSalons()}
                        style={{width:'100%', padding:'10px 10px 10px 40px', borderRadius:'8px', border:'1px solid #ddd'}}
                    />
                </div>
                <button onClick={fetchSalons} style={{padding:'10px 20px', background:'#3498db', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>Caută</button>
            </div>

            <div style={{background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                    <thead style={{background:'#f8f9fa', color:'#7f8c8d'}}>
                        <tr>
                            <th style={{padding:'15px', textAlign:'left'}}>Nume Afacere</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Categorie</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Proprietar</th>
                            <th style={{padding:'15px', textAlign:'center'}}>Rating</th>
                            <th style={{padding:'15px', textAlign:'right'}}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{padding:'30px', textAlign:'center'}}>Se încarcă...</td></tr>
                        ) : salons.map(salon => (
                            <tr key={salon.id} style={{borderBottom:'1px solid #eee'}}>
                                <td style={{padding:'15px', fontWeight:'600', color:'#2c3e50'}}>{salon.name}</td>
                                <td style={{padding:'15px', textTransform:'capitalize'}}>{salon.category || 'General'}</td>
                                <td style={{padding:'15px'}}>
                                    <div>{salon.owner?.name}</div>
                                    <div style={{fontSize:'11px', color:'#999'}}>{salon.owner?.email}</div>
                                </td>
                                <td style={{padding:'15px', textAlign:'center', color:'#f39c12', fontWeight:'bold'}}>
                                    <FaStar style={{marginRight:'5px'}}/> {salon.averageRating?.toFixed(1)}
                                </td>
                                <td style={{padding:'15px', textAlign:'right', display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                                    <Link href={`/salon/${salon.slug}`} target="_blank">
                                        <button style={{background:'#f0f9ff', color:'#007bff', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer'}} title="Vezi Pagina">
                                            <FaExternalLinkAlt />
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(salon.id)}
                                        style={{background:'#fee2e2', color:'#ef4444', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer'}}
                                        title="Șterge Salon"
                                    >
                                        <FaTrash />
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