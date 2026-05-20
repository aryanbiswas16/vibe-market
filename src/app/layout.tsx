import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vibe — get paid to play',
  description:
    'The streamer marketplace where devs pay streamers to play their games. Fortnite, Roblox, Minecraft, indie Steam games — get paid to do what you love.',
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
    title: 'Vibe — get paid to play',
    description:
      'The streamer marketplace where devs pay streamers to play their games.',
    type: 'website',
    siteName: 'Vibe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe — get paid to play',
    description:
      'The streamer marketplace where devs pay streamers to play their games.',
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
        {children}
      </body>
    </html>
  )
}