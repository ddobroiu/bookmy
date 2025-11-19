// /src/app/api/admin/salons/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request) {
    const session = await getSession();
    if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Interzis' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    try {
        const salons = await prisma.salon.findMany({
            where: {
                name: { contains: search, mode: 'insensitive' }
            },
            include: {
                owner: { select: { email: true, name: true } }
            },
            orderBy: { id: 'desc' },
            take: 50
        });

        return NextResponse.json(salons);
    } catch (error) {
        return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
    }
}