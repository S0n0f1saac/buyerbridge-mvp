// app/layout.js
import './globals.css'

export const metadata = {
  title: 'BuyerBridge',
  description: 'Modernizing Real Estate',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="w-full border-b border-black bg-white px-6 py-4 flex items-center justify-between text-sm">
          {/* Left nav links */}
          <div className="flex gap-6">
            <a href="/browse" className="hover:underline">Browse</a>
            <a href="/add-property" className="hover:underline">Add Property</a>
            <a href="/my-properties" className="hover:underline">My Properties</a>
            <a href="/seller/tour-requests" className="hover:underline">Tour Requests</a>
            <a href="/seller/offers" className="hover:underline">Offers</a>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 font-serif font-bold text-lg">
            BuyerBridge
          </div>

          {/* Right auth buttons */}
          <div className="flex gap-4">
            <a href="/login" className="px-4 py-1 border border-black rounded-full hover:bg-black hover:text-white transition">
              Login
            </a>
            <a href="/signup" className="px-4 py-1 border border-black rounded-full hover:bg-black hover:text-white transition">
              Sign Up
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}



