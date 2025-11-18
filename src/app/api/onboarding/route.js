// /src/app/api/onboarding/route.js (COD COMPLET)

import { NextResponse } from 'next/server';
// Importăm baza de date pentru a actualiza starea (simulată)
// Presupunând că ai fișierele /src/db.js cu structurile exportate
import { salonsDB, usersDB } from '@/db'; 

// Funcție helper pentru a obține ID-ul utilizatorului (simulare)
const getUserId = (request) => {
    // În realitate, ai decoda un JWT și ai returna ID-ul utilizatorului logat
    return 'partner@test.com'; 
};

/**
 * Functie POST: Salvează configurarea finală a salonului (Onboarding)
 * * Datele primite (formData) includ:
 * { name, address, category, services, schedule }
 */
export async function POST(request) {
    try {
        const formData = await request.json();
        const userId = getUserId(request); // Identifică utilizatorul logat

        // 1. Validare de bază
        if (!formData.name || !formData.category || !formData.schedule) {
            return NextResponse.json({ message: 'Missing required configuration fields.' }, { status: 400 });
        }

        // 2. Simulare: Generarea unui slug bazat pe nume (URL prietenos)
        const salonSlug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        
        // 3. Simulare: Crearea/Actualizarea salonului în baza de date
        const existingSalonIndex = salonsDB.findIndex(s => s.id === salonSlug);

        const newSalonData = {
            id: salonSlug,
            name: formData.name,
            address: formData.address,
            category: formData.category,
            schedule: formData.schedule, // Orarul Săptămânal Salvat!
            services: formData.services, // Serviciile Salvate!
            rating: 5.0, 
            reviews: 0,
            description: "Descriere generată automat la onboarding."
        };

        if (existingSalonIndex !== -1) {
            // Actualizează (dacă există)
            salonsDB[existingSalonIndex] = { ...salonsDB[existingSalonIndex], ...newSalonData };
        } else {
            // Creează (dacă e nou)
            salonsDB.push(newSalonData);
        }

        // 4. Simulare: Actualizează starea utilizatorului (marchează ca fiind configurat)
        const userIndex = usersDB.findIndex(u => u.email === userId);
        if (userIndex !== -1) {
            usersDB[userIndex].salonSetup = true;
        }

        // 5. Success
        console.log('--- ONBOARDING COMPLETED & DATA SAVED (Simulated) ---');
        console.log('Salon Data:', newSalonData);

        return NextResponse.json({ 
            message: 'Afacere configurată și salvată cu succes!',
            salonId: salonSlug
        }, { status: 200 });

    } catch (error) {
        console.error('Onboarding Submission Error:', error);
        return NextResponse.json({ message: 'Internal Server Error during submission.' }, { status: 500 });
    }
}