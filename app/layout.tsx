import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Telegram AI Agent',
  description: 'AI-powered Telegram bot with auto-reply, payment verification, and digital product delivery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
