"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/Button";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        
        if (authData.user) {
          const res = await fetch(`/api/enrollments/${authData.user.id}`);
          if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              setEnrollments(Array.isArray(data) ? data : []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const sortedEnrollments = [...enrollments].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Your Library...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar activeItem="My Courses" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">My Courses</h1>
              <p className="text-lg opacity-70">Pick up where you left off in your learning journey.</p>
            </div>
            <Button variant="primary" onClick={() => window.location.href = '/courses'}>Browse More</Button>
          </header>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEnrollments.length > 0 ? sortedEnrollments.map((enroll) => (
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
              <div className="col-span-full py-24 border-4 border-dashed border-deep-indigo/10 rounded-xl text-center bg-white">
                <div className="text-7xl mb-6 grayscale opacity-20">📖</div>
                <p className="font-heading font-bold text-deep-indigo opacity-30 uppercase tracking-widest text-xl">Your library is empty.</p>
                <p className="text-sm opacity-40 mt-2 mb-8 uppercase font-bold">Start your first path today!</p>
                <Button variant="primary" className="px-10" onClick={() => window.location.href = '/courses'}>Explore Paths</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
