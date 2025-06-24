'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProperties = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error.message)
      } else {
        setProperties(data)
      }

      setLoading(false)
    }

    fetchProperties()
  }, [router])

  if (loading) return <p>Loading your listings...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Properties</h1>
      {properties.length === 0 ? (
        <p>You haven’t listed any properties yet.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id} style={{ marginBottom: '1rem' }}>
              <strong>{property.title}</strong><br />
              {property.description}<br />
              Price: ${property.price.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
