// /src/app/dashboard/data/route.js (COD COMPLET FINAL)

import { NextResponse } from 'next/server';

// ATENȚIE: DATELE DB SIMULATE SUNT MUTATE AICI PENTRU A EVITA EROAREA DE IMPORT
const servicesDB = [];
const staffDB = [];
const SALON_ID = 'salon-de-lux-central'; 

// Funcție Helper pentru a obține ID-ul salonului
const getSalonId = (request) => {
    // În realitate, ai decoda un JWT
    return SALON_ID; 
};

// Functie GET: Citește Servicii sau Staff
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const salonId = getSalonId(request);

    // Înlocuim logica DB reală cu date mock
    if (type === 'services') {
        // În producție, ai folosi: return NextResponse.json(await prisma.service.findMany({ where: { salonId } }));
        return NextResponse.json(servicesDB.filter(s => s.salonId === salonId));
    }
    if (type === 'staff') {
        return NextResponse.json(staffDB.filter(s => s.salonId === salonId));
    }

    return NextResponse.json({ message: 'Invalid type specified' }, { status: 400 });
}

// POST: Adaugă Serviciu sau Staff (LOGICĂ DE SIMULARE)
export async function POST(request) {
    const { type, data } = await request.json();
    const salonId = getSalonId(request);

    if (!type || !data) {
        return NextResponse.json({ message: 'Missing type or data' }, { status: 400 });
    }

    const newEntry = {
        ...data,
        salonId,
        id: Date.now(), // ID unic bazat pe timestamp
    };

    if (type === 'service') {
        servicesDB.push(newEntry);
        return NextResponse.json({ message: 'Service added successfully', entry: newEntry }, { status: 201 });
    }
    if (type === 'staff') {
        staffDB.push(newEntry);
        return NextResponse.json({ message: 'Staff member added successfully', entry: newEntry }, { status: 201 });
    }

    return NextResponse.json({ message: 'Invalid type for POST' }, { status: 400 });
}

// DELETE: Șterge Serviciu sau Staff (LOGICĂ DE SIMULARE)
export async function DELETE(request) {
    // În producție, aici ai folosi prisma.service.delete
    return NextResponse.json({ message: 'Delete simulated successfully' });
}