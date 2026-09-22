import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LanguageProvider } from '@/context/LanguageContext'
import { LanguageFloatingBar } from '@/components/LanguageFloatingBar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AgroVision AI – Soil & Crop Advisory Platform for Indian Farmers',
  description:
    'AI-powered Agricultural Soil Testing, Hyper-local Weather, Crop Recommendations & Fertilizer Planning for Indian Agriculture. Aligned with ICAR and Soil Health Card norms.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <LanguageFloatingBar />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
