// /src/app/api/register/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client'; // Importă enumul Role
import { z } from 'zod'; // Import Zod

import logger from '@/lib/logger';
import { ONBOARDING_EMAIL_FROM } from '@/config';

// Define Zod schema for registration input
const registerSchema = z.object({
  email: z.string().email('Adresa de email este invalidă.'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere.'),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Rol invalid.' }),
  }),
});

// Inițializăm Resend cu cheia API din variabilele de mediu
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input using Zod
    const { email, password, role } = registerSchema.parse(body);
    
    // 1. Verificăm dacă utilizatorul există deja în baza de date
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      logger.info(`Registration attempt for existing email: ${email}`);
      return NextResponse.json({ message: 'Acest email este deja înregistrat.' }, { status: 409 });
    }

    // 2. Criptăm parola
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Creăm utilizatorul în baza de date
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash, // Salvăm parola criptată
        role: role, // Trimitem rolul ca string valid pentru enum
        salonSetup: role === 'PARTENER' ? false : true,
      },
    });
    
    // 4. Trimiterea Email-ului de Confirmare (Folosind Resend)
    try {
      await resend.emails.send({
        from: ONBOARDING_EMAIL_FROM, 
        to: [email],
        subject: 'Bun venit la BooksApp!',
        html: `
          <h1>Bine ai venit, ${email}!</h1>
          <p>Contul tău a fost creat cu succes ca **${role}**.</p>
          <p>Te poți autentifica acum pe platforma noastră.</p>
        `,
      });
    } catch (emailError) {
      logger.error('Resend Error:', emailError);
      // Chiar dacă email-ul eșuează, înregistrarea este un succes.
      // Logăm eroarea dar continuăm.
    }

    logger.info(`User registered successfully: ${user.email}, Role: ${user.role}`);
    return NextResponse.json({ 
      message: 'Înregistrare reușită! Verifică-ți emailul.',
      user: { id: user.id, email: user.email, role: user.role }, // Nu trimitem parola înapoi
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error during registration:', error.errors);
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    logger.error('Registration Error:', error);
    // Verificăm dacă este o eroare cunoscută de la Prisma
    if (error.code) { // Prisma errors have codes
        return NextResponse.json({ message: `Eroare la scrierea în baza de date: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Eroare internă de server la înregistrare.' }, { status: 500 });
  }
}