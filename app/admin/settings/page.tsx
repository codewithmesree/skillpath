"use client";

import React from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Save, Bell, Shield, Palette, Database } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar activeItem="Settings" />
        
        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Platform Settings</h1>
            <p className="text-lg opacity-70">Configure your LMS infrastructure and branding.</p>
          </header>

          <div className="space-y-8">
            {/* General Settings */}
            <Card className="border-3">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-primary" size={24} />
                <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">General Configuration</h2>
              </div>
              <div className="space-y-6">
                <Input label="Platform Name" defaultValue="SkillPath LMS" />
                <Input label="Support Email" defaultValue="support@skillpath.com" />
                <div className="flex items-center gap-4 p-4 bg-secondary/20 border-2 border-deep-indigo/10 rounded">
                  <input type="checkbox" id="maintenance" className="w-5 h-5 accent-primary" />
                  <label htmlFor="maintenance" className="font-bold text-deep-indigo uppercase text-sm cursor-pointer">Enable Maintenance Mode</label>
                </div>
              </div>
            </Card>

            {/* Payment Settings */}
            <Card className="border-3">
              <div className="flex items-center gap-3 mb-6">
                <Database className="text-success" size={24} />
                <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Payment Gateway (Razorpay)</h2>
              </div>
              <div className="space-y-6">
                <Input label="Webhook Secret" placeholder="Enter webhook secret..." type="password" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-deep-indigo bg-success/10">
                    <span className="block text-[10px] font-bold opacity-50 uppercase mb-1">Status</span>
                    <span className="font-bold text-success uppercase">Connected</span>
                  </div>
                  <div className="p-4 border-2 border-deep-indigo bg-white">
                    <span className="block text-[10px] font-bold opacity-50 uppercase mb-1">Mode</span>
                    <span className="font-bold text-deep-indigo uppercase">Test Mode</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="border-3">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-warning" size={24} />
                <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  "Email on new enrollment",
                  "Email on payment success",
                  "Weekly platform report",
                  "Security alerts"
                ].map((notif, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border-b-2 border-deep-indigo/5 last:border-0">
                    <span className="font-bold text-deep-indigo uppercase text-sm">{notif}</span>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in bg-gray-200 rounded-full border-2 border-deep-indigo cursor-pointer">
                       <div className="absolute left-1 top-1 w-3 h-3 bg-white border-2 border-deep-indigo rounded-full transition transform translate-x-6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end pt-6">
              <Button variant="primary" className="flex items-center gap-2">
                <Save size={20} />
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
