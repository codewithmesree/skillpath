"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/Input";

export default function CourseListing() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["All", "Design", "Development", "Business", "Marketing", "Music", "Photography"];
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Courses fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);


  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      
      <main className="flex-grow px-6 md:px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-indigo uppercase">Course Library</h1>
            <p className="text-lg opacity-70">Find the perfect path for your next career jump.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-xl">
             <Input placeholder="Search for courses, skills, or mentors..." className="flex-1" />
             <Button variant="primary" className="h-fit py-[14px]">Filter</Button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`px-6 py-2 rounded-lg border-2 border-deep-indigo font-heading font-bold transition-all duration-150 ${
                cat === "All" 
                ? "bg-primary text-white shadow-brutal translate-x-[2px] translate-y-[2px]" 
                : "bg-secondary/40 text-deep-indigo hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center font-heading font-bold text-2xl py-20 uppercase opacity-20">Loading Courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? courses.map((course, i) => (
              <CourseCard key={course._id || i} courseId={course._id} {...course} />
            )) : (
              <div className="col-span-full text-center py-20 font-bold opacity-50">No courses found. Check back later!</div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center gap-4">
           <Button variant="secondary" disabled>Previous</Button>
           <div className="flex gap-2">
             {[1, 2, 3].map(p => (
               <button key={p} className={`w-10 h-10 border-2 border-deep-indigo font-bold flex items-center justify-center rounded ${p === 1 ? 'bg-primary text-white shadow-brutal' : 'bg-white text-deep-indigo'}`}>
                 {p}
               </button>
             ))}
           </div>
           <Button variant="secondary">Next</Button>
        </div>
      </main>

      <footer className="bg-deep-indigo text-white py-8 px-6 text-center text-sm opacity-50">
        © 2026 SkillPath Library. All rights reserved.
      </footer>
    </div>
  );
}
