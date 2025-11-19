// /src/app/api/admin/users/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET: Listează utilizatorii (cu căutare și filtrare)
export async function GET(request) {
    const session = await getSession();
    if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Interzis' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'ALL';

    try {
        const whereClause = {
            AND: [
                // Căutare după nume sau email
                {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ]
                },
                // Filtrare după rol (dacă nu e ALL)
                ...(role !== 'ALL' ? [{ role: role }] : [])
            ]
        };

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phoneNumber: true,
                createdAt: true, // Asigură-te că ai acest câmp în schema sau îl ignorăm dacă nu
                _count: {
                    select: { appointments: true } // Vedem câte programări a făcut
                }
            },
            orderBy: { id: 'desc' },
            take: 50 // Limităm la 50 pentru performanță
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
    }
}

// DELETE: Șterge un utilizator
export async function DELETE(request) {
    const session = await getSession();
    if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Interzis' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        // Ștergem tot ce ține de user (cascade manual dacă e nevoie)
        await prisma.appointment.deleteMany({ where: { clientId: id } });
        await prisma.favorite.deleteMany({ where: { userId: id } });
        await prisma.review.deleteMany({ where: { userId: id } });
        
        // Dacă e partener, ștergem și salonul (logica e complexă, aici simplificăm)
        const user = await prisma.user.findUnique({ where: { id }});
        if (user.role === 'PARTNER' && user.salonId) {
             await prisma.salon.delete({ where: { id: user.salonId } });
        }

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
    }
}