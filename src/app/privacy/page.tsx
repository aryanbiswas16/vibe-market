import Link from 'next/link'
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Eye, Shield, Share2, Lock, Cookie, FileText, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Vibe',
  description:
    'Learn how Vibe Marketplace collects, uses, and protects your personal data. Read our privacy policy.',
}

const sections = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    content: [
      'We collect information you provide when creating an account, including your name, email address, payment information, and streaming platform connections. This data is necessary to provide our marketplace services.',
      'We automatically collect certain information when you use Vibe, including IP address, browser type, device information, and usage patterns. This helps us improve our platform and detect fraudulent activity.',
      'Streamers may provide additional profile information such as follower counts, average viewership, and streaming schedule. Developers may provide company information and game details.',
    ],
  },
  {
    icon: Shield,
    title: '2. How We Use Your Information',
    content: [
      'Your information is used to operate and maintain the Vibe Marketplace, process transactions, facilitate communication between users, and provide customer support.',
      'We may use aggregated, anonymized data for analytics, marketing, and platform improvement. This data cannot be used to identify individual users.',
      'Your email address may be used to send service-related notifications, payment confirmations, and updates about the platform. You can opt out of marketing communications at any time.',
    ],
  },
  {
    icon: Share2,
    title: '3. Data Sharing',
    content: [
      'We share information with third-party payment processors to facilitate transactions. These processors are bound by strict data protection agreements and may not use your data for any other purpose.',
      'Information you choose to make public on your profile, such as streaming statistics and portfolio content, is visible to other Vibe users. You control what information is displayed on your public profile.',
      'We do not sell your personal information to third parties. We may disclose information if required by law, to enforce our terms, or to protect the rights and safety of our users.',
    ],
  },
  {
    icon: Lock,
    title: '4. Data Security',
    content: [
      'We implement industry-standard security measures to protect your data, including encryption in transit and at rest, regular security audits, and access controls.',
      'Payment information is processed and stored by our PCI-compliant payment partners. We do not store full credit card numbers or CVV codes on our servers.',
      'Despite our efforts, no method of electronic storage or transmission is 100% secure. We encourage users to enable two-factor authentication and use strong, unique passwords.',
    ],
  },
  {
    icon: Cookie,
    title: '5. Cookies',
    content: [
      'Vibe uses cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze platform usage. Essential cookies are required for the platform to function.',
      'Third-party analytics providers may use cookies to help us understand how users interact with our platform. You can control cookie settings through your browser preferences.',
      'By using Vibe, you consent to our use of cookies in accordance with this policy. You may disable cookies through your browser settings, though this may affect platform functionality.',
    ],
  },
  {
    icon: FileText,
    title: '6. Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal data at any time through your account settings. You may also request a copy of the data we hold about you.',
      'You can export your data or delete your account entirely from your account settings. Account deletion is irreversible and will remove your profile, gig history, and associated data.',
      'Depending on your jurisdiction, you may have additional rights under applicable privacy laws, including the right to data portability and the right to restrict processing.',
    ],
  },
  {
    icon: Mail,
    title: '7. Contact',
    content: [
      'If you have questions about this privacy policy or how we handle your data, please contact our privacy team at privacy@vibe.market.',
      'You may also write to us at: Vibe Marketplace, Attn: Privacy Department. We will respond to all privacy inquiries within 30 days.',
    ],
  },
]

function Header() {
  return (
    <header className="shadow-divider">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          <span className="text-caption font-bold text-zinc-50">Vibe</span>
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="shadow-divider py-8">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-small text-zinc-700">
          &copy; 2026 Vibe Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-display text-zinc-50">Privacy Policy</h1>
          <p className="mt-2 text-body text-zinc-500">Last updated: January 15, 2026</p>
        </div>
        <div className="space-y-5">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg surface-3 text-brand">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-body leading-relaxed text-zinc-400">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
