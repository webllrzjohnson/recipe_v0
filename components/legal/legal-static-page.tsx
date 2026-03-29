import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LegalDocument } from '@/components/legal/legal-document';
import type { LegalPageSlug } from '@/lib/legal';
import { copy } from '@/lib/copy';
import { resolveLegalPageForPublic } from '@/lib/static-pages/resolve';
import { createAnonServerClient } from '@/lib/supabase/anon-server';

const legal = copy.legal;

export async function LegalStaticPage({ slug }: { slug: LegalPageSlug }) {
  const supabase = createAnonServerClient();
  const { content, lastUpdated } = await resolveLegalPageForPublic(
    supabase,
    slug,
    legal.lastUpdatedDate
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">{content.description}</p>
          <div className="mt-10">
            <LegalDocument
              content={content}
              lastUpdatedLabel={legal.lastUpdated}
              lastUpdated={lastUpdated}
            />
          </div>
          <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground italic">
            {legal.attorneyReview}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
