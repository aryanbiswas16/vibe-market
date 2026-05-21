import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'Vibe | Streamer Marketplace for Game Creators',
  description:
    'A paid gig marketplace where game creators hire streamers and streamers find games worth playing.',
  keywords: [
    'streamer',
    'marketplace',
    'gaming',
    'twitch',
    'youtube',
    'fortnite',
    'roblox',
    'minecraft',
    'indie games',
    'sponsorship',
  ],
  openGraph: {
    title: 'Vibe | Streamer Marketplace for Game Creators',
    description:
      'A paid gig marketplace where game creators hire streamers and streamers find games worth playing.',
    type: 'website',
    siteName: 'Vibe',
    images: ['/marketplace-hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe | Streamer Marketplace for Game Creators',
    description:
      'A paid gig marketplace where game creators hire streamers and streamers find games worth playing.',
    images: ['/marketplace-hero.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-black text-zinc-100 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
