import Link from 'next/link'
import dynamic from 'next/dynamic'
import Container from '../components/Container'
import Button from '../components/Button'
import Footer from '../components/Footer'

const Header = dynamic(() => import('../components/Header'), { ssr: false })

export default function Home() {
  return (
    <div>
      <Header />
      <main>
      <Container>
        <section className="hero mt-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold">Bookmy — Pagina de rezervări pentru afacerea ta</h1>
              <p className="mt-3 text-muted">Alege tipul de cont și autentifică-te rapid.</p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="card p-4">
                  <h3 className="font-semibold">Proprietar / Listează afacere</h3>
                  <p className="text-sm muted mt-1">Dacă ai un salon și vrei să îți listezi afacerea.</p>
                  <div className="mt-3">
                    <Link href="/auth/signin?role=OWNER"><Button>Autentificare proprietar</Button></Link>
                  </div>
                  <div className="mt-2">
                    <Link href="/auth/register?role=OWNER"><Button variant="outline">Creează cont proprietar</Button></Link>
                  </div>
                </div>

                <div className="card p-4">
                  <h3 className="font-semibold">Client / Caută salon</h3>
                  <p className="text-sm muted mt-1">Cont pentru clienți care rezervă servicii.</p>
                  <div className="mt-3">
                    <Link href="/auth/signin?role=CUSTOMER"><Button>Autentificare client</Button></Link>
                  </div>
                  <div className="mt-2">
                    <Link href="/auth/register?role=CUSTOMER"><Button variant="outline">Creează cont client</Button></Link>
                  </div>
                </div>
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
    </div>
  )
}
