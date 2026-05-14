"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { CreditCard, Download, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Payments...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar activeItem="Payments" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Financial Records</h1>
              <p className="text-lg opacity-70">Track revenue and manage transaction history.</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-secondary border-3 border-deep-indigo font-bold uppercase text-sm shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <Download size={18} />
              Export CSV
            </button>
          </header>

          <Card className="p-0 overflow-hidden border-3">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-secondary/50 border-b-3 border-deep-indigo font-heading font-bold text-deep-indigo uppercase text-sm">
                     <tr>
                       <th className="p-4">Transaction ID</th>
                       <th className="p-4">Student</th>
                       <th className="p-4">Course</th>
                       <th className="p-4">Amount</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Date</th>
                     </tr>
                  </thead>
                  <tbody className="font-body text-deep-indigo">
                     {payments.length > 0 ? payments.map((payment) => (
                       <tr key={payment._id} className="border-b-2 border-deep-indigo/5 hover:bg-secondary/10 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs opacity-60">{payment.transactionId || payment.orderId}</span>
                              <ExternalLink size={12} className="opacity-30" />
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold">{payment.userId?.name || 'Unknown User'}</div>
                            <div className="text-[10px] opacity-50 uppercase tracking-tighter">{payment.userId?.email}</div>
                          </td>
                          <td className="p-4 italic opacity-70">
                            {payment.courseId?.title || 'Course Deleted'}
                          </td>
                          <td className="p-4 font-bold text-success">
                            ₹{payment.amount}
                          </td>
                          <td className="p-4">
                            <div className={`flex items-center gap-1.5 px-3 py-1 border-2 font-bold text-[10px] uppercase tracking-widest inline-flex ${
                              payment.paymentStatus === 'completed' 
                              ? 'bg-success/10 border-success text-success' 
                              : payment.paymentStatus === 'pending'
                              ? 'bg-warning/10 border-warning text-warning'
                              : 'bg-error/10 border-error text-error'
                            }`}>
                              {payment.paymentStatus === 'completed' && <CheckCircle size={10} />}
                              {payment.paymentStatus === 'pending' && <Clock size={10} />}
                              {payment.paymentStatus === 'failed' && <XCircle size={10} />}
                              {payment.paymentStatus}
                            </div>
                          </td>
                          <td className="p-4 text-right opacity-70">
                            {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                       </tr>
                     )) : (
                       <tr>
                          <td colSpan={6} className="p-20 text-center font-heading font-bold opacity-20 text-2xl uppercase tracking-widest">No transactions found.</td>
                       </tr>
                     )}
                  </tbody>
               </table>
             </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
