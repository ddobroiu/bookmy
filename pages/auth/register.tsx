import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Container from '../../components/Container'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Header = dynamic(() => import('../../components/Header'), { ssr: false })

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'ok'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) })
      if (res.ok) {
        setStatus('ok')
        router.push('/auth/signin')
      } else {
        setStatus('error')
      }
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <div>
      <Header />
      <main className="mt-12">
        <Container>
          <div className="max-w-md mx-auto card">
            <h1 className="text-2xl font-bold mb-2">Creează cont</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nume" value={name} onChange={setName} placeholder="Numele tău" />
              <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" />
              <Input label="Parolă" value={password} onChange={setPassword} type="password" placeholder="••••••" />
              <div><Button>{status === 'sending' ? 'Se înregistrează...' : 'Creează cont'}</Button></div>
            </form>
            {status === 'error' && <p className="mt-3 text-red-600">A apărut o eroare la înregistrare.</p>}
          </div>
        </Container>
      </main>
    </div>
  )
}
