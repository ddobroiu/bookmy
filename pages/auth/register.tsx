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
  const [role, setRole] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'ok'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name, role }) })
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
              <div>
                <label className="block text-sm font-medium">Sunt:</label>
                <div className="flex gap-4 mt-2">
                  <label className="inline-flex items-center"><input type="radio" name="role" value="CUSTOMER" checked={role==='CUSTOMER'} onChange={() => setRole('CUSTOMER')} className="mr-2"/> Client (căutător)</label>
                  <label className="inline-flex items-center"><input type="radio" name="role" value="OWNER" checked={role==='OWNER'} onChange={() => setRole('OWNER')} className="mr-2"/> Proprietar / Listează afacere</label>
                </div>
              </div>
              <div><Button type="submit">{status === 'sending' ? 'Se înregistrează...' : 'Creează cont'}</Button></div>
            </form>
            {status === 'error' && <p className="mt-3 text-red-600">A apărut o eroare la înregistrare.</p>}
          </div>
        </Container>
      </main>
    </div>
  )
}
