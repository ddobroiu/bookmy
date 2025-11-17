import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import type { NextAuthOptions } from 'next-auth'
import { sendResendEmail } from '../../../lib/resend'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { email, password } = credentials as { email: string; password: string }
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null
        const bcrypt = (await import('bcryptjs')).default
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null
        // return user object for session
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.user = { id: user.id, email: user.email, name: user.name }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && token.user) {
        session.user = token.user
      }
      return session
    },
  },
  // use default built-in pages; avoid pointing signIn to an API route (causes redirect loops)
}

export default NextAuth(authOptions)
