// /src/app/api/chat/route.js (ACTUALIZAT CU SALVARE ÎN DB)

import { NextResponse } from 'next/server';
import { processUserMessage } from '@/lib/ai-service';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { message, salonId, guestInfo } = await request.json();
        const session = await getSession();

        // 1. Identificăm utilizatorul
        const userId = session.userId || null;
        const guestName = !userId ? (guestInfo?.name || 'Vizitator Web') : null;
        const guestPhone = !userId ? (guestInfo?.phone || null) : null;

        // 2. Dacă suntem pe pagina unui salon, SALVĂM mesajul clientului în DB
        if (salonId) {
            await prisma.message.create({
                data: {
                    content: message,
                    sender: 'CLIENT',
                    salonId: salonId,
                    userId: userId,
                    guestName: guestName,
                    guestPhone: guestPhone,
                    isRead: false
                }
            });
        }

        // 3. Procesăm mesajul cu AI-ul
        const context = {
            userId: userId,
            userName: session.user?.name || guestName,
            salonId: salonId
        };
        
        const aiResponse = await processUserMessage(message, context);

        // 4. Dacă suntem pe pagina unui salon, SALVĂM și răspunsul AI-ului
        if (salonId) {
            await prisma.message.create({
                data: {
                    content: aiResponse.text,
                    sender: 'AI', // Marcat ca AI ca să știe partenerul că a răspuns robotul
                    salonId: salonId,
                    userId: userId,
                    guestName: guestName,
                    guestPhone: guestPhone,
                    isRead: true 
                }
            });
        }

        return NextResponse.json(aiResponse);

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ text: "Eroare conexiune." }, { status: 500 });
    }
}