
// /src/app/api/reviews/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/session';

// GET: Obține recenziile pentru un salon
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
        return NextResponse.json({ error: 'ID-ul salonului este obligatoriu.' }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { salonId },
            include: {
                user: {
                    select: { email: true }, // Selectează doar câmpuri sigure
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Eroare la preluarea recenziilor:', error);
        return NextResponse.json({ error: 'Nu am putut prelua recenziile.' }, { status: 500 });
    }
}

// POST: Adaugă o recenzie nouă
export async function POST(request) {
    const session = await getSession();
    if (!session?.user) {
        return NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 });
    }

    const { salonId, appointmentId, rating, comment } = await request.json();

    if (!salonId || !appointmentId || !rating) {
        return NextResponse.json({ error: 'Toate câmpurile sunt obligatorii.' }, { status: 400 });
    }

    try {
        // Verifică dacă utilizatorul a avut o programare finalizată
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                clientId: session.user.id,
                salonId: salonId,
                end: {
                    lt: new Date(), // Programarea trebuie să se fi încheiat
                },
            },
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Nu ai o programare validă pentru a lăsa o recenzie.' }, { status: 403 });
        }

        // Verifică dacă a mai lăsat o recenzie pentru această programare
        const existingReview = await prisma.review.findUnique({
            where: { appointmentId },
        });

        if (existingReview) {
            return NextResponse.json({ error: 'Ai lăsat deja o recenzie pentru această programare.' }, { status: 409 });
        }

        // Creează recenzia și actualizează rating-ul salonului într-o singură tranzacție
        const newReview = await prisma.$transaction(async (tx) => {
            // Pas 1: Obține salonul curent pentru a avea datele de rating
            const salon = await tx.salon.findUnique({
                where: { id: salonId },
                select: { averageRating: true, reviewCount: true },
            });

            if (!salon) {
                throw new Error('Salonul nu a fost găsit.');
            }

            // Pas 2: Calculează noul rating mediu
            const { averageRating, reviewCount } = salon;
            const newReviewCount = reviewCount + 1;
            const newAverageRating =
                (averageRating * reviewCount + parseInt(rating, 10)) / newReviewCount;

            // Pas 3: Actualizează salonul cu noile valori
            await tx.salon.update({
                where: { id: salonId },
                data: {
                    reviewCount: newReviewCount,
                    averageRating: newAverageRating,
                },
            });

            // Pas 4: Creează recenzia
            const createdReview = await tx.review.create({
                data: {
                    rating: parseInt(rating, 10),
                    comment,
                    userId: session.user.id,
                    salonId,
                    appointmentId,
                },
            });

            return createdReview;
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('Eroare la adăugarea recenziei:', error);
        return NextResponse.json({ error: 'Nu am putut adăuga recenzia.' }, { status: 500 });
    }
}
