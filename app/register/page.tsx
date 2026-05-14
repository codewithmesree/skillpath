"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
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
          <h1 className="text-3xl font-heading font-bold text-deep-indigo uppercase mb-2">Create Account</h1>
          <p className="text-sm opacity-60 mb-8">Join thousands of modern learners today.</p>

          {error && (
            <div className="bg-error/10 border-2 border-error p-3 rounded-md text-error text-sm font-bold mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <Input 
              label="Full Name" 
              placeholder="Alex Johnson" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            
            <div className="space-y-2">
              <label className="font-heading font-bold text-sm text-deep-indigo uppercase tracking-wider">Account Type</label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-3 border-2 font-bold rounded-md transition-all ${role === 'student' ? 'bg-primary text-white border-deep-indigo shadow-brutal' : 'bg-white text-deep-indigo border-transparent hover:border-deep-indigo'}`}
                >
                  Student
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`flex-1 py-3 border-2 font-bold rounded-md transition-all ${role === 'instructor' ? 'bg-primary text-white border-deep-indigo shadow-brutal' : 'bg-white text-deep-indigo border-transparent hover:border-deep-indigo'}`}
                >
                  Instructor
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-3 border-2 font-bold rounded-md transition-all ${role === 'admin' ? 'bg-primary text-white border-deep-indigo shadow-brutal' : 'bg-white text-deep-indigo border-transparent hover:border-deep-indigo'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-deep-indigo opacity-70">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
