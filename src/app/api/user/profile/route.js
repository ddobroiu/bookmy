import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/session';
import prisma from '../../../../lib/prisma';

export async function GET() {
  const session = await getSession();

  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilizatorul nu a fost găsit' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Eroare la preluarea datelor utilizatorului:', error);
    return NextResponse.json({ error: 'Eroare la preluarea datelor utilizatorului' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await getSession();

  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const { name, phoneNumber } = await request.json();

    if (!name || !phoneNumber) {
      return NextResponse.json({ error: 'Numele și numărul de telefon sunt obligatorii' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.userId,
      },
      data: {
        name,
        phoneNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Eroare la actualizarea datelor utilizatorului:', error);
    return NextResponse.json({ error: 'Eroare la actualizarea datelor utilizatorului' }, { status: 500 });
  }
}
