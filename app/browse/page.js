'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const PROPERTY_TYPES = ['sale', 'rent', 'sold']
const FEATURES = ['office', 'theatre', 'pool', 'gym', 'basement']

export default function BrowsePage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [type, setType] = useState(null)
  const [beds, setBeds] = useState(null)
  const [baths, setBaths] = useState(null)
  const [features, setFeatures] = useState({})
  const [sqft, setSqft] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Sync filter state from URL
  useEffect(() => {
    const q = searchParams.get('query') || ''
    const t = searchParams.get('type') || null
    const b = searchParams.get('beds') || null
    const ba = searchParams.get('baths') || null
    const sq = searchParams.get('sqft') || null

    const f = {}
    FEATURES.forEach(feat => {
      if (searchParams.get(feat) === 'true') f[feat] = true
    })

    setQuery(q)
    setType(t)
    setBeds(b)
    setBaths(ba)
    setFeatures(f)
    setSqft(sq)
  }, [searchParams])

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)

      let q = supabase.from('properties').select('*')

      if (type) q = q.eq('type', type)
      if (beds) q = q.eq('bedrooms', parseInt(beds))
      if (baths) q = q.eq('bathrooms', parseInt(baths))
      FEATURES.forEach(feat => {
        if (features[feat]) q = q.eq(feat, true)
      })
      if (query) {
        q = q.ilike('title', `%${query}%`)
      }

      if (sqft) {
        const [min, max] = sqft.includes('-')
          ? sqft.split('-').map(Number)
          : sqft.startsWith('<')
          ? [0, 999]
          : [2501, 100000]

        q = q.gte('sqft', min).lte('sqft', max)
      }

      const { data, error } = await q

      if (error) console.error('Fetch failed:', error)
      else setProperties(data)

      setLoading(false)
    }

    fetchProperties()
  }, [type, beds, baths, features, query])

  // Update URL
  const updateURL = () => {
    const params = new URLSearchParams()
    if (query) params.set('query', query)
    if (type) params.set('type', type)
    if (beds) params.set('beds', beds)
    if (baths) params.set('baths', baths)
    if (sqft) params.set('sqft', sqft)
    FEATURES.forEach(f => {
      if (features[f]) params.set(f, 'true')
    })
    router.push(`/browse?${params.toString()}`)
  }

  const toggleFeature = (key) => {
    setFeatures(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      return updated
    })
  }

  return (
    <div className="min-h-screen p-6 bg-[#F9F3EF] text-[#1B3C53] font-sans">
      {/* Type Filters */}
      <div className="flex justify-center gap-4 mb-6">
        {PROPERTY_TYPES.map(t => (
          <button
            key={t}
            onClick={() => {
              setType(type === t ? null : t)
              setTimeout(updateURL, 0)
            }}
            className={`px-6 py-2 rounded-full border ${
              type === t ? 'bg-[#1B3C53] text-[#F9F3EF]' : 'border-[#1B3C53]'
            } transition`}
          >
            {t === 'sale' ? 'For Sale' : t === 'rent' ? 'For Rent' : 'Just Sold'}
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="mb-6">

        {/* Beds & Baths & Sqft Selectors */}
        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <select
            value={beds || ''}
            onChange={(e) => {
              setBeds(e.target.value || null)
              updateURL()
            }}
            className="border px-4 py-2 rounded"
          >
            <option value=""># of Beds</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select
            value={baths || ''}
            onChange={(e) => {
              setBaths(e.target.value || null)
              updateURL()
            }}
            className="border px-4 py-2 rounded"
          >
            <option value=""># of Baths</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select
            value={sqft || ''}
            onChange={(e) => {
              setSqft(e.target.value || null)
              updateURL()
            }}
            className="border px-4 py-2 rounded"
          >
            <option value="">Sqft Range</option>
            <option value="<1000">{'< 1000'}</option>
            <option value="1000-1500">1000–1500</option>
            <option value="1500-2000">1500–2000</option>
            <option value="2000-2500">2000–2500</option>
            <option value=">2500">{'> 2500'}</option>
          </select>
        </div>

        {/* Feature Checkboxes */}
        <div className="flex flex-wrap gap-4 justify-center">
          {FEATURES.map(f => (
            <label key={f} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={features[f] || false}
                onChange={() => {
                  toggleFeature(f)
                  setTimeout(updateURL, 0)
                }}
              />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center items-center gap-2 mb-8">
        <input
          type="text"
          placeholder="Search by zip or town"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 w-96 rounded bg-[#F9F3EF] text-[#1B3C53] placeholder-gray-500"
        />
        <button
          onClick={updateURL}
          className="px-4 py-2 border border-[#1B3C53] rounded hover:bg-[#1B3C53] hover:text-[#F9F3EF]"
        >
          🔍
        </button>
      </div>

      {/* Property Grid */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
        <a
          key={p.id}
          href={`/property/${p.id}`}
          className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition block"
        >
          <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover rounded mb-2" />
          <h3 className="font-bold">{p.title}</h3>
          <p className="text-sm">{p.bedrooms} Bed • {p.bathrooms} Bath • {p.sqft} Sqft</p>
          <p className="text-sm mt-1">${p.price?.toLocaleString()}</p>
        </a>
      ))}
        </div>
      )}
    </div>
  )
}



