// /src/app/api/partner/forms/submissions/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const submissions = await prisma.formSubmission.findMany({
      where: {
        // Filtrăm formularele care aparțin șabloanelor create de acest salon
        formTemplate: {
          salonId: session.salonId
        }
      },
      include: {
        client: {
          select: { name: true, email: true, phoneNumber: true }
        },
        formTemplate: {
          include: {
            questions: { orderBy: { order: 'asc' } } // Avem nevoie de întrebări pentru a mapa răspunsurile
          }
        },
        appointment: {
          select: { start: true, title: true } // Să știm pentru ce programare e
        }
      },
      orderBy: {
        createdAt: 'desc' // Cele mai recente primele
      }
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Submissions Error:", error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}