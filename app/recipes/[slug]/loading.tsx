import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecipeDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-10 sm:py-14">
          <div className="mx-auto max-w-[730px] px-4 sm:px-6 lg:px-8">
            <Skeleton className="mb-6 h-4 w-40" />
            <Skeleton className="mb-6 h-10 w-full" />
            <Skeleton className="mb-10 aspect-square max-w-md mx-auto rounded-sm" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
