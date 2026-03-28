import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tagline */}
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Authentic Filipino Cuisine
          </p>

          {/* Title */}
          <h1 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            {t('heroSubtitle')}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/recipes">
                {t('exploreRecipes')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-secondary shadow-2xl">
            <Image
              src="https://placehold.co/1200x675/C0392B/FFFFFF?text=Filipino+Cuisine"
              alt="Filipino cuisine spread"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Decorative accent */}
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />
        </div>
      </div>
    </section>
  );
}
