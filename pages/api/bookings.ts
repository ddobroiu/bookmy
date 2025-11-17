import type { NextApiRequest, NextApiResponse } from 'next'

// Placeholder bookings API. We'll wire Prisma and real DB next.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ bookings: [] })
  }
  if (req.method === 'POST') {
    // accept payload and return created booking stub
    const { salonSlug, name, time } = req.body
    return res.status(201).json({ id: 'temp-id', salonSlug, name, time })
  }
  return res.status(405).end()
}
