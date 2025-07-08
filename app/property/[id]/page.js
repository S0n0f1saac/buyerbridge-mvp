'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserAndProperty = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData?.user || null)

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) console.error(error)
      else setProperty(data)
    }

    fetchUserAndProperty()
  }, [id])

  if (!property) return <p className="p-6">Loading...</p>

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-6 text-black">

      {/* Hero Image with Subtle Arrows */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button className="text-xs px-2 py-1 border border-black rounded-full bg-white hover:bg-black hover:text-white transition">
          ◀
        </button>
        <div className="w-full max-w-6xl">
          <img
            src={property.image_url}
            alt="Main"
            className="w-full h-[600px] object-cover border"
          />
        </div>
        <button className="text-xs px-2 py-1 border border-black rounded-full bg-white hover:bg-black hover:text-white transition">
          ▶
        </button>
      </div>

      {/* Image Preview Row */}
      <div className="flex gap-4 justify-center mb-6">
        {[1, 2, 3].map((i) => (
          <img
            key={i}
            src={property.image_url}
            alt={`Preview ${i}`}
            className="w-24 h-16 object-cover border cursor-pointer"
          />
        ))}
      </div>

      {/* Main Info Section */}
      <div className="mb-4 text-lg">
        <h2 className="text-3xl font-bold mb-2">Price: ${property.price?.toLocaleString()}</h2>
        <p className="mb-1">
          {property.bedrooms || '?'} Beds • {property.bathrooms || '?'} Baths • {property.sqft || '?'} Sqft • {property.lot_size || '?'} Acres
        </p>
        <p className="mb-1">{property.address || 'Address not listed'}</p>
        <p className="mb-1">School District: {property.school_district || 'N/A'}</p>
      </div>

      {/* Spec Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-base font-medium my-6">
        <div>Year Built: {property.year_built || '?'}</div>
        <div>Price / Sqft: ${property.price_per_sqft || '?'}</div>
        <div>Days on BuyerBridge: {property.days_listed || '?'}</div>
        <div>Garage: {property.garage_size || '?'}</div>
      </div>

      {/* Auth-Protected Buttons */}
      {user ? (
        <div className="flex justify-center gap-6 mb-6 text-base">
          <button
            className="px-6 py-3 border border-black rounded-full hover:bg-black hover:text-white transition"
            onClick={() => router.push(`/request-tour?property_id=${id}`)}
          >
            Request Tour
          </button>
          <button
            className="px-6 py-3 border border-black rounded-full hover:bg-black hover:text-white transition"
          >
            Virtual Tour
          </button>
          <button
            className="px-6 py-3 border border-black rounded-full hover:bg-black hover:text-white transition"
            onClick={() => router.push(`/make-offer?property_id=${id}`)}
          >
            Send Offer
          </button>
        </div>
      ) : (
        <p className="text-center mb-6 text-sm italic">
          Please <a href="/login" className="underline">log in</a> to request a tour or make an offer.
        </p>
      )}

      <hr className="my-6 border-black" />

      {/* Affordability Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-center mb-4">Affordability Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-base">
          <div>Est. $$/Month</div>
          <div>Utility Cost</div>
          <div>HOA Cost</div>
          <div>Yearly Tax</div>
          <div>Insurance</div>
          <div>Water</div>
          <div>Electric</div>
          <div>Gas</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">About this home</h3>
        <p>{property.description || 'No description available.'}</p>
      </div>

      <hr className="my-6 border-black" />

      {/* Map Placeholder */}
      <div className="h-64 bg-gray-100 border flex items-center justify-center text-base text-gray-600">
        MAP Placeholder — location of property will go here
      </div>
    </div>
  )
}





