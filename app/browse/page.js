'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BrowsePage() {
  const [properties, setProperties] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState(null)

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

  const toggleFilter = (filter) => {
    setActiveFilter((prev) => (prev === filter ? null : filter))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">

      {/* Top Buttons */}
      <div className="flex justify-center gap-6 mb-6">
        {['For Sale', 'For Rent', 'Just Sold'].map((label) => {
          const isActive = activeFilter === label
          return (
            <button
              key={label}
              onClick={() => toggleFilter(label)}
              className={`px-6 py-2 rounded-full border text-sm font-medium transition 
                ${isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-black hover:bg-gray-100'}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <h2 className="text-lg font-semibold mb-2">Filters</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-wrap justify-center gap-6 mb-4">

          {/* Beds Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="beds" className="text-sm">Beds:</label>
            <select id="beds" className="border rounded p-1 text-sm">
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* Baths Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="baths" className="text-sm">Baths:</label>
            <select id="baths" className="border rounded p-1 text-sm">
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* Checkbox Filters */}
          {['Office', 'Theatre', 'Pool', 'Gym', 'Basement'].map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4" />
              {feature}
            </label>
          ))}
        </div>

        {/* Search Bar + Map Button */}
        <div className="flex items-center gap-4 w-full justify-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by address or keyword..."
              className="w-full border rounded-full py-2 pl-4 pr-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              🔍
            </button>
          </div>

          <button
            className={`px-6 py-2 rounded-full border text-sm font-medium transition
              ${activeFilter === 'Map'
                ? 'bg-black text-white'
                : 'bg-white text-black border-black hover:bg-gray-100'}`}
            onClick={() => toggleFilter('Map')}
          >
            Map
          </button>
        </div>
      </div>

      {/* Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          filtered.map((property) => (
            <div
              key={property.id}
              className="bg-white border rounded shadow hover:shadow-md transition cursor-pointer overflow-hidden"
              onClick={() => window.location.href = `/property/${property.id}`}
            >
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 text-sm">
                <h3 className="text-base font-semibold mb-1">{property.address}</h3>
                <p className="mb-1">
                  {property.bedrooms || '?'} Beds • {property.bathrooms || '?'} Baths • {property.sqft || '?'} Sqft
                </p>
                <p className="text-lg font-bold">${property.price?.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


