"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Courses...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar activeItem="Courses" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Course Inventory</h1>
              <p className="text-lg opacity-70">Create, edit, and manage your learning content.</p>
            </div>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ New Course</Button>
          </header>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-indigo/40" size={20} />
              <input 
                type="text" 
                placeholder="Search courses by name or category..."
                className="w-full pl-12 pr-4 py-3 border-3 border-deep-indigo focus:shadow-brutal focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border-3 border-deep-indigo font-bold uppercase text-sm hover:bg-secondary transition-all">
              <Filter size={18} />
              Filter
            </button>
          </div>

          {/* Grid view of courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => (
              <Card key={course._id} className="p-0 overflow-hidden border-3 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="h-48 bg-secondary/30 border-b-3 border-deep-indigo relative group">
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                    alt={course.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white border-2 border-deep-indigo px-3 py-1 font-bold text-xs uppercase shadow-brutal">
                    {course.category}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-heading font-bold text-deep-indigo mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-sm opacity-60 mb-6 line-clamp-2">{course.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div>
                      <span className="block text-[10px] font-bold uppercase opacity-40">Price</span>
                      <span className="text-xl font-heading font-bold text-primary">₹{course.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 border-2 border-deep-indigo hover:bg-secondary transition-all shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 border-2 border-error text-error hover:bg-error hover:text-white transition-all shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="col-span-full py-20 text-center border-4 border-dashed border-deep-indigo/20 rounded-xl">
                 <div className="text-6xl mb-4 opacity-20">📭</div>
                 <h2 className="text-2xl font-heading font-bold text-deep-indigo opacity-30 uppercase tracking-widest">No courses found</h2>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCourses}
      />
    </div>
  );
}
