"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { InstructorSidebar } from "@/components/InstructorSidebar";
import { Card } from "@/components/Card";
import { Users, Search, Filter } from 'lucide-react';
import { Input } from '@/components/Input';

export default function InstructorStudentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/instructor/students');
        const data = await res.json();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredEnrollments = enrollments.filter(enroll => 
    enroll.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enroll.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enroll.courseId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Students...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <InstructorSidebar activeItem="Students" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Student Management</h1>
            <p className="text-lg opacity-70">Monitor the progress of everyone learning from you.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-indigo opacity-30" size={20} />
               <Input 
                placeholder="Search students by name or email..." 
                className="pl-12" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-3 border-deep-indigo font-bold uppercase text-xs hover:bg-secondary transition-all">
              <Filter size={18} /> Filter by Course
            </button>
          </div>

          <Card className="p-0 overflow-hidden border-3">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-primary/10 border-b-3 border-deep-indigo font-heading font-bold text-deep-indigo uppercase text-xs">
                     <tr>
                       <th className="p-4">Student Name</th>
                       <th className="p-4">Course</th>
                       <th className="p-4">Progress</th>
                       <th className="p-4">Enrollment Date</th>
                       <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="font-body text-deep-indigo">
                     {filteredEnrollments.length > 0 ? filteredEnrollments.map((enroll, i) => (
                       <tr key={enroll._id || i} className="border-b-2 border-deep-indigo/5 hover:bg-secondary/10 transition-colors">
                          <td className="p-4">
                            <div className="font-bold">{enroll.userId?.name || 'Anonymous'}</div>
                            <div className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">{enroll.userId?.email}</div>
                          </td>
                          <td className="p-4 font-bold text-sm uppercase opacity-70">{enroll.courseId?.title}</td>
                          <td className="p-4">
                             <div className="flex items-center gap-3">
                               <div className="flex-1 h-2 w-24 bg-secondary/30 rounded-full overflow-hidden border border-deep-indigo/10">
                                 <div className="h-full bg-primary" style={{ width: `${enroll.progress}%` }} />
                               </div>
                               <span className="text-[10px] font-black uppercase">{enroll.progress}%</span>
                             </div>
                          </td>
                          <td className="p-4 text-xs font-bold opacity-50">{new Date(enroll.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                             <button className="text-[10px] font-black uppercase text-primary hover:underline">Message</button>
                          </td>
                       </tr>
                     )) : (
                       <tr>
                          <td colSpan={5} className="p-20 text-center font-heading font-bold opacity-20 text-2xl uppercase tracking-widest italic">No students enrolled yet.</td>
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
