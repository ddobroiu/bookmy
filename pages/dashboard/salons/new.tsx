import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { toKebabCase } from '../../../lib/slug'
const Header = dynamic(() => import('../../../components/Header'), { ssr: false })

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { toKebabCase } from '../../../lib/slug'
import Container from '../../../components/Container'
import Input from '../../../components/Input'
import Button from '../../../components/Button'

const Header = dynamic(() => import('../../../components/Header'), { ssr: false })

export default function NewSalon() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [checking, setChecking] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)

  useEffect(() => {
    if (!slug && name) {
      setSlug(toKebabCase(name))
    }
  }, [name])

  async function checkSlug(value: string) {
    setChecking(true)
    setSuggestion(null)
    try {
      const res = await fetch(`/api/salons/slug-check?slug=${encodeURIComponent(value)}`)
      const data = await res.json()
      if (!data.ok && data.suggestion) setSuggestion(data.suggestion)
    } catch (e) {
      console.error(e)
    } finally {
      setChecking(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name, slug, phone, address, openingHours }
    const res = await fetch('/api/salons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      const err = await res.json()
      alert(err.error || 'Failed')
    }
  }

  return (
    <div>
      <Header />
      <main className="mt-8">
        <Container>
          <div className="max-w-2xl mx-auto card">
            <h1 className="text-2xl font-bold mb-3">Creează salonul tău</h1>
            <p className="text-sm muted mb-4">Completează informațiile de bază și publică pagina pentru clienți.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nume salon" value={name} onChange={setName} placeholder="Numele salonului" />

              <div>
                <label className="block mb-1 text-sm font-medium">Slug</label>
                <div className="flex gap-2">
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} onBlur={() => checkSlug(slug)} className="flex-1 border border-gray-200 rounded-md px-3 py-2" />
                  <button type="button" onClick={() => setSlug(toKebabCase(name))} className="btn-outline px-3 py-2 rounded-md">Auto</button>
                </div>
                {checking && <p className="text-sm text-gray-500">Verific slug...</p>}
                {suggestion && <p className="text-sm text-yellow-600">Sugestie: {suggestion} <button type="button" onClick={() => setSlug(suggestion)} className="ml-2 text-blue-600">Folosește</button></p>}
              </div>

              <Input label="Telefon" value={phone} onChange={setPhone} placeholder="0740..." />
              <Input label="Adresă" value={address} onChange={setAddress} placeholder="Strada, oraș" />
              <Input label="Program (text)" value={openingHours} onChange={setOpeningHours} placeholder="Luni-Vineri 09:00-18:00" />

              <div>
                <Button>Creează salon</Button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  )
}
              <input value={newImage} onChange={(e) => setNewImage(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="https://..." />
              <button type="button" onClick={() => {
                if (newImage.trim()) { setImages((s) => [...s, newImage.trim()]); setNewImage('') }
              }} className="bg-gray-200 px-3 rounded">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="w-24 h-24 bg-gray-100 rounded overflow-hidden relative">
                  <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages((s) => s.filter((_, i) => i !== idx))} className="absolute top-0 right-0 bg-white text-red-600 px-1">×</button>
                </div>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm">Social links</span>
            <div className="flex gap-2 mt-1">
              <input value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)} placeholder="e.g. instagram" className="w-32 border rounded px-2 py-1" />
              <input value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} placeholder="https://" className="flex-1 border rounded px-2 py-1" />
              <button type="button" onClick={() => {
                if (newSocialPlatform.trim() && newSocialUrl.trim()) {
                  setSocialLinks((s) => [...s, { platform: newSocialPlatform.trim(), url: newSocialUrl.trim() }])
                  setNewSocialPlatform('')
                  setNewSocialUrl('')
                }
              }} className="bg-gray-200 px-3 rounded">Add</button>
            </div>
            <div className="mt-2 space-y-1">
              {socialLinks.map((sl, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1 border rounded">
                  <div className="text-sm"><strong>{sl.platform}</strong>: <span className="text-blue-600">{sl.url}</span></div>
                  <button type="button" onClick={() => setSocialLinks((s) => s.filter((_, i) => i !== idx))} className="text-sm text-red-600">Remove</button>
                </div>
              ))}
            </div>
          </label>

          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create salon</button>
          </div>
        </form>
      </main>
    </div>
  )
}
