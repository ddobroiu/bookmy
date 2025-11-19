// /src/app/api/slots/route.js (ACTUALIZAT PENTRU TURE ȘI PAUZE)

import { NextResponse } from 'next/server';
import moment from 'moment';
import prisma from '@/lib/prisma';

const FIXED_SERVICE_DURATION = 60; // Default fallback

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const dateString = searchParams.get('date');
    const staffId = searchParams.get('staffId');
    const salonId = searchParams.get('salonId');
    const serviceId = searchParams.get('serviceId');

    if (!dateString || !salonId || !staffId) {
        return NextResponse.json({ message: 'Date incomplete' }, { status: 400 });
    }

    try {
        // 1. Obținem durata serviciului (dacă e selectat)
        let duration = FIXED_SERVICE_DURATION;
        if (serviceId) {
            const service = await prisma.service.findUnique({ where: { id: serviceId } });
            if (service) duration = service.duration;
        }

        // 2. Obținem datele Angajatului (inclusiv programul)
        const staffMember = await prisma.staff.findUnique({
            where: { id: staffId }
        });

        if (!staffMember) return NextResponse.json({ slots: [] });

        // Determinăm programul pentru ziua respectivă
        const dayOfWeek = moment(dateString).format('dddd').toLowerCase();
        // Parsăm schedule-ul din JSON (Prisma îl returnează direct ca obiect dacă e tip Json, dar uneori e string depinde de driver)
        // Pentru siguranță, verificăm tipul.
        let schedule = staffMember.schedule;
        if (typeof schedule === 'string') {
             try { schedule = JSON.parse(schedule); } catch(e) { schedule = {}; }
        }
        
        const dailySchedule = schedule?.[dayOfWeek];

        // Dacă nu are program definit sau e închis, returnăm gol
        if (!dailySchedule || !dailySchedule.open) {
            return NextResponse.json({ slots: [] });
        }

        // 3. Intervalul de lucru (Shift)
        const shiftStart = moment(`${dateString} ${dailySchedule.start}`, 'YYYY-MM-DD HH:mm');
        const shiftEnd = moment(`${dateString} ${dailySchedule.end}`, 'YYYY-MM-DD HH:mm');

        // 4. Programări existente în acea zi pentru acel angajat
        const existingAppointments = await prisma.appointment.findMany({
            where: {
                salonId: salonId,
                staffId: staffId,
                status: { not: 'CANCELLED' },
                start: { gte: moment(dateString).startOf('day').toDate() },
                end: { lte: moment(dateString).endOf('day').toDate() }
            }
        });

        // 5. Generare Sloturi
        let currentTime = moment(shiftStart);
        const availableSlots = [];

        while (currentTime.clone().add(duration, 'minutes').isSameOrBefore(shiftEnd)) {
            const slotStart = moment(currentTime);
            const slotEnd = slotStart.clone().add(duration, 'minutes');
            
            let isAvailable = true;

            // A. Verificăm suprapunerea cu Pauzele
            if (dailySchedule.breaks && Array.isArray(dailySchedule.breaks)) {
                for (const brk of dailySchedule.breaks) {
                    const breakStart = moment(`${dateString} ${brk.start}`, 'YYYY-MM-DD HH:mm');
                    const breakEnd = moment(`${dateString} ${brk.end}`, 'YYYY-MM-DD HH:mm');
                    
                    // Dacă slotul se intersectează cu pauza
                    if (slotStart.isBefore(breakEnd) && slotEnd.isAfter(breakStart)) {
                        isAvailable = false;
                        break;
                    }
                }
            }

            // B. Verificăm suprapunerea cu Rezervările
            if (isAvailable) {
                for (const app of existingAppointments) {
                    const appStart = moment(app.start);
                    const appEnd = moment(app.end);
                    
                    if (slotStart.isBefore(appEnd) && slotEnd.isAfter(appStart)) {
                        isAvailable = false;
                        break;
                    }
                }
            }

            if (isAvailable) {
                availableSlots.push(currentTime.format('HH:mm'));
            }

            // Avansăm cu durata serviciului (sau un pas mai mic, ex: 15 min, pentru flexibilitate)
            // Pentru Booksy-style, pasul de 30 min sau 15 min e standard. Aici folosim durata serviciului pentru simplitate.
            // Să zicem pas de 30 min pentru a oferi mai multe opțiuni de start.
            currentTime.add(30, 'minutes'); 
        }

        return NextResponse.json(availableSlots);

    } catch (error) {
        console.error("Slots Error:", error);
        return NextResponse.json({ message: 'Eroare server' }, { status: 500 });
    }
}