// /app/api/booking/route.js (COD COMPLET)

import { NextResponse } from 'next/server';
import moment from 'moment';

// ATENȚIE: Simularea Bazei de Date (Aceeași logică ca la /api/appointments)
// În producție, aici ai folosi o bază de date reală (Railway)
const appointmentsDB = [
    // Se presupune că acest array este partajat sau că folosești o bază de date reală
    { 
        id: 1, 
        title: 'Programare: Client X (Manichiură)',
        start: new Date(new Date().setHours(15, 0, 0, 0)),
        end: new Date(new Date().setHours(16, 0, 0, 0)),
        isBlock: false,
    },
];


// Functie POST: Adaugă o programare nouă de la client
export async function POST(request) {
    try {
        const { service, date, time, clientName, clientPhone, salonId } = await request.json();
        
        if (!service || !date || !time || !clientPhone || !salonId) {
            return NextResponse.json({ message: 'Missing required booking fields' }, { status: 400 });
        }

        // 1. Calculăm intervalul orar exact (start și end)
        const appointmentStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();
        // Durata este preluată din obiectul service (simulat)
        const appointmentEnd = moment(appointmentStart).add(service.duration, 'minutes').toDate();
        
        // 2. Creăm obiectul programării
        const newAppointment = {
            id: appointmentsDB.length + 1,
            // Titlul va fi vizibil în calendarul partenerului
            title: `Programare: ${clientName} (${service.name})`, 
            start: appointmentStart,
            end: appointmentEnd,
            isBlock: false, // Este o programare, nu un block
            salonId: salonId,
            clientName: clientName,
            clientPhone: clientPhone,
        };

        // 3. Simulare: Salvare în baza de date
        appointmentsDB.push(newAppointment);

        // În realitate: Save to Railway DB
        
        return NextResponse.json({ 
            message: 'Booking successfully saved.',
            appointment: newAppointment
        }, { status: 201 });

    } catch (error) {
        console.error('Booking POST Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}