// /src/app/api/user/settings/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET: Preluăm setările curente
export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        notifEmail: true,
        notifSms: true,
        notifPromo: true
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// PUT: Actualizăm setările
export async function PUT(request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        notifEmail: body.notifEmail,
        notifSms: body.notifSms,
        notifPromo: body.notifPromo
      },
      select: {
        notifEmail: true,
        notifSms: true,
        notifPromo: true
      }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 });
  }
}