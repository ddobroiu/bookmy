import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { toKebabCase } from '../../../lib/slug'
const Header = dynamic(() => import('../../../components/Header'), { ssr: false })

export default function NewSalon() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState('')
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([])
  const [newSocialPlatform, setNewSocialPlatform] = useState('')
  const [newSocialUrl, setNewSocialUrl] = useState('')
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
    const payload = { name, slug, phone, address, description, images, socialLinks, openingHours }
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
      <main className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create your salon</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm">Slug</span>
            <div className="flex gap-2">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} onBlur={() => checkSlug(slug)} className="mt-1 block w-full border rounded px-3 py-2" />
              <button type="button" onClick={() => setSlug(toKebabCase(name))} className="bg-gray-200 px-3 rounded">Auto</button>
            </div>
            {checking && <p className="text-sm text-gray-500">Checking slug...</p>}
            {suggestion && <p className="text-sm text-yellow-600">Suggested: {suggestion} <button type="button" onClick={() => setSlug(suggestion)} className="ml-2 text-blue-600">Use</button></p>}
          </label>

          <label className="block">
            <span className="text-sm">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm">Address</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm">Opening hours (text)</span>
            <input value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm">Short description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={3} />
          </label>

          <label className="block">
            <span className="text-sm">Images (paste image URL)</span>
            <div className="flex gap-2 mt-1">
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
