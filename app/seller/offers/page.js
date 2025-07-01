'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellerOffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOffers = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          email,
          price,
          message,
          created_at,
          property:property_id (
            id,
            title,
            user_id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching offers:', error.message)
      } else {
        const sellerOffers = data.filter(
          (offer) => offer.property?.user_id === user.id
        )
        setOffers(sellerOffers)
      }

      setLoading(false)
    }

    fetchOffers()
  }, [router])

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Property Offers</h1>
      {offers.length === 0 ? (
        <p>No offers yet.</p>
      ) : (
        <ul>
          {offers.map((offer) => (
            <li key={offer.id} style={{ marginBottom: '1rem' }}>
              <strong>Property:</strong> {offer.property.title}<br />
              <strong>Email:</strong> {offer.email}<br />
              <strong>Offer:</strong> ${Number(offer.price).toLocaleString()}<br />
              <strong>Message:</strong> {offer.message || '(none)'}<br />
              <strong>Submitted:</strong> {new Date(offer.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
