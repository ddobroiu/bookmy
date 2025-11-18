// /src/app/api/salon/route.js (COD FINAL)

import { NextResponse } from 'next/server';
// CORECTAT: Ieși din /salon, /api, /app (3 nivele)
import { getSalonDetails, findSalonServices } from '../../../db'; 

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ message: "Slug missing" }, { status: 400 });
    }

    // Preluarea datelor de salon și servicii
    const salon = getSalonDetails(slug);
    
    if (!salon) {
        return NextResponse.json({ message: "Salon not found" }, { status: 404 });
    }

    const services = findSalonServices(salon.id);

    return NextResponse.json({
        ...salon,
        services: services
    });
}