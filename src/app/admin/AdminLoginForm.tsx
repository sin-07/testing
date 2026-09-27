'use client';

/**
 * Supercharged Admin Login Component
 * Features:
 * - Clean glassmorphism styling
 * - 1-Click "Fill Demo Credentials" shortcut for effortless testing
 * - Micro-transitions and animated loading states
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Alert } from '@/components/ui';
import { adminLogin } from '@/actions/admin';
import { Lock, Mail, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(email, password);

      if (result.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@examportal.com');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        {/* Login Card */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-2xl mb-4 text-white shadow-lg shadow-primary-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized personnel access only • Session 2026
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs animate-fadeIn">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@examportal.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          {/* 1-Click Demo Shortcut */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-semibold text-slate-300 block">Evaluation Mode</span>
                <span className="text-[11px] text-slate-500 font-mono">admin@examportal.com</span>
              </div>

              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 text-xs font-semibold transition-colors border border-primary-500/30"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Fill Demo
              </button>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Return to Public Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
