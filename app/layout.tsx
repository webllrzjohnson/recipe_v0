import type { Metadata } from 'next';
import { ConsentAwareAnalytics } from '@/components/compliance/consent-aware-analytics';
import { CookieConsentBanner } from '@/components/compliance/cookie-consent-banner';
import { Toaster } from '@/components/ui/toaster';
import { getSiteAppearance } from '@/lib/site/get-site-appearance';
import { getMetadataBase } from '@/lib/seo/site-url';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const a = await getSiteAppearance();
  const icons: Metadata['icons'] = a.faviconUrl
    ? a.faviconUrl.toLowerCase().endsWith('.svg')
      ? { icon: { url: a.faviconUrl, type: 'image/svg+xml' }, apple: a.faviconUrl }
      : { icon: a.faviconUrl, apple: a.faviconUrl }
    : {
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
      };

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: `${a.siteName} - Authentic Filipino Recipes`,
      template: `%s | ${a.siteName}`,
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
    icons,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const a = await getSiteAppearance();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={a.googleFontsHref} rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <style
          id="site-theme-overrides"
          dangerouslySetInnerHTML={{ __html: a.injectedThemeCss }}
        />
        {children}
        <Toaster />
        <CookieConsentBanner />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
