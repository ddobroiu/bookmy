import { useState } from 'react'
import { signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('../../components/Header'), { ssr: false })

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    await signIn('email', { email, callbackUrl: '/' })
    setStatus('sent')
  }

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </label>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send magic link'}
            </button>
          </div>
        </form>

        {status === 'sent' && (
          <p className="mt-4 text-sm text-green-600">Check your email for the magic link.</p>
        )}
      </main>
    </div>
  )
}
