import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChefHat, Heart, Users } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { getSiteBrand } from '@/lib/site/get-site-appearance';
import { resolveAboutPage } from '@/lib/static-pages/resolve';
import { createAnonServerClient } from '@/lib/supabase/anon-server';

const VALUE_ICONS = [Heart, Users, ChefHat] as const;

export async function generateMetadata() {
  const supabase = createAnonServerClient();
  const [about, { siteName }] = await Promise.all([
    resolveAboutPage(supabase),
    getSiteBrand(),
  ]);

  return buildPageMetadata({
    pathname: '/about',
    title: about.title,
    description: about.subtitle,
    siteName,
  });
}

export default async function AboutPage() {
  const supabase = createAnonServerClient();
  const [content, { siteName, siteTagline }] = await Promise.all([
    resolveAboutPage(supabase),
    getSiteBrand(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} siteTagline={siteTagline} />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">{content.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={content.storyImageUrl}
                  alt={content.storyHeading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  loading="eager"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {content.storyHeading}
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">{content.storyText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {content.missionHeading}
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">{content.missionText}</p>
              </div>
              <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
                <Image
                  src={content.missionImageUrl}
                  alt={content.missionHeading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground">
                {content.valuesHeading}
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {content.values.map((value, index) => {
                const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
                return (
                  <div key={`${value.title}-${index}`} className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer siteName={siteName} siteTagline={siteTagline} />
    </div>
  );
}
