import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import type { NextAuthOptions } from 'next-auth'
import { sendResendEmail } from '../../../lib/resend'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    EmailProvider({
      // we override sending below using Resend; keep `from` for clarity
      from: process.env.EMAIL_FROM,
      // Custom send function: uses Resend API via lib/resend.ts
      // NextAuth will call this to send the magic link email
      async sendVerificationRequest(params: any) {
        const { identifier: email, url, provider } = params
        const from = provider.from || process.env.EMAIL_FROM
        const site = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const text = `Sign in to ${site}\n\nClick this link to sign in:\n${url}\n\nIf you did not request this, you can ignore this email.`
        const html = `<p>Sign in to <strong>${site}</strong></p><p><a href="${url}" style="display:inline-block;padding:12px 18px;background:${process.env.BRAND_COLOR || '#0b7180'};color:#fff;border-radius:8px;text-decoration:none;">Sign in</a></p><p style="color:#6b7280;font-size:14px;margin-top:12px;">If you did not request this, you can ignore this email.</p>`
        try {
          await sendResendEmail({ to: email, from, subject: `Your sign-in link for ${site}`, text, html })
        } catch (err) {
          console.error('Error sending verification email via Resend:', err)
          throw err
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
  },
  // use default built-in pages; avoid pointing signIn to an API route (causes redirect loops)
}

export default NextAuth(authOptions)
