// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx — ROOT LAYOUT (Server Component)
// Provider order: Auth → Theme → Tier → Toast → children
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/shared/providers/theme.provider';
import { AuthProvider } from '@/shared/providers/auth.provider';
import { TierProvider } from '@/shared/providers/tier.provider';
import { ToastProvider } from '@/shared/providers/toast.provider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Ухаалаг тэмдэглэлийн дэвтэр',
    template: '%s | MindSteps',
  },
  description: 'Сэтгэлзүйн туслах платформ',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MindSteps',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning prevents React warning when next-themes
    // adds the `dark` class on the server vs client hydration.
    <html lang="mn" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider>
            <TierProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TierProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
