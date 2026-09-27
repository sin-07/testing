import { redirect } from 'next/navigation';
import { checkAdminSession, adminLogout } from '@/actions/admin';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const navItems = [
  { href: '/admin/dashboard', label: 'Command Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/students', label: 'Candidate Directory', icon: Users },
  { href: '/admin/dashboard/slots', label: 'Center Allocations', icon: Building2 },
];

async function handleLogout() {
  'use server';
  await adminLogout();
  redirect('/admin');
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAdminSession();

  if (!session?.isAuthenticated) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="h-full flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-base tracking-tight text-white block">
                    Admin Portal
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Central System</span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2 block">
                Navigation
              </span>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
                >
                  <item.icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* User profile & Sign Out */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-xs font-heading">
                  A
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Administrator</p>
                  <span className="text-[10px] text-emerald-400 font-mono">Authenticated</span>
                </div>
              </div>

              <form action={handleLogout}>
                <button
                  type="submit"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-sm">Admin Panel</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-400 hover:text-white">
              Public Portal
            </Link>
            <form action={handleLogout}>
              <button type="submit" className="p-1.5 text-slate-400 hover:text-rose-400">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around py-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-1 px-3 text-slate-600 hover:text-primary-600 text-[11px] font-medium"
            >
              <item.icon className="w-4 h-4" />
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
