import { useState } from 'react'
import { signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Container from '../../components/Container'
import Input from '../../components/Input'
import Button from '../../components/Button'

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
      <main className="mt-12">
        <Container>
          <div className="max-w-md mx-auto card">
            <h1 className="text-2xl font-bold mb-2">Autentificare</h1>
            <p className="text-sm muted mb-4">Primești un link în email pentru autentificare.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" />
              <div>
                <Button>
                  {status === 'sending' ? 'Trimitere...' : 'Trimite magic link'}
                </Button>
              </div>
            </form>

            {status === 'sent' && (
              <p className="mt-4 text-sm" style={{ color: 'var(--brand-700)' }}>Verifică emailul pentru linkul de autentificare.</p>
            )}
          </div>
        </Container>
      </main>
    </div>
  )
}
