// src/lib/session.js
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// Verificăm dacă secretul de sesiune este setat, pentru a preveni erorile
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('Variabila de mediu SESSION_SECRET nu este setată corect. Trebuie să aibă cel puțin 32 de caractere.');
}

/**
 * @typedef {object} SessionData
 * @property {string} [userId] - ID-ul utilizatorului autentificat.
 * @property {string} [role] - Rolul utilizatorului ('client' sau 'partner').
 * @property {boolean} [salonSetup] - Statusul de configurare a salonului pentru parteneri.
 * @property {boolean} [isLoggedIn] - Starea de autentificare.
 */

const sessionOptions = {
  password: process.env.SESSION_SECRET.padEnd(32, 'x'), // asigură minim 32 caractere
  cookieName: 'bookmy_session', // Numele cookie-ului criptat
  cookieOptions: {
    // Setează secure: true în producție pentru a trimite cookie-ul doar prin HTTPS
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Previne accesul la cookie prin JavaScript-ul din browser
  },
};

/**
 * Funcție ajutătoare pentru a obține sesiunea curentă în componente de server sau rute API.
 * @returns {Promise<import('iron-session').IronSession<SessionData>>}
 */
export async function getSession() {
  const session = await getIronSession({ cookies: cookies() }, sessionOptions); // compatibil Next.js 16
  return session;
}

// Modificare de test realizata de Gemini.
