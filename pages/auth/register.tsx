import { useState } from 'react'
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

export default function RegisterPage() {
  const router = useRouter()
  const roleFromQuery = (router.query.role as string) || 'CUSTOMER'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'ok'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role: roleFromQuery }),
      })
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Creează cont</CardTitle>
          <CardDescription>
            {roleFromQuery === 'OWNER'
              ? 'Creează un cont de proprietar de salon.'
              : 'Creează un cont de client pentru a rezerva servicii.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nume complet</Label>
              <Input
                id="name"
                placeholder="Ex: Maria Popescu"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                A apărut o eroare la înregistrare.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Se înregistrează...' : 'Creează cont'}
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Ai deja cont?{" "}
              <Link
                href="/auth/signin"
                className="underline underline-offset-4 hover:text-primary"
              >
                Autentifică-te
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
