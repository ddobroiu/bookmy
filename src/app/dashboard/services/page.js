// /app/dashboard/services/page.js (COD COMPLET ACTUALIZAT CU API)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUser, FaListUl } from 'react-icons/fa';

// Componentă re-utilizabilă pentru Adăugare
const AddForm = ({ onAdd, title, fields }) => {
    const initialFormData = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    const [formData, setFormData] = useState(initialFormData);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData(initialFormData); // Resetare
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px dashed #ddd', paddingBottom: '10px' }}>Adaugă {title}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                {fields.map(field => (
                    <div key={field.name} style={{ flex: field.flex || 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '3px' }}>{field.label}</label>
                        <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                ))}
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    <FaPlus /> Adaugă
                </button>
            </form>
        </div>
    );
};


export default function DashboardServicesPage() {
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- LOGICA DE COMUNICARE CU API (CRUD) ---

    // 1. Fetch inițial de date (Services & Staff)
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const servicesRes = await fetch('/api/dashboard/data?type=services');
            const staffRes = await fetch('/api/dashboard/data?type=staff');
            
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (staffRes.ok) setStaff(await staffRes.json());
            
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            alert("Eroare la încărcarea datelor.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // 2. Funcție de Adăugare
    const handleAdd = async (data, type) => {
        try {
            const response = await fetch('/api/dashboard/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: type, data: data }),
            });
            
            if (response.ok) {
                // Reîncărcăm lista pentru a avea datele actualizate
                fetchData(); 
            } else {
                alert(`Eroare la adăugarea ${type}!`);
            }
        } catch (error) {
            console.error(`Eroare POST ${type}:`, error);
        }
    };

    // 3. Funcție de Ștergere
    const handleDelete = async (id, type) => {
        if (!confirm(`Ești sigur că vrei să ștergi acest ${type}?`)) return;

        try {
            const response = await fetch(`/api/dashboard/data?type=${type}&id=${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                // Reîncărcăm lista
                fetchData();
            } else {
                alert(`Eroare la ștergerea ${type}!`);
            }
        } catch (error) {
            console.error(`Eroare DELETE ${type}:`, error);
        }
    };
    
    // --- Definiții de câmpuri pentru formulare ---
    const serviceFields = [
        { name: 'name', label: 'Nume Serviciu', flex: 2 },
        { name: 'price', label: 'Preț (RON)', type: 'number', flex: 1 },
        { name: 'duration', label: 'Durată (min)', type: 'number', flex: 1 },
    ];
    const staffFields = [
        { name: 'name', label: 'Nume Angajat', flex: 2 },
        { name: 'role', label: 'Rol', flex: 1 },
    ];


    if (isLoading) {
        return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă datele...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1>Gestionarea Serviciilor și Angajaților</h1>
            <p style={{ marginBottom: '30px', color: '#666' }}>
                Definește prețurile, duratele și echipa ta.
            </p>

            {/* Zonă Servicii */}
            <div style={{ marginBottom: '40px', border: '1px solid #eee', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaListUl /> Servicii Oferite</h2>
                
                <AddForm onAdd={(data) => handleAdd(data, 'service')} title="Serviciu Nou" fields={serviceFields} />
                
                {services.map(service => (
                    <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee', alignItems: 'center' }}>
                        <div>
                            <strong>{service.name}</strong>
                            <span style={{ marginLeft: '15px', color: '#007bff', fontWeight: 600 }}>{service.price} RON</span>
                            <span style={{ marginLeft: '15px', color: '#555', fontSize: '14px' }}>({service.duration} min)</span>
                        </div>
                        <div>
                            <button onClick={() => alert('Editare nu este implementată încă')} style={{ marginRight: '10px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}><FaEdit /></button>
                            <button onClick={() => handleDelete(service.id, 'service')} style={{ color: '#e64c3c', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Zonă Angajați (Staff) */}
            <div style={{ border: '1px solid #eee', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaUser /> Angajați (Staff)</h2>
                
                <AddForm onAdd={(data) => handleAdd(data, 'staff')} title="Angajat Nou" fields={staffFields} />

                {staff.map(member => (
                    <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee', alignItems: 'center' }}>
                        <div>
                            <strong>{member.name}</strong>
                            <span style={{ marginLeft: '15px', color: '#555', fontSize: '14px' }}>{member.role}</span>
                        </div>
                        <div>
                            <button onClick={() => alert('Editare nu este implementată încă')} style={{ marginRight: '10px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}><FaEdit /></button>
                            <button onClick={() => handleDelete(member.id, 'staff')} style={{ color: '#e64c3c', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}