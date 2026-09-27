/**
 * Not Found Page
 * Displays when a page is not found
 */

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/apply">
            <Button variant="secondary">
              Register for Exam
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
