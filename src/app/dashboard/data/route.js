// /src/app/dashboard/data/route.js (Refactorizat cu Prisma)

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Importăm clientul Prisma

// Funcție Helper pentru a obține ID-ul salonului (simulare)
const getSalonId = (request) => {
    // Într-o aplicație reală, acest ID ar veni dintr-un token de autentificare (JWT)
    // Asigură-te că acest ID corespunde cu cel folosit la onboarding
    return 'partner@test.com'; 
};

// Functie GET: Citește Servicii sau Staff folosind Prisma
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const salonId = getSalonId(request);

    try {
        if (type === 'services') {
            // TODO: Modelul 'Service' nu este definit în schema.prisma.
            // Când va fi implementat, logica de mai jos ar trebui activată.
            /*
            const services = await prisma.service.findMany({ where: { salonId } });
            return NextResponse.json(services);
            */
            return NextResponse.json([]); // Returnăm un array gol deocamdată
        }
        if (type === 'staff') {
            const staff = await prisma.staff.findMany({ where: { salonId } });
            return NextResponse.json(staff);
        }

        return NextResponse.json({ message: 'Tip de date invalid specificat.' }, { status: 400 });
    } catch (error) {
        console.error(`Eroare la preluarea datelor pentru '${type}':`, error);
        return NextResponse.json({ message: 'Eroare internă a serverului.' }, { status: 500 });
    }
}

// POST: Adaugă Serviciu sau Staff folosind Prisma
export async function POST(request) {
    const { type, data } = await request.json();
    const salonId = getSalonId(request);

    if (!type || !data) {
        return NextResponse.json({ message: 'Lipsesc tipul sau datele.' }, { status: 400 });
    }

    try {
        if (type === 'service') {
            // TODO: Logica pentru crearea serviciilor va fi adăugată aici
            return NextResponse.json({ message: 'Funcționalitatea de adăugare serviciu nu este implementată.' }, { status: 501 });
        }
        if (type === 'staff') {
            if (!data.name || !data.role) {
                return NextResponse.json({ message: 'Numele și rolul sunt obligatorii pentru personal.' }, { status: 400 });
            }
            const newStaffMember = await prisma.staff.create({
                data: {
                    name: data.name,
                    role: data.role,
                    salonId: salonId,
                },
            });
            return NextResponse.json({ message: 'Membru staff adăugat cu succes.', entry: newStaffMember }, { status: 201 });
        }

        return NextResponse.json({ message: 'Tip invalid pentru operația POST.' }, { status: 400 });
    } catch (error) {
        console.error(`Eroare la adăugarea '${type}':`, error);
        return NextResponse.json({ message: 'Eroare internă a serverului la adăugare.' }, { status: 500 });
    }
}

// DELETE: Șterge Serviciu sau Staff (LOGICĂ DE SIMULARE)
export async function DELETE(request) {
    // În producție, aici ai folosi prisma.service.delete sau prisma.staff.delete
    return NextResponse.json({ message: 'Ștergerea a fost simulată cu succes.' });
}