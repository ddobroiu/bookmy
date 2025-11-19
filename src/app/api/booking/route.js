// /src/app/api/booking/route.js (ACTUALIZAT - FĂRĂ PROCESARE PLATĂ)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import moment from 'moment';
import { Resend } from 'resend';
import { getSession } from '@/lib/session';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        if (!service || !date || !time || !salonId) {
            return NextResponse.json({ message: 'Date incomplete.' }, { status: 400 });
        }

        // 1. Verificări disponibilitate
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
            return NextResponse.json({ message: 'Acest interval nu mai este disponibil.' }, { status: 409 });
        }

        // 2. Creare Programare (Implicit UNPAID)
        // Dacă userul nu e logat, teoretic ar trebui blocat sau gestionat guest (aici cerem login)
        if (!session.userId) {
             return NextResponse.json({ message: 'Te rugăm să te autentifici.' }, { status: 401 });
        }

        const newAppointment = await prisma.appointment.create({
            data: {
                start: appointmentStart,
                end: appointmentEnd,
                title: `${service.name} - ${clientName}`,
                price: parseFloat(service.price),
                
                // --- SETĂRI FIXE PENTRU PLATA LA LOCAȚIE ---
                paymentStatus: 'UNPAID',
                paymentMethod: 'CASH',
                status: 'CONFIRMED', // Confirmăm rezervarea ca să apară în calendar
                // --------------------------------------------
                
                clientId: session.userId,
                salonId: salonId,
                staffId: staff.id,
                clientName,
                clientPhone
            },
            include: {
                salon: true,
                staff: true
            }
        });

        // 3. Email Confirmare (Adaptat pentru plată la locație)
        if (session.email) {
            try {
                await resend.emails.send({
                    from: 'BooksApp <rezervari@bookmy.ro>',
                    to: [session.email],
                    subject: `Rezervare Confirmată: ${service.name}`,
                    html: `
                        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
                            <h2 style="color: #007bff;">Rezervare Confirmată! ✅</h2>
                            <p>Salut ${clientName}, te așteptăm la <strong>${newAppointment.salon.name}</strong>.</p>
                            
                            <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; background: #fafafa; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Serviciu:</strong> ${service.name}</p>
                                <p style="margin: 5px 0;"><strong>Data:</strong> ${moment(appointmentStart).format('DD MMMM YYYY, HH:mm')}</p>
                                <p style="margin: 5px 0;"><strong>Specialist:</strong> ${newAppointment.staff.name}</p>
                                <p style="margin: 5px 0; font-size: 16px;"><strong>De plată:</strong> <span style="color: #007bff; font-weight: bold;">${service.price} RON</span></p>
                                <p style="margin: 5px 0; color: #e67e22; font-size: 13px;">*Plata se efectuează la recepție.</p>
                            </div>

                            <p style="font-size: 12px; color: #888;">Locație: ${newAppointment.salon.address}</p>
                        </div>
                    `
                });
            } catch (emailErr) {
                console.error("Eroare email:", emailErr);
            }
        }

        return NextResponse.json({ success: true, appointmentId: newAppointment.id }, { status: 201 });

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json({ message: 'Eroare server.' }, { status: 500 });
    }
}