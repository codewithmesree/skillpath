"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail('admin@skillpath.dev');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col justify-between font-body text-dark-text selection:bg-primary selection:text-white">
      {/* Top Security Header Strip */}
      <header className="bg-deep-indigo text-white border-b-4 border-primary px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-warning text-deep-indigo border-2 border-white flex items-center justify-center font-heading font-black text-sm shadow-brutal-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="font-heading font-black text-lg uppercase tracking-wider text-white">
              SkillPath <span className="text-primary">//</span> Admin Console
            </span>
            <span className="hidden sm:inline-block ml-3 bg-white/10 text-warning px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border border-white/20">
              Clearance Level 4
            </span>
          </div>
        </div>

        <Link 
          href="/"
          className="text-xs font-heading font-bold uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Main Site
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-grow flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Security Notice Pill */}
          <div className="bg-warning border-3 border-deep-indigo p-3.5 rounded-lg shadow-brutal flex items-center gap-3">
            <AlertTriangle className="text-deep-indigo shrink-0" size={24} />
            <div className="text-xs font-bold text-deep-indigo">
              <span className="uppercase tracking-wider font-black">Restricted Access Area:</span>
              <p className="opacity-80">This portal is reserved strictly for platform administrators. Non-admin accounts will be rejected.</p>
            </div>
          </div>

          <Card className="p-8 sm:p-10 border-4 border-deep-indigo bg-white shadow-brutal-lg space-y-6">
            <div className="space-y-2 border-b-3 border-deep-indigo/10 pb-6">
              <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 border-2 border-deep-indigo rounded text-xs font-heading font-black uppercase text-deep-indigo">
                <Lock size={14} /> Internal Gateway
              </div>
              <h1 className="text-3xl font-heading font-black text-deep-indigo uppercase tracking-tight">
                Admin Authentication
              </h1>
              <p className="text-sm opacity-70">
                Enter your built-in administrator credentials to access system management.
              </p>
            </div>

            {error && (
              <div className="bg-error/10 border-3 border-error p-3.5 rounded-md text-error text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5">
              <Input
                label="Admin Email Address"
                type="email"
                placeholder="admin@skillpath.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Master Security Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 text-base font-heading font-black uppercase tracking-wider shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                disabled={loading}
              >
                <ShieldCheck size={20} />
                <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Enter Console'}</span>
              </Button>
            </form>

            {/* Inbuilt Credentials Quick Assistant */}
            <div className="pt-4 border-t-2 border-dashed border-deep-indigo/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-heading font-black uppercase tracking-wider text-deep-indigo/70 flex items-center gap-1.5">
                  <KeyRound size={14} /> Built-in Admin Credentials:
                </span>
                <button
                  type="button"
                  onClick={autofillDemo}
                  className="text-[11px] font-black uppercase tracking-wider text-primary hover:text-deep-indigo underline cursor-pointer"
                >
                  Autofill
                </button>
              </div>

              <div className="bg-surface-low border-2 border-deep-indigo/30 p-2.5 rounded font-mono text-xs flex justify-between items-center text-deep-indigo">
                <div>
                  <span className="font-bold">admin@skillpath.dev</span> / <span className="opacity-70">admin123</span>
                </div>
                <span className="text-[10px] bg-warning/50 border border-deep-indigo/30 px-1.5 py-0.5 rounded font-bold uppercase">
                  Default
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t-2 border-deep-indigo/10 text-xs font-bold uppercase tracking-wider opacity-40">
        SkillPath Security Infrastructure © 2026 • Encrypted Session
      </footer>
    </div>
  );
}
