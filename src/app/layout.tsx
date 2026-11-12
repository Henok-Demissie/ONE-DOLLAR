import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'One Dollar Project — One Dollar. One Dream. Millions of Possibilities.',
    template: '%s | One Dollar Project',
  },
  description:
    'A premium donation platform and hire-me portfolio. Support a dream with just $1 or hire a world-class developer for your next project.',
  keywords: [
    'donation',
    'crypto donation',
    'hire developer',
    'freelance',
    'portfolio',
    'one dollar',
    'web development',
    'Next.js developer',
    'full stack developer',
  ],
  authors: [{ name: 'One Dollar Project' }],
  creator: 'One Dollar Project',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    title: 'One Dollar Project',
    description: 'One Dollar. One Dream. Millions of Possibilities.',
    siteName: 'One Dollar Project',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Dollar Project',
    description: 'One Dollar. One Dream. Millions of Possibilities.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD700',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-dark-800 text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111111',
                color: '#f5f5f5',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#FFD700',
                  secondary: '#111111',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#111111',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
