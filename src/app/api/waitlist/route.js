// /src/app/api/waitlist/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import moment from 'moment';

// POST: Clientul se înscrie pe listă
export async function POST(request) {
    try {
        const body = await request.json();
        const { salonId, serviceId, staffId, date, name, phone, email, notes } = body;

        if (!salonId || !serviceId || !date || !name || !phone) {
            return NextResponse.json({ message: 'Date incomplete.' }, { status: 400 });
        }

        const entry = await prisma.waitlist.create({
            data: {
                salonId,
                serviceId,
                staffId: staffId || null, // Poate fi null dacă nu contează angajatul
                date: new Date(date), // Salvăm data dorită
                clientName: name,
                clientPhone: phone,
                clientEmail: email,
                notes
            }
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        console.error("Waitlist Error:", error);
        return NextResponse.json({ message: 'Eroare la înscriere.' }, { status: 500 });
    }
}

// GET: Partenerul vede lista de așteptare
export async function GET(request) {
    const session = await getSession();
    if (!session?.salonId) {
        return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });
    }

    try {
        const entries = await prisma.waitlist.findMany({
            where: { 
                salonId: session.salonId,
                status: 'PENDING' // Arătăm doar ce e activ
            },
            include: {
                service: { select: { name: true } },
                staff: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json({ message: 'Eroare server.' }, { status: 500 });
    }
}

// PATCH: Partenerul marchează o cerere ca rezolvată
export async function PATCH(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });

    const { id, status } = await request.json();

    try {
        const updated = await prisma.waitlist.update({
            where: { id },
            data: { status }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: 'Eroare actualizare.' }, { status: 500 });
    }
}
