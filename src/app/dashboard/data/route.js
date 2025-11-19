// /src/app/dashboard/data/route.js (ACTUALIZAT CU PUT)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        if (type === 'services') {
            const services = await prisma.service.findMany({ 
                where: { salonId: session.salonId },
                orderBy: { price: 'asc' }
            });
            return NextResponse.json(services);
        }
        if (type === 'staff') {
            // Returnăm și programul angajatului
            const staff = await prisma.staff.findMany({ 
                where: { salonId: session.salonId },
                orderBy: { name: 'asc' }
            });
            return NextResponse.json(staff);
        }
        return NextResponse.json([], { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Eroare server' }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });

    const { type, data } = await request.json();

    try {
        if (type === 'service') {
            const newService = await prisma.service.create({
                data: {
                    name: data.name,
                    price: parseFloat(data.price),
                    duration: parseInt(data.duration),
                    salonId: session.salonId
                }
            });
            return NextResponse.json(newService, { status: 201 });
        }
        if (type === 'staff') {
            const newStaff = await prisma.staff.create({
                data: {
                    name: data.name,
                    role: data.role,
                    salonId: session.salonId,
                    // Program default (L-V 09-17) dacă nu e setat
                    schedule: {} 
                }
            });
            return NextResponse.json(newStaff, { status: 201 });
        }
        return NextResponse.json({ message: 'Tip invalid' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Eroare la salvare' }, { status: 500 });
    }
}

// NOU: PUT pentru actualizare (folosit la salvarea programului)
export async function PUT(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });

    const { type, data, id } = await request.json();

    try {
        if (type === 'staff') {
            // Verificăm dacă angajatul aparține salonului
            const existing = await prisma.staff.findUnique({ where: { id } });
            if (!existing || existing.salonId !== session.salonId) {
                return NextResponse.json({ message: 'Fără drepturi' }, { status: 403 });
            }

            const updatedStaff = await prisma.staff.update({
                where: { id },
                data: {
                    // Putem actualiza numele, rolul sau programul
                    ...(data.name && { name: data.name }),
                    ...(data.role && { role: data.role }),
                    ...(data.schedule && { schedule: data.schedule })
                }
            });
            return NextResponse.json(updatedStaff);
        }
        return NextResponse.json({ message: 'Tip neimplementat' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Eroare la actualizare' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    try {
        if (type === 'service') {
            const service = await prisma.service.findUnique({ where: { id } });
            if (service?.salonId !== session.salonId) return NextResponse.json({ error: 'Fără drepturi' }, { status: 403 });
            await prisma.service.delete({ where: { id } });
        }
        if (type === 'staff') {
             const member = await prisma.staff.findUnique({ where: { id } });
             if (member?.salonId !== session.salonId) return NextResponse.json({ error: 'Fără drepturi' }, { status: 403 });
             await prisma.staff.delete({ where: { id } });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Eroare la ștergere' }, { status: 500 });
    }
}