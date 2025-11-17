import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../api/auth/[...nextauth]'
import prisma from '../../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (!slug || Array.isArray(slug)) return res.status(400).json({ error: 'missing slug' })

  if (req.method === 'GET') {
    const salon = await prisma.salon.findUnique({ where: { slug: slug as string }, include: { services: true } })
    if (!salon) return res.status(404).json({ error: 'not found' })
    return res.json({ services: salon.services })
  }

  // POST -> create service for salon (owner only)
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user || !session.user.email) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const salon = await prisma.salon.findUnique({ where: { slug: slug as string } })
    if (!salon) return res.status(404).json({ error: 'Salon not found' })
    if (salon.ownerId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const { name, duration, price } = req.body
    if (!name) return res.status(400).json({ error: 'Missing name' })

    const service = await prisma.service.create({ data: { salonId: salon.id, name, duration: Number(duration) || 30, price: Number(price) || 0 } })
    return res.status(201).json({ service })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
