// /src/app/api/slots/route.js (COD COMPLET)

import { NextResponse } from 'next/server';
import moment from 'moment';
// Importăm baza de date simulată pentru a verifica orarul și programările
import { appointmentsDB, getSalonDetails } from '@/db'; 

// Durata fixă a serviciului pentru testare (ar trebui să vină din request)
const FIXED_SERVICE_DURATION = 60; // 60 minute

// Funcție Helper pentru a obține ID-ul salonului (din cookie sau simulare)
const getSalonId = (request) => {
    // În realitate, ai decoda un JWT sau verifica o sesiune
    return 'salon-de-lux-central'; 
};

// Functie GET: Calculează sloturile libere
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const dateString = searchParams.get('date');
    const staffId = searchParams.get('staffId'); // Vom folosi staffId pentru filtrare
    
    if (!dateString) {
        return NextResponse.json({ message: 'Missing date' }, { status: 400 });
    }

    const salonId = getSalonId(request);
    // Presupunem că am colectat datele de orar (din Onboarding) și le putem obține de aici.
    const salonDetails = getSalonDetails(salonId); 
    
    if (!salonDetails) {
        return NextResponse.json({ message: 'Salon details not found' }, { status: 404 });
    }
    
    const dayOfWeek = moment(dateString).format('dddd').toLowerCase(); // Ex: luni, marți
    const dailySchedule = salonDetails.schedule ? salonDetails.schedule[dayOfWeek] : { open: true, start: '09:00', end: '17:00' };

    if (!dailySchedule || !dailySchedule.open) {
        return NextResponse.json({ slots: [] }); // Închis în acea zi
    }

    // 1. Definim intervalul de lucru (din Onboarding Step 3)
    const startTime = moment(`${dateString} ${dailySchedule.start}`);
    const endTime = moment(`${dateString} ${dailySchedule.end}`);
    
    // 2. Extragem programările existente (filtrate după dată și angajat)
    const existingAppointments = appointmentsDB.filter(app => {
        // Filtrează după dată
        const appDate = moment(app.start).format('YYYY-MM-DD');
        const isTargetDay = appDate === dateString;
        
        // Filtrează după Angajat (simulare: se presupune că angajatul a fost atribuit)
        const isTargetStaff = staffId === 'all' || app.staffId === staffId; 
        
        return isTargetDay && isTargetStaff;
    });

    // 3. Generăm sloturile disponibile (Logica simplă)
    let currentTime = moment(startTime);
    const availableSlots = [];

    while (currentTime.isBefore(endTime)) {
        let slotEnd = moment(currentTime).add(FIXED_SERVICE_DURATION, 'minutes');
        
        let isBooked = existingAppointments.some(app => {
            const appStart = moment(app.start);
            const appEnd = moment(app.end);
            
            // Verifică suprapunerea (Slotul tău începe înainte ca cel existent să se termine ȘI slotul tău se termină după ce cel existent începe)
            return (currentTime.isBefore(appEnd) && slotEnd.isAfter(appStart));
        });

        if (slotEnd.isSameOrBefore(endTime) && !isBooked) {
            availableSlots.push(currentTime.format('HH:mm'));
        }

        // Treci la următorul slot (mărimea intervalului)
        currentTime = slotEnd; 
    }

    // 4. Returnăm sloturile
    return NextResponse.json({ slots: availableSlots });
}
