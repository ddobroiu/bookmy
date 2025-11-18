// /src/app/api/register/route.js (COD COMPLET FINAL CU BCRYPT & PRISMA)

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as bcrypt from 'bcryptjs'; // Import NOU
import prisma from '@/lib/prisma'; // Import NOU

// ATENȚIE: Inlocuiește cu cheia ta API Resend (Resend API Key)
const resend = new Resend(process.env.RESEND_API_KEY); 
const SALT_ROUNDS = 10; // Nivel standard de criptare

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Lipsește email-ul, parola sau rolul.' }, { status: 400 });
    }

    // 1. Verifică existența utilizatorului
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Acest email este deja înregistrat.' }, { status: 409 });
    }
    
    // 2. Criptarea Parolei
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Înregistrarea Utilizatorului în DB (Prisma)
    const newUser = await prisma.user.create({
        data: {
            email: email,
            passwordHash: passwordHash,
            role: role === 'partner' ? 'PARTNER' : 'CLIENT', // Conversie la ENUM din schema.prisma
            salonSetup: role === 'partner' ? false : true, // Partenerii trebuie să facă onboarding
        }
    });

    // 4. Trimiterea Email-ului de Confirmare (Folosind Resend)
    const { error } = await resend.emails.send({
      from: 'BooksApp <onboarding@bookmy.ro>', 
      to: [email],
      subject: 'Bun venit la BooksApp!',
      html: `
        <h1>Bine ai venit, ${newUser.email}!</h1>
        <p>Contul tău a fost creat cu succes ca **${newUser.role}**.</p>
        <p>Te poți autentifica acum pe platforma noastră.</p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      // Notificăm utilizatorul de succes, chiar dacă emailul a eșuat
      return NextResponse.json({ 
          message: 'Înregistrare reușită, dar emailul de confirmare nu a putut fi trimis.' 
      }, { status: 201 });
    }

    return NextResponse.json({ 
      message: 'Înregistrare reușită! Verifică-ți emailul.',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error (Prisma):', error);
    return NextResponse.json({ message: 'Eroare internă de server la înregistrare.' }, { status: 500 });
  }
}