import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { toKebabCase } from '../../../lib/slug'
import Container from '../../../components/Container'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { BuildingStorefrontIcon, LinkIcon, PhoneIcon, MapPinIcon, ClockIcon, DocumentTextIcon, PhotoIcon, GlobeAltIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

const Header = dynamic(() => import('../../../components/Header'), { ssr: false })

export default function NewSalon() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [openingHours, setOpeningHours] = useState('')

  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState('')

  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([])
  const [newSocialPlatform, setNewSocialPlatform] = useState('')
  const [newSocialUrl, setNewSocialUrl] = useState('')

  const [checking, setChecking] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [subChecking, setSubChecking] = useState(false)
  const [subAvailable, setSubAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (!slug && name) setSlug(toKebabCase(name))
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

  async function checkSubdomain(value: string) {
    setSubChecking(true)
    setSubAvailable(null)
    try {
      const res = await fetch(`/api/subdomain-check?subdomain=${encodeURIComponent(value)}`)
      const data = await res.json()
      setSubAvailable(!!data.ok)
    } catch (e) {
      console.error(e)
    } finally {
      setSubChecking(false)
    }
  }

  function addImage() {
    const v = newImage.trim()
    if (!v) return
    setImages((s) => [...s, v])
    setNewImage('')
  }

  function addSocial() {
    const p = newSocialPlatform.trim()
    const u = newSocialUrl.trim()
    if (!p || !u) return
    setSocialLinks((s) => [...s, { platform: p, url: u }])
    setNewSocialPlatform('')
    setNewSocialUrl('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name, slug, subdomain, phone, address, description, images, socialLinks, openingHours }
    const res = await fetch('/api/salons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) router.push('/dashboard')
    else {
      const err = await res.json()
      alert(err.error || 'A apărut o eroare')
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl animate-fade-in-up mb-8">
              <div className="flex items-center gap-4">
                <BuildingStorefrontIcon className="w-12 h-12" />
                <div>
                  <h1 className="text-3xl font-bold">Creează salonul tău</h1>
                  <p className="text-lg opacity-90">Completează informațiile de bază și publică pagina pentru clienți.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg animate-slide-in-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BuildingStorefrontIcon className="w-6 h-6 text-indigo-500" />
                  Informații de bază
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Nume salon" value={name} onChange={setName} placeholder="Numele salonului" icon={<BuildingStorefrontIcon className="w-5 h-5" />} />
                  <Input label="Telefon" value={phone} onChange={setPhone} placeholder="0740..." icon={<PhoneIcon className="w-5 h-5" />} />
                  <Input label="Adresă" value={address} onChange={setAddress} placeholder="Strada, oraș" icon={<MapPinIcon className="w-5 h-5" />} />
                  <Input label="Program (text)" value={openingHours} onChange={setOpeningHours} placeholder="Luni-Vineri 09:00-18:00" icon={<ClockIcon className="w-5 h-5" />} />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scurtă descriere</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200" rows={4} placeholder="Descrie salonul tău..." />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg animate-slide-in-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <LinkIcon className="w-6 h-6 text-purple-500" />
                  URL și domeniu
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Slug</label>
                    <div className="flex gap-3">
                      <input value={slug} onChange={(e) => setSlug(e.target.value)} onBlur={() => checkSlug(slug)} className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200" />
                      <button type="button" onClick={() => setSlug(toKebabCase(name))} className="bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-200 transition">Auto</button>
                    </div>
                    {checking && <p className="text-sm text-gray-500 mt-2">Verific slug...</p>}
                    {suggestion && (
                      <p className="text-sm text-yellow-600 mt-2">
                        Sugestie: {suggestion}{' '}
                        <button type="button" onClick={() => setSlug(suggestion)} className="ml-2 text-blue-600 font-semibold hover:underline">Folosește</button>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Subdomeniu</label>
                    <div className="flex gap-3">
                      <input value={subdomain} onChange={(e) => setSubdomain(e.target.value)} onBlur={() => checkSubdomain(subdomain)} className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200" placeholder="ex: salonul-tau" />
                      <button type="button" onClick={() => setSubdomain(toKebabCase(name))} className="bg-purple-100 text-purple-700 px-4 py-3 rounded-xl hover:bg-purple-200 transition">Auto</button>
                    </div>
                    {subChecking && <p className="text-sm text-gray-500 mt-2">Verific subdomeniu...</p>}
                    {subAvailable === true && <p className="text-sm text-green-600 mt-2 flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> Disponibil</p>}
                    {subAvailable === false && <p className="text-sm text-red-600 mt-2 flex items-center gap-1"><XCircleIcon className="w-4 h-4" /> Indisponibil</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg animate-slide-in-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <PhotoIcon className="w-6 h-6 text-pink-500" />
                  Imagini
                </h2>
                <div className="flex gap-3 mb-4">
                  <input value={newImage} onChange={(e) => setNewImage(e.target.value)} className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200" placeholder="https://..." />
                  <button type="button" onClick={addImage} className="bg-pink-100 text-pink-700 px-6 py-3 rounded-xl hover:bg-pink-200 transition font-semibold">Adaugă</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`img-${idx}`} className="w-full h-24 object-cover rounded-xl shadow" />
                      <button type="button" onClick={() => setImages((s) => s.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg animate-slide-in-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <GlobeAltIcon className="w-6 h-6 text-green-500" />
                  Rețele sociale
                </h2>
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <input value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)} placeholder="e.g. instagram" className="border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200" />
                  <input value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} placeholder="https://" className="border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200" />
                  <button type="button" onClick={addSocial} className="bg-green-100 text-green-700 px-6 py-3 rounded-xl hover:bg-green-200 transition font-semibold">Adaugă</button>
                </div>
                <div className="space-y-3">
                  {socialLinks.map((sl, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <strong className="text-gray-900">{sl.platform}</strong>
                          <p className="text-sm text-blue-600">{sl.url}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setSocialLinks((s) => s.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 transition">Șterge</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                  <BuildingStorefrontIcon className="w-6 h-6 mr-2" />
                  Creează salon
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  )
}
