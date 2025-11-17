import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Bookmy — create your booking page</h1>
      <p>Welcome. This is a starter app. Each client will get a page at <code>/[slug]</code>.</p>

      <h2>Examples</h2>
      <ul>
        <li>
          <Link href="/salon-exemplu">/salon-exemplu</Link>
        </li>
      </ul>
    </main>
  )
}
