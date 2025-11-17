import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('../../components/Header'), { ssr: false })
import prisma from '../../lib/prisma'

type Props = {
  userEmail?: string | null
}

export default function Dashboard({ userEmail }: Props) {
  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <p className="mt-4">Signed in as: {userEmail}</p>

        <section className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Your salons</h2>
          <div className="mt-4 space-y-3">
            {salons.length === 0 && <p className="text-sm text-gray-600">You have no salons yet. Create one.</p>}
            {salons.map((s) => (
              <div key={s.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-500">/{s.slug}</div>
                </div>
                <div className="flex gap-2">
                  <a className="text-sm text-blue-600" href={`/dashboard/salons/${s.slug}/services`}>Manage services</a>
                  <a className="text-sm text-green-600" href={`/${s.slug}`} target="_blank" rel="noreferrer">View page</a>
                </div>
              </div>
            ))}
          </div>
        </section>
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
    },
  }
}
