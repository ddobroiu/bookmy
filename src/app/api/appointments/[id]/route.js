// src/app/api/appointments/[id]/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  const session = await getSession();
  const { id: appointmentId } = params;

  if (!session || !session.userId) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { salon: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Programarea nu a fost găsită' }, { status: 404 });
    }

    // Verifică dacă utilizatorul este clientul care a făcut programarea sau un partener al salonului
    const isClient = session.role === 'CLIENT' && appointment.clientId === session.userId;
    const isPartner = session.role === 'PARTENER' && appointment.salon.id === session.salonId;

    if (!isClient && !isPartner) {
      return NextResponse.json({ error: 'Nu aveți permisiunea să anulați această programare' }, { status: 403 });
    }

    // Regula de 24 de ore
    const now = new Date();
    const appointmentStart = new Date(appointment.start);
    const hoursDifference = (appointmentStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return NextResponse.json({ error: 'Programările nu pot fi anulate cu mai puțin de 24 de ore înainte.' }, { status: 400 });
    }

    // Anulează programarea
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Eroare la anularea programării:', error);
    return NextResponse.json({ error: 'Eroare la anularea programării' }, { status: 500 });
  }
}
