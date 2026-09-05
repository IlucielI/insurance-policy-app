import type { Metadata } from 'next'
import './globals.css'
import FloatingChat from '@/components/FloatingChat'
import Providers from '@/components/Providers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import LocaleInitializer from '@/components/LocaleInitializer'

export const metadata: Metadata = {
  title: 'Insurance Policy System',
  description: 'Asuransi yang transparan dan mudah dipahami',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <html lang="id">
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <LocaleInitializer />
            {children}
            <FloatingChat />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
