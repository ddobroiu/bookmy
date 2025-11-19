// src/lib/session.ts
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';
import { SESSION_COOKIE_NAME } from '@/config';

// Verificăm dacă secretul de sesiune este setat
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('Variabila de mediu SESSION_SECRET nu este setată corect. Trebuie să aibă cel puțin 32 de caractere.');
}

export interface SessionData {
  userId?: string;
  role?: Role; // Use the Prisma Role enum
  salonSetup?: boolean;
  isLoggedIn: boolean;
  // Alte câmpuri opționale dacă sunt necesare (ex: email)
  email?: string;
  salonId?: string;
}

// MODIFICARE AICI: Adăugat 'export' pentru ca middleware.js să o poată folosi
export const sessionOptions = {
  password: process.env.SESSION_SECRET.padEnd(32, 'x'), // asigură minim 32 caractere
  cookieName: SESSION_COOKIE_NAME, // Numele cookie-ului criptat
  cookieOptions: {
    // Setează secure: true în producție pentru a trimite cookie-ul doar prin HTTPS
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Previne accesul la cookie prin JavaScript-ul din browser
  },
};

/**
 * Funcție ajutătoare pentru a obține sesiunea curentă în componente de server sau rute API.
 * @returns {Promise<IronSession<SessionData>>}
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  // Next.js 15/16: cookies() este Promise, trebuie await
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}