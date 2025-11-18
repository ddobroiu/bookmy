import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

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
        start: 'desc', // Afișează cele mai recente programări primele
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Eroare la preluarea programărilor:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
