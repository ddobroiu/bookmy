// /src/app/dashboard/services/page.js (COD COMPLET MODERNIZAT)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUser, FaListUl } from 'react-icons/fa';
import styles from './services.module.css'; // Importăm stilurile CSS Module

// Componentă re-utilizabilă pentru Adăugare (Refactorizată)
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
        <div className={styles.addFormContainer}>
            <h3 className={styles.formTitle}>Adaugă {title}</h3>
            <form onSubmit={handleSubmit} className={styles.formRow}>
                {fields.map(field => (
                    <div key={field.name} className={styles.fieldGroup} style={{ flex: field.flex || 1 }}>
                        <label className={styles.label}>{field.label}</label>
                        <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder={field.placeholder || ''}
                        />
                    </div>
                ))}
                <button type="submit" className={styles.addButton}>
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
                fetchData(); // Reîncărcăm lista
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
                fetchData(); // Reîncărcăm lista
            } else {
                alert(`Eroare la ștergerea ${type}!`);
            }
        } catch (error) {
            console.error(`Eroare DELETE ${type}:`, error);
        }
    };
    
    // --- Definiții de câmpuri pentru formulare ---
    const serviceFields = [
        { name: 'name', label: 'Nume Serviciu', flex: 2, placeholder: 'ex: Tuns Clasic' },
        { name: 'price', label: 'Preț (RON)', type: 'number', flex: 1, placeholder: '50' },
        { name: 'duration', label: 'Durată (min)', type: 'number', flex: 1, placeholder: '30' },
    ];
    const staffFields = [
        { name: 'name', label: 'Nume Angajat', flex: 2, placeholder: 'ex: Ion Popescu' },
        { name: 'role', label: 'Rol', flex: 1, placeholder: 'ex: Senior Stylist' },
    ];


    if (isLoading) {
        return <div style={{padding: '50px', textAlign: 'center'}}>Se încarcă datele...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>Gestionarea Serviciilor și Angajaților</h1>
            <p className={styles.headerDescription}>
                Definește prețurile, duratele și echipa ta pentru a permite programări online.
            </p>

            {/* Zonă Servicii */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaListUl /> Servicii Oferite</h2>
                
                <AddForm onAdd={(data) => handleAdd(data, 'service')} title="Serviciu Nou" fields={serviceFields} />
                
                {services.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>Niciun serviciu adăugat încă.</p>}

                {services.map(service => (
                    <div key={service.id} className={styles.listItem}>
                        <div>
                            <strong className={styles.itemName}>{service.name}</strong>
                            <span className={styles.itemMetaPrimary}>{service.price} RON</span>
                            <span className={styles.itemMetaSecondary}>({service.duration} min)</span>
                        </div>
                        <div>
                            <button onClick={() => alert('Editare nu este implementată încă')} className={`${styles.actionButton} ${styles.editBtn}`} title="Editează"><FaEdit /></button>
                            <button onClick={() => handleDelete(service.id, 'service')} className={`${styles.actionButton} ${styles.deleteBtn}`} title="Șterge"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Zonă Angajați (Staff) */}
            <div className={styles.sectionContainer}>
                <h2 className={styles.sectionHeader}><FaUser /> Angajați (Staff)</h2>
                
                <AddForm onAdd={(data) => handleAdd(data, 'staff')} title="Angajat Nou" fields={staffFields} />

                {staff.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>Niciun angajat adăugat încă.</p>}

                {staff.map(member => (
                    <div key={member.id} className={styles.listItem}>
                        <div>
                            <strong className={styles.itemName}>{member.name}</strong>
                            <span className={styles.itemMetaSecondary}>{member.role}</span>
                        </div>
                        <div>
                            <button onClick={() => alert('Editare nu este implementată încă')} className={`${styles.actionButton} ${styles.editBtn}`} title="Editează"><FaEdit /></button>
                            <button onClick={() => handleDelete(member.id, 'staff')} className={`${styles.actionButton} ${styles.deleteBtn}`} title="Șterge"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}