// /src/app/api/salons/search/route.js (NOU - MOTOR CĂUTARE)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('cat') || '';
    const location = searchParams.get('loc') || '';

    try {
        // Construim filtrul dinamic
        const whereClause = {
            // Dacă avem categorie, filtrăm exact, altfel orice
            ...(category && { category: { contains: category, mode: 'insensitive' } }),
            
            // Filtrare locație (simplă, text)
            ...(location && { address: { contains: location, mode: 'insensitive' } }),
            
            // Căutare text (nume salon SAU nume serviciu)
            ...(query && {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { 
                        services: { 
                            some: { 
                                name: { contains: query, mode: 'insensitive' } 
                            } 
                        } 
                    }
                ]
            })
        };

        const salons = await prisma.salon.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                slug: true,
                address: true,
                category: true,
                averageRating: true,
                reviewCount: true,
                // Luăm serviciul cu prețul cel mai mic pentru a afișa "de la X RON"
                services: {
                    orderBy: { price: 'asc' },
                    take: 1,
                    select: { name: true, price: true }
                },
                // Luăm o imagine din portofoliu
                portfolioItems: {
                    take: 1,
                    select: { url: true }
                }
            }
        });

        // Formatăm pentru frontend
        const results = salons.map(salon => ({
            id: salon.id,
            title: salon.name,
            slug: salon.slug,
            rating: salon.averageRating || 5.0,
            reviews: salon.reviewCount,
            address: salon.address,
            // Imagine default dacă nu are portofoliu
            image: salon.portfolioItems[0]?.url || 'https://images.unsplash.com/photo-1521590832896-017c4f98aa51?auto=format&fit=crop&w=400&q=80',
            price: salon.services[0]?.price || 'N/A',
            serviceName: salon.services[0]?.name || 'Servicii diverse'
        }));

        return NextResponse.json(results);

    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: 'Eroare la căutare' }, { status: 500 });
    }
}