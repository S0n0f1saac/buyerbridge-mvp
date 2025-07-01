'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id
  const [property, setProperty] = useState(null)

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formStatus, setFormStatus] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching property:', error.message)
      } else {
        setProperty(data)
      }
    }

    fetchProperty()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('tour_requests').insert([{
      email,
      message,
      property_id: id,
    }])

    if (error) {
      console.error("Tour request error:", error.message)
      setFormStatus('Something went wrong. Please try again.')
    } else {
      setFormStatus('Tour request submitted! ✅')
      setEmail('')
      setMessage('')
    }
  }

  if (!property) return <p style={{ padding: '2rem' }}>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{property.title}</h1>

      {property.image_url && (
        <img
          src={property.image_url}
          alt={property.title}
          style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
        />
      )}

      <p>{property.description}</p>
      <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>

      <hr style={{ margin: '2rem 0' }} />
      <h2>Schedule a Tour</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <textarea
          placeholder="Optional message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        /><br /><br />
        <button type="submit">Request Tour</button>
        <p>{formStatus}</p>
      </form>
    </div>
  )
}


