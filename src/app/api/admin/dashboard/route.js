// /src/app/api/admin/dashboard/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
    const session = await getSession();
    
    // Verificăm strict rolul de ADMIN
    if (!session?.userId || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Acces interzis.' }, { status: 403 });
    }

    try {
        // 1. Statistici Globale
        const totalUsers = await prisma.user.count();
        const totalSalons = await prisma.salon.count();
        const totalAppointments = await prisma.appointment.count();
        
        // Calculăm venitul total estimat (suma prețurilor din programări confirmate/plătite)
        const revenueData = await prisma.appointment.aggregate({
            _sum: { price: true },
            where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
        });

        // 2. Lista ultimelor saloane înscrise
        const recentSalons = await prisma.salon.findMany({
            take: 10,
            orderBy: { id: 'desc' }, // Folosim ID descrescător ca proxy pentru "cele mai noi" dacă nu avem createdAt pe Salon
            include: {
                owner: { select: { email: true, name: true } }
            }
        });

        return NextResponse.json({
            stats: {
                users: totalUsers,
                salons: totalSalons,
                appointments: totalAppointments,
                revenue: revenueData._sum.price || 0
            },
            salons: recentSalons
        });

    } catch (error) {
        console.error("Admin API Error:", error);
        return NextResponse.json({ error: 'Eroare server.' }, { status: 500 });
    }
}

// DELETE: Șterge un salon (acțiune de admin)
export async function DELETE(request) {
    const session = await getSession();
    if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('id');

    try {
        // Ștergem salonul (Cascada din DB ar trebui să șteargă și programările, dar Prisma cere explicit uneori)
        // Pentru siguranță, ștergem doar salonul și lăsăm Prisma să se ocupe de relații (dacă onDelete: Cascade e setat în schema)
        // Sau facem o ștergere "soft" (marcare ca inactiv). Aici facem hard delete pentru demo.
        
        // Important: Ștergem întâi dependențele dacă schema nu are Cascade
        await prisma.appointment.deleteMany({ where: { salonId } });
        await prisma.staff.deleteMany({ where: { salonId } });
        await prisma.service.deleteMany({ where: { salonId } });
        
        await prisma.salon.delete({ where: { id: salonId } });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Nu s-a putut șterge salonul.' }, { status: 500 });
    }
}