"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push(
        data.user.role === 'admin' ? '/admin' : 
        data.user.role === 'instructor' ? '/instructor' : 
        '/dashboard'
      );
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 border-3">
          <h1 className="text-3xl font-heading font-bold text-deep-indigo uppercase mb-2">Welcome Back</h1>
          <p className="text-sm opacity-60 mb-8">Log in to continue your learning journey.</p>

          {error && (
            <div className="bg-error/10 border-2 border-error p-3 rounded-md text-error text-sm font-bold mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="alex@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-lg"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-deep-indigo opacity-70">
            Don't have an account? <Link href="/register" className="text-primary hover:underline">Register now</Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
