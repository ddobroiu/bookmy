import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Container from '../../components/Container'
import Input from '../../components/Input'
import Button from '../../components/Button'

import AuthCard from '../../components/AuthCard'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid'

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <Input label="Nume complet" value={name} onChange={setName} placeholder="Ex: Maria Popescu" icon={<UserIcon className="w-5 h-5" />} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nume@exemplu.com" icon={<EnvelopeIcon className="w-5 h-5" />} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <Input
                label="Parolă"
                value={password}
                onChange={setPassword}
                type={showPassword ? 'text' : 'password'}
                placeholder="Alege o parolă sigură"
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

            <motion.div
              className="flex items-center justify-between mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <div className="text-sm text-white/80">Ai deja cont? <a href="/auth/signin" className="text-pink-300 font-semibold hover:text-pink-200 transition">Autentifică-te</a></div>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    Se înregistrează...
                  </motion.div>
                ) : (
                  'Creează cont'
                )}
              </Button>
            </motion.div>
          </form>

          {status === 'error' && (
            <motion.p
              className="mt-4 text-red-300 font-semibold text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              A apărut o eroare la înregistrare.
            </motion.p>
          )}
      </AuthCard>
    </div>
  )
}
