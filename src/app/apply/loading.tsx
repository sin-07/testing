/**
 * Loading Component for Apply Page
 * Displays while page is loading
 */

import { LoadingSpinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" message="Loading registration form..." />
    </div>
  );
}
