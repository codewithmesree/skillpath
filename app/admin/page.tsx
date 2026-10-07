"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { Clock, Bell, X, Radio } from 'lucide-react';
import { useAdminChannel } from "@/lib/useAdminChannel";
import { EVENTS, type CourseSubmittedPayload, type CourseStatusUpdatedPayload } from "@/lib/realtime";

type Toast = CourseSubmittedPayload & { toastId: number };

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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  const dismissToast = (courseId: string) =>
    setToasts(prev => prev.filter(t => t._id !== courseId));

  const realtimeStatus = useAdminChannel({
    [EVENTS.COURSE_SUBMITTED]: (course: CourseSubmittedPayload) => {
      setCourses(prev => [
        { ...course, instructorId: { name: course.instructor } },
        ...prev.filter(c => c._id !== course._id),
      ]);
      setFreshIds(prev => new Set(prev).add(course._id));
      setToasts(prev => [
        { ...course, toastId: Date.now() },
        ...prev.filter(t => t._id !== course._id),
      ].slice(0, 4));
    },
    [EVENTS.COURSE_STATUS_UPDATED]: ({ _id, status }: CourseStatusUpdatedPayload) => {
      // Another admin (or tab) handled it
      setCourses(prev => prev.map(c => (c._id === _id ? { ...c, status } : c)));
      dismissToast(_id);
    },
  });

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


  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    const previous = courses;
    // Optimistic update so the card leaves the queue immediately
    setCourses(prev => prev.map(c => (c._id === id ? { ...c, status: newStatus } : c)));
    dismissToast(id);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Status update failed (${res.status})`);
    } catch (error) {
      console.error("Error updating course status:", error);
      setCourses(previous);
      alert("Couldn't update the course status. Please try again.");
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
            <div
              title={
                realtimeStatus === 'live' ? 'Connected: new submissions appear instantly'
                : realtimeStatus === 'disabled' ? 'Pusher keys not set. Add them to .env to enable live updates'
                : realtimeStatus === 'error' ? 'Could not authorize the realtime channel'
                : 'Connecting...'
              }
              className={`flex items-center gap-2 px-3 py-1.5 border-2 border-deep-indigo text-[10px] font-black uppercase tracking-widest shadow-brutal-sm ${
                realtimeStatus === 'live' ? 'bg-success/20 text-deep-indigo'
                : realtimeStatus === 'connecting' ? 'bg-warning/20 text-deep-indigo'
                : 'bg-white text-deep-indigo/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                realtimeStatus === 'live' ? 'bg-success animate-pulse'
                : realtimeStatus === 'connecting' ? 'bg-warning'
                : 'bg-deep-indigo/30'
              }`} />
              <Radio size={12} />
              {realtimeStatus === 'live' ? 'Live' : realtimeStatus === 'connecting' ? 'Connecting' : 'Live updates off'}
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
                <span className="ml-1 bg-warning text-deep-indigo border-2 border-deep-indigo text-sm px-2 py-0.5 shadow-brutal-sm">
                  {courses.filter(c => c.status === 'pending').length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {courses.filter(c => c.status === 'pending').map((course) => (
                  <Card key={course._id} className={`border-3 bg-warning/5 border-warning flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 ${freshIds.has(course._id) ? 'ring-4 ring-primary/40' : ''}`}>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white border-2 border-warning flex items-center justify-center font-black text-warning italic overflow-hidden">
                        {course.thumbnail ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" /> : '?'}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-deep-indigo uppercase flex items-center gap-2">
                          {course.title}
                          {freshIds.has(course._id) && (
                            <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 border border-deep-indigo tracking-widest">NEW</span>
                          )}
                        </h3>
                        <p className="text-xs opacity-60 font-bold uppercase">
                          Submitted by: {course.instructorId?.name || course.instructor || 'Unknown'}
                          {course.category ? ` · ${course.category}` : ''}
                          {course.price !== undefined ? ` · ₹${course.price}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="primary" className="py-2 px-6 bg-success border-deep-indigo text-deep-indigo hover:shadow-none" onClick={() => handleStatusUpdate(course._id, 'approved')}>Approve</Button>
                      <Button variant="outline" className="py-2 px-6 text-error border-error hover:bg-error/10" onClick={() => handleStatusUpdate(course._id, 'rejected')}>Decline</Button>
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

      {/* Realtime submission toasts */}
      <div className="fixed top-24 right-4 z-[60] flex flex-col gap-3 w-[340px] max-w-[calc(100vw-2rem)]" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.toastId} className="bg-white border-3 border-deep-indigo shadow-brutal-lg p-4 animate-toast-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                <Bell size={14} className="animate-bounce" />
                {t.resubmitted ? 'Course resubmitted' : 'New course submitted'}
              </div>
              <button onClick={() => dismissToast(t._id)} aria-label="Dismiss" className="text-deep-indigo/50 hover:text-deep-indigo">
                <X size={16} />
              </button>
            </div>
            <h4 className="mt-2 font-heading font-bold text-deep-indigo uppercase leading-tight line-clamp-2">{t.title}</h4>
            <p className="text-xs font-bold opacity-60 uppercase mt-1">
              by {t.instructor || 'Unknown'}{t.category ? ` · ${t.category}` : ''}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleStatusUpdate(t._id, 'approved')}
                className="flex-1 py-2 bg-success border-2 border-deep-indigo font-heading font-black text-xs uppercase shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(t._id, 'rejected')}
                className="flex-1 py-2 bg-white border-2 border-error text-error font-heading font-black text-xs uppercase hover:bg-error hover:text-white transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

