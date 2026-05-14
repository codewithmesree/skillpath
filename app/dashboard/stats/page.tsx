"use client";

import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { BarChart3, TrendingUp, Zap, Target, Clock } from 'lucide-react';

export default function StudentStats() {
  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar activeItem="Statistics" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Learning Analytics</h1>
            <p className="text-lg opacity-70">Visualize your growth and learning habits.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Stats */}
            <Card className="lg:col-span-2 border-3 bg-white p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Weekly Learning Time</h2>
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  <span className="text-[10px] font-black uppercase opacity-40">This Week</span>
                </div>
              </div>
              
              {/* Mock Chart */}
              <div className="flex items-end justify-between h-64 gap-2 pb-2 border-b-3 border-deep-indigo">
                {[45, 80, 55, 95, 30, 65, 85].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div 
                      className="w-full bg-primary border-2 border-deep-indigo shadow-brutal-sm group-hover:bg-warning group-hover:-translate-y-1 transition-all" 
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[10px] font-black uppercase opacity-40">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="border-3 bg-secondary/20 border-deep-indigo p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-primary" />
                  <h3 className="font-heading font-black text-deep-indigo uppercase text-sm">Active Streak</h3>
                </div>
                <div className="text-5xl font-heading font-black text-deep-indigo italic">12 <span className="text-xl not-italic opacity-40">DAYS</span></div>
                <p className="text-[10px] font-bold uppercase mt-4 text-success">+3 Days since last week</p>
              </Card>

              <Card className="border-3 bg-warning/20 border-deep-indigo p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-warning" />
                  <h3 className="font-heading font-black text-deep-indigo uppercase text-sm">Monthly Goal</h3>
                </div>
                <div className="text-5xl font-heading font-black text-deep-indigo italic">84%</div>
                <div className="w-full h-2 bg-white border-2 border-deep-indigo mt-4">
                  <div className="h-full bg-warning w-[84%]" />
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: 'Average Session', value: '42m' },
              { icon: TrendingUp, label: 'Progress Rate', value: '+14%' },
              { icon: BarChart3, label: 'Quizzes Taken', value: '28' },
              { icon: Zap, label: 'Skill Points', value: '1.2k' }
            ].map((item, i) => (
              <Card key={i} className="border-3 bg-white hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 bg-bg-offwhite border-2 border-deep-indigo flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-primary" />
                </div>
                <p className="text-[10px] font-black uppercase opacity-40">{item.label}</p>
                <p className="text-3xl font-heading font-black text-deep-indigo mt-1">{item.value}</p>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
