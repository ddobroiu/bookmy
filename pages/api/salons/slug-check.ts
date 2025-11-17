import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { toKebabCase, suggestSlug } from '../../../lib/slug'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (!slug || Array.isArray(slug)) return res.status(400).json({ error: 'missing slug' })

  const base = toKebabCase(slug as string)
  // check if exists
  const existing = await prisma.salon.findUnique({ where: { slug: base } })
  if (!existing) return res.json({ ok: true, slug: base })

  // find available suffix
  let idx = 2
  let candidate = suggestSlug(base, idx)
  while (await prisma.salon.findUnique({ where: { slug: candidate } })) {
    idx += 1
    candidate = suggestSlug(base, idx)
  }

  return res.json({ ok: false, suggestion: candidate })
}
