import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER, // e.g. smtp://user:pass@smtp.mailtrap.io:2525
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
  },
  pages: {
    // use default pages; you can override with custom UI later
    signIn: '/api/auth/signin',
  },
}

export default NextAuth(authOptions)
