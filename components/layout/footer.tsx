'use client';

import Link from 'next/link';
import { copy } from '@/lib/copy';
import { ChefHat, Facebook, Instagram, Youtube } from 'lucide-react';

const common = copy.common;
const footer = copy.footer;

export function Footer() {
  const quickLinks = [
    { href: '/', label: common.home },
    { href: '/recipes', label: common.recipes },
    { href: '/categories', label: common.categories },
    { href: '/blog', label: common.blog },
    { href: '/about', label: common.about },
  ];

  const legalLinks = [
    { href: '/privacy', label: footer.privacyPolicy },
    { href: '/terms', label: footer.termsOfUse },
    { href: '/disclaimer', label: footer.disclaimer },
    { href: '/cookies', label: footer.cookiePolicy },
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="font-serif text-xl font-bold text-foreground">
                {common.siteName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{footer.description}</p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
              {footer.quickLinks}
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

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
              {footer.legalHeading}
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

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
              {footer.followUs}
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

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {common.siteName}. {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
