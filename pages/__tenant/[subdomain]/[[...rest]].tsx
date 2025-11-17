import prisma from '../../../lib/prisma'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../../../components/Header'), { ssr: false })

type Props = {
  salon: any | null
}

export default function TenantPage({ salon }: Props) {
  return (
    <div>
      <Header />
      <main className="p-8">
        <h1 className="text-2xl font-bold">{salon.name}</h1>
        <p className="mt-2">{salon.description}</p>
        <p className="mt-2 text-sm muted">Telefon: {salon.phone}</p>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const subdomain = String(ctx.params?.subdomain || '')
  if (!subdomain) return { props: { salon: null } }

  const salon = await prisma.salon.findUnique({ where: { subdomain } })
  if (!salon) return { props: { salon: null } }

  return { props: { salon: JSON.parse(JSON.stringify(salon)) } }
}
