// /src/app/api/register/route.js (COD COMPLET FINAL)

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// CORECTAT: Folosim alias-ul @/
import { usersDB } from '@/db'; 

const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (usersDB.find(u => u.email === email)) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    usersDB.push({ email, password, role });
    
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

    return NextResponse.json({ 
      message: 'User registered and welcome email sent!',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}