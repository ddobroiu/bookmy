// /src/app/api/onboarding/route.js (Refactorizat cu Prisma)

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Importăm clientul Prisma

// Funcție helper pentru a obține ID-ul utilizatorului (simulare)
// În producție, acest ID ar trebui extras dintr-un token de autentificare (JWT)
const getUserIdFromRequest = async (request) => {
    // Simulare: Presupunem că email-ul este într-un header sau sesiune
    const userEmail = 'partner@test.com'; // Hardcodat pentru demonstrație
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });
    return user?.id; // Returnează ID-ul utilizatorului sau null
};

/**
 * Functie POST: Salvează configurarea finală a salonului (Onboarding) folosind Prisma
 * Datele primite (formData) includ: { name, address, category, services, schedule }
 */
export async function POST(request) {
    try {
        const formData = await request.json();
        const userId = await getUserIdFromRequest(request);

        // 1. Validare utilizator și date
        if (!userId) {
            return NextResponse.json({ message: 'Utilizator neautorizat.' }, { status: 401 });
        }

        if (!formData.name || !formData.category || !formData.schedule) {
            return NextResponse.json({ message: 'Lipsesc câmpuri de configurare obligatorii.' }, { status: 400 });
        }

        // 2. Generarea unui slug unic pentru URL
        const baseSlug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        let uniqueSlug = baseSlug;
        let counter = 1;
        // Verifică dacă slug-ul există deja și adaugă un sufix numeric dacă este necesar
        while (await prisma.salon.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        // 3. Crearea/Actualizarea salonului în baza de date
        const salon = await prisma.salon.upsert({
            where: { id: userId }, // Folosim un ID unic, de ex. ID-ul partenerului
            update: {
                name: formData.name,
                slug: uniqueSlug,
                address: formData.address,
                category: formData.category,
                scheduleJson: JSON.stringify(formData.schedule), // Salvăm orarul ca JSON
            },
            create: {
                id: userId, // Asociază salonul cu ID-ul partenerului
                name: formData.name,
                slug: uniqueSlug,
                address: formData.address,
                category: formData.category,
                scheduleJson: JSON.stringify(formData.schedule),
            },
        });

        // 4. Actualizează starea utilizatorului (marchează ca fiind configurat)
        await prisma.user.update({
            where: { id: userId },
            data: {
                salonSetup: true,
                salonId: salon.id, // Leagă utilizatorul de salon
            },
        });

        // 5. Succes
        console.log('--- ONBOARDING COMPLETAT CU PRISMA ---');
        console.log('Date Salon:', salon);

        return NextResponse.json({
            message: 'Afacere configurată și salvată cu succes!',
            salonId: salon.id,
            salonSlug: salon.slug,
        }, { status: 200 });

    } catch (error) {
        console.error('Eroare la trimiterea datelor de onboarding:', error);
        return NextResponse.json({ message: 'Eroare internă a serverului la trimitere.' }, { status: 500 });
    }
}