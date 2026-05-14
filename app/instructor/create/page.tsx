"use client";

import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { InstructorSidebar } from "@/components/InstructorSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Upload, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    category: '',
    instructor: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (res.ok) {
        router.push('/instructor');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create course');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <InstructorSidebar activeItem="Create Course" />
        
        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-deep-indigo opacity-50 hover:opacity-100 font-bold uppercase text-xs mb-6 transition-all"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Draft a New Course</h1>
            <p className="text-lg opacity-70 text-primary font-bold italic">Share your expertise with the world.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-3 p-8 bg-white shadow-brutal">
              <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase mb-6 border-b-2 border-deep-indigo/10 pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <Input 
                  label="Course Title"
                  placeholder="e.g. Master React in 30 Days"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Category"
                    placeholder="e.g. Development"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                  <Input 
                    label="Price (INR)"
                    type="number"
                    placeholder="999"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-deep-indigo/60">Detailed Description</label>
                  <textarea 
                    className="w-full border-3 border-deep-indigo p-4 font-body focus:outline-none focus:shadow-brutal transition-all min-h-[160px] bg-bg-offwhite/30"
                    placeholder="Explain what students will learn, prerequisites, and the target audience..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="border-3 p-8 bg-white shadow-brutal">
              <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase mb-6 border-b-2 border-deep-indigo/10 pb-2">Media & Instructor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Input 
                    label="Instructor Display Name"
                    placeholder="e.g. Jane Doe"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    required
                  />
                  <Input 
                    label="Thumbnail URL"
                    placeholder="https://..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex flex-col justify-center items-center border-4 border-dashed border-deep-indigo/10 rounded-xl bg-bg-offwhite/20 p-6 text-center">
                  {formData.thumbnail ? (
                    <div className="relative group w-full aspect-video border-3 border-deep-indigo overflow-hidden">
                      <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, thumbnail: ''})}
                        className="absolute inset-0 bg-error/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase"
                      >
                        <Trash2 className="mr-2" /> Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                        <Upload size={32} />
                      </div>
                      <p className="text-xs font-bold uppercase opacity-40">Thumbnail Preview</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-6 pb-12">
              <Button type="button" variant="outline" onClick={() => router.back()}>Discard Draft</Button>
              <Button type="submit" variant="primary" className="px-10" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
