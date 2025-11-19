// /src/app/api/chat/route.js (FINAL)

import { NextResponse } from 'next/server';
import { processUserMessage } from '@/lib/ai-service';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

// 1 Credit per discuție
const WHATSAPP_SESSION_COST = 1; 

export async function POST(request) {
    try {
        const body = await request.json();
        const { message, guestInfo } = body;
        const session = await getSession();

        let phone = guestInfo?.phone || session.user?.phoneNumber || 'web-guest';
        if (phone === 'web-guest' && session.userId) {
            const u = await prisma.user.findUnique({ where: { id: session.userId } });
            if (u?.phoneNumber) phone = u.phoneNumber;
        }

        // 1. Încărcare Stare
        let conversationState = null;
        if (phone !== 'web-guest') {
            conversationState = await prisma.conversationState.findUnique({ where: { phoneNumber: phone } });
        }

        const context = {
            phone,
            currentSalonId: conversationState?.currentSalonId || null,
            userName: session.user?.name || guestInfo?.name
        };

        // 2. Procesare AI
        const aiResponse = await processUserMessage(message, context);

        // 3. LOGICA DE ACCES ȘI TAXARE (La intrarea în salon)
        if (aiResponse.action === 'ENTER_SALON' && aiResponse.targetSalonId) {
            
            const targetSalon = await prisma.salon.findUnique({ 
                where: { id: aiResponse.targetSalonId } 
            });

            // A. Verificare STATUS ABONAMENT (Blocare Totală)
            if (targetSalon.subscriptionStatus === 'PAST_DUE' || targetSalon.subscriptionStatus === 'CANCELLED') {
                return NextResponse.json({ 
                    text: `Ne pare rău, dar **${targetSalon.name}** nu este disponibil momentan pe platformă.`
                });
            }

            // B. Verificare CREDITE (Blocare Parțială - doar Chat)
            // Doar dacă e pe WhatsApp (phone real), pe web e gratis ca să îi agățăm
            if (phone !== 'web-guest' && targetSalon.credits < WHATSAPP_SESSION_COST) {
                return NextResponse.json({ 
                    text: `**${targetSalon.name}** nu poate prelua mesaje momentan prin WhatsApp. Te rugăm să îi contactezi telefonic la ${targetSalon.phone} sau să rezervi pe site.`
                });
            }

            // C. Taxare
            if (phone !== 'web-guest') {
                await prisma.salon.update({
                    where: { id: aiResponse.targetSalonId },
                    data: { credits: { decrement: WHATSAPP_SESSION_COST } }
                });

                await prisma.conversationState.upsert({
                    where: { phoneNumber: phone },
                    update: { currentSalonId: aiResponse.targetSalonId, lastActive: new Date() },
                    create: { phoneNumber: phone, currentSalonId: aiResponse.targetSalonId }
                });
            }
        }

        // ... (Cod ieșire salon și salvare mesaje - neschimbat) ...
        // Copiază restul logicii de salvare a mesajelor din versiunea anterioară a acestui fișier
        
        return NextResponse.json(aiResponse);

    } catch (error) {
        return NextResponse.json({ text: "Eroare sistem." }, { status: 500 });
    }
}