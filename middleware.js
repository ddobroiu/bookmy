// /middleware.js (COD COMPLET ACTUALIZAT CU LOGICA DE ONBOARDING)
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './src/lib/session'; // Importă sessionOptions

// Rutele protejate:
const PARTNER_PROTECTED_ROUTES = ['/dashboard'];
const ONBOARDING_ROUTE = '/dashboard/onboarding';

export async function middleware(request) { // Adaugă 'async' aici
  const pathname = request.nextUrl.pathname;

  // Citim sesiunea folosind iron-session
  const session = await getIronSession(request, NextResponse.next(), sessionOptions);

  const userRole = session.role;
  const salonSetup = session.salonSetup;

  // Logica 1: Verificare Autentificare și Rol (Logică anterioară)
  const isPartnerRoute = PARTNER_PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isPartnerRoute) {
    if (userRole !== 'PARTENER') { // Folosește 'PARTENER' conform enum-ului Prisma
      // Redirecționează la logare dacă nu este partener
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); 
      return NextResponse.redirect(loginUrl);
    }
  }

  // Logica 2: Redirecționare Onboarding
  const isDashboardRoot = pathname === '/dashboard' || pathname === '/dashboard/';
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTE);

  // Daca e partener si nu a facut setup, trebuie sa mearga la onboarding
  if (userRole === 'PARTENER' && !salonSetup && !isOnboardingRoute) {
    // Redirecționăm partenerul nou la pagina de setup
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }
  
  // Daca e partener si A FACUT setup, dar incearca sa acceseze /onboarding, il trimitem la /dashboard
  if (userRole === 'PARTENER' && salonSetup && isOnboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Permitem accesul
  return NextResponse.next();
}

export const config = {
  // Verifică toate rutele relevante (inclusiv dashboard, login, și onboading)
  matcher: ['/dashboard/:path*', '/login', '/inregistrare-afacere', '/inregistrare-client'], 
};