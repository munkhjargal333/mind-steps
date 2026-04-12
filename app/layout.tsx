import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppProviders } from "@/core/providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Ухаалаг тэмдэглэлийн дэвтэр',
    template: '%s | Mind-steps'
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
    title: 'Mind-steps',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
