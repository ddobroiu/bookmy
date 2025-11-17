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
          <p className="text-sm text-gray-600">(Salon list will appear here)</p>
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

  // Example: we could fetch salons for this user here using prisma
  // const salons = await prisma.salon.findMany({ where: { ownerId: session.user.id } })

  return {
    props: {
      userEmail: session.user?.email ?? null,
    },
  }
}
