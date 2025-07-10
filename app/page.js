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
    <div className="min-h-screen w-full px-4 md:px-12 lg:px-24 py-12 bg-[#F9F3EF] text-[#1B3C53] font-sans flex flex-col items-center">
      
      {/* Header */}
      <h1 className="text-7xl font-serif font-bold mb-4 text-center leading-tight tracking-tight">
        BuyerBridge
      </h1>
      <p className="text-3xl mb-12 text-center italic font-serif tracking-wide">
        Modernizing real estate
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mb-32 flex border border-[#1B3C53] rounded-full overflow-hidden">
        <input
          type="text"
          placeholder="Enter zip code or town"
          className="flex-grow px-4 py-3 text-lg outline-none bg-[#F9F3EF] text-[#1B3C53] placeholder-[#7e8a94]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 border-l border-[#1B3C53] hover:bg-[#1B3C53] hover:text-[#F9F3EF] transition text-lg"
        >
          🔍
        </button>
      </form>

      <div className="flex-grow" />

      {/* About Us */}
      <section className="w-full max-w-3xl mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-2">About Us</h2>
        <p className="text-base font-sans">
          BuyerBridge is a modern real estate platform designed to connect buyers and sellers more efficiently. 
          We combine clean design with powerful tools to make discovering, listing, and closing on properties seamless.
        </p>
      </section>

      {/* Contact */}
      <section className="w-full max-w-3xl">
        <h2 className="text-2xl font-serif font-semibold mb-2">Contact</h2>
        <p className="text-base font-sans mb-1">Email: support@buyerbridge.com</p>
        <p className="text-base font-sans">Phone: (555) 123-4567</p>
      </section>
    </div>
  )
}




