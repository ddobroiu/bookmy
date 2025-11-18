// /app/api/logout/route.js (COD COMPLET)

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  
  // Ștergem ambele cookie-uri esențiale setându-le ca expirate
  response.cookies.set('user-role', '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 0, 
    path: '/',
  });
  response.cookies.set('salon-setup', '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 0, 
    path: '/',
  });

  return response;
}