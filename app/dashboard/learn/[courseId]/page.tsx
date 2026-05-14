"use client";

import React, { useEffect, useState, use } from 'react';
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Clock,
  Play
} from 'lucide-react';

export default function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data) {
            setCourse(data);
          }
        }
      } catch (error) {
        console.error("Error fetching course for learn page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);


  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Lesson...</div>

  const currentLesson = course?.lessons?.[currentLessonIndex];

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-72px)]">
        {/* Course Content Sidebar */}
        <aside className="w-[350px] bg-white border-r-4 border-deep-indigo flex flex-col h-full overflow-hidden hidden lg:flex">
          <div className="p-6 border-b-4 border-deep-indigo bg-secondary/30">
            <h2 className="font-heading font-black text-deep-indigo uppercase tracking-tighter line-clamp-2">{course?.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1 h-2 bg-white border-2 border-deep-indigo rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[35%]" />
              </div>
              <span className="text-[10px] font-black uppercase text-deep-indigo/60 whitespace-nowrap">35% Done</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {course?.lessons?.map((lesson: any, i: number) => (
              <button 
                key={lesson._id}
                onClick={() => setCurrentLessonIndex(i)}
                className={`w-full text-left p-4 border-3 flex items-start gap-4 transition-all ${
                  currentLessonIndex === i 
                  ? 'bg-primary text-white border-deep-indigo shadow-brutal translate-x-1 translate-y-1' 
                  : 'bg-white text-deep-indigo border-deep-indigo hover:bg-secondary hover:translate-x-1 hover:translate-y-1'
                }`}
              >
                <div className={`mt-1 ${currentLessonIndex === i ? 'text-white' : 'text-primary'}`}>
                  {i < currentLessonIndex ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Lesson {i + 1}</p>
                  <p className="font-heading font-bold text-sm leading-tight mt-0.5">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-2 opacity-50 text-[10px] font-black uppercase">
                    <Clock size={10} />
                    {lesson.duration || '10:00'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t-4 border-deep-indigo">
             <Button variant="outline" className="w-full text-xs py-3">View Resources</Button>
          </div>
        </aside>

        {/* Video Player Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-bg-offwhite">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <button className="flex items-center gap-2 font-black uppercase text-xs text-deep-indigo hover:text-primary transition-colors">
                <ChevronLeft size={16} />
                Back to Dashboard
              </button>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Section 1: The Foundations</div>
            </header>

            {/* Main Video Section */}
            <div className="relative aspect-video bg-deep-indigo border-4 border-deep-indigo shadow-brutal-lg overflow-hidden group">
              <img 
                src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200`} 
                className="w-full h-full object-cover opacity-40 blur-[2px] group-hover:blur-0 transition-all duration-700" 
                alt="Video Placeholder" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-primary border-4 border-deep-indigo shadow-brutal flex items-center justify-center rounded-full hover:scale-110 transition-transform active:scale-95">
                  <Play size={32} className="text-white fill-current ml-1" />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-white border-2 border-deep-indigo px-4 py-2 shadow-brutal">
                  <h3 className="font-heading font-bold text-deep-indigo uppercase text-sm italic">{currentLesson?.title}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-heading font-bold text-deep-indigo uppercase">{currentLesson?.title}</h1>
                  <span className="bg-success/20 text-success border-2 border-success/30 px-3 py-1 font-black text-[10px] uppercase rounded">Unlocked</span>
                </div>
                <p className="text-lg opacity-80 leading-relaxed font-body">
                  In this lesson, we dive deep into the core concepts that define this module. We'll explore the underlying architecture, practical applications, and common pitfalls to avoid.
                </p>
                
                <div className="flex gap-4">
                  <Button variant="primary" className="px-10">Mark as Completed</Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText size={18} />
                    Download Notes
                  </Button>
                </div>
              </div>

              {/* Lesson Quiz / Next up */}
              <div className="space-y-6">
                <Card className="border-3 bg-secondary/20 space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">Next Lesson</div>
                  <h4 className="font-heading font-bold text-deep-indigo text-lg leading-tight uppercase">
                    {course?.lessons?.[currentLessonIndex + 1]?.title || 'End of Section'}
                  </h4>
                  <Button 
                    variant="secondary" 
                    className="w-full text-xs py-3"
                    disabled={currentLessonIndex >= (course?.lessons?.length || 1) - 1}
                    onClick={() => setCurrentLessonIndex(prev => prev + 1)}
                  >
                    Up Next <ChevronRight size={14} />
                  </Button>
                </Card>

                <Card className="border-3 bg-warning/10 border-warning space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-warning">Knowledge Check</div>
                  <p className="text-xs font-bold text-deep-indigo uppercase leading-tight">Ready to test your knowledge on this lesson?</p>
                  <Button variant="primary" className="w-full bg-warning border-deep-indigo text-deep-indigo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Take Quiz</Button>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
