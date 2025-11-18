// /src/app/api/salon/route.js (Refactorizat cu Prisma)

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Importăm clientul Prisma

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ message: "Parametrul 'slug' lipsește." }, { status: 400 });
    }

    try {
        const salon = await prisma.salon.findUnique({
            where: { slug: slug },
            // TODO: Când modelul 'Service' este implementat, include-l aici.
            // include: { services: true } 
        });
        
        if (!salon) {
            return NextResponse.json({ message: "Salonul nu a fost găsit." }, { status: 404 });
        }

        // Parsează orarul din JSON string în obiect înainte de a-l trimite clientului
        const salonData = {
            ...salon,
            schedule: JSON.parse(salon.scheduleJson || '{}'),
        };
        // Nu mai trimitem `scheduleJson` pentru a nu expune structura internă
        delete salonData.scheduleJson;

        // TODO: Logica pentru servicii trebuie adăugată aici când modelul `Service` există.
        // Deocamdată, returnăm un array gol.
        const services = [];

        return NextResponse.json({
            ...salonData,
            services: services
        });

    } catch (error) {
        console.error("Eroare la preluarea detaliilor salonului:", error);
        // Verifică dacă eroarea este de la parsarea JSON
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: "Format invalid pentru orar în baza de date." }, { status: 500 });
        }
        return NextResponse.json({ message: "Eroare internă a serverului." }, { status: 500 });
    }
}