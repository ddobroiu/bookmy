import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

const RESERVED = new Set(['www', 'admin', 'api', 'mail', 'ftp', 'support', 'blog', 'shop'])

function validSubdomain(s: string) {
  if (!s) return false
  if (s.length < 2 || s.length > 63) return false
  if (!/^[a-z0-9-]+$/.test(s)) return false
  if (s.startsWith('-') || s.endsWith('-')) return false
  if (RESERVED.has(s)) return false
  return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.subdomain || '')
  const s = q.toLowerCase().trim()

  if (!validSubdomain(s)) return res.json({ ok: false, reason: 'invalid' })

  const existing = await prisma.salon.findUnique({ where: { subdomain: s } })
  if (existing) return res.json({ ok: false, reason: 'taken' })

  return res.json({ ok: true })
}
