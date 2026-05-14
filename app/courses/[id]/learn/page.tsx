"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useParams } from 'next/navigation';

export default function VideoLearningPage() {
  const params = useParams();
  const [activeLesson, setActiveLesson] = useState(0);

  const lessons = [
    { title: "Introduction to Brutalism", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:00" },
    { title: "Grid Systems & Layouts", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "15:30" },
    { title: "Typography Masterclass", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "20:00" },
    { title: "Final Project: Sticker UI", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "45:00" },
  ];

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Content */}
        <aside className="w-[320px] bg-secondary border-r-3 border-deep-indigo flex flex-col h-full overflow-y-auto">
          <div className="p-6 border-b-2 border-deep-indigo bg-white/50">
            <h2 className="font-heading font-bold text-xl text-deep-indigo uppercase">Course Content</h2>
            <div className="mt-2 w-full h-3 bg-surface-high border-2 border-deep-indigo rounded-md overflow-hidden">
               <div className="h-full bg-primary" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs font-bold mt-2 opacity-60">45% COMPLETE</p>
          </div>

          <div className="flex-1">
            {lessons.map((lesson, i) => (
              <button 
                key={i}
                onClick={() => setActiveLesson(i)}
                className={`w-full text-left p-6 border-b border-deep-indigo/10 flex items-start gap-4 transition-all ${activeLesson === i ? 'bg-white border-l-8 border-l-primary' : 'hover:bg-white/40'}`}
              >
                <span className={`w-8 h-8 rounded-full border-2 border-deep-indigo flex items-center justify-center font-bold text-sm ${activeLesson === i ? 'bg-primary text-white' : 'bg-white'}`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm leading-tight ${activeLesson === i ? 'text-primary' : 'text-deep-indigo'}`}>{lesson.title}</h3>
                  <p className="text-xs opacity-50 mt-1 font-bold uppercase tracking-wider">{lesson.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content - Video Player & Notes */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-surface-low">
          <div className="w-full aspect-video bg-black border-b-3 border-deep-indigo relative">
            <iframe 
              className="w-full h-full"
              src={lessons[activeLesson].videoUrl}
              title={lessons[activeLesson].title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="p-8 max-w-4xl mx-auto w-full space-y-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-heading font-bold text-deep-indigo uppercase">{lessons[activeLesson].title}</h1>
                <p className="text-lg opacity-60">Module 1: Design Foundations</p>
              </div>
              <div className="flex gap-4">
                 <Button variant="secondary">Previous</Button>
                 <Button variant="primary">Mark as Completed</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <h3 className="font-heading font-bold mb-4 uppercase text-primary">Lesson Notes</h3>
                <textarea 
                  className="w-full h-40 bg-surface-low border-2 border-deep-indigo p-4 font-body text-sm outline-none focus:bg-secondary/20"
                  placeholder="Type your notes here..."
                ></textarea>
                <Button variant="ghost" className="mt-4 w-full text-xs">Save Notes</Button>
              </Card>

              <Card className="bg-secondary/20">
                <h3 className="font-heading font-bold mb-4 uppercase text-deep-indigo">Resources</h3>
                <ul className="space-y-3">
                  {['Assets.zip', 'Layout-Guide.pdf', 'Design-Tokens.json'].map(file => (
                    <li key={file} className="flex items-center justify-between p-3 bg-white border-2 border-deep-indigo rounded-md">
                      <span className="text-sm font-bold">{file}</span>
                      <button className="text-primary font-bold hover:underline">Download</button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
