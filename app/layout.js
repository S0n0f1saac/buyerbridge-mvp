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
        {/* Your navbar goes here */}
        {children}
      </body>
    </html>
  )
}



