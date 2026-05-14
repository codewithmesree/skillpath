"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [metricsData, setMetricsData] = useState({
    revenue: 0,
    students: 0,
    completions: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

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


  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openEditModal = (course: any) => {
    setEditingCourse(course);
    setIsModalOpen(true);
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

          {/* Pending Approvals Section */}
          {courses.filter(c => c.status === 'pending').length > 0 && (
            <div className="mb-12 space-y-6">
              <h2 className="text-2xl font-heading font-bold text-warning uppercase flex items-center gap-2">
                <Clock size={24} /> Pending Approvals
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {courses.filter(c => c.status === 'pending').map((course) => (
                  <Card key={course._id} className="border-3 bg-warning/5 border-warning flex items-center justify-between p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white border-2 border-warning flex items-center justify-center font-black text-warning italic">?</div>
                      <div>
                        <h3 className="font-heading font-bold text-deep-indigo uppercase">{course.title}</h3>
                        <p className="text-xs opacity-60 font-bold uppercase">Submitted by: {course.instructorId?.name || course.instructor || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="primary" className="py-2 px-6 bg-success border-deep-indigo text-deep-indigo hover:shadow-none" onClick={() => handleStatusUpdate(course._id, 'approved')}>Approve</Button>
                      <Button variant="outline" className="py-2 px-6 text-error border-error hover:bg-error/10" onClick={() => handleDelete(course._id)}>Reject</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Course Table */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">All Platform Courses</h2>
              <span className="text-sm font-bold opacity-40 uppercase tracking-widest">{courses.filter(c => c.status === 'approved').length} Approved</span>
            </div>
            <Card className="p-0 overflow-hidden border-3">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary/50 border-b-3 border-deep-indigo font-heading font-bold text-deep-indigo uppercase text-sm">
                       <tr>
                         <th className="p-4">Course Name</th>
                         <th className="p-4">Instructor</th>
                         <th className="p-4">Status</th>
                         <th className="p-4">Students</th>
                         <th className="p-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="font-body text-deep-indigo">
                       {courses.filter(c => c.status === 'approved').length > 0 ? courses.filter(c => c.status === 'approved').map((course, i) => (
                         <tr key={course._id || i} className="border-b-2 border-deep-indigo/5 hover:bg-secondary/10 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-lg">{course.title}</div>
                              <div className="text-xs opacity-50 uppercase tracking-tighter">{course.category}</div>
                            </td>
                            <td className="p-4 font-bold opacity-70">{course.instructorId?.name || course.instructor}</td>
                            <td className="p-4">
                               <span className={`px-3 py-1 border-2 font-black text-[10px] uppercase italic ${
                                 course.status === 'approved' ? 'bg-success/10 border-success text-success' :
                                 course.status === 'pending' ? 'bg-warning/10 border-warning text-warning' :
                                 'bg-error/10 border-error text-error'
                               }`}>
                                 {course.status}
                               </span>
                            </td>
                            <td className="p-4 font-bold">{course.enrollmentsCount || 0}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-3">
                                <button 
                                  onClick={() => openEditModal(course)}
                                  className="px-3 py-1 bg-white border-2 border-deep-indigo font-bold text-xs hover:bg-secondary transition-all"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(course._id)}
                                  className="px-3 py-1 bg-error/10 border-2 border-error text-error font-bold text-xs hover:bg-error hover:text-white transition-all"
                                >
                                  Delete
                                </button>
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }} 
        onSuccess={() => {
          fetchData();
          setEditingCourse(null);
        }}
        initialData={editingCourse}
      />
    </div>
  );
}

