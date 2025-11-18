// /src/lib/prisma.js (Cod Final)
import { PrismaClient } from '@prisma/client';

// Clientul este definit global pentru a preveni instanțieri multiple în dev
const prisma = global.prisma || new PrismaClient({
    log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;