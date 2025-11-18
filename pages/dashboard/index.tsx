import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import dynamic from 'next/dynamic'
import prisma from '../../lib/prisma'
import Container from '../../components/Container'
import { Button } from '../../components/ui/button'
import { BuildingStorefrontIcon, PlusIcon, EyeIcon, CogIcon } from '@heroicons/react/24/solid'

const Header = dynamic(() => import('../../components/Header'), { ssr: false })

type Props = {
  userEmail?: string | null
  salons?: Array<{ id: string; name: string; slug: string }>
}

export default function Dashboard({ userEmail, salons = [] }: Props) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Panou proprietar</h1>
                  <p className="text-lg opacity-90">Autentificat ca: {userEmail}</p>
                </div>
                <div className="animate-pulse-glow">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <a href="/dashboard/salons/new">Creează salon</a>
                  </Button>
                </div>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-slide-in-left">Saloanele tale</h2>
              {salons.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover-lift animate-fade-in-up">
                  <BuildingStorefrontIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Nu ai saloane încă</h3>
                  <p className="text-gray-500 mb-6">Creează primul salon pentru a începe să primești rezervări.</p>
                  <Button>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Creează primul salon
                  </Button>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salons.map((s, index) => (
                  <div key={s.id} className="bg-white rounded-2xl p-6 shadow-lg hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center mb-4">
                      <BuildingStorefrontIcon className="w-8 h-8 text-indigo-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
                        <p className="text-sm text-gray-500">/{s.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a href={`/dashboard/salons/${s.slug}/services`} className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-200 transition">
                        <CogIcon className="w-4 h-4" />
                        Manage
                      </a>
                      <a href={`/${s.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm bg-pink-100 text-pink-700 px-3 py-2 rounded-lg hover:bg-pink-200 transition">
                        <EyeIcon className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
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
