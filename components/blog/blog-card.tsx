import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import type { LocalizedBlogPost } from '@/lib/types/database';

export function BlogCard({
  post,
  priority = false,
}: {
  post: LocalizedBlogPost;
  priority?: boolean;
}) {
  return (
    <Link href={`/blog/${post.slug}`} prefetch className="block">
      <Card className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={
              post.image_url ||
              'https://placehold.co/960x540/C0392B/FFFFFF?text=Blog'
            }
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            priority={priority}
            loading={priority ? 'eager' : undefined}
          />
        </div>
        <CardContent className="p-4">
          <h2 className="mb-2 font-serif text-lg font-bold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
