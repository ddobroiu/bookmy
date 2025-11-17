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
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Nume complet" value={name} onChange={setName} placeholder="Ex: Maria Popescu" icon={<UserIcon className="w-5 h-5" />} />
            <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" icon={<MailIcon className="w-5 h-5" />} />
            <Input
              label="Parolă"
              value={password}
              onChange={setPassword}
              type={showPassword ? 'text' : 'password'}
              placeholder="Alege o parolă sigură"
              icon={<LockClosedIcon className="w-5 h-5" />}
              className="mb-2"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-indigo-500 mb-2 transition hover:underline">
              {showPassword ? 'Ascunde parola' : 'Arată parola'}
            </button>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">Ai deja cont? <a href="/auth/signin" className="text-pink-600 font-semibold hover:underline">Autentifică-te</a></div>
              <Button type="submit">{status === 'sending' ? 'Se înregistrează...' : 'Creează cont'}</Button>
            </div>
          </form>

          {status === 'error' && <p className="mt-3 text-red-600 font-semibold">A apărut o eroare la înregistrare.</p>}
      </AuthCard>
    </div>
  )
}
