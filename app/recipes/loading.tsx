import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { getSiteBrand } from '@/lib/site/get-site-appearance';

export default async function RecipesLoading() {
  const { siteName, siteTagline } = await getSiteBrand();
  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} siteTagline={siteTagline} />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Skeleton className="mb-4 h-10 w-48" />
            <Skeleton className="mb-8 h-4 max-w-xl" />
            <Skeleton className="mb-6 h-10 w-full max-w-md" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer siteName={siteName} siteTagline={siteTagline} />
    </div>
  );
}
