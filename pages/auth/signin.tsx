import { useState } from 'react'
import { signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Container from '../../components/Container'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useRouter } from 'next/router'
import AuthCard from '../../components/AuthCard'

const Header = dynamic(() => import('../../components/Header'), { ssr: false })

export default function SignInPage() {
  const router = useRouter()
  const { role: roleQuery } = router.query
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const res = await signIn('credentials', { redirect: false, email, password })
    if (res?.ok) {
      // Redirect based on role query (OWNER -> dashboard)
      if (roleQuery === 'OWNER') {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/'
      }
    } else {
      setStatus('error')
    }
  }

  return (
    <div>
      <Header />
      <AuthCard title="Autentificare" subtitle="Conectează-te cu email și parolă">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" />
          <div>
            <label className="block">
              <div className="text-sm mb-1 font-medium">Parolă</div>
              <div className="relative">
                <input className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-sm text-gray-500">{showPassword ? 'Ascunde' : 'Arată'}</button>
              </div>
            </label>
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-600">Autentificare eșuată. Verifică email/parolă.</p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500"><a href="/auth/register" className="text-indigo-600">Creează cont</a></div>
            <Button type="submit">{status === 'sending' ? 'Se autentifică...' : 'Autentificare'}</Button>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
