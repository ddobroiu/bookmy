// /src/app/api/partner/portfolio/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET: Listează imaginile salonului curent (pentru Dashboard)
export async function GET() {
  const session = await getSession();
  // Verificăm dacă e partener și are salon configurat
  if (!session?.userId || session.role !== 'PARTENER' || !session.salonId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const items = await prisma.portfolioItem.findMany({
      where: { salonId: session.salonId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST: Adaugă o imagine nouă
export async function POST(request) {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { url, description } = await request.json();

  try {
    const newItem = await prisma.portfolioItem.create({
      data: {
        url, // Aici vine string-ul Base64 sau URL-ul extern
        description,
        salonId: session.salonId
      }
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 });
  }
}

// DELETE: Șterge o imagine
export async function DELETE(request) {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    // Ne asigurăm că imaginea aparține salonului curent înainte de ștergere
    const item = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!item || item.salonId !== session.salonId) {
        return NextResponse.json({ error: 'Nu aveți permisiunea.' }, { status: 403 });
    }

    await prisma.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}