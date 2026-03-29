import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChefHat, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const t = useTranslations();

  const quickLinks = [
    { href: '/', label: t('common.home') },
    { href: '/recipes', label: t('common.recipes') },
    { href: '/categories', label: t('common.categories') },
    { href: '/blog', label: t('common.blog') },
    { href: '/about', label: t('common.about') },
  ];

  const legalLinks = [
    { href: '/privacy', label: t('footer.privacyPolicy') },
    { href: '/terms', label: t('footer.termsOfUse') },
    { href: '/disclaimer', label: t('footer.disclaimer') },
    { href: '/cookies', label: t('footer.cookiePolicy') },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="font-serif text-xl font-bold text-foreground">
                {t('common.siteName')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
              {t('footer.quickLinks')}
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
              {t('footer.legalHeading')}
            </h3>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
              {t('footer.followUs')}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('common.siteName')}.{' '}
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
