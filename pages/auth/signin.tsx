import { useState } from 'react'
import { signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Container from '../../components/Container'

import Input from '../../components/Input'
import Button from '../../components/Button'
import { useRouter } from 'next/router'
import AuthCard from '../../components/AuthCard'
import { MailIcon, LockClosedIcon } from '@heroicons/react/solid'

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" icon={<MailIcon className="w-5 h-5" />} />
          <Input
            label="Parolă"
            value={password}
            onChange={setPassword}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••"
            icon={<LockClosedIcon className="w-5 h-5" />}
            className="mb-2"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-indigo-500 mb-2 transition hover:underline">
            {showPassword ? 'Ascunde parola' : 'Arată parola'}
          </button>
          {status === 'error' && (
            <p className="text-sm text-red-600 font-semibold">Autentificare eșuată. Verifică email/parolă.</p>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500"><a href="/auth/register" className="text-pink-600 font-semibold hover:underline">Creează cont</a></div>
            <Button type="submit">{status === 'sending' ? 'Se autentifică...' : 'Autentificare'}</Button>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
