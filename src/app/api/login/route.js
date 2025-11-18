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
    const session = await getSession();
    session.user = {
        id: user.id,
        email: user.email, // Stocăm și email-ul pentru acces rapid
        role: user.role,
        salonSetup: user.salonSetup,
    };
    await session.save(); // Salvează datele în cookie-ul de sesiune criptat

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
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Eroare internă de server.' }, { status: 500 });
  }
}