import type { Metadata } from 'next';
import { Libre_Baskerville, Raleway } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { getMetadataBase } from '@/lib/seo/site-url';
import './globals.css';

/** Headings stay Baskerville; UI & body use Raleway 400 + your fallbacks (see globals @theme --font-sans). */
const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const raleway = Raleway({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
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
        className={`${libreBaskerville.variable} ${raleway.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
