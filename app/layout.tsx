import type { Metadata } from 'next'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'SymptoSeek',
  description: 'Seek the perfect doctor for your symptoms',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
      <body>
      {children}
      <SpeedInsights />
      </body>
      </html>
  )
}
