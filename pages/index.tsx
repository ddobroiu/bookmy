import Link from 'next/link'
import dynamic from 'next/dynamic'
import Container from '../components/Container'
import Button from '../components/Button'
import Footer from '../components/Footer'

const Header = dynamic(() => import('../components/Header'), { ssr: false })

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <section className="hero mt-8">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl animate-fadein">
              <div className="bg-white/90 rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm">Bookmy — Rezervări moderne pentru afacerea ta</h1>
                    <p className="mt-3 text-lg text-gray-600 font-medium">Alege tipul de cont și autentifică-te rapid. Platformă modernă pentru saloane și clienți.</p>

                    <div className="mt-8 grid sm:grid-cols-2 gap-6">
                      <div className="card-modern p-6 rounded-2xl bg-gradient-to-br from-pink-100 via-indigo-100 to-purple-100 shadow-xl border-2 border-transparent hover:border-pink-400 transition-all duration-300 animate-card">
                        <h3 className="font-bold text-indigo-700 text-lg">Proprietar / Listează afacere</h3>
                        <p className="text-sm text-gray-500 mt-2">Dacă ai un salon și vrei să îți listezi afacerea.</p>
                        <div className="mt-4">
                          <Link href="/auth/signin?role=OWNER"><Button>Autentificare proprietar</Button></Link>
                        </div>
                        <div className="mt-2">
                          <Link href="/auth/register?role=OWNER"><Button variant="outline">Creează cont proprietar</Button></Link>
                        </div>
                      </div>

                      <div className="card-modern p-6 rounded-2xl bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 shadow-xl border-2 border-transparent hover:border-indigo-400 transition-all duration-300 animate-card">
                        <h3 className="font-bold text-pink-700 text-lg">Client / Caută salon</h3>
                        <p className="text-sm text-gray-500 mt-2">Cont pentru clienți care rezervă servicii.</p>
                        <div className="mt-4">
                          <Link href="/auth/signin?role=CUSTOMER"><Button>Autentificare client</Button></Link>
                        </div>
                        <div className="mt-2">
                          <Link href="/auth/register?role=CUSTOMER"><Button variant="outline">Creează cont client</Button></Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <div className="card-modern rounded-2xl overflow-hidden shadow-xl border-2 border-indigo-200 animate-card">
                      <img src="/salon-sample.jpg" alt="sample" className="w-full h-64 object-cover scale-105 hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick links</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="card-modern p-6 rounded-2xl bg-white shadow-lg border-2 border-transparent hover:border-indigo-400 transition-all duration-300 animate-card">
                <h3 className="font-semibold text-indigo-700">Dashboard</h3>
                <p className="mt-2 text-sm text-gray-500">Accesează panoul tău de control pentru a-ți gestiona saloanele și serviciile.</p>
                <div className="mt-4"><Link href="/dashboard"><Button variant="outline">Mergi la dashboard</Button></Link></div>
              </div>

              <div className="card-modern p-6 rounded-2xl bg-white shadow-lg border-2 border-transparent hover:border-pink-400 transition-all duration-300 animate-card">
                <h3 className="font-semibold text-pink-700">Creare salon</h3>
                <p className="mt-2 text-sm text-gray-500">Completează profilul salonului tău cu descriere, imagini și rețele sociale.</p>
                <div className="mt-4"><Link href="/dashboard/salons/new"><Button variant="outline">Creează salon</Button></Link></div>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-xl font-bold text-gray-900">Developer tools</h2>
            <p className="mt-2 text-sm text-gray-500">Pentru a inspecta baza de date locală rulează <code className="bg-gray-100 px-2 py-1 rounded">npx prisma studio</code>.</p>
          </section>

        </Container>
      </main>
      <Footer />
      <style jsx>{`
        .animate-fadein { animation: fadein 1s ease; }
        .animate-card { animation: cardin 0.7s cubic-bezier(.4,0,.2,1); }
        @keyframes fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes cardin { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
