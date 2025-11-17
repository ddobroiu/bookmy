import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../lib/prisma'
import { toKebabCase, suggestSlug } from '../../../lib/slug'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const { name, slug, phone, address, description, images, socialLinks, openingHours } = req.body
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Missing name' })

    let baseSlug = slug && typeof slug === 'string' && slug.trim() !== '' ? toKebabCase(slug) : toKebabCase(name)

    // ensure unique
    const existing = await prisma.salon.findUnique({ where: { slug: baseSlug } })
    if (existing) {
      let idx = 2
      let candidate = suggestSlug(baseSlug, idx)
      while (await prisma.salon.findUnique({ where: { slug: candidate } })) {
        idx += 1
        candidate = suggestSlug(baseSlug, idx)
      }
      baseSlug = candidate
    }

    const ownerEmail = session.user.email ?? undefined

    const salon = await prisma.salon.create({
      data: {
        name,
        slug: baseSlug,
        phone: phone ?? null,
        address: address ?? null,
        description: description ?? null,
        images: images ?? null,
        socialLinks: socialLinks ?? null,
        openingHours: openingHours ?? null,
        owner: ownerEmail ? { connect: { email: ownerEmail } } : undefined,
      },
    })

    return res.status(201).json({ salon })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
