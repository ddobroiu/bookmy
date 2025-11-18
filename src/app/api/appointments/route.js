// src/app/api/appointments/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staffId');

  if (!session || !session.salonId) {
    // This protects the route for partners only
    return NextResponse.json({ error: 'Neautorizat sau nu este un cont de partener.' }, { status: 401 });
  }

  try {
    const whereClause = {
      salonId: session.salonId,
      status: {
        not: 'CANCELLED' // Nu afișăm programările anulate
      }
    };

    if (staffId && staffId !== 'all') {
      whereClause.staffId = staffId;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: {
          select: { email: true } // Select whatever client info is needed
        },
        staff: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Eroare la preluarea programărilor:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului.' }, { status: 500 });
  }
}