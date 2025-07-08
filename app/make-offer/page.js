'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MakeOfferPage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setEmail(data?.user?.email || '')
    }

    const id = searchParams.get('property_id')
    if (id) setPropertyId(id)

    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('offers').insert([
      {
        property_id: propertyId,
        email,
        price: parseFloat(price),
        message
      }
    ])

    if (error) {
      alert('Error submitting offer.')
      console.error(error)
    } else {
      alert('Offer submitted successfully!')
      router.push('/browse')
    }
  }

  if (!user) {
    return <p className="p-6 text-center">Please log in to make an offer.</p>
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Make an Offer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={email}
          disabled
        />
        <input
          type="number"
          placeholder="Offer Price"
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          className="w-full border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        <button type="submit" className="px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition">
          Submit Offer
        </button>
      </form>
    </div>
  )
}

