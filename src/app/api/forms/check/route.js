// /src/app/api/forms/check/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const salonId = searchParams.get('salonId');
  const serviceId = searchParams.get('serviceId');

  if (!salonId) return NextResponse.json({ error: 'Lipsesc parametri' }, { status: 400 });

  try {
    // Căutăm formulare care sunt:
    // 1. Generale (pentru tot salonul)
    // 2. SAU legate specific de serviciul ales
    const forms = await prisma.formTemplate.findMany({
      where: {
        salonId: salonId,
        OR: [
          { isGeneral: true },
          { services: { some: { id: serviceId } } } // Dacă serviceId e null, asta nu returnează nimic, corect
        ]
      },
      include: {
        questions: {
            orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}