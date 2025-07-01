import './globals.css'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function RootLayout({ children }) {
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: '#f1f1f1',
          borderBottom: '1px solid #ddd'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/browse" style={{ color: '#333' }}>Browse</Link>
            <Link href="/add-property" style={{ color: '#333' }}>Add Property</Link>
            <Link href="/seller/tour-requests" style={{ color: '#333' }}>Tour Requests</Link>
            <Link href="/seller/offers" style={{ color: '#333' }}>Offers</Link>
          </div>
          <div>
            {user ? (
              <form action="/logout" method="post">
                <button type="submit">Logout</button>
              </form>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

