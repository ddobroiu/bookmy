// /src/app/admin/users/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch, FaUserTag } from 'react-icons/fa';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?search=${search}&role=${roleFilter}`);
            if (res.ok) setUsers(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Debounce simplu sau apel la Enter/Click
    useEffect(() => {
        fetchUsers();
    }, [roleFilter]); // Reîncarcă la schimbarea filtrului

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei să ștergi acest utilizator? Acțiunea este ireversibilă.')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
            else alert('Eroare la ștergere');
        } catch (e) { alert('Eroare rețea'); }
    };

    return (
        <div>
            <h1 style={{color:'#2c3e50', marginBottom:'30px'}}>Gestiune Utilizatori</h1>

            {/* Bara de Control */}
            <div style={{background:'white', padding:'20px', borderRadius:'12px', marginBottom:'20px', display:'flex', gap:'15px', alignItems:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
                <div style={{position:'relative', flex:1}}>
                    <FaSearch style={{position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#999'}}/>
                    <input 
                        type="text" 
                        placeholder="Caută după nume sau email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                        style={{width:'100%', padding:'10px 10px 10px 40px', borderRadius:'8px', border:'1px solid #ddd'}}
                    />
                </div>
                
                <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', background:'white'}}
                >
                    <option value="ALL">Toate Rolurile</option>
                    <option value="CLIENT">Clienți</option>
                    <option value="PARTNER">Parteneri</option>
                    <option value="ADMIN">Admini</option>
                </select>

                <button onClick={fetchUsers} style={{padding:'10px 20px', background:'#3498db', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                    Caută
                </button>
            </div>

            {/* Tabel */}
            <div style={{background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                    <thead style={{background:'#f8f9fa', color:'#7f8c8d'}}>
                        <tr>
                            <th style={{padding:'15px', textAlign:'left'}}>Utilizator</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Rol</th>
                            <th style={{padding:'15px', textAlign:'left'}}>Telefon</th>
                            <th style={{padding:'15px', textAlign:'center'}}>Rezervări</th>
                            <th style={{padding:'15px', textAlign:'right'}}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{padding:'30px', textAlign:'center'}}>Se încarcă...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} style={{borderBottom:'1px solid #eee'}}>
                                <td style={{padding:'15px'}}>
                                    <div style={{fontWeight:'600', color:'#2c3e50'}}>{user.name || 'Nespecificat'}</div>
                                    <div style={{fontSize:'12px', color:'#999'}}>{user.email}</div>
                                </td>
                                <td style={{padding:'15px'}}>
                                    <span style={{
                                        padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                                        background: user.role === 'ADMIN' ? '#e74c3c' : user.role === 'PARTNER' ? '#3498db' : '#2ecc71',
                                        color: 'white'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{padding:'15px', color:'#555'}}>{user.phoneNumber || '-'}</td>
                                <td style={{padding:'15px', textAlign:'center', fontWeight:'bold'}}>{user._count?.appointments || 0}</td>
                                <td style={{padding:'15px', textAlign:'right'}}>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        disabled={user.role === 'ADMIN'} // Nu te poți șterge pe tine
                                        style={{background:'#fee2e2', color:'#ef4444', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer'}}
                                        title="Șterge Cont"
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