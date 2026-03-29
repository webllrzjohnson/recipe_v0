import type { LegalPageContent } from '@/lib/legal';

type LegalDocumentProps = {
  content: LegalPageContent;
  lastUpdatedLabel: string;
  lastUpdated: string;
};

export function LegalDocument({
  content,
  lastUpdatedLabel,
  lastUpdated,
}: LegalDocumentProps) {
  return (
    <article className="legal-document space-y-10">
      <p className="text-sm text-muted-foreground">
        {lastUpdatedLabel}: {lastUpdated}
      </p>
      {content.sections.map((section, si) => (
        <section key={si} className="space-y-4">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {section.title}
          </h2>
          {section.paragraphs.map((paragraph, pi) => (
            <p key={pi} className="text-pretty text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
