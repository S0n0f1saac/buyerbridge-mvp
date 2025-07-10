'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/browse?query=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="min-h-screen w-full px-4 md:px-12 lg:px-24 py-12 text-black flex flex-col items-center">
      {/* Header */}
      <h1 className="text-5xl font-bold mb-4 text-center font-serif leading-tight tracking-tight">
        Modernizing real estate
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mb-32 flex border border-black rounded-full overflow-hidden">
        <input
          type="text"
          placeholder="Enter an address, zip code, neighborhood or city"
          className="flex-grow px-4 py-3 text-lg outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 border-black hover:bg-black hover:text-white transition text-md"
        >
          Search
        </button>
      </form>

      <div className="flex-grow" />

      {/* About Us */}
      <section className="w-full max-w-3xl mb-12">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-base">
          BuyerBridge is a modern real estate platform designed to connect buyers and sellers more efficiently. 
          We combine clean design with powerful tools to make discovering, listing, and closing on properties seamless.
        </p>
      </section>

      {/* Contact */}
      <section className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p className="text-base mb-1">Email: support@buyerbridge.com</p>
        <p className="text-base">Phone: (555) 555-5555</p>
      </section>
    </div>
  )
}


