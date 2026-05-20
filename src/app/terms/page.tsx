import Link from 'next/link'
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Shield, DollarSign, Users, AlertTriangle, XCircle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — Vibe',
  description:
    'Read the terms of service for Vibe Marketplace. Learn about your rights and responsibilities as a user of the platform.',
}

const sections = [
  {
    icon: Shield,
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using Vibe Marketplace ("Vibe", "we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the platform.',
      'We reserve the right to update or modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of Vibe after any changes constitutes acceptance of the updated terms.',
      'These terms apply to all users of the platform, including developers, streamers, and visitors. Additional terms may apply to specific features or services.',
    ],
  },
  {
    icon: DollarSign,
    title: '2. Marketplace Services',
    content: [
      'Vibe operates as a marketplace connecting game developers with streamers for paid promotional gigs. We facilitate communication and payment processing but are not a party to the agreement between developers and streamers.',
      'All gigs posted on Vibe must comply with applicable laws and platform guidelines. Developers are responsible for the accuracy of their gig descriptions and the fulfillment of promised payments.',
      'Vibe charges a service fee on completed transactions. The fee structure is displayed at the time of gig posting and may vary based on the type and size of the gig.',
    ],
  },
  {
    icon: Users,
    title: '3. User Accounts',
    content: [
      'You must create an account to use Vibe\'s services. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.',
      'You must provide accurate, current, and complete information during registration. Vibe reserves the right to suspend or terminate accounts that provide false or misleading information.',
      'Each user may maintain only one account. Multiple accounts, account sharing, or any attempt to circumvent our systems is prohibited.',
    ],
  },
  {
    icon: DollarSign,
    title: '4. Payments & Payouts',
    content: [
      'All payments are processed through our secure payment partners. Developers must have sufficient funds in their account before a gig can be activated. Streamers will receive payouts according to the terms specified in each gig.',
      'Payouts are processed within 3-5 business days after gig completion, subject to verification. Vibe reserves the right to hold payments pending dispute resolution.',
      'Chargebacks, fraudulent activity, or payment disputes may result in account suspension and legal action. Vibe is not responsible for delays caused by third-party payment processors.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '5. Content & Conduct',
    content: [
      'Users retain ownership of content they post on Vibe. By posting content, you grant Vibe a non-exclusive, royalty-free license to display, distribute, and promote that content on the platform.',
      'Prohibited conduct includes harassment, fraud, spam, impersonation, posting misleading information, and any activity that violates applicable laws or third-party rights.',
      'Streamers must comply with platform-specific guidelines (Twitch, YouTube, etc.) when streaming Vibe gigs. Developers must not require streamers to violate their platform\'s terms of service.',
    ],
  },
  {
    icon: XCircle,
    title: '6. Limitation of Liability',
    content: [
      'Vibe Marketplace is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.',
      'Vibe shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability is limited to the fees paid by you in the 12 months preceding the claim.',
      'Users agree to indemnify and hold Vibe harmless from any claims arising from their use of the platform, violation of these terms, or infringement of any third-party rights.',
    ],
  },
  {
    icon: XCircle,
    title: '7. Termination',
    content: [
      'Either party may terminate these terms at any time by discontinuing use of the platform. Vibe reserves the right to suspend or terminate accounts for violations of these terms or for any reason at our discretion.',
      'Upon termination, your right to access the platform ceases immediately. Sections regarding liability, payment obligations, and dispute resolution will survive termination.',
      'Terminated users may not re-register without prior written consent from Vibe. We reserve the right to delete account data after a reasonable period following termination.',
    ],
  },
  {
    icon: Mail,
    title: '8. Contact',
    content: [
      'For questions about these terms or any other inquiries, please contact us at support@vibe.market. We aim to respond to all inquiries within 48 hours.',
      'Legal notices may be sent to Vibe Marketplace, Attn: Legal Department. We may provide notices to you via email or through the platform.',
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-display text-zinc-50">Terms of Service</h1>
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
