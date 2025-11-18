// /src/app/dashboard/calendar/page.js (FIX CALE DB)

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import PartnerCalendar from '../../../components/PartnerCalendar';
import { findSalonStaff } from '../../../db'; // CORECTAT: Cale 3 nivele sus
// ... restul codului rămâne neschimbat.

// Componentă pentru a simula filtrarea calendarului
const CalendarWithStaffFilter = () => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState('all'); // 'all' pentru toți
    const [isLoadingStaff, setIsLoadingStaff] = useState(true);

    // Încarcă lista de angajați
    const fetchStaff = useCallback(async () => {
        setIsLoadingStaff(true);
        try {
            // Presupunem că apelul la funcția din db.js funcționează aici.
            // În realitate, am folosi un API endpoint securizat: /api/dashboard/data?type=staff
            const staffData = findSalonStaff('salon-de-lux-central'); // Folosim ID-ul de test
            
            // Adăugăm opțiunea "Toți"
            setStaffList([{ id: 'all', name: 'Toți Angajații' }, ...staffData]);
        } catch (error) {
            console.error("Eroare la încărcarea staff-ului:", error);
        } finally {
            setIsLoadingStaff(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);
    
    // În Dashboard, nu afișăm doar Calendarul.
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

            {/* Calendarul Partenerului - Trimitem filtrul */}
            <PartnerCalendar staffId={selectedStaffId} />
        </div>
    );
};

export default CalendarWithStaffFilter;