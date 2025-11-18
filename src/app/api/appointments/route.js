// /app/api/appointments/route.js (COD COMPLET)

import { NextResponse } from 'next/server';

// ATENȚIE: Simularea Bazei de Date pentru Programări
// În producție, aici ai folosi Prisma, Drizzle sau un client SQL direct
const appointmentsDB = [
    // Evenimente inițiale (pentru a arăta ceva la încărcare)
    { 
        id: 1, 
        title: 'Programare: Client X (Manichiură)',
        start: new Date(new Date().setHours(15, 0, 0, 0)),
        end: new Date(new Date().setHours(16, 0, 0, 0)),
        isBlock: false,
    },
];

// Functie GET: Încarcă programările
export async function GET() {
    // În realitate: Fetch from Railway DB where partnerId = user.partnerId
    return NextResponse.json(appointmentsDB);
}

// Functie POST: Adaugă o programare sau blochează timpul
export async function POST(request) {
    try {
        const { start, end, title, isBlock } = await request.json();
        
        if (!start || !end || !title) {
            return NextResponse.json({ message: 'Missing required appointment fields' }, { status: 400 });
        }

        const newAppointment = {
            id: appointmentsDB.length + 1,
            title,
            start: new Date(start), // Convertim în obiect Date
            end: new Date(end),     // Convertim în obiect Date
            isBlock,
            // Adaugi aici partnerId (extras din JWT-ul utilizatorului logat)
        };

        appointmentsDB.push(newAppointment);

        // În realitate: Save to Railway DB
        
        return NextResponse.json({ 
            message: 'Appointment successfully saved.',
            appointment: newAppointment
        }, { status: 201 });

    } catch (error) {
        console.error('Appointment POST Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}