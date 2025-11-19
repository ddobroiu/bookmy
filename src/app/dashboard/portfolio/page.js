// /src/app/dashboard/portfolio/page.js (FUNCTIONAL)

'use client';

import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

export default function PortfolioPage() {
    const [images, setImages] = useState([]);
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    // Fetch inițial
    useEffect(() => {
        async function loadImages() {
            try {
                const res = await fetch('/api/partner/portfolio');
                if (res.ok) setImages(await res.json());
            } catch (e) { console.error(e); }
        }
        loadImages();
    }, []);

    // Încărcare imagine
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Convertim la Base64 pentru a salva direct în DB (pentru simplitate)
        // În producție reală, am folosi un serviciu de upload (S3) și am salva doar URL-ul.
        const reader = new FileReader();
        reader.onloadend = async () => {
            setIsUploading(true);
            const base64String = reader.result;

            try {
                const res = await fetch('/api/partner/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: base64String })
                });

                if (res.ok) {
                    const newItem = await res.json();
                    setImages([newItem, ...images]); // Adăugăm noua imagine la început
                    showToast('Imagine salvată!', 'success');
                } else {
                    showToast('Eroare la salvare.', 'error');
                }
            } catch (err) {
                showToast('Eroare rețea.', 'error');
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Sigur vrei să ștergi?')) return;
        try {
            const res = await fetch(`/api/partner/portfolio?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setImages(images.filter(img => img.id !== id));
                showToast('Imagine ștearsă.', 'info');
            }
        } catch (err) {
            showToast('Eroare la ștergere.', 'error');
        }
    };

    const uploadBoxStyle = {
        border: '2px dashed #007bff',
        borderRadius: '12px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: '#f0f9ff',
        color: '#007bff'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', color: '#1c2e40', marginBottom: '10px' }}>Portofoliul Meu</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                
                {/* Buton Upload */}
                <label style={uploadBoxStyle}>
                    {isUploading ? <span>Se încarcă...</span> : (
                        <>
                            <FaCloudUploadAlt style={{ fontSize: '40px', marginBottom: '10px' }} />
                            <span style={{ fontWeight: '600' }}>Adaugă Fotografie</span>
                        </>
                    )}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={isUploading} />
                </label>

                {/* Listare Imagini */}
                {images.map(img => (
                    <div key={img.id} style={{ position: 'relative', height: '200px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <img src={img.url} alt="Lucrare" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                            onClick={() => handleDelete(img.id)}
                            style={{
                                position: 'absolute', top: '10px', right: '10px',
                                backgroundColor: 'white', border: 'none', borderRadius: '50%',
                                width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#e64c3c', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}