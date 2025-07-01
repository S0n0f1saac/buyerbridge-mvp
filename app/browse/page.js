'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BrowsePage() {
  const [properties, setProperties] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error.message)
      } else {
        setProperties(data)
        setFiltered(data)
      }
    }

    fetchProperties()
  }, [])

  const handleFilter = () => {
    const min = Number(minPrice) || 0
    const max = Number(maxPrice) || Infinity
    const keyword = search.toLowerCase()

    const result = properties.filter((p) => {
      const inPriceRange = p.price >= min && p.price <= max
      const matchesKeyword =
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
      return inPriceRange && matchesKeyword
    })

    setFiltered(result)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Browse Properties</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search title/description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {filtered.length === 0 ? (
          <p>No results found.</p>
        ) : (
          filtered.map((property) => (
            <div key={property.id} style={{ width: '300px' }}>
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt={property.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              )}
              <h3 style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => window.location.href = `/property/${property.id}`}>
               {property.title}
                </h3>
              <p>{property.description}</p>
              <p><strong>${property.price.toLocaleString()}</strong></p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
