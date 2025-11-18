// /src/app/api/register/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client'; // Importă enumul Role

// Inițializăm Resend cu cheia API din variabilele de mediu
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    
    // Validare input
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Lipsește email-ul, parola sau rolul.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Parola trebuie să aibă cel puțin 6 caractere.' }, { status: 400 });
    }

    // NOU: Validare și conversie corectă pentru enum
    let prismaRole;
    if (role && typeof role === 'string' && ['CLIENT', 'PARTENER'].includes(role.toUpperCase())) {
      prismaRole = role.toUpperCase();
    } else {
      return NextResponse.json({ message: 'Rol invalid.' }, { status: 400 });
    }
    
    // 1. Verificăm dacă utilizatorul există deja în baza de date
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Acest email este deja înregistrat.' }, { status: 409 });
    }

    // 2. Criptăm parola
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Creăm utilizatorul în baza de date
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash, // Salvăm parola criptată
        role: prismaRole, // Trimitem rolul ca string valid pentru enum
        salonSetup: prismaRole === 'PARTENER' ? false : true,
      },
    });
    
    // 4. Trimiterea Email-ului de Confirmare (Folosind Resend)
    try {
      await resend.emails.send({
        from: 'BooksApp <onboarding@bookmy.ro>', 
        to: [email],
        subject: 'Bun venit la BooksApp!',
        html: `
          <h1>Bine ai venit, ${email}!</h1>
          <p>Contul tău a fost creat cu succes ca **${prismaRole}**.</p>
          <p>Te poți autentifica acum pe platforma noastră.</p>
        `,
      });
    } catch (emailError) {
      console.error('Resend Error:', emailError);
      // Chiar dacă email-ul eșuează, înregistrarea este un succes.
      // Logăm eroarea dar continuăm.
    }

    return NextResponse.json({ 
      message: 'Înregistrare reușită! Verifică-ți emailul.',
      user: { id: user.id, email: user.email, role: user.role }, // Nu trimitem parola înapoi
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    // Verificăm dacă este o eroare cunoscută de la Prisma
    if (error.code) { // Prisma errors have codes
        return NextResponse.json({ message: `Eroare la scrierea în baza de date: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Eroare internă de server la înregistrare.' }, { status: 500 });
  }
}