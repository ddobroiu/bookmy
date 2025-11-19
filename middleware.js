// middleware.js (COD COMPLET ACTUALIZAT)

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './src/lib/session';

const ONBOARDING_ROUTE = '/dashboard/onboarding';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  const session = await getIronSession(request, response, sessionOptions);
  
  const userRole = session.role;
  const isLoggedIn = session.isLoggedIn;

  // 1. Protecție Rute Admin (NOU)
  if (pathname.startsWith('/admin')) {
      if (!isLoggedIn || userRole !== 'ADMIN') {
          // Dacă nu e admin, îl trimitem la login sau home
          return NextResponse.redirect(new URL('/login', request.url));
      }
  }

  // 2. Protecție Generală (Dashboard / Profil)
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/profil')) && !isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
  }

  // 3. Protecție Partener (Nu lăsăm clienții în dashboard)
  if (pathname.startsWith('/dashboard') && userRole !== 'PARTNER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/profil', request.url));
  }

  // 4. Logica Onboarding Partener
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTE);
  if (userRole === 'PARTNER' && !session.salonSetup && !isOnboardingRoute && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }
  
  if (userRole === 'PARTNER' && session.salonSetup && isOnboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
      '/dashboard/:path*', 
      '/login', 
      '/profil/:path*', 
      '/admin/:path*', // Adăugăm admin la matcher
      '/inregistrare-afacere', 
      '/inregistrare-client'
  ], 
};