import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">Bookmy</Link>

        <nav>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
