import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const session = await getSession();

  if (!session || !session.userId) {
    // În producție, sesiunea ar trebui verificată mai riguros, posibil printr-un middleware.
    // Aici, pentru dezvoltare, permitem accesul dacă nu există sesiune,
    // dar returnăm un array gol sau un mesaj de eroare.
    return NextResponse.json({ error: 'Neautorizat. Trebuie să fii autentificat pentru a vedea programările.' }, { status: 401 });
  }

  try {
    const userAppointments = await prisma.appointment.findMany({
      where: {
        clientId: session.userId,
      },
      include: {
        salon: {
          select: {
            name: true,
            slug: true,
            address: true,
          },
        },
        staff: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        start: 'desc', // Afișează programările cele mai recente primele
      },
    });

    return NextResponse.json(userAppointments);
  } catch (error) {
    console.error('Eroare la preluarea programărilor utilizatorului:', error);
    return NextResponse.json({ error: 'A apărut o eroare pe server la preluarea programărilor.' }, { status: 500 });
  }
}