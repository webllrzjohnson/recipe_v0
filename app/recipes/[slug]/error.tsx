'use client';

import { SegmentErrorLayout } from '@/components/layout/segment-error-layout';

export default function RecipeDetailError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentErrorLayout {...props} />;
}
