// /src/app/api/partner/client-reviews/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// POST: Salonul lasă o recenzie clientului
export async function POST(request) {
  const session = await getSession();
  
  // Verificări de securitate
  if (!session?.userId || session.role !== 'PARTENER' || !session.salonId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const { appointmentId, rating, comment } = await request.json();

    if (!appointmentId || !rating) {
      return NextResponse.json({ error: 'Date incomplete.' }, { status: 400 });
    }

    // 1. Găsim programarea pentru a lua ID-ul clientului
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true } // Avem nevoie de datele clientului
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Programarea nu există.' }, { status: 404 });
    }

    if (appointment.salonId !== session.salonId) {
      return NextResponse.json({ error: 'Nu aveți dreptul asupra acestei programări.' }, { status: 403 });
    }

    // 2. Creăm recenzia în baza de date
    const newReview = await prisma.clientReview.create({
      data: {
        rating: parseInt(rating),
        comment,
        salonId: session.salonId,
        clientId: appointment.clientId,
        appointmentId: appointment.id
      }
    });

    // 3. Recalculăm media notelor clientului
    const allReviews = await prisma.clientReview.findMany({
      where: { clientId: appointment.clientId },
      select: { rating: true }
    });

    const totalRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const average = totalRating / allReviews.length;

    // 4. Actualizăm user-ul (Clientul)
    await prisma.user.update({
      where: { id: appointment.clientId },
      data: {
        averageClientRating: parseFloat(average.toFixed(2)),
        clientReviewCount: allReviews.length
      }
    });

    return NextResponse.json({ success: true, review: newReview });

  } catch (error) {
    console.error("Eroare la recenzia clientului:", error);
    // Verificăm dacă a mai dat deja review (Unique constraint)
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Ați evaluat deja acest client pentru această programare.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Eroare server.' }, { status: 500 });
  }
}