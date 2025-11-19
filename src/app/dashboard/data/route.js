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
        const { service, staff, date, time, clientName, clientPhone, salonId } = body;

        if (!service || !date || !time || !salonId) return NextResponse.json({ message: 'Date incomplete.' }, { status: 400 });

        const appointmentStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();
        const appointmentEnd = moment(appointmentStart).add(service.duration, 'minutes').toDate();

        const conflict = await prisma.appointment.findFirst({
            where: {
                staffId: staff.id,
                status: { not: 'CANCELLED' },
                OR: [{ start: { lt: appointmentEnd }, end: { gt: appointmentStart } }]
            }
        });

        if (conflict) return NextResponse.json({ message: 'Interval ocupat.' }, { status: 409 });
        if (!session.userId) return NextResponse.json({ message: 'Te rugăm să te autentifici.' }, { status: 401 });

        // 1. Verificăm politica de aprobare a salonului
        const salon = await prisma.salon.findUnique({ where: { id: salonId } });
        const staffMember = await prisma.staff.findUnique({ where: { id: staff.id } });
        
        // Dacă autoApprove e true, statusul e CONFIRMED. Dacă e false, e PENDING.
        const initialStatus = salon.autoApprove ? 'CONFIRMED' : 'PENDING';

        const newAppointment = await prisma.appointment.create({
            data: {
                start: appointmentStart,
                end: appointmentEnd,
                title: `${service.name} - ${clientName}`,
                price: parseFloat(service.price),
                paymentStatus: 'UNPAID',
                status: initialStatus,
                clientId: session.userId,
                salonId: salonId,
                staffId: staff.id,
                clientName,
                clientPhone
            },
            include: { salon: true, staff: true }
        });

        // 2. Notificări
        if (initialStatus === 'CONFIRMED') {
            // Flux standard: Confirmare directă
            if (session.email) {
                await resend.emails.send({
                    from: 'BooksApp <rezervari@bookmy.ro>',
                    to: [session.email],
                    subject: `Rezervare Confirmată: ${service.name}`,
                    html: `<p>Rezervare confirmată pentru ${moment(appointmentStart).format('DD/MM/YYYY HH:mm')}.</p>`
                });
            }
        } else {
            // Flux Aprobare: Notificăm Angajatul sau Salonul
            const notifyEmail = staffMember?.email || (await prisma.user.findUnique({ where: { id: salon.ownerId } }))?.email;
            
            if (notifyEmail) {
                await resend.emails.send({
                    from: 'BooksApp Admin <admin@bookmy.ro>',
                    to: [notifyEmail],
                    subject: `🔔 Cerere Nouă: ${service.name}`,
                    html: `
                        <h2>Ai o cerere nouă de la ${clientName}!</h2>
                        <p><strong>Dată:</strong> ${moment(appointmentStart).format('DD MMMM HH:mm')}</p>
                        <p>Te rugăm să intri în Dashboard pentru a Aproba sau Refuza.</p>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/calendar">Mergi la Calendar</a>
                    `
                });
            }

            if (session.email) {
                await resend.emails.send({
                    from: 'BooksApp <rezervari@bookmy.ro>',
                    to: [session.email],
                    subject: `Cerere Trimisă: ${service.name}`,
                    html: `<p>Cererea ta este în așteptare. Vei primi o notificare când salonul confirmă.</p>`
                });
            }
        }

        return NextResponse.json({ success: true, appointmentId: newAppointment.id }, { status: 201 });

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json({ message: 'Eroare server.' }, { status: 500 });
    }
}