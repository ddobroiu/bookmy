// /src/app/api/register/route.js (COD COMPLET FINAL)

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// Calea corectă: 3 nivele sus pentru /src/db.js
import { usersDB } from '../../../db'; 

// ATENȚIE: Inlocuiește cu cheia ta API Resend (Resend API Key)
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Simulare: Verificare existență utilizator (folosind usersDB)
    if (usersDB.find(u => u.email === email)) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // 2. Simulare: Înregistrare
    usersDB.push({ email, password, role });
    
    // 3. Trimiterea Email-ului de Confirmare (Folosind Resend)
    const { error } = await resend.emails.send({
      from: 'BooksApp <onboarding@bookmy.ro>', // Adresa ta verificată Resend
      to: [email],
      subject: 'Bun venit la BooksApp!',
      html: `
        <h1>Bine ai venit, ${email}!</h1>
        <p>Contul tău a fost creat cu succes ca **${role.toUpperCase()}**.</p>
        <p>Te poți autentifica acum pe platforma noastră.</p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ message: 'User created, but email failed to send.' }, { status: 500 });
    }

    // 4. Răspuns de succes
    return NextResponse.json({ 
      message: 'User registered and welcome email sent!',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}