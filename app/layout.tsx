import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { AppProviders } from '@/core/providers'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const serif = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

// ── Viewport — theme color light/dark ────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F59E0B' },
    { media: '(prefers-color-scheme: dark)',  color: '#1C1814' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',       // iPhone notch / Dynamic Island
}

// ── App metadata ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  'MindSteps',
    template: '%s · MindSteps',
  },
  description: 'Сэтгэлзүйн туслах платформ — өдөр тутмын тэмдэглэл, ойлголт',
  applicationName: 'MindSteps',

  // ── PWA / Apple ───────────────────────────────────────────
  appleWebApp: {
    capable: true,
    title: 'MindSteps',
    statusBarStyle: 'default',   // 'black-translucent' notch-тай phone-д
  },

  // ── Open Graph (share preview) ────────────────────────────
  openGraph: {
    type:        'website',
    siteName:    'MindSteps',
    title:       'MindSteps — Сэтгэлзүйн тэмдэглэл',
    description: 'Өдөр тутмын тэмдэглэл, AI шинжилгээ, хувийн өсөлт',
  },

  // ── Icons ─────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${serif.variable} antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}