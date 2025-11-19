// /src/app/api/partner/credits/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { CREDIT_PACKAGES } from '@/lib/subscription';

export async function POST(request) {
    const session = await getSession();
    if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

    const { packageId } = await request.json();
    const selectedPack = CREDIT_PACKAGES.find(p => p.id === packageId);

    if (!selectedPack) {
        return NextResponse.json({ error: 'Pachet invalid' }, { status: 400 });
    }

    try {
        // SIMULARE PLATĂ (Stripe ar veni aici)
        // Dacă plata e OK:
        
        const updatedSalon = await prisma.salon.update({
            where: { id: session.salonId },
            data: {
                credits: { increment: selectedPack.credits }
            }
        });

        return NextResponse.json({ 
            success: true, 
            newBalance: updatedSalon.credits,
            message: `Ai adăugat ${selectedPack.credits} credite!`
        });
    } catch (error) {
        return NextResponse.json({ error: 'Eroare tranzacție' }, { status: 500 });
    }
}