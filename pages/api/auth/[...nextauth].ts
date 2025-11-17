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
      // For safety during development we replace actual email sending with a no-op logger.
      // This prevents accidental outbound emails while you test authentication flows.
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params: any) {
        const { identifier: email, url } = params
        const site = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        // Log the verification link to server console (no external request)
        console.log(`[NextAuth][DEV] Magic link for ${email}: ${url} (site: ${site})`)
        // Additionally write to a file for easier local inspection (safe, optional)
        try {
          const fs = await import('fs')
          const path = `./.next/magic-links.log`
          const line = `${new Date().toISOString()}\t${email}\t${url}\n`
          fs.appendFileSync(path, line)
        } catch (e) {
          // ignore file write errors in dev
          console.debug('Could not write magic link to file:', e)
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
