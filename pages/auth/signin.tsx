import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()
  const { role: roleQuery } = router.query
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const res = await signIn('credentials', { redirect: false, email, password })
    if (res?.ok) {
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Autentificare</CardTitle>
          <CardDescription>
            Introduceți email-ul și parola pentru a vă conecta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nume@exemplu.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {status === 'error' && (
              <p className="text-sm text-destructive">
                Autentificare eșuată. Verifică email/parolă.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Se autentifică...' : 'Autentificare'}
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Nu ai cont?{" "}
              <Link
                href="/auth/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                Creează cont
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
