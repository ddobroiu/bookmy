import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { salonId, userId, appointmentId, rating, comment } = body;

    if (!salonId || !userId || !appointmentId || !rating) {
      return NextResponse.json({ message: 'Datele necesare pentru recenzie sunt incomplete.' }, { status: 400 });
    }

    // Verifică dacă există deja o recenzie pentru această programare
    const existingReview = await prisma.review.findUnique({
      where: { appointmentId },
    });

    if (existingReview) {
      return NextResponse.json({ message: 'Ați lăsat deja o recenzie pentru această programare.' }, { status: 409 });
    }

    // Creează recenzia
    const newReview = await prisma.review.create({
      data: {
        rating: parseInt(rating, 10),
        comment,
        userId,
        salonId,
        appointmentId,
      },
    });

    // Actualizează rating-ul agregat al salonului
    const salonReviews = await prisma.review.findMany({
      where: { salonId },
      select: { rating: true },
    });

    const totalRating = salonReviews.reduce((acc, review) => acc + review.rating, 0);
    const reviewCount = salonReviews.length;
    const averageRating = totalRating / reviewCount;

    await prisma.salon.update({
      where: { id: salonId },
      data: {
        averageRating: parseFloat(averageRating.toFixed(2)),
        reviewCount,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Eroare la crearea recenziei:', error);
    return NextResponse.json({ message: 'Eroare internă a serverului la crearea recenziei.' }, { status: 500 });
  }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
        return NextResponse.json({ message: "Parametrul 'salonId' lipsește." }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { salonId: salonId },
            include: {
                user: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        
        return NextResponse.json(reviews);

    } catch (error) {
        console.error("Eroare la preluarea recenziilor:", error);
        return NextResponse.json({ message: "Eroare internă a serverului." }, { status: 500 });
    }
}