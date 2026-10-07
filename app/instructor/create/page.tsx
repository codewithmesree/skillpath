"use client";

import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { InstructorSidebar } from "@/components/InstructorSidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Upload, Trash2, ArrowLeft, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
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

  const samplePresets = [
    { label: "Code & Dev", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80" },
    { label: "UI/UX Design", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80" },
    { label: "AI & Data", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" },
    { label: "Security & APIs", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image must be smaller than 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
        
        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-deep-indigo opacity-50 hover:opacity-100 font-bold uppercase text-xs mb-6 transition-all"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Draft a New Course</h1>
            <p className="text-lg opacity-70 text-primary font-bold italic">Submit your curriculum. It goes live once an admin approves it.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-3 p-8 bg-white shadow-brutal">
              <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase mb-6 border-b-2 border-deep-indigo/10 pb-2">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <Input 
                  label="Course Title"
                  placeholder="e.g. Mastering Modern UI/UX Architecture"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Input 
                      label="Category"
                      placeholder="e.g. Art, Design, Development"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Art", "Design", "Development", "Business", "AI & Tech"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: preset }))}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border border-deep-indigo transition-all ${
                            formData.category.toLowerCase() === preset.toLowerCase()
                              ? "bg-primary text-white shadow-brutal-sm"
                              : "bg-white text-deep-indigo hover:bg-secondary/40"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input 
                    label="Price (INR)"
                    type="number"
                    placeholder="999 (0 for free)"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-deep-indigo/60">Detailed Description</label>
                  <textarea 
                    className="w-full border-3 border-deep-indigo p-4 font-body focus:outline-none focus:shadow-brutal transition-all min-h-[140px] bg-bg-offwhite/30"
                    placeholder="Explain what students will learn, project milestones, prerequisites..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Media & Thumbnail (Optional) */}
            <Card className="border-3 p-8 bg-white shadow-brutal">
              <div className="flex items-center justify-between border-b-2 border-deep-indigo/10 pb-3 mb-6">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-heading font-bold text-deep-indigo uppercase">
                    Course Thumbnail &amp; Instructor
                  </h2>
                  <p className="text-xs font-bold text-dark-text/60 uppercase">
                    Thumbnail is completely optional. If left blank, a default course cover will be used.
                  </p>
                </div>
                <span className="bg-secondary/40 text-deep-indigo text-[10px] font-black uppercase px-2 py-0.5 border border-deep-indigo/30 rounded">
                  Optional
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Inputs */}
                <div className="space-y-6">
                  <Input 
                    label="Instructor Display Name"
                    placeholder="e.g. Jane Doe"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    required
                  />

                  {/* Thumbnail Option 1: File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-deep-indigo/70">
                      Option A: Upload Image File (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-white border-3 border-deep-indigo px-4 py-2.5 font-heading font-black text-xs uppercase tracking-wider text-deep-indigo shadow-brutal hover:bg-secondary hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2">
                        <Upload size={16} /> Choose Image File
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                      {formData.thumbnail && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                          className="text-xs font-bold uppercase text-error hover:underline flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Clear Image
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Option 2: Image URL */}
                  <div className="space-y-2">
                    <Input 
                      label="Option B: Or Paste Image URL (Optional)"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/60">
                      Or Pick a Quick Preset Cover:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {samplePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, thumbnail: preset.url }))}
                          className={`text-xs font-bold uppercase px-3 py-1 border-2 border-deep-indigo transition-all ${
                            formData.thumbnail === preset.url
                              ? 'bg-primary text-white shadow-brutal-sm'
                              : 'bg-white text-deep-indigo hover:bg-secondary/40'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Live Thumbnail Preview */}
                <div className="flex flex-col justify-center items-center">
                  <div className="w-full max-w-sm border-3 border-deep-indigo rounded-lg bg-bg-offwhite overflow-hidden shadow-brutal">
                    {/* Header chrome */}
                    <div className="bg-secondary/40 border-b-2 border-deep-indigo px-3 py-1.5 flex items-center justify-between text-[11px] font-heading font-black uppercase text-deep-indigo">
                      <span>Thumbnail Preview</span>
                      <span className="text-[10px] font-bold text-dark-text/60">
                        {formData.thumbnail ? 'Custom Cover' : 'Default Cover'}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-video w-full bg-secondary/20 flex items-center justify-center overflow-hidden">
                      {formData.thumbnail ? (
                        <>
                          <img 
                            src={formData.thumbnail} 
                            alt="Course Thumbnail Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                            className="absolute top-2 right-2 bg-error text-white p-1 rounded border-2 border-deep-indigo shadow-sm hover:scale-105 transition-transform"
                            title="Remove Thumbnail"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-6 space-y-2">
                          <ImageIcon size={40} className="mx-auto text-deep-indigo/40" />
                          <p className="text-xs font-heading font-bold uppercase text-deep-indigo/60">
                            No image selected
                          </p>
                          <p className="text-[10px] font-body text-dark-text/50">
                            A high-resolution platform cover will automatically be displayed.
                          </p>
                        </div>
                      )}

                      {/* Mock Badges */}
                      <div className="absolute bottom-2 left-2 bg-warning border-2 border-deep-indigo px-2 py-0.5 text-[10px] font-black uppercase text-deep-indigo shadow-brutal-sm">
                        {formData.price ? (Number(formData.price) === 0 ? 'FREE' : `₹${formData.price}`) : '₹999'}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white border-2 border-deep-indigo px-2 py-0.5 text-[10px] font-bold uppercase text-deep-indigo shadow-brutal-sm">
                        {formData.category || 'Category'}
                      </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="p-3 bg-white space-y-1">
                      <p className="font-heading font-bold text-sm text-deep-indigo truncate">
                        {formData.title || 'Course Title Preview'}
                      </p>
                      <p className="text-[10px] font-bold text-dark-text/60 uppercase">
                        By {formData.instructor || 'Your Name'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-6 pb-12">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Discard Draft
              </Button>
              <Button type="submit" variant="primary" className="px-10 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
