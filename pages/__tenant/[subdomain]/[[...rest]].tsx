import prisma from '../../../lib/prisma'
import { GetServerSideProps } from 'next'

type Props = {
  salon: any | null
}

export default function TenantPage({ salon }: Props) {
  if (!salon) return <main className="p-8"> <h1>Salon's not found</h1> </main>

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{salon.name}</h1>
      <p className="mt-2">{salon.description}</p>
      <p className="mt-2 text-sm muted">Telefon: {salon.phone}</p>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const subdomain = String(ctx.params?.subdomain || '')
  if (!subdomain) return { props: { salon: null } }

  const salon = await prisma.salon.findUnique({ where: { subdomain } })
  if (!salon) return { props: { salon: null } }

  return { props: { salon: JSON.parse(JSON.stringify(salon)) } }
}
