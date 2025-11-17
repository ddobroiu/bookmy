import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { sendResendEmail } from '../../../lib/resend'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email, password, name, role } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
    const allowedRoles = ['CUSTOMER', 'OWNER']
    const userRole = allowedRoles.includes(role) ? role : 'CUSTOMER'

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hashed, name, role: userRole } })
  // Send welcome email (do NOT include the password). If RESEND_API_KEY is not set, helper will throw.
  try {
    const from = process.env.EMAIL_FROM || 'no-reply@bookmy.ro'
    const site = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const subject = `Bun venit pe Bookmy, ${name || ''}`
    const html = `<p>Bun venit ${name || ''},</p><p>Contul tău a fost creat cu succes pentru <strong>${email}</strong>.</p><p>Pentru a te autentifica, folosește formularul de autentificare: <a href="${site}/auth/signin">${site}/auth/signin</a></p><p>Dacă nu ai creat acest cont, ignoră acest email.</p>`
    const text = `Bun venit ${name || ''}\n\nContul tău a fost creat pentru ${email}.\n\nAutentificare: ${site}/auth/signin\n\nDacă nu ai creat acest cont, ignoră acest email.`
    await sendResendEmail({ to: email, from, subject, html, text })
  } catch (err) {
    console.error('Failed to send welcome email via Resend:', err)
    // Do not fail registration if email sending fails
  }

    return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (err: any) {
    console.error('Registration error:', err)
    const message = err?.message || String(err)
    return res.status(500).json({ error: 'Internal server error', message })
  }
}
