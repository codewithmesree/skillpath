"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { InstructorSidebar } from "@/components/InstructorSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchMyCourses = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();

      if (!authData.user || authData.user.role !== 'instructor') {
        router.push(authData.user?.role === 'admin' ? '/admin' : '/dashboard');
        return;
      }

      const res = await fetch('/api/courses');
      const data = await res.json();
      // The API already filters for instructors (approved + their own)
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const stats = [
    { label: "Total Courses", value: courses.length.toString() },
    { label: "Approved", value: courses.filter(c => c.status === 'approved').length.toString() },
    { label: "Pending", value: courses.filter(c => c.status === 'pending').length.toString() },
    { label: "Total Students", value: courses.reduce((acc, c) => acc + (c.enrollmentsCount || 0), 0).toString() },
  ];

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Instructor Hub...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <InstructorSidebar activeItem="Dashboard" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">

          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Instructor Hub</h1>
              <p className="text-lg opacity-70">Manage your courses and track student engagement.</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Create New Course
            </Button>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <Card key={i} className="flex flex-col gap-1 border-3 bg-white shadow-brutal transition-all">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.label}</span>
                 <span className="text-4xl font-heading font-bold text-deep-indigo">{stat.value}</span>
              </Card>
            ))}
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">My Course Submissions</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {courses.length > 0 ? courses.map((course) => (
                <Card key={course._id} className="border-3 bg-white flex flex-col md:flex-row gap-6 p-6 items-center justify-between hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-24 h-24 bg-secondary/20 border-3 border-deep-indigo flex items-center justify-center overflow-hidden">
                       {course.thumbnail ? <img src={course.thumbnail} className="w-full h-full object-cover" /> : <div className="text-3xl font-black opacity-20 italic">S</div>}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-deep-indigo uppercase leading-tight">{course.title}</h3>
                      <p className="text-xs opacity-50 font-bold uppercase tracking-widest mt-1">{course.category}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-deep-indigo/10 text-[10px] font-black uppercase">
                           <CheckCircle size={14} className="text-success" /> {course.enrollmentsCount || 0} Enrolled
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-deep-indigo/10 text-[10px] font-black uppercase text-primary">
                           ₹{course.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[150px]">
                    <div className={`px-4 py-1.5 border-3 font-heading font-black text-xs uppercase italic flex items-center gap-2 ${
                      course.status === 'approved' ? 'bg-success/20 text-success border-success' :
                      course.status === 'pending' ? 'bg-warning/20 text-warning border-warning' :
                      'bg-error/20 text-error border-error'
                    }`}>
                      {course.status === 'approved' ? <CheckCircle size={14} /> : 
                       course.status === 'pending' ? <Clock size={14} /> : <XCircle size={14} />}
                      {course.status}
                    </div>
                    {course.status === 'approved' && (
                      <Button variant="secondary" className="w-full py-2 text-[10px]" onClick={() => window.location.href = `/dashboard/learn/${course._id}`}>View Course</Button>
                    )}
                  </div>
                </Card>
              )) : (
                <div className="py-24 border-4 border-dashed border-deep-indigo/10 rounded-xl text-center bg-white">
                  <p className="font-heading font-bold text-deep-indigo opacity-30 uppercase tracking-widest text-xl">You haven't submitted any courses yet.</p>
                  <Button variant="primary" className="mt-6" onClick={() => setIsModalOpen(true)}>Submit Your First Course</Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <CreateCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchMyCourses}
      />
    </div>
  );
}
