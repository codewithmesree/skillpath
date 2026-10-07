"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
      const [authRes, coursesRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/courses?myCourses=true')
      ]);

      if (authRes.ok) {
        const authData = await authRes.json();
        if (!authData.user || (authData.user.role !== 'instructor' && authData.user.role !== 'admin')) {
          router.push(authData.user?.role === 'admin' ? '/admin' : '/dashboard');
          return;
        }
      }

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleResubmit = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resubmit' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Resubmit failed');
      }
      setCourses(prev => prev.map(c => (c._id === id ? { ...c, status: 'pending' } : c)));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const stats = [
    { label: "Total Courses", value: courses.length.toString() },
    { label: "Approved", value: courses.filter(c => c.status === 'approved').length.toString() },
    { label: "Pending", value: courses.filter(c => c.status === 'pending').length.toString() },
    { label: "Total Students", value: courses.reduce((acc, c) => acc + (c.enrollmentsCount || 0), 0).toString() },
  ];

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
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="flex flex-col gap-2 border-3 bg-white shadow-brutal animate-pulse p-6">
                  <div className="h-3 w-20 bg-secondary/60 rounded" />
                  <div className="h-8 w-12 bg-secondary/80 rounded" />
                </Card>
              ))
            ) : (
              stats.map((stat, i) => (
                <Card key={i} className="flex flex-col gap-1 border-3 bg-white shadow-brutal transition-all">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.label}</span>
                   <span className="text-4xl font-heading font-bold text-deep-indigo">{stat.value}</span>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">My Course Submissions</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                [1, 2].map((i) => (
                  <Card key={i} className="border-3 bg-white p-6 animate-pulse flex items-center gap-6">
                    <div className="w-24 h-24 bg-secondary/40 border-2 border-deep-indigo/20 rounded" />
                    <div className="space-y-3 flex-1">
                      <div className="h-5 w-1/3 bg-secondary/50 rounded" />
                      <div className="h-3 w-24 bg-secondary/30 rounded" />
                    </div>
                  </Card>
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
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
                        {course.status === 'pending' ? 'awaiting review' : course.status}
                      </div>
                      {course.status === 'rejected' && (
                        <Button
                          variant="primary"
                          className="w-full py-2 text-[10px] font-heading font-black uppercase tracking-wider shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                          onClick={() => handleResubmit(course._id)}
                        >
                          Resubmit for Review
                        </Button>
                      )}
                      <Link href={`/dashboard/learn/${course._id}`} className="w-full">
                        <Button variant="secondary" className="w-full py-2 text-[10px] font-heading font-black uppercase tracking-wider shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                          Manage Materials
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              ) : (
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
