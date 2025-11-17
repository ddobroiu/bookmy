
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { HomeIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <HomeIcon className="w-7 h-7 text-indigo-500 group-hover:text-pink-500 transition" />
          </div>
          <div>
            <div className="font-extrabold text-xl text-white tracking-tight drop-shadow">Bookmy</div>
            <div className="text-xs text-white/80 font-medium">Rezervări moderne</div>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-white font-semibold hover:text-pink-200 transition">Acasă</Link>
          <Link href="/dashboard" className="text-white font-semibold hover:text-pink-200 transition">Dashboard</Link>
          <Link href="/dashboard/salons/new" className="text-white font-semibold hover:text-pink-200 transition">Adaugă salon</Link>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white/90 text-sm"><UserIcon className="w-4 h-4" />{session.user?.email}</span>
              <button onClick={() => signOut()} className="flex items-center gap-1 text-sm bg-pink-600 hover:bg-red-600 text-white px-3 py-1 rounded transition"><ArrowRightOnRectangleIcon className="w-4 h-4" />Logout</button>
            </div>
          ) : (
            <Link href="/auth/signin" className="flex items-center gap-1 text-sm bg-white/90 hover:bg-white text-indigo-600 px-3 py-1 rounded shadow transition">
              <UserIcon className="w-4 h-4" />Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
