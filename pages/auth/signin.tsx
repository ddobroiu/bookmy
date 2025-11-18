import { useState } from 'react'
import { signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Container from '../../components/Container'

import Input from '../../components/Input'
import Button from '../../components/Button'
import { useRouter } from 'next/router'
import AuthCard from '../../components/AuthCard'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid'

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" icon={<EnvelopeIcon className="w-5 h-5" />} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Input
              label="Parolă"
              value={password}
              onChange={setPassword}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••"
              icon={<LockClosedIcon className="w-5 h-5" />}
              className="mb-2"
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-indigo-300 hover:text-pink-300 transition font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showPassword ? 'Ascunde parola' : 'Arată parola'}
          </motion.button>

          {status === 'error' && (
            <motion.p
              className="text-sm text-red-300 font-semibold text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Autentificare eșuată. Verifică email/parolă.
            </motion.p>
          )}

          <motion.div
            className="flex items-center justify-between mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <div className="text-sm text-white/80"><a href="/auth/register" className="text-pink-300 font-semibold hover:text-pink-200 transition">Creează cont</a></div>
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Se autentifică...
                </motion.div>
              ) : (
                'Autentificare'
              )}
            </Button>
          </motion.div>
        </form>
      </AuthCard>
    </div>
  )
}
