// /src/app/api/partner/salon/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session?.userId || session.role !== 'PARTNER') return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const salon = await prisma.salon.findFirst({ where: { ownerId: session.userId } });
    if (!salon) return NextResponse.json({ error: 'Inexistent' }, { status: 404 });
    return NextResponse.json({
        ...salon,
        schedule: salon.scheduleJson ? JSON.parse(salon.scheduleJson) : {},
        facilities: salon.facilities ? JSON.parse(JSON.stringify(salon.facilities)) : []
    });
  } catch (error) { return NextResponse.json({ error: 'Eroare' }, { status: 500 }); }
}

export async function PUT(request) {
  const session = await getSession();
  if (!session?.userId || session.role !== 'PARTNER') return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await request.json();
  const { name, address, phone, description, category, schedule, coverImage, facilities, autoApprove, notificationEmail, notificationPhone } = body;

  try {
    const existingSalon = await prisma.salon.findFirst({ where: { ownerId: session.userId } });
    if (!existingSalon) return NextResponse.json({ error: 'Salon inexistent' }, { status: 404 });

    const updatedSalon = await prisma.salon.update({
      where: { id: existingSalon.id },
      data: {
        name, address, phone, description, category, coverImage,
        scheduleJson: JSON.stringify(schedule),
        facilities: facilities,
        autoApprove: autoApprove,
        // Salvăm noile câmpuri
        notificationEmail: notificationEmail,
        notificationPhone: notificationPhone
      }
    });
    return NextResponse.json(updatedSalon);
  } catch (error) { return NextResponse.json({ error: 'Eroare actualizare' }, { status: 500 }); }
}