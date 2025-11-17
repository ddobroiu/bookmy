import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'missing id' })

  const service = await prisma.service.findUnique({ where: { id: id as string }, include: { salon: true } })
  if (!service) return res.status(404).json({ error: 'Service not found' })

  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user || !session.user.email) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (service.salon.ownerId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const { name, duration, price } = req.body
    const updated = await prisma.service.update({ where: { id: id as string }, data: { name: name ?? service.name, duration: Number(duration) ?? service.duration, price: Number(price) ?? service.price } })
    return res.json({ service: updated })
  }

  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user || !session.user.email) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (service.salon.ownerId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    await prisma.service.delete({ where: { id: id as string } })
    return res.json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
