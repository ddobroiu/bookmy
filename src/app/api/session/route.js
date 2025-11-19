// src/app/api/session/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request) {
  try {
    const session = await getSession();

    // Returnează doar datele relevante pentru client
    return NextResponse.json({
      isLoggedIn: session.isLoggedIn || false,
      userId: session.userId || null,
      role: session.role || null,
      salonSetup: session.salonSetup || false,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ message: 'Failed to fetch session data.', details: String(error) }, { status: 500 });
  }
}
