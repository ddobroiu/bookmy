// src/app/api/user/appointments/route.js
import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/session';
import prisma from '../../../../lib/prisma';

export async function GET() {
  const session = await getSession();

  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  if (session.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Doar clienții pot vedea programările.' }, { status: 403 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        clientId: session.userId,
      },
      include: {
        salon: {
          select: {
            name: true,
            slug: true,
          },
        },
        staff: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        start: 'desc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Eroare la preluarea programărilor:', error);
    return NextResponse.json({ error: 'Eroare la preluarea programărilor' }, { status: 500 });
  }
}
