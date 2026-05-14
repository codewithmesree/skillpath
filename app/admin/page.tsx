"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { CreateCourseModal } from "@/components/CreateCourseModal";

export default function AdminDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [metricsData, setMetricsData] = useState({
    revenue: 0,
    students: 0,
    completions: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [coursesRes, metricsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/admin/metrics')
      ]);
      
      let coursesData = [];
      let metrics = { revenue: 0, students: 0, completions: 0 };

      if (coursesRes.ok && coursesRes.headers.get("content-type")?.includes("application/json")) {
        coursesData = await coursesRes.json();
      }
      
      if (metricsRes.ok && metricsRes.headers.get("content-type")?.includes("application/json")) {
        metrics = await metricsRes.json();
      }
      
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setMetricsData(metrics);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const metrics = [
    { label: "Total Revenue", value: `₹${metricsData.revenue?.toLocaleString() || 0}`, growth: "+12%" },
    { label: "Active Students", value: metricsData.students?.toString() || "0", growth: "+8%" },
    { label: "Course Enrollments", value: metricsData.completions?.toString() || "0", growth: "+15%" },
  ];

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Admin...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar activeItem="Dashboard" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Admin Control Panel</h1>
              <p className="text-lg opacity-70 font-body">Monitor platform growth and manage content.</p>
            </div>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Create New Course</Button>
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {metrics.map((metric, i) => (
              <Card key={i} className="border-3 bg-surface-lowest flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                   <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">{metric.label}</span>
                   <span className="bg-success/20 text-success font-bold text-[10px] px-2 py-1 rounded border border-success/30">{metric.growth}</span>
                 </div>
                 <div className="text-4xl font-heading font-bold text-deep-indigo mt-4">{metric.value}</div>
              </Card>
            ))}
          </div>

          {/* Course Table */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Recent Courses</h2>
              <span className="text-sm font-bold opacity-40 uppercase tracking-widest">{courses.length} Total Courses</span>
            </div>
            <Card className="p-0 overflow-hidden border-3">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary/50 border-b-3 border-deep-indigo font-heading font-bold text-deep-indigo uppercase text-sm">
                       <tr>
                         <th className="p-4">Course Name</th>
                         <th className="p-4">Category</th>
                         <th className="p-4">Students</th>
                         <th className="p-4">Price</th>
                         <th className="p-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="font-body text-deep-indigo">
                       {courses.length > 0 ? courses.map((course, i) => (
                         <tr key={course._id || i} className="border-b-2 border-deep-indigo/5 hover:bg-secondary/10 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-lg">{course.title}</div>
                              <div className="text-xs opacity-50 uppercase tracking-tighter">{course.instructor}</div>
                            </td>
                            <td className="p-4 italic opacity-70">{course.category}</td>
                            <td className="p-4 font-bold">{course.enrollmentsCount || 0}</td>
                            <td className="p-4 font-bold text-primary">₹{course.price}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-3">
                                <button className="px-3 py-1 bg-white border-2 border-deep-indigo font-bold text-xs hover:bg-secondary transition-all">Edit</button>
                                <button className="px-3 py-1 bg-error/10 border-2 border-error text-error font-bold text-xs hover:bg-error hover:text-white transition-all">Delete</button>
                              </div>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan={5} className="p-20 text-center font-heading font-bold opacity-20 text-2xl uppercase tracking-widest">No courses available yet.</td>
                         </tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </Card>
          </div>
        </main>
      </div>

      <CreateCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
      />
    </div>
  );
}

