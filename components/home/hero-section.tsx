import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { HomePageStoredContent } from '@/lib/static-pages/types';

export interface HeroSectionProps {
  content: HomePageStoredContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            {content.tagline}
          </p>

          <h1 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.heroTitle}
          </h1>

          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            {content.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/recipes" prefetch>
                {content.exploreRecipesLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/blog" prefetch>
                {content.blogLabel}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-secondary shadow-2xl">
            {/* CMS URLs may be any origin — use <img> so Next image domains need no config */}
            <img
              src={content.heroImageUrl}
              alt={content.heroImageAlt}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/10" />
        </div>
      </div>
    </section>
  );
}
