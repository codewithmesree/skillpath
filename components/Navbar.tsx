"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { Sparkles, User, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="h-[72px] bg-white border-b-4 border-deep-indigo flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button 
          className="lg:hidden p-2 border-2 border-deep-indigo hover:bg-secondary transition-all shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary border-3 border-deep-indigo shadow-brutal flex items-center justify-center transition-transform group-hover:-rotate-6">
            <span className="text-white font-heading font-black text-xl italic">S</span>
          </div>
          <span className="font-heading font-black text-2xl tracking-tighter text-deep-indigo uppercase italic group-hover:text-primary transition-colors hidden xs:block">SkillPath</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-10 bg-secondary/30 px-8 py-2 border-2 border-deep-indigo/10 rounded-full">
        <Link href="/courses" className="font-heading font-bold text-deep-indigo hover:text-primary transition-all text-xs uppercase tracking-widest">Courses</Link>
        {user && (
          <Link 
            href={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/dashboard'} 
            className="font-heading font-bold text-deep-indigo hover:text-primary transition-all text-xs uppercase tracking-widest"
          >
            Dashboard
          </Link>
        )}

        <Link href="/pricing" className="font-heading font-bold text-deep-indigo hover:text-primary transition-all text-xs uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} />
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            {/* Plan Tag */}
            {(user.plan === 'pro' || user.plan === 'enterprise') && (
              <div className={`hidden md:flex items-center gap-2 px-3 py-1 border-2 border-deep-indigo shadow-brutal-sm ${
                user.plan === 'pro' ? 'bg-warning text-deep-indigo' : 'bg-primary text-white'
              }`}>
                <Sparkles size={12} className={user.plan === 'enterprise' ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">{user.plan}</span>
              </div>
            )}

            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-4 bg-bg-offwhite border-2 border-deep-indigo p-1.5 rounded-full shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-secondary"
            >
              <div className="w-8 h-8 bg-warning border-2 border-deep-indigo rounded-full flex items-center justify-center font-bold text-deep-indigo overflow-hidden">
                 {user.name.charAt(0)}
              </div>
              <span className="font-heading font-bold text-deep-indigo text-[10px] uppercase tracking-tighter hidden sm:block pr-2">{user.name}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-4 w-56 bg-white border-4 border-deep-indigo shadow-brutal p-2 z-[60] animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b-2 border-deep-indigo/10 mb-2">
                  <p className="text-[10px] font-black uppercase opacity-40">Signed in as</p>
                  <p className="font-heading font-bold text-deep-indigo truncate">{user.email}</p>
                </div>
                
                <Link href={user.role === 'admin' ? '/admin/settings' : '/dashboard/settings'} className="flex items-center gap-3 w-full p-3 font-heading font-bold text-xs text-deep-indigo uppercase hover:bg-secondary transition-colors" onClick={() => setIsDropdownOpen(false)}>
                  <User size={16} /> My Profile
                </Link>
                <Link href="/dashboard/stats" className="flex items-center gap-3 w-full p-3 font-heading font-bold text-xs text-deep-indigo uppercase hover:bg-secondary transition-colors" onClick={() => setIsDropdownOpen(false)}>
                  <Sparkles size={16} /> Learning Stats
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 font-heading font-bold text-xs text-error uppercase hover:bg-error/10 transition-colors border-t-2 border-deep-indigo/10 mt-2"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="secondary" className="px-6 py-2 text-xs">Log In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" className="px-6 py-2 text-xs">Get Started</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-white z-40 lg:hidden flex flex-col p-8 space-y-6 animate-in slide-in-from-left duration-300">
           <Link 
            href="/courses" 
            className="text-2xl font-heading font-black text-deep-indigo uppercase border-b-4 border-deep-indigo/5 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
           >
            Courses
           </Link>
           {user && (
             <Link 
              href={user.role === 'admin' ? '/admin' : '/dashboard'} 
              className="text-2xl font-heading font-black text-deep-indigo uppercase border-b-4 border-deep-indigo/5 pb-4"
              onClick={() => setIsMobileMenuOpen(false)}
             >
              Dashboard
             </Link>
           )}
           <Link 
            href="/pricing" 
            className="text-2xl font-heading font-black text-deep-indigo uppercase border-b-4 border-deep-indigo/5 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
           >
            Pricing
           </Link>
           <div className="pt-10">
             {user ? (
               <Button variant="primary" className="w-full py-4 text-lg" onClick={handleLogout}>Log Out</Button>
             ) : (
               <div className="space-y-4">
                 <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                   <Button variant="secondary" className="w-full py-4 text-lg">Log In</Button>
                 </Link>
                 <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block">
                   <Button variant="primary" className="w-full py-4 text-lg">Get Started</Button>
                 </Link>
               </div>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};

