// /src/app/api/salon/route.js (ACTUALIZAT)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ message: "Missing slug" }, { status: 400 });

    try {
        const salon = await prisma.salon.findUnique({
            where: { slug: slug },
            include: {
                // AICI ADUCEM DATELE REALE
                services: {
                    orderBy: { price: 'asc' }
                },
                // Putem aduce și câteva imagini pentru galerie
                portfolioItems: {
                    take: 6,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        
        if (!salon) return NextResponse.json({ message: "Not found" }, { status: 404 });

        const salonData = {
            ...salon,
            schedule: JSON.parse(salon.scheduleJson || '{}'),
            // Dacă nu are imagini, punem unele fake pentru design
            portfolioItems: salon.portfolioItems.length > 0 ? salon.portfolioItems : [] 
        };
        delete salonData.scheduleJson;

        return NextResponse.json(salonData);

    } catch (error) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}