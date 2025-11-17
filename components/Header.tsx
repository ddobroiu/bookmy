import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-md">
      <div className="container-custom flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,var(--brand-500),var(--accent-gold))' }} />
            <div>
              <div className="font-semibold text-lg">Bookmy</div>
              <div className="text-sm muted">Pagina de rezervări</div>
            </div>
          </Link>
        </div>

        <nav>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm muted">{session.user?.email}</span>
              <button onClick={() => signOut()} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Sign out</button>
            </div>
          ) : (
            <Link href="/auth/signin" className="text-sm bg-transparent border px-3 py-1 rounded" >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
