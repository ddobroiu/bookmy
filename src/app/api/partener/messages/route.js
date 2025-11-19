// /src/app/api/partner/messages/route.js (NOU)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET: Preluăm conversațiile salonului
export async function GET(request) {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const phone = searchParams.get('phone'); // Pentru WhatsApp

  try {
    // A. Dacă cerem mesajele unei singure conversații
    if (userId || phone) {
        const whereCondition = { 
            salonId: session.salonId,
            OR: []
        };
        
        if (userId) whereCondition.OR.push({ userId: userId });
        if (phone) whereCondition.OR.push({ guestPhone: phone });

        const messages = await prisma.message.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(messages);
    } 
    
    // B. Dacă cerem LISTA de conversații (Inbox)
    else {
        // Luăm toate mesajele salonului
        const allMessages = await prisma.message.findMany({
            where: { salonId: session.salonId },
            include: {
                user: { select: { name: true, avatarUrl: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Grupăm mesajele manual (Prisma groupBy e limitat la relații)
        const conversationsMap = new Map();

        for (const msg of allMessages) {
            // Cheia unică a conversației: UserId sau Telefon
            const key = msg.userId || msg.guestPhone || 'unknown';
            
            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, {
                    id: key, // ID-ul conversației
                    type: msg.guestPhone ? 'WHATSAPP' : 'WEB',
                    name: msg.user?.name || msg.guestName || msg.guestPhone || 'Vizitator',
                    info: msg.user?.email || msg.guestPhone,
                    avatar: msg.user?.avatarUrl,
                    lastMessage: msg.content,
                    lastMessageDate: msg.createdAt,
                    isRead: msg.isRead,
                    // Identificatori pentru a deschide chat-ul
                    userId: msg.userId,
                    guestPhone: msg.guestPhone
                });
            }
        }

        const conversations = Array.from(conversationsMap.values());
        return NextResponse.json(conversations);
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST: Partenerul răspunde
export async function POST(request) {
  const session = await getSession();
  if (!session?.salonId) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { userId, guestPhone, content } = await request.json();

  try {
    const newMessage = await prisma.message.create({
      data: {
        content,
        sender: 'PARTNER',
        salonId: session.salonId,
        userId: userId || null,
        guestPhone: guestPhone || null,
        isRead: true
      }
    });
    
    // TODO: Aici vom adăuga logica de trimitere pe WhatsApp dacă guestPhone există!
    // ex: if (guestPhone) sendToWhatsApp(guestPhone, content);

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare trimitere' }, { status: 500 });
  }
}