'use client';

import { SegmentErrorLayout } from '@/components/layout/segment-error-layout';

export default function RecipesError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentErrorLayout {...props} />;
}
