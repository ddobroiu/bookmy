// /src/app/dashboard/data/route.js (COD COMPLET FINAL)

import { NextResponse } from 'next/server';
// CORECTAT: Folosim alias-ul @/
import { servicesDB, staffDB, findSalonServices, findSalonStaff } from '@/db'; 

// Funcția Helper pentru a obține ID-ul salonului (din cookie sau simulare)
const getSalonId = (request) => {
    // În realitate, ai decoda un JWT sau verifica o sesiune
    return 'salon-de-lux-central'; 
};

// GET: Citește Servicii sau Staff
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const salonId = getSalonId(request);

    if (type === 'services') {
        return NextResponse.json(findSalonServices(salonId));
    }
    if (type === 'staff') {
        return NextResponse.json(findSalonStaff(salonId));
    }

    return NextResponse.json({ message: 'Invalid type specified' }, { status: 400 });
}

// POST: Adaugă Serviciu sau Staff
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

// DELETE: Șterge Serviciu sau Staff
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(searchParams.get('id'));
    
    if (!type || !id) {
        return NextResponse.json({ message: 'Missing type or ID' }, { status: 400 });
    }

    if (type === 'service') {
        const index = servicesDB.findIndex(s => s.id === id);
        if (index > -1) {
            servicesDB.splice(index, 1);
            return NextResponse.json({ message: 'Service deleted successfully' });
        }
    }
    if (type === 'staff') {
        const index = staffDB.findIndex(s => s.id === id);
        if (index > -1) {
            staffDB.splice(index, 1);
            return NextResponse.json({ message: 'Staff member deleted successfully' });
        }
    }

    return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
}