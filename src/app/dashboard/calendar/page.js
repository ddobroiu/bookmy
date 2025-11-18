// /src/app/dashboard/calendar/page.js (Refactorizat cu API Fetch)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PartnerCalendar from '../../../components/PartnerCalendar';

// Componentă pentru a afișa calendarul cu filtru de personal
const CalendarWithStaffFilter = () => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState('all'); 
    const [isLoadingStaff, setIsLoadingStaff] = useState(true);

    // 1. Funcția de preluare a angajaților de la API
    const fetchStaff = useCallback(async () => {
        setIsLoadingStaff(true);
        try {
            // Apelăm endpoint-ul API pentru a prelua lista de angajați
            const response = await fetch('/api/dashboard/data?type=staff');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const staffData = await response.json();
            
            // Adăugăm opțiunea "Toți" la începutul listei
            setStaffList([{ id: 'all', name: 'Toți Angajații' }, ...staffData]);
        } catch (error) {
            console.error("Eroare la încărcarea personalului:", error);
            // Oprește încărcarea chiar dacă există o eroare pentru a nu bloca UI-ul
        } finally {
            setIsLoadingStaff(false);
        }
    }, []); // Fără dependențe, se execută o singură dată la montarea componentei

    // 2. Apelăm funcția la încărcarea componentei
    useEffect(() => {
        fetchStaff(); 
    }, [fetchStaff]);
    
    return (
        <div style={{ padding: '0 20px', maxWidth: '1600px', margin: '0 auto' }}>
            <h1>Calendar Programări</h1>
            <p style={{ marginBottom: '25px', color: '#666' }}>Vizualizează programările pe săptămână sau lună.</p>
            
            {/* Filtru Angajați */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <label style={{ fontWeight: 600 }}>Filtrează după Angajat:</label>
                {isLoadingStaff ? (
                    <span>Se încarcă...</span>
                ) : (
                    <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        {staffList.map(staff => (
                            <option key={staff.id} value={staff.id}>
                                {staff.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Calendarul Partenerului - Trimitem ID-ul personalului selectat */}
            <PartnerCalendar staffId={selectedStaffId} />
        </div>
    );
};

export default CalendarWithStaffFilter;