import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Bookmy — create your booking page</h1>
      <p className="mt-2">Welcome. This is a starter app. Each client will get a page at <code>/[slug]</code>.</p>

      <h2 className="mt-6 font-semibold">Quick links</h2>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li><Link href="/auth/signin">Sign in / Sign up (magic link)</Link></li>
        <li><Link href="/dashboard">Owner dashboard</Link></li>
        <li><Link href="/dashboard/salons/new">Create a new salon (onboarding)</Link></li>
        <li><Link href="/salon-exemplu">Public salon example: /salon-exemplu</Link></li>
      </ul>

      <h2 className="mt-6 font-semibold">Developer tools</h2>
      <p className="mt-2">To inspect the database, run <code>npx prisma studio</code> locally and open the UI.</p>
    </main>
  )
}
