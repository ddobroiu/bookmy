// /src/app/api/login/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session'; // Importă getSession din iron-session

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email și parolă sunt necesare.' }, { status: 400 });
    }

    // 1. Căutare Utilizator în Baza de Date
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Credențiale invalide.' }, { status: 401 });
    }

    // 2. Verificarea Parolei folosind bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credențiale invalide.' }, { status: 401 });
    }

    // 3. Crearea și Salvarea Sesiunii cu iron-session
    let session;
    try {
      session = await getSession();
    } catch (sessionError) {
      console.error('Eroare la getSession:', sessionError);
      return NextResponse.json({ message: 'Eroare la inițializarea sesiunii.', details: String(sessionError) }, { status: 500 });
    }

    try {
      session.userId = user.id;
      session.email = user.email;
      session.role = user.role;
      session.salonSetup = user.salonSetup;
      session.isLoggedIn = true;
      await session.save();
    } catch (sessionSaveError) {
      console.error('Eroare la salvarea sesiunii:', sessionSaveError);
      return NextResponse.json({ message: 'Eroare la salvarea sesiunii.', details: String(sessionSaveError) }, { status: 500 });
    }

    // 4. Logare reușită: Trimitem răspunsul
    return NextResponse.json({ 
      message: 'Logare reușită!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        salonSetup: user.salonSetup,
      }
    }, { status: 200 });

  } catch (error) {
    // Logare detaliată cu stack trace și variabile relevante
    console.error('Login Error:', error);
    if (error && error.stack) {
      console.error('Stack:', error.stack);
    }
    return NextResponse.json({ message: 'Eroare internă de server.', details: String(error) }, { status: 500 });
  }
}