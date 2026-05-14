"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { InstructorSidebar } from "@/components/InstructorSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { User, Mail, Shield, Bell, Lock, Save } from 'lucide-react';

export default function InstructorSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Settings updated successfully!");
    }, 1000);
  };

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Accessing Profile...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <InstructorSidebar activeItem="Settings" />
        
        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Instructor Settings</h1>
            <p className="text-lg opacity-70">Control your profile visibility and account security.</p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Profile Section */}
              <Card className="border-3 p-8 bg-white shadow-brutal">
                <div className="flex items-center gap-4 mb-8 border-b-2 border-deep-indigo/10 pb-4">
                  <div className="p-3 bg-primary/10 text-primary border-2 border-primary/20">
                    <User size={24} />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase">Public Profile</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name"
                    value={user?.name || ''}
                    placeholder="Enter your name"
                    onChange={(e) => setUser({...user, name: e.target.value})}
                  />
                  <Input 
                    label="Email Address"
                    value={user?.email || ''}
                    placeholder="email@example.com"
                    type="email"
                    disabled
                  />
                </div>
                
                <div className="mt-6">
                  <label className="text-sm font-bold uppercase tracking-widest text-deep-indigo/60 block mb-2">Professional Bio</label>
                  <textarea 
                    className="w-full border-3 border-deep-indigo p-4 font-body focus:outline-none focus:shadow-brutal transition-all min-h-[120px] bg-bg-offwhite/30"
                    placeholder="Tell your students about yourself..."
                    defaultValue="Experienced instructor passionate about sharing knowledge."
                  />
                </div>
              </Card>

              {/* Account Security */}
              <Card className="border-3 p-8 bg-white shadow-brutal">
                <div className="flex items-center gap-4 mb-8 border-b-2 border-deep-indigo/10 pb-4">
                  <div className="p-3 bg-secondary/10 text-primary border-2 border-primary/20">
                    <Shield size={24} />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase">Security & Login</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                     <Input label="New Password" type="password" placeholder="••••••••" className="flex-1" />
                     <Input label="Confirm Password" type="password" placeholder="••••••••" className="flex-1" />
                  </div>
                  <Button variant="secondary" className="text-xs py-2">Update Password</Button>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="border-3 p-8 bg-white shadow-brutal">
                <div className="flex items-center gap-4 mb-8 border-b-2 border-deep-indigo/10 pb-4">
                  <div className="p-3 bg-warning/10 text-deep-indigo border-2 border-warning/20">
                    <Bell size={24} />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase">Notifications</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    "Email me when a student enrolls in my course",
                    "Notify me of new reviews and ratings",
                    "Weekly earnings summary",
                    "Platform updates and creator tips"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-2 border-deep-indigo/5 hover:border-deep-indigo/20 transition-all">
                       <input type="checkbox" defaultChecked className="w-5 h-5 border-3 border-deep-indigo text-primary focus:ring-0" />
                       <span className="font-bold text-sm uppercase opacity-70">{text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex justify-end pb-12">
                <Button type="submit" variant="primary" className="px-12 flex items-center gap-2" disabled={saving}>
                  <Save size={20} /> {saving ? 'Saving Changes...' : 'Save All Settings'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
