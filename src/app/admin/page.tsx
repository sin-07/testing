/**
 * Admin Login Page
 * Entry point for admin authentication
 */

import { redirect } from 'next/navigation';
import { checkAdminSession } from '@/actions/admin';
import AdminLoginForm from './AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Check if already logged in
  const session = await checkAdminSession();
  
  if (session?.isAuthenticated) {
    redirect('/admin/dashboard');
  }

  return <AdminLoginForm />;
}
