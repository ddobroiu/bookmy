import { useState } from 'react'
import { signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Container from '../../components/Container'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useRouter } from 'next/router'

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
      <main className="mt-12">
        <Container>
          <div className="max-w-md mx-auto card">
            <h1 className="text-2xl font-bold mb-2">Autentificare</h1>
            <p className="text-sm muted mb-4">Autentificare cu email și parolă.</p>

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

              <div>
                <Button type="submit">
                  {status === 'sending' ? 'Se autentifică...' : 'Autentificare'}
                </Button>
              </div>
            </form>

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-600">Autentificare eșuată. Verifică email/parolă.</p>
            )}

            <div className="mt-4 text-sm">
              <a href="/auth/register" className="text-blue-600">Creează cont</a>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
