// /src/app/api/partner/salon/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET: Preluăm datele curente ale salonului
export async function GET() {
  const session = await getSession();
  if (!session?.userId || session.role !== 'PARTNER') {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    // Căutăm salonul deținut de user
    const salon = await prisma.salon.findFirst({
      where: { ownerId: session.userId }
    });

    if (!salon) return NextResponse.json({ error: 'Nu aveți un salon configurat.' }, { status: 404 });

    return NextResponse.json({
        ...salon,
        schedule: salon.scheduleJson ? JSON.parse(salon.scheduleJson) : {},
        facilities: salon.facilities ? JSON.parse(JSON.stringify(salon.facilities)) : []
    });

  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// PUT: Actualizăm datele salonului
export async function PUT(request) {
  const session = await getSession();
  if (!session?.userId || session.role !== 'PARTNER') {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const body = await request.json();
  const { name, address, phone, description, category, schedule, coverImage, facilities } = body;

  try {
    // Căutăm salonul existent pentru a-i lua ID-ul
    const existingSalon = await prisma.salon.findFirst({
        where: { ownerId: session.userId }
    });

    if (!existingSalon) return NextResponse.json({ error: 'Salon inexistent' }, { status: 404 });

    // Actualizăm
    const updatedSalon = await prisma.salon.update({
      where: { id: existingSalon.id },
      data: {
        name,
        address,
        phone,
        description,
        category,
        coverImage, // Se poate trimite un string Base64 sau URL
        scheduleJson: JSON.stringify(schedule),
        facilities: facilities // Prisma știe să salveze array-uri în Json
      }
    });

    return NextResponse.json(updatedSalon);

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 });
  }
}