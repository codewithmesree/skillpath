"use client";

import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { FileText, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StudentAssignments() {
  const assignments = [
    { title: "React State Management Lab", course: "Advanced React", due: "Tomorrow", status: "pending", priority: "high" },
    { title: "Landing Page Redesign", course: "UI/UX Design", due: "In 3 days", status: "submitted", priority: "medium" },
    { title: "Node.js Middleware Exercise", course: "Backend Mastery", due: "Yesterday", status: "overdue", priority: "high" },
    { title: "Database Schema Design", course: "SQL Essentials", due: "Next Week", status: "pending", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar activeItem="Assignments" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Assignments</h1>
              <p className="text-lg opacity-70">Submit your projects and track instructor feedback.</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-secondary px-4 py-2 border-2 border-deep-indigo font-black text-xs uppercase italic">4 Active</div>
              <div className="bg-success/20 px-4 py-2 border-2 border-success/30 text-success font-black text-xs uppercase italic">12 Completed</div>
            </div>
          </header>

          <div className="space-y-6">
            {assignments.map((task, i) => (
              <Card key={i} className="p-0 border-3 overflow-hidden bg-white shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className={`w-2 md:w-4 ${
                    task.status === 'overdue' ? 'bg-error' : 
                    task.status === 'submitted' ? 'bg-success' : 'bg-warning'
                  }`} />
                  
                  <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-start gap-5 w-full">
                      <div className="w-12 h-12 bg-bg-offwhite border-2 border-deep-indigo flex items-center justify-center">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold text-deep-indigo uppercase">{task.title}</h3>
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{task.course}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-deep-indigo opacity-40" />
                        <span className={`text-[10px] font-black uppercase ${task.status === 'overdue' ? 'text-error' : 'text-deep-indigo/60'}`}>
                          {task.due}
                        </span>
                      </div>

                      <div className={`flex items-center gap-2 px-3 py-1 border-2 font-black text-[10px] uppercase tracking-widest ${
                        task.status === 'overdue' ? 'bg-error/10 border-error text-error' : 
                        task.status === 'submitted' ? 'bg-success/10 border-success text-success' : 
                        'bg-warning/10 border-warning text-warning'
                      }`}>
                        {task.status === 'submitted' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {task.status}
                      </div>

                      <Button variant={task.status === 'submitted' ? 'outline' : 'primary'} className="min-w-[140px] py-2 text-xs font-black uppercase">
                        {task.status === 'submitted' ? 'Resubmit' : 'Submit Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
