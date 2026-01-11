import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SmoothScrollHandler } from '@/components/providers/SmoothScrollHandler'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Masjid Baiturrahim',
  description: 'Website resmi Masjid Baiturrahim - Pusat ibadah dan kegiatan keagamaan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={plusJakartaSans.variable}>
        <QueryProvider>
          <ThemeProvider>
            <SmoothScroll />
            <SmoothScrollHandler />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
