// /src/app/api/appointments/route.js (ACTUALIZAT)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staffId');

  if (!session || !session.salonId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const whereClause = {
      salonId: session.salonId,
      status: { not: 'CANCELLED' }
    };

    if (staffId && staffId !== 'all') {
      whereClause.staffId = staffId;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        // Includem datele clientului, inclusiv rating-ul
        client: {
          select: { 
              id: true,
              name: true, 
              email: true, 
              phoneNumber: true,
              averageClientRating: true, // NOU: Nota medie
              clientReviewCount: true    // NOU: Nr recenzii
          } 
        },
        staff: {
          select: { name: true }
        },
        // Verificăm dacă există deja un review dat pentru această programare
        clientReview: {
            select: { id: true, rating: true }
        }
      }
    });

    // Formatăm datele pentru calendar
    const formattedAppointments = appointments.map(app => ({
        ...app,
        title: app.client 
            ? `${app.client.name || 'Client'} (★${app.client.averageClientRating?.toFixed(1) || 'New'})` // Afișăm nota în titlu
            : app.title, // Fallback pentru programări manuale
        start: app.start,
        end: app.end,
        // Adăugăm meta-date utile pentru frontend
        clientData: app.client,
        hasBeenReviewed: !!app.clientReview // True dacă a primit deja notă
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Eroare la preluarea programărilor:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului.' }, { status: 500 });
  }
}