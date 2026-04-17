import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import { AppProviders } from "@/core/providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const serif = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'Ухаалаг тэмдэглэлийн дэвтэр',
    template: '%s | Mind-steps'
  },
  description: 'Сэтгэлзүйн туслах платформ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${serif.variable} antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}