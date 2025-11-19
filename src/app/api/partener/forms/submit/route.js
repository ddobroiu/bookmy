// /src/app/api/forms/submit/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// POST: Salvează răspunsurile clientului
export async function POST(request) {
  const session = await getSession();
  // Putem permite și guest submission dacă avem un token de securitate, dar acum cerem login
  if (!session?.userId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { appointmentId, formTemplateId, answers } = await request.json();

  try {
    // Verificăm dacă programarea aparține userului
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment || appointment.clientId !== session.userId) {
        return NextResponse.json({ error: 'Programare invalidă.' }, { status: 403 });
    }

    // Salvăm răspunsurile
    const submission = await prisma.formSubmission.create({
      data: {
        appointmentId,
        formTemplateId,
        clientId: session.userId,
        answers: JSON.stringify(answers) // Salvăm răspunsurile ca JSON
      }
    });

    return NextResponse.json({ success: true, id: submission.id });

  } catch (error) {
    console.error("Form Submit Error:", error);
    return NextResponse.json({ error: 'Eroare la trimitere.' }, { status: 500 });
  }
}