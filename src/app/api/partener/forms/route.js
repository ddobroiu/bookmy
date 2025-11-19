// /src/app/api/partner/forms/route.js (ACTUALIZAT PENTRU FORMULARE GENERALE)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const forms = await prisma.formTemplate.findMany({
      where: { salonId: session.salonId },
      include: {
        questions: { orderBy: { order: 'asc' } },
        services: { select: { id: true, name: true } }
      }
    });
    return NextResponse.json(forms);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  // Primim acum și isGeneral
  const { title, description, isRequired, isGeneral, questions, serviceIds } = await request.json();

  try {
    const newForm = await prisma.formTemplate.create({
      data: {
        title,
        description,
        isRequired,
        isGeneral, // Salvăm setarea
        salonId: session.salonId,
        questions: {
          create: questions.map((q, index) => ({
            text: q.text,
            type: q.type,
            isRequired: q.isRequired,
            order: index,
            options: q.options ? JSON.stringify(q.options) : null
          }))
        },
        // Conectăm serviciile DOAR dacă nu e general
        services: !isGeneral && serviceIds && serviceIds.length > 0 ? {
          connect: serviceIds.map(id => ({ id }))
        } : undefined
      },
      include: { questions: true }
    });

    return NextResponse.json(newForm, { status: 201 });

  } catch (error) {
    console.error("Form Creation Error:", error);
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 });
  }
}

// DELETE rămâne la fel...
export async function DELETE(request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const form = await prisma.formTemplate.findUnique({ where: { id } });
    if (form.salonId !== session.salonId) return NextResponse.json({ error: 'Interzis' }, { status: 403 });

    await prisma.formTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare ștergere.' }, { status: 500 });
  }
}