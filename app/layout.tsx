import type { Metadata } from 'next';
import { Lora, Source_Sans_3 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sarap Kitchen - Authentic Filipino Recipes',
    template: '%s | Sarap Kitchen',
  },
  description:
    'Discover authentic Filipino recipes with step-by-step instructions. From classic adobo to sweet leche flan, bring the flavors of the Philippines to your kitchen.',
  keywords: [
    'Filipino recipes',
    'Philippine cuisine',
    'adobo recipe',
    'sinigang recipe',
    'leche flan',
    'Asian cooking',
  ],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${lora.variable} ${sourceSans.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
