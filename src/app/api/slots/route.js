// /src/app/api/slots/route.js (Refactorizat cu Prisma)

import { NextResponse } from 'next/server';
import moment from 'moment';
import prisma from '../../../lib/prisma'; // Importăm clientul Prisma

// Durata fixă a serviciului pentru testare (ar trebui să vină din request)
const FIXED_SERVICE_DURATION = 60; // 60 minute

// Functie GET: Calculează sloturile libere folosind Prisma
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const dateString = searchParams.get('date');
    const staffId = searchParams.get('staffId');
    const salonId = searchParams.get('salonId'); // Adăugăm salonId ca parametru

    if (!dateString || !salonId) {
        return NextResponse.json({ message: 'Lipsesc parametrii obligatorii: date și salonId' }, { status: 400 });
    }

    try {
        // Preluăm detaliile salonului din baza de date
        const salonDetails = await prisma.salon.findUnique({
            where: { id: salonId },
        });

        if (!salonDetails) {
            return NextResponse.json({ message: 'Detaliile salonului nu au fost găsite' }, { status: 404 });
        }

        // Parsăm orarul din JSON
        const schedule = JSON.parse(salonDetails.scheduleJson || '{}');
        const dayOfWeek = moment(dateString).format('dddd').toLowerCase();
        const dailySchedule = schedule[dayOfWeek];

        if (!dailySchedule || !dailySchedule.open) {
            return NextResponse.json({ slots: [] }); // Închis în acea zi
        }

        // 1. Definim intervalul de lucru
        const startTime = moment(`${dateString} ${dailySchedule.start}`);
        const endTime = moment(`${dateString} ${dailySchedule.end}`);

        // 2. Extragem programările existente din baza de date
        const queryStartOfDay = moment(dateString).startOf('day').toDate();
        const queryEndOfDay = moment(dateString).endOf('day').toDate();

        const appointmentFilter = {
            salonId: salonId,
            start: { gte: queryStartOfDay },
            end: { lte: queryEndOfDay },
        };

        // Adaugă filtru de staff dacă este specificat și nu este 'all'
        if (staffId && staffId !== 'all') {
            appointmentFilter.staffId = staffId;
        }

        const existingAppointments = await prisma.appointment.findMany({
            where: appointmentFilter,
        });

        // 3. Generăm sloturile disponibile
        let currentTime = moment(startTime);
        const availableSlots = [];

        while (currentTime.isBefore(endTime)) {
            const slotEnd = moment(currentTime).add(FIXED_SERVICE_DURATION, 'minutes');

            const isBooked = existingAppointments.some(app => {
                const appStart = moment(app.start);
                const appEnd = moment(app.end);
                // Verifică suprapunerea
                return currentTime.isBefore(appEnd) && slotEnd.isAfter(appStart);
            });

            if (slotEnd.isSameOrBefore(endTime) && !isBooked) {
                availableSlots.push(currentTime.format('HH:mm'));
            }

            // Treci la următorul slot. Aici folosim durata serviciului, nu `slotEnd`.
            currentTime.add(FIXED_SERVICE_DURATION, 'minutes');
        }

        // 4. Returnăm sloturile
        return NextResponse.json({ slots: availableSlots });

    } catch (error) {
        console.error("Eroare la calcularea sloturilor:", error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: "Format invalid pentru orar în baza de date." }, { status: 500 });
        }
        return NextResponse.json({ message: "Eroare internă a serverului." }, { status: 500 });
    }
}

