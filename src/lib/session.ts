// /src/lib/session.ts (COD ACTUALIZAT ȘI FIXAT PENTRU LOCALHOST)

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';
import { SESSION_COOKIE_NAME } from '@/config';

// Fallback pentru secret în development, ca să nu crape dacă lipsește din .env
const secret = process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long";

export interface SessionData {
  userId?: string;
  role?: Role; 
  salonSetup?: boolean;
  isLoggedIn: boolean;
  email?: string;
  salonId?: string;
}

// Configurația Sesiunii
export const sessionOptions = {
  password: secret,
  cookieName: SESSION_COOKIE_NAME || 'bookmy_session',
  cookieOptions: {
    // IMPORTANT: Setăm secure: false explicit dacă nu suntem în producție
    // Acest lucru permite cookie-ului să funcționeze pe http://localhost
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const, // 'lax' este necesar pentru navigarea normală
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // Sesiunea expiră în 7 zile
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}