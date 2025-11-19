// /src/app/dashboard/data/route.js (ACTUALIZAT CU RELAȚIA SERVICII)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { checkSubscriptionLimit } from '@/lib/subscription';

export async function GET(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        if (type === 'services') {
            const services = await prisma.service.findMany({ where: { salonId: session.salonId }, orderBy: { price: 'asc' } });
            return NextResponse.json(services);
        }
        if (type === 'staff') {
            // Includem serviciile pentru a le afișa în frontend
            const staff = await prisma.staff.findMany({ 
                where: { salonId: session.salonId }, 
                orderBy: { name: 'asc' },
                include: { services: { select: { id: true, name: true } } }
            });
            return NextResponse.json(staff);
        }
        return NextResponse.json([], { status: 400 });
    } catch (error) { return NextResponse.json({ message: 'Eroare server' }, { status: 500 }); }
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
                    requiresApproval: data.requiresApproval || false,
                    autoAssign: data.autoAssign || false,
                    salonId: session.salonId
                }
            });
            return NextResponse.json(newService, { status: 201 });
        }
        
        if (type === 'staff') {
            // 1. Verificăm Limita Abonamentului
            const salon = await prisma.salon.findUnique({ 
                where: { id: session.salonId },
                include: { _count: { select: { staff: true } } } 
            });

            if (!checkSubscriptionLimit(salon.subscriptionPlan, salon._count.staff)) {
                return NextResponse.json({ 
                    message: `Ai atins limita de calendare pentru planul ${salon.subscriptionPlan}.` 
                }, { status: 403 });
            }

            // 2. Creăm Staff cu Servicii Conectate
            const serviceIds = data.serviceIds || []; // Array de ID-uri servicii

            const newStaff = await prisma.staff.create({
                data: {
                    name: data.name,
                    role: data.role,
                    isHuman: data.isHuman !== false,
                    assignedPerson: data.assignedPerson || null, // Persoana responsabilă
                    
                    useSalonContact: data.useSalonContact !== false,
                    email: data.email || null,
                    phone: data.phone || null,
                    salonId: session.salonId,
                    schedule: {},
                    
                    // Conectăm serviciile selectate
                    services: {
                        connect: serviceIds.map(id => ({ id }))
                    }
                },
                include: { services: true }
            });
            return NextResponse.json(newStaff, { status: 201 });
        }
        return NextResponse.json({ message: 'Tip invalid' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Eroare la salvare' }, { status: 500 });
    }
}

// PUT și DELETE rămân similare, asigură-te că PUT permite update la servicii
// ... (poți copia restul din versiunea anterioară sau lăsa așa dacă nu ai nevoie de update complex acum)
export async function DELETE(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ message: 'Neautorizat' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    try {
        if (type === 'service') await prisma.service.delete({ where: { id } });
        if (type === 'staff') await prisma.staff.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) { return NextResponse.json({ message: 'Eroare' }, { status: 500 }); }
}