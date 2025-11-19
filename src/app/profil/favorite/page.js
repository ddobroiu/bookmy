// /src/app/profil/favorite/page.js (FUNCTIONAL)

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaHeart, FaCalendarCheck, FaSadTear } from 'react-icons/fa';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch date reale din API
    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/user/favorites');
            if (res.ok) {
                const data = await res.json();
                setFavorites(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (salonId) => {
        try {
            await fetch(`/api/user/favorites?salonId=${salonId}`, { method: 'DELETE' });
            // Actualizăm lista local fără refresh
            setFavorites(prev => prev.filter(fav => fav.id !== salonId));
        } catch (err) {
            alert("Eroare la ștergere");
        }
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Se încarcă...</div>;

    return (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '100%' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '30px', color: '#1c2e40', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                Locații Favorite
            </h1>

            {favorites.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: '#888'}}>
                    <FaSadTear style={{fontSize: '40px', marginBottom: '15px', color: '#ddd'}}/>
                    <p>Nu ai nicio locație salvată la favorite.</p>
                    <Link href="/search" style={{color: '#007bff', fontWeight: '600'}}>Găsește un salon</Link>
                </div>
            ) : (
                <div>
                    {favorites.map(place => (
                        <div key={place.id} style={{
                            display: 'flex',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            border: '1px solid #eee',
                            gap: '20px',
                            alignItems: 'flex-start'
                        }}>
                            <img src={place.image} alt={place.name} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#eee' }} />
                            
                            <div style={{ flex: 1 }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                    <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{place.name}</h3>
                                    <button 
                                        onClick={() => removeFavorite(place.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        title="Elimină din favorite"
                                    >
                                        <FaHeart style={{ color: '#e64c3c' }} />
                                    </button>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                                    <FaStar style={{ color: '#ffc107', marginRight: '5px' }} /> {place.rating}
                                    <span style={{ margin: '0 10px', color: '#ddd' }}>|</span>
                                    <span style={{ textTransform: 'capitalize', fontSize: '12px', fontWeight: '600', background:'#e6f0ff', padding:'2px 8px', borderRadius:'4px', color:'#007bff' }}>{place.category}</span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '14px', marginBottom: '15px' }}>
                                    <FaMapMarkerAlt style={{ marginRight: '5px' }} /> {place.address}
                                </div>

                                <Link href={`/salon/${place.slug}`} style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '8px 20px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px'
                                    }}>
                                        <FaCalendarCheck /> Rezervă Acum
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}