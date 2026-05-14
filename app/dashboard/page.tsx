"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/Button";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error('Failed to fetch user');
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          
          const enrollRes = await fetch(`/api/enrollments/${data.user.id}`);
          if (enrollRes.ok) {
            const enrollContentType = enrollRes.headers.get("content-type");
            if (enrollContentType && enrollContentType.includes("application/json")) {
              const enrolls = await enrollRes.json();
              setEnrollments(Array.isArray(enrolls) ? enrolls : []);
            }
          }
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const stats = [
    { label: "Completed", value: enrollments.filter(e => e.progress === 100).length.toString() },
    { label: "In Progress", value: enrollments.filter(e => e.progress < 100).length.toString() },
    { label: "Hours Learned", value: "128" },
    { label: "Quiz Avg", value: "92%" },
  ];

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar activeItem="Dashboard" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Welcome back, {user?.name || 'Learner'}! 👋</h1>
            <p className="text-lg opacity-70">You're making great progress this week. Keep it up!</p>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <Card key={i} className="flex flex-col gap-1 border-3 bg-white shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.label}</span>
                 <span className="text-4xl font-heading font-bold text-deep-indigo">{stat.value}</span>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Continue Learning */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex justify-between items-end">
                 <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Enrolled Courses</h2>
                 <span className="text-sm font-bold opacity-40 uppercase tracking-widest">{enrollments.length} Courses</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {enrollments.length > 0 ? enrollments.map((enroll) => (
                   <CourseCard 
                     key={enroll._id}
                     courseId={enroll.courseId?._id}
                     title={enroll.courseId?.title || 'Unknown Course'} 
                     category={enroll.courseId?.category || 'General'} 
                     instructor={enroll.courseId?.instructor || 'Staff'} 
                     rating={enroll.courseId?.rating || 4.5}
                     image={enroll.courseId?.thumbnail}
                     progress={enroll.progress} 
                   />
                 )) : (
                   <div className="col-span-full py-20 border-4 border-dashed border-deep-indigo/10 rounded-xl text-center">
                     <div className="text-6xl mb-4 opacity-20">📚</div>
                     <p className="font-heading font-bold text-deep-indigo opacity-30 uppercase tracking-widest text-xl">No courses enrolled yet.</p>
                     <Button variant="primary" className="mt-6" onClick={() => window.location.href = '/courses'}>Explore Courses</Button>
                   </div>
                 )}
               </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-8">
               <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Achievements</h2>
               <Card className="bg-secondary/20 border-3 border-deep-indigo space-y-6 p-6">
                  {[
                    { icon: '🎯', title: 'Quick Learner', desc: 'Completed 5 lessons in 1 day' },
                    { icon: '📄', title: 'Top Scorer', desc: 'Got 100% in React Quiz' },
                    { icon: '🏆', title: 'Weekly Warrior', desc: '7 day learning streak' }
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-4 items-center group">
                      <div className="w-12 h-12 bg-white border-2 border-deep-indigo shadow-brutal flex items-center justify-center text-2xl group-hover:-rotate-12 transition-transform">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-deep-indigo uppercase leading-tight">{activity.title}</p>
                        <p className="text-[11px] font-bold opacity-60 uppercase tracking-tighter">{activity.desc}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full py-2 text-[10px] font-bold uppercase tracking-widest mt-4">View Certificates</Button>
               </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
