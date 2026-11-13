import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'One Dollar Project — Henok Demissie',
    template: '%s | One Dollar Project',
  },
  description:
    'One dollar can help build a million-dollar dream. An audacious proof-of-possibility movement by Henok Demissie (Anthropic via Revelo, YC Afterquery, Codeforces Top 5%) rising from $0 to elevate Ethiopian and African tech.',
  keywords: [
    'Henok Demissie',
    'One Dollar Project',
    'AI Engineer',
    'Ethiopian Tech',
    'Anthropic',
    'Y Combinator',
    'Codeforces Expert',
    'Software Engineer',
    'Micro Donations',
  ],
  authors: [{ name: 'Henok Demissie' }],
  creator: 'Henok Demissie',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://one-dollar-psi.vercel.app',
    title: 'One Dollar Project — Henok Demissie',
    description: 'One dollar can help build a million-dollar dream. The Proof-of-Possibility Experiment.',
    siteName: 'One Dollar Project',
    images: [
      {
        url: 'https://one-dollar-psi.vercel.app/poster-twitter.jpg',
        width: 1200,
        height: 675,
        alt: 'One Dollar Project — Henok Demissie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Dollar Project — Henok Demissie',
    description: 'One dollar can help build a million-dollar dream. The Proof-of-Possibility Experiment.',
    images: ['https://one-dollar-psi.vercel.app/poster-twitter.jpg'],
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
  themeColor: '#0DCB3D',
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
    <html lang="en" suppressHydrationWarning>
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
