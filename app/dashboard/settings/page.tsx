"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { User, Bell, Shield, Wallet, Camera } from 'lucide-react';

export default function StudentSettings() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar activeItem="Settings" />
        
        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Profile Settings</h1>
            <p className="text-lg opacity-70">Manage your account information and preferences.</p>
          </header>

          <div className="space-y-8">
            {/* Profile Section */}
            <Card className="border-3 p-8 bg-white">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="relative group">
                  <div className="w-32 h-32 bg-secondary border-4 border-deep-indigo shadow-brutal flex items-center justify-center text-4xl font-black text-deep-indigo">
                    {user?.name?.charAt(0)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary border-2 border-deep-indigo flex items-center justify-center text-white shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Camera size={18} />
                  </button>
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" defaultValue={user?.name} />
                    <Input label="Email Address" defaultValue={user?.email} disabled />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-deep-indigo/40">Bio</label>
                    <textarea 
                      className="w-full border-3 border-deep-indigo p-4 font-body min-h-[100px] focus:outline-none focus:shadow-brutal transition-all"
                      defaultValue="Passionate learner exploring the world of modern web development."
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card className="border-3 bg-secondary/10">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-primary" />
                <h2 className="text-xl font-heading font-black text-deep-indigo uppercase italic">Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  "New lesson announcements",
                  "Assignment feedback alerts",
                  "Weekly progress reports",
                  "Platform updates"
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b-2 border-deep-indigo/5 last:border-0">
                    <span className="font-bold text-sm uppercase text-deep-indigo">{item}</span>
                    <div className="w-12 h-6 bg-white border-2 border-deep-indigo rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 bottom-1 w-4 bg-primary border-2 border-deep-indigo rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Billing History Link */}
            <Card className="border-3 bg-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Wallet className="text-warning" />
                <div>
                  <h3 className="font-heading font-black text-deep-indigo uppercase text-sm">Billing & Subscription</h3>
                  <p className="text-[10px] font-bold opacity-40 uppercase">You are currently on the Free Tier</p>
                </div>
              </div>
              <Button variant="outline" className="text-[10px] py-2">Manage</Button>
            </Card>

            <div className="flex justify-end pt-4">
               <Button variant="primary" className="px-12 py-3 shadow-brutal-lg">Save Profile Changes</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
