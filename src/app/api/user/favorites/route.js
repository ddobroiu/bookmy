// /src/app/api/user/favorites/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET: Listează saloanele favorite ale utilizatorului logat
export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.userId },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            category: true,
            averageRating: true,
            // Putem lua și o imagine din portofoliu ca thumbnail
            portfolioItems: {
              take: 1,
              select: { url: true }
            }
          }
        }
      }
    });

    // Formatăm datele pentru frontend
    const formatted = favorites.map(fav => ({
      id: fav.salon.id,
      name: fav.salon.name,
      slug: fav.salon.slug,
      address: fav.salon.address,
      rating: fav.salon.averageRating || 5.0,
      category: fav.salon.category || 'General',
      // Folosim prima imagine din portofoliu sau un placeholder
      image: fav.salon.portfolioItems[0]?.url || 'https://via.placeholder.com/150'
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST: Adaugă un salon la favorite
export async function POST(request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { salonId } = await request.json();

  try {
    await prisma.favorite.create({
      data: {
        userId: session.userId,
        salonId: salonId
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    // P2002 este codul Prisma pentru "Unique constraint failed" (deja favorit)
    if (error.code === 'P2002') return NextResponse.json({ success: true }); 
    return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 });
  }
}

// DELETE: Șterge de la favorite
export async function DELETE(request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const salonId = searchParams.get('salonId');

  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: session.userId,
        salonId: salonId
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}