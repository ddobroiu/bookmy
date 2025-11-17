import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import dynamic from 'next/dynamic'
import prisma from '../../lib/prisma'
import Container from '../../components/Container'
import Button from '../../components/Button'

const Header = dynamic(() => import('../../components/Header'), { ssr: false })

type Props = {
  userEmail?: string | null
  salons?: Array<{ id: string; name: string; slug: string }>
}

export default function Dashboard({ userEmail, salons = [] }: Props) {
  return (
    <div>
      <Header />
      <main className="mt-8">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panou proprietar</h1>
              <p className="text-sm muted">Autentificat ca: {userEmail}</p>
            </div>
            <div>
              <Button variant="outline"><a href="/dashboard/salons/new">Creează salon</a></Button>
            </div>
          </div>

          <section className="mt-6 grid gap-4">
            {salons.length === 0 && <div className="card">Nu ai saloane încă. Creează primul salon.</div>}
            {salons.map((s) => (
              <div key={s.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-medium text-lg">{s.name}</div>
                  <div className="text-sm muted">/{s.slug}</div>
                </div>
                <div className="flex gap-3">
                  <a className="text-sm" href={`/dashboard/salons/${s.slug}/services`}>Manage</a>
                  <a className="text-sm" href={`/${s.slug}`} target="_blank" rel="noreferrer">View</a>
                </div>
              </div>
            ))}
          </section>
        </Container>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({ where: { email: session.user?.email ?? undefined } })
  if (!user) return { props: { userEmail: session.user?.email ?? null, salons: [] } }

  const salons = await prisma.salon.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, slug: true } })

  return {
    props: {
      userEmail: session.user?.email ?? null,
      salons,
    },
  }
}
