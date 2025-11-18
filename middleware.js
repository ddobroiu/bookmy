// /middleware.js (COD COMPLET ACTUALIZAT CU LOGICA DE ONBOARDING)
import { NextResponse } from 'next/server';

// Rutele protejate:
const PARTNER_PROTECTED_ROUTES = ['/dashboard'];
const ONBOARDING_ROUTE = '/dashboard/onboarding';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Citim cookie-urile
  const userRole = request.cookies.get('user-role')?.value;
  const salonSetup = request.cookies.get('salon-setup')?.value === 'true'; // Convertim string la boolean

  // Logica 1: Verificare Autentificare și Rol (Logică anterioară)
  const isPartnerRoute = PARTNER_PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isPartnerRoute) {
    if (userRole !== 'partner') {
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
  if (userRole === 'partner' && !salonSetup && !isOnboardingRoute) {
    // Redirecționăm partenerul nou la pagina de setup
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }
  
  // Daca e partener si A FACUT setup, dar incearca sa acceseze /onboarding, il trimitem la /dashboard
  if (userRole === 'partner' && salonSetup && isOnboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Permitem accesul
  return NextResponse.next();
}

export const config = {
  // Verifică toate rutele relevante (inclusiv dashboard, login, și onboading)
  matcher: ['/dashboard/:path*', '/login', '/inregistrare-afacere', '/inregistrare-client'], 
};