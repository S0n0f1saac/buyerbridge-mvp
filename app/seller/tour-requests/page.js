'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellerTourRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('tour_requests')
        .select(`
          id,
          email,
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
        console.error('Error fetching tour requests:', error.message)
      } else {
        const sellerRequests = data.filter(
          (req) => req.property?.user_id === user.id
        )
        setRequests(sellerRequests)
      }

      setLoading(false)
    }

    fetchRequests()
  }, [router])

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Tour Requests</h1>
      {requests.length === 0 ? (
        <p>No tour requests yet.</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.id} style={{ marginBottom: '1rem' }}>
              <strong>Property:</strong> {r.property.title}<br />
              <strong>Email:</strong> {r.email}<br />
              <strong>Message:</strong> {r.message || '(none)'}<br />
              <strong>Requested:</strong> {new Date(r.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
