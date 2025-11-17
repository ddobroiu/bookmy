import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SalonPage() {
  const router = useRouter()
  const { slug } = router.query

  return (
    <main>
      <h1>Salon: {slug}</h1>
      <p>This is a placeholder salon page. In the next steps we'll add bookings and admin UI.</p>

      <p>
        <Link href="/">Back home</Link>
      </p>
    </main>
  )
}
