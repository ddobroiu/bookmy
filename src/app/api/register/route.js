// /src/app/api/register/route.js (COD COMPLET FINAL)

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// SIMULARE DATE: Mutăm baza de date a utilizatorilor aici
const usersDB = []; 

// ATENȚIE: Inlocuiește cu cheia ta API Resend (Resend API Key)
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Lipsește email-ul, parola sau rolul.' }, { status: 400 });
    }

    // 1. Simulare: Verifică existența utilizatorului
    if (usersDB.find(u => u.email === email)) {
      return NextResponse.json({ message: 'Acest email este deja înregistrat.' }, { status: 409 });
    }

    // 2. Simulare: Înregistrare (fără criptare)
    usersDB.push({ email: email, password: password, role: role, salonSetup: role === 'partner' ? false : true });
    
    // 3. Trimiterea Email-ului de Confirmare (Folosind Resend)
    const { error } = await resend.emails.send({
      from: 'BooksApp <onboarding@bookmy.ro>', 
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
      return NextResponse.json({ message: 'Înregistrare reușită, dar emailul de confirmare nu a putut fi trimis.' }, { status: 201 });
    }

    return NextResponse.json({ 
      message: 'Înregistrare reușită! Verifică-ți emailul.',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Eroare internă de server la înregistrare.' }, { status: 500 });
  }
}