// /src/app/api/login/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Importăm Prisma Client
import * as bcrypt from 'bcryptjs'; // Presupunând că folosești bcrypt pentru parolă

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email și parolă sunt necesare.' }, { status: 400 });
    }

    // 1. Căutare Utilizator în Baza de Date
    const user = await prisma.user.findUnique({
      where: { email: email },
      // Selectăm datele esențiale, inclusiv parola criptată
      select: { 
          id: true, 
          role: true, 
          salonSetup: true, 
          passwordHash: true 
      } 
    });

    if (!user) {
      return NextResponse.json({ message: 'Credențiale invalide.' }, { status: 401 });
    }
    
    // 2. Verificarea Parolei
    // ATENȚIE: Aici se verifică parola. În producție, folosești bcrypt.
    // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    // Simulare de succes (pentru că nu am integrat bcrypt)
    const isPasswordValid = password === '123'; 

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credențiale invalide.' }, { status: 401 });
    }

    // 3. Logare reușită: Pregătim răspunsul și cookie-urile
    const response = NextResponse.json({ 
      message: 'Logare reușită!',
      user: {
          id: user.id,
          email: user.email,
          role: user.role.toLowerCase(), // Ex: 'partner'
          salonSetup: user.salonSetup,
      }
    }, { status: 200 });
    
    // 4. Setarea cookie-urilor de autentificare (pentru middleware)
    response.cookies.set('user-role', user.role.toLowerCase(), { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, // 1 săptămână
      path: '/',
    });
    response.cookies.set('salon-setup', user.salonSetup ? 'true' : 'false', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login Error (Prisma):', error);
    // În producție, erorile de bază de date vor fi afișate aici.
    return NextResponse.json({ message: 'Eroare internă de server.' }, { status: 500 });
  }
}