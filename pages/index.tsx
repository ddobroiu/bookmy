import Link from 'next/link'
import Container from '../components/Container'
import Button from '../components/Button'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <Container>
        <section className="hero mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">Bookmy — Pagina de rezervări pentru afacerea ta</h1>
              <p className="mt-3 text-muted">Creează rapid o pagină dedicată pentru salonul tău: servicii, program, contacte și rezervări.</p>

              <div className="mt-6 flex gap-3">
                <Link href="/dashboard/salons/new"><Button>Începe acum</Button></Link>
                <Link href="/auth/signin"><Button variant="outline">Autentificare</Button></Link>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="card">
                <img src="/salon-sample.jpg" alt="sample" className="image-thumb" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Quick links</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-medium">Dashboard</h3>
              <p className="mt-1 text-sm muted">Accesează panoul tău de control pentru a-ți gestiona saloanele și serviciile.</p>
              <div className="mt-3"><Link href="/dashboard"><Button variant="outline">Mergi la dashboard</Button></Link></div>
            </div>

            <div className="card">
              <h3 className="font-medium">Creare salon</h3>
              <p className="mt-1 text-sm muted">Completează profilul salonului tău cu descriere, imagini și rețele sociale.</p>
              <div className="mt-3"><Link href="/dashboard/salons/new"><Button variant="outline">Creează salon</Button></Link></div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Developer tools</h2>
          <p className="mt-2 text-sm muted">Pentru a inspecta baza de date locală rulează <code>npx prisma studio</code>.</p>
        </section>

        <Footer />
      </Container>
    </main>
  )
}
