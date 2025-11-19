// /src/app/api/booking/route.js (COD COMPLET FINAL)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import moment from 'moment';
import { Resend } from 'resend';
import { getSession } from '@/lib/session';

const resend = new Resend(process.env.RESEND_API_KEY);
// Costul pentru o notificare "Premium" (SMS/Wapp)
const NOTIFICATION_COST = 1; 

export async function POST(request) {
    try {
        const session = await getSession();
        const body = await request.json();
        
        const { 
            service, 
            staff, 
            date, 
            time, 
            clientName, 
            clientPhone, 
            salonId
        } = body;

        const paymentMethod = 'CASH'; 

        // 1. VALIDĂRI DE BAZĂ
        if (!service || !date || !time || !salonId) {
            return NextResponse.json({ message: 'Date incomplete.' }, { status: 400 });
        }

        if (!session.userId) {
             return NextResponse.json({ message: 'Te rugăm să te autentifici.' }, { status: 401 });
        }

        // 2. VERIFICARE ABONAMENT SALON (KILL SWITCH)
        const salon = await prisma.salon.findUnique({ where: { id: salonId } });
        
        if (!salon) {
            return NextResponse.json({ message: 'Salon inexistent.' }, { status: 404 });
        }

        // Dacă abonamentul nu este ACTIVE sau TRIAL, blocăm rezervarea
        const isSubscriptionActive = ['ACTIVE', 'TRIAL'].includes(salon.subscriptionStatus);
        if (!isSubscriptionActive) {
            return NextResponse.json({ 
                message: 'Acest salon nu acceptă programări momentan (Abonament inactiv).' 
            }, { status: 403 });
        }

        // 3. VERIFICARE DISPONIBILITATE (CALENDAR)
        const appointmentStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();
        const appointmentEnd = moment(appointmentStart).add(service.duration, 'minutes').toDate();

        const conflict = await prisma.appointment.findFirst({
            where: {
                staffId: staff.id,
                status: { not: 'CANCELLED' },
                OR: [
                    { start: { lt: appointmentEnd }, end: { gt: appointmentStart } }
                ]
            }
        });

        if (conflict) {
            return NextResponse.json({ message: 'Intervalul orar este deja ocupat.' }, { status: 409 });
        }

        // 4. DETERMINARE STATUS (Aprobare Manuală vs Automată)
        // Luăm datele proaspete pentru a verifica setările
        const dbService = await prisma.service.findUnique({ where: { id: service.id } });
        
        let initialStatus = 'CONFIRMED';
        
        // Dacă Salonul cere aprobare globală SAU Serviciul cere aprobare specifică
        if (!salon.autoApprove || (dbService && dbService.requiresApproval)) {
            initialStatus = 'PENDING';
        }

        // 5. CREARE PROGRAMARE ÎN DB
        const newAppointment = await prisma.appointment.create({
            data: {
                start: appointmentStart,
                end: appointmentEnd,
                title: `${service.name} - ${clientName}`,
                price: parseFloat(service.price),
                status: initialStatus,
                clientId: session.userId,
                salonId: salonId,
                staffId: staff.id,
                serviceId: service.id,
                clientName,
                clientPhone,
                paymentStatus: 'UNPAID',
                paymentMethod: paymentMethod
            },
            include: { salon: true, staff: true }
        });

        // 6. LOGICA DE NOTIFICARE & TAXARE CREDITE
        
        // A. Determinăm destinatarii interni (Cine primește notificarea?)
        // Luăm datele angajatului pentru a vedea preferința de contact
        const staffMember = await prisma.staff.findUnique({ where: { id: staff.id } });
        let internalRecipients = [];
        
        if (staffMember.useSalonContact) {
            // Centralizat: Trimitem la recepție
            if (salon.notificationEmail) internalRecipients.push(salon.notificationEmail);
            else {
                // Fallback: Proprietar
                const owner = await prisma.user.findUnique({ where: { id: salon.ownerId } });
                if (owner?.email) internalRecipients.push(owner.email);
            }
        } else {
            // Individual: Trimitem la angajat
            if (staffMember.email) internalRecipients.push(staffMember.email);
        }

        // B. Verificăm Creditele pentru Notificări Premium (SMS/Wapp)
        // Momentan simulăm doar partea de email, dar pregătim logica de scădere credite
        let creditsToDeduct = 0;
        const hasCredits = salon.credits >= NOTIFICATION_COST;
        
        // Dacă am avea integrare SMS activă și salonul are credite și telefon setat:
        // if (hasCredits && salon.notificationPhone) { ... sendSMS(); creditsToDeduct += NOTIFICATION_COST; }

        // C. Trimitere Email-uri (Gratuit - Inclus)
        
        // Email către Salon/Staff (Important dacă e PENDING)
        if (internalRecipients.length > 0) {
            const subject = initialStatus === 'PENDING' 
                ? `🔔 Aprobare Necesară: ${clientName}` 
                : `📅 Rezervare Nouă: ${clientName}`;
            
            const actionText = initialStatus === 'PENDING' ? 'Trebuie să aprobi manual această cerere.' : 'Programarea a fost confirmată automat.';

            await resend.emails.send({
                from: 'BooksApp Admin <admin@bookmy.ro>',
                to: internalRecipients,
                subject: subject,
                html: `
                    <div style="font-family: sans-serif;">
                        <h2>${subject}</h2>
                        <p><strong>Client:</strong> ${clientName} (${clientPhone})</p>
                        <p><strong>Serviciu:</strong> ${service.name}</p>
                        <p><strong>Când:</strong> ${moment(appointmentStart).format('DD MMMM, HH:mm')}</p>
                        <p><strong>Angajat:</strong> ${staffMember.name}</p>
                        <hr/>
                        <p>${actionText}</p>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/calendar" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vezi în Calendar</a>
                    </div>
                `
            });
        }

        // Email către Client
        if (session.email) {
             if (initialStatus === 'PENDING') {
                await resend.emails.send({
                    from: 'BooksApp <rezervari@bookmy.ro>',
                    to: [session.email],
                    subject: `Cerere Trimisă: ${service.name}`,
                    html: `
                        <p>Salut ${clientName},</p>
                        <p>Cererea ta este în așteptare. Vei primi o notificare imediat ce salonul confirmă disponibilitatea.</p>
                    `
                });
             } else {
                await resend.emails.send({
                    from: 'BooksApp <rezervari@bookmy.ro>',
                    to: [session.email],
                    subject: `Rezervare Confirmată: ${service.name}`,
                    html: `
                        <div style="font-family: sans-serif;">
                            <h2 style="color: #1aa858;">Rezervare Confirmată! ✅</h2>
                            <p>Te așteptăm la <strong>${salon.name}</strong> pe ${moment(appointmentStart).format('DD/MM/YYYY HH:mm')}.</p>
                            <p style="color: #666; font-size: 12px;">Plata se face la locație.</p>
                        </div>
                    `
                });
             }
        }

        // 7. ACTUALIZARE BALANȚĂ (Dacă s-au consumat credite pentru SMS)
        if (creditsToDeduct > 0) {
            await prisma.salon.update({
                where: { id: salonId },
                data: { 
                    credits: { decrement: creditsToDeduct } 
                }
            });
        }

        return NextResponse.json({ success: true, appointmentId: newAppointment.id, status: initialStatus }, { status: 201 });

    } catch (error) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ message: 'Eroare internă server.' }, { status: 500 });
    }
}