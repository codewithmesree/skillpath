"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { InstructorSidebar } from "@/components/InstructorSidebar";
import { Card } from "@/components/Card";
import { IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/Button';

export default function InstructorEarningsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch('/api/instructor/earnings');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Wallet...</div>

  const stats = [
    { label: "Total Revenue", value: `₹${data?.totalRevenue || 0}`, icon: IndianRupee, color: 'primary' },
    { label: "Platform Fee (20%)", value: `-₹${data?.platformFee || 0}`, icon: ArrowDownRight, color: 'error' },
    { label: "Net Earnings", value: `₹${data?.netEarnings || 0}`, icon: ArrowUpRight, color: 'success' },
  ];

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <InstructorSidebar activeItem="Earnings" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Earnings & Payouts</h1>
              <p className="text-lg opacity-70">Track your success and manage your revenue stream.</p>
            </div>
            <Button variant="primary" className="shadow-brutal bg-success text-deep-indigo border-deep-indigo">Request Payout</Button>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className={`border-3 bg-white shadow-brutal transition-all`}>
                   <div className="flex justify-between items-start mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</span>
                     <div className={`p-2 bg-${stat.color}/10 border-2 border-${stat.color}/30 text-${stat.color}`}>
                       <Icon size={16} />
                     </div>
                   </div>
                   <span className={`text-4xl font-heading font-black ${stat.label === 'Net Earnings' ? 'text-success' : 'text-deep-indigo'}`}>{stat.value}</span>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Revenue Chart Simulated */}
            <Card className="lg:col-span-2 border-3 bg-white space-y-8">
               <div className="flex justify-between items-center">
                 <h2 className="font-heading font-bold text-deep-indigo uppercase">Revenue Growth</h2>
                 <span className="text-xs font-bold text-success flex items-center gap-1 uppercase tracking-tighter">
                   <TrendingUp size={14} /> +12.5% this month
                 </span>
               </div>
               
               <div className="flex items-end gap-3 h-48 px-4">
                 {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                   <div key={i} className="flex-1 group relative">
                     <div 
                      className="w-full bg-primary border-2 border-deep-indigo shadow-brutal-sm hover:bg-warning transition-colors" 
                      style={{ height: `${h}%` }}
                     />
                     <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-40 uppercase">Day {i+1}</div>
                   </div>
                 ))}
               </div>
            </Card>

            {/* Transactions History */}
            <div className="space-y-6">
               <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase">Recent Sales</h2>
               <div className="space-y-4">
                 {data?.transactions?.length > 0 ? data.transactions.slice(0, 5).map((tx: any, i: number) => (
                   <Card key={i} className="border-2 p-4 bg-white flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary/30 flex items-center justify-center font-black text-primary border-2 border-deep-indigo italic">S</div>
                      <div className="flex-1 min-w-0">
                         <p className="font-bold text-xs truncate uppercase">{tx.courseId?.title}</p>
                         <p className="text-[10px] opacity-50 font-bold uppercase">Success • {new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="font-heading font-black text-success">₹{tx.amount}</div>
                   </Card>
                 )) : (
                   <div className="text-center py-10 opacity-30 font-bold uppercase text-xs">No transactions yet.</div>
                 )}
               </div>
               <Button variant="outline" className="w-full text-[10px] py-3 uppercase font-black">Download Statement</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
