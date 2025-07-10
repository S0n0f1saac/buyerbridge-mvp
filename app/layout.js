// app/layout.js
import './globals.css'

export const metadata = {
  title: 'BuyerBridge',
  description: 'Modernizing Real Estate',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F9F3EF] text-[#1B3C53] font-[DM Sans]">
        <nav className="w-full border-b border-[#1B3C53] px-6 py-4 flex items-center justify-between text-sm bg-[#F9F3EF]">
          {/* Left nav links */}
          <div className="flex gap-6">
            <a href="/browse" className="hover:underline">Browse</a>
            <a href="/my-dashboard" className="hover:underline">My Dashboard</a>
          </div>

          {/* Center logo */}
          <a
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 font-serif font-bold text-lg hover:underline"
            style={{ fontFamily: 'Playfair Display' }}
          >
            BuyerBridge
          </a>

          {/* Right auth buttons */}
          <div className="flex gap-4">
            <a href="/login" className="px-4 py-1 border border-[#1B3C53] rounded-full hover:bg-[#1B3C53] hover:text-[#F9F3EF] transition">
              Login
            </a>
            <a href="/signup" className="px-4 py-1 border border-[#1B3C53] rounded-full hover:bg-[#1B3C53] hover:text-[#F9F3EF] transition">
              Sign Up
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}




