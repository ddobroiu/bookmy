// src/lib/session.ts
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';
import { SESSION_COOKIE_NAME } from '@/config';

// Verificăm dacă secretul de sesiune este setat, pentru a preveni erorile
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('Variabila de mediu SESSION_SECRET nu este setată corect. Trebuie să aibă cel puțin 32 de caractere.');
}

export interface SessionData {
  userId?: string;
  role?: Role; // Use the Prisma Role enum
  salonSetup?: boolean;
  isLoggedIn: boolean;
}

const sessionOptions = {
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
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
