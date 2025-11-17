import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Container from '../../components/Container'
import Input from '../../components/Input'
import Button from '../../components/Button'
import AuthCard from '../../components/AuthCard'

const Header = dynamic(() => import('../../components/Header'), { ssr: false })

export default function RegisterPage() {
  const router = useRouter()
  const roleFromQuery = (router.query.role as string) || 'CUSTOMER'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'ok'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name, role: roleFromQuery }) })
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
      <AuthCard title="Creează cont" subtitle={roleFromQuery === 'OWNER' ? 'Cont pentru proprietari' : 'Cont pentru clienți'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nume complet" value={name} onChange={setName} placeholder="Ex: Maria Popescu" />
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" />
          <div>
            <label className="block">
              <div className="text-sm mb-1 font-medium">Parolă</div>
              <div className="relative">
                <input
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Alege o parolă sigură"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-sm text-gray-500">{showPassword ? 'Ascunde' : 'Arată'}</button>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Ai deja cont? <a href="/auth/signin" className="text-indigo-600">Autentifică-te</a></div>
            <Button type="submit">{status === 'sending' ? 'Se înregistrează...' : 'Creează cont'}</Button>
          </div>
        </form>

        {status === 'error' && <p className="mt-3 text-red-600">A apărut o eroare la înregistrare.</p>}
      </AuthCard>
    </div>
  )
}
