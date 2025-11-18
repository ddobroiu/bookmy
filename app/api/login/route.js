// /app/api/login/route.js (COD COMPLET ACTUALIZAT CU SALON STATUS)

import { NextResponse } from 'next/server';

// ATENȚIE: Simularea bazei de date. Am adăugat proprietatea 'salonSetup'.
const usersDB = [
    { email: 'client@test.com', password: '123', role: 'client', salonSetup: false },
    { email: 'partner@test.com', password: '123', role: 'partner', salonSetup: true }, // Partenerul existent are setup facut
    { email: 'newpartner@test.com', password: '123', role: 'partner', salonSetup: false }, // Partenerul nou trebuie sa faca setup
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = usersDB.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: {
          email: user.email,
          role: user.role,
          salonSetup: user.salonSetup, // TRIMITEM STAREA SALONULUI
      }
    }, { status: 200 });
    
    // Setăm cookie-ul 'user-role' și 'salon-setup' (ambele vizibile de middleware)
    response.cookies.set('user-role', user.role, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });
    // Setăm starea setup-ului în cookie
    response.cookies.set('salon-setup', user.salonSetup ? 'true' : 'false', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}