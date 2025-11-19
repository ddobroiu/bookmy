// middleware.js (Actualizat pentru a proteja profilul)
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './src/lib/session';

const PARTNER_PROTECTED_ROUTES = ['/dashboard'];
const ONBOARDING_ROUTE = '/dashboard/onboarding';
// Adăugăm rutele de client
const CLIENT_PROTECTED_ROUTES = ['/profil']; 

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const session = await getIronSession(request, NextResponse.next(), sessionOptions);
  
  const userRole = session.role;
  const isLoggedIn = session.isLoggedIn;

  // 1. Protecție Generală (Trebuie să fii logat pentru Dashboard sau Profil)
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/profil')) && !isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
  }

  // 2. Protecție Partener
  if (pathname.startsWith('/dashboard') && userRole !== 'PARTENER') {
      return NextResponse.redirect(new URL('/', request.url)); // Sau o pagină de eroare 403
  }

  // 3. Logica Onboarding Partener (neschimbată)
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTE);
  if (userRole === 'PARTENER' && !session.salonSetup && !isOnboardingRoute && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }
  
  if (userRole === 'PARTENER' && session.salonSetup && isOnboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Adăugăm /profil/:path* la matcher
  matcher: ['/dashboard/:path*', '/login', '/profil/:path*', '/inregistrare-afacere', '/inregistrare-client'], 
};