'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MyDashboard() {
  const [user, setUser] = useState(null)
  const [properties, setProperties] = useState([])
  const [offers, setOffers] = useState([])
  const [tours, setTours] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      setUser(userData.user)

      // Fetch user properties
      const { data: userProperties } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userData.user.id)
      setProperties(userProperties || [])

      // Fetch offers made by this user
      const { data: userOffers } = await supabase
        .from('offers')
        .select('*')
        .eq('user_id', userData.user.id)
      setOffers(userOffers || [])

      // Fetch tour requests for user's properties
      const { data: userTours } = await supabase
        .from('tour_requests')
        .select('*')
        .in('property_id', userProperties.map(p => p.id))
      setTours(userTours || [])
    }

    fetchData()
  }, [])

  if (!user) {
    return <p className="p-6 text-center">Please log in to view your dashboard.</p>
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto text-black">

      <h1 className="text-3xl font-bold mb-8 text-center">My Dashboard</h1>

      {/* My Properties */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">My Properties</h2>

        <div className="mb-4">
          <a
            href="/add-property"
            className="inline-block px-6 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
          >
            + Add New Property
          </a>
        </div>

        {properties.length === 0 ? (
          <p className="text-sm">You haven't listed any properties yet.</p>
        ) : (
        <ul className="space-y-3">
          {properties.map((p) => (
            <li key={p.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm">{p.address}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`/edit-property/${p.id}`}
                  className="text-sm px-4 py-1 border border-black rounded hover:bg-black hover:text-white transition"
                >
                  Edit
                </a>
                <button
                  onClick={async () => {
                    const confirmed = confirm('Are you sure you want to delete this property?')
                    if (confirmed) {
                      const { error } = await supabase.from('properties').delete().eq('id', p.id)
                      if (!error) location.reload()
                      else alert('Delete failed.')
                    }
                  }}
                  className="text-sm px-4 py-1 border border-black rounded hover:bg-black hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        )}
      </section>

      {/* My Offers */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">My Offers</h2>
        {offers.length === 0 ? (
          <p className="text-sm">You haven't submitted any offers.</p>
        ) : (
          <ul className="space-y-3">
            {offers.map((o) => (
              <li key={o.id} className="border p-4 rounded">
                <p className="font-semibold">Offer for Property ID: {o.property_id}</p>
                <p className="text-sm">Price: ${o.price}</p>
                <p className="text-sm">Message: {o.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tour Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tour Requests for Your Properties</h2>
        {tours.length === 0 ? (
          <p className="text-sm">No tour requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {tours.map((t) => (
              <li key={t.id} className="border p-4 rounded">
                <p className="font-semibold">Request for Property ID: {t.property_id}</p>
                <p className="text-sm">Email: {t.email}</p>
                <p className="text-sm">Message: {t.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
