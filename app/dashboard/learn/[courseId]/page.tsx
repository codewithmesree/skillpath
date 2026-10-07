"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { 
  PlayCircle, 
  CheckCircle2, 
  XCircle,
  ChevronLeft, 
  FileText, 
  Clock,
  Play,
  Upload,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  HelpCircle,
  Layers,
  BookOpen,
  Video,
  Presentation,
  AlertCircle,
  Maximize2,
  Minimize2,
  Columns
} from 'lucide-react';

interface Material {
  _id?: string;
  title: string;
  type: 'video' | 'ppt' | 'slides' | 'notes' | 'quiz';
  url?: string;
  fileName?: string;
  fileSize?: string;
  content?: string;
  duration?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectAnswer?: number;
  quizExplanation?: string;
  createdAt?: string;
}

export default function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'ppt' | 'slides' | 'notes' | 'quiz'>('all');
  const [isSidebarFullPage, setIsSidebarFullPage] = useState(true);

  // Instructor Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'ppt' | 'slides' | 'notes' | 'quiz'>('video');
  const [submittingMaterial, setSubmittingMaterial] = useState(false);
  
  // New Material Form
  const [materialForm, setMaterialForm] = useState<{
    title: string;
    url: string;
    fileName: string;
    fileSize: string;
    content: string;
    duration: string;
    quizQuestion: string;
    quizOptions: string[];
    quizCorrectAnswer: number;
    quizExplanation: string;
  }>({
    title: '',
    url: '',
    fileName: '',
    fileSize: '',
    content: '',
    duration: '',
    quizQuestion: '',
    quizOptions: ['', '', '', ''],
    quizCorrectAnswer: 0,
    quizExplanation: '',
  });

  // Interactive Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const openUploadModal = (type?: 'video' | 'ppt' | 'slides' | 'notes' | 'quiz') => {
    if (type) {
      setUploadType(type);
    } else if (activeFilter !== 'all') {
      setUploadType(activeFilter === 'slides' ? 'ppt' : activeFilter);
    }
    setIsUploadModalOpen(true);
  };

  const fetchCourseAndUser = async () => {
    try {
      // 1. Fetch current user
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // 2. Fetch course data
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          setCourse(data);
        }
      }
    } catch (error) {
      console.error("Error fetching course for learn page:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseAndUser();
    }
  }, [courseId]);

  // Aggregate all uploaded items (combining course.materials, lessons, and quizzes)
  const allMaterials: Material[] = React.useMemo(() => {
    if (!course) return [];
    
    const items: Material[] = [];

    // 1. Dedicated materials array
    if (Array.isArray(course.materials)) {
      course.materials.forEach((m: any) => {
        items.push(m);
      });
    }

    // 2. Existing lessons (if not already represented)
    if (Array.isArray(course.lessons)) {
      course.lessons.forEach((lesson: any, idx: number) => {
        if (lesson.videoUrl || lesson.title) {
          items.push({
            _id: lesson._id || `lesson-${idx}`,
            title: lesson.title,
            type: 'video',
            url: lesson.videoUrl,
            duration: lesson.duration || '10:00',
            content: lesson.notes,
          });
        }
      });
    }

    // 3. Existing quizzes (if not already represented)
    if (Array.isArray(course.quizzes)) {
      course.quizzes.forEach((quiz: any, idx: number) => {
        items.push({
          _id: quiz._id || `quiz-${idx}`,
          title: `Quiz: ${quiz.question?.slice(0, 40) || 'Knowledge Check'}...`,
          type: 'quiz',
          quizQuestion: quiz.question,
          quizOptions: quiz.options,
          quizCorrectAnswer: quiz.correctAnswer,
          quizExplanation: quiz.explanation,
        });
      });
    }

    return items;
  }, [course]);

  // Filter materials based on selected tab
  const filteredMaterials = React.useMemo(() => {
    if (activeFilter === 'all') return allMaterials;
    if (activeFilter === 'ppt' || activeFilter === 'slides') {
      return allMaterials.filter(m => m.type === 'ppt' || m.type === 'slides');
    }
    return allMaterials.filter(m => m.type === activeFilter);
  }, [allMaterials, activeFilter]);

  const currentMaterial: Material | undefined = filteredMaterials[selectedMaterialIndex] || filteredMaterials[0];

  // Reset quiz selection whenever switching materials
  useEffect(() => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  }, [selectedMaterialIndex, currentMaterial?._id]);

  // Can current user upload / manage materials?
  const canManage = Boolean(
    user && (
      user.role === 'admin' || 
      user.role === 'instructor'
    )
  );

  // File upload handler (reads file as Data URL with size formatting)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit. For larger videos, please enter a YouTube, Vimeo, or external MP4 URL.");
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMaterialForm(prev => ({
        ...prev,
        url: reader.result as string,
        fileName: file.name,
        fileSize: sizeFormatted,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
    };
    reader.readAsDataURL(file);

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const textReader = new FileReader();
      textReader.onloadend = () => {
        setMaterialForm(prev => ({
          ...prev,
          content: prev.content || (textReader.result as string),
        }));
      };
      textReader.readAsText(file);
    }
  };

  // Submit new material to backend
  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.title) {
      alert("Please enter a title for the material.");
      return;
    }

    setSubmittingMaterial(true);

    try {
      const payload: any = {
        action: 'addMaterial',
        material: {
          title: materialForm.title,
          type: uploadType,
          url: materialForm.url,
          fileName: materialForm.fileName,
          fileSize: materialForm.fileSize,
          content: materialForm.content,
          duration: materialForm.duration || (uploadType === 'video' ? '12:00' : undefined),
          quizQuestion: uploadType === 'quiz' ? materialForm.quizQuestion : undefined,
          quizOptions: uploadType === 'quiz' ? materialForm.quizOptions.filter(Boolean) : undefined,
          quizCorrectAnswer: uploadType === 'quiz' ? materialForm.quizCorrectAnswer : undefined,
          quizExplanation: uploadType === 'quiz' ? materialForm.quizExplanation : undefined,
        }
      };

      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedCourse = await res.json();
        setCourse(updatedCourse);
        setIsUploadModalOpen(false);
        setActiveFilter('all');
        setSelectedMaterialIndex(0);
        // Reset form
        setMaterialForm({
          title: '',
          url: '',
          fileName: '',
          fileSize: '',
          content: '',
          duration: '',
          quizQuestion: '',
          quizOptions: ['', '', '', ''],
          quizCorrectAnswer: 0,
          quizExplanation: '',
        });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to upload material');
      }
    } catch (err: any) {
      alert('Error uploading material: ' + err.message);
    } finally {
      setSubmittingMaterial(false);
    }
  };

  // Delete a study material
  const handleDeleteMaterial = async (materialId?: string) => {
    if (!materialId) return;
    if (!confirm("Are you sure you want to remove this study material?")) return;

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeMaterial',
          materialId,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setCourse(updated);
        setSelectedMaterialIndex(0);
      }
    } catch (err: any) {
      alert("Error deleting material: " + err.message);
    }
  };

  // Helper to render video (YouTube, Vimeo, MP4, or Data URL)
  const renderVideoPlayer = (url?: string) => {
    if (!url) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-deep-indigo text-white p-8 text-center">
          <Video size={48} className="text-primary mb-3" />
          <p className="font-heading font-bold text-lg uppercase">Video URL not provided</p>
          <p className="text-xs opacity-60">The instructor has not attached a valid video source for this item.</p>
        </div>
      );
    }

    // YouTube Embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0];
      } else if (url.includes('/embed/')) {
        videoId = url.split('/embed/')[1]?.split('?')[0];
      }
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
          title="YouTube Video Player"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Vimeo Embed
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Vimeo Video Player"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // HTML5 Video tag (MP4, WebM, Data URL)
    return (
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="w-full h-full object-contain bg-black"
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  // Helper for material icon
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle size={18} className="text-primary" />;
      case 'ppt': return <Presentation size={18} className="text-warning" />;
      case 'slides': return <Layers size={18} className="text-secondary" />;
      case 'notes': return <FileText size={18} className="text-success" />;
      case 'quiz': return <HelpCircle size={18} className="text-error" />;
      default: return <BookOpen size={18} className="text-deep-indigo" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-black uppercase text-2xl text-deep-indigo">
        Loading Course Hub...
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-bg-offwhite flex flex-col font-body overflow-hidden">
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Instructor Management Action Ribbon */}
      {canManage && (
        <div className="bg-deep-indigo text-white px-6 md:px-12 py-3 border-b-4 border-deep-indigo flex flex-wrap items-center justify-between gap-4 select-none z-30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-warning text-deep-indigo text-[10px] font-heading font-black uppercase tracking-wider px-2 py-0.5 border border-deep-indigo rounded">
              Instructor Studio
            </span>
            <span className="text-xs font-bold text-white/90">
              Manage study materials for: <strong className="text-secondary">{course?.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => openUploadModal()}
              className="py-1.5 px-4 text-xs font-heading font-black uppercase tracking-wider flex items-center gap-2 bg-primary text-white border-2 border-white shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Plus size={16} /> Upload Study Material
            </Button>
          </div>
        </div>
      )}

      {/* Main Body Area - covers 100% of remaining viewport height */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* SIDEBAR: CAN COVER WHOLE PAGE OR RUN FULL HEIGHT IN SPLIT VIEW */}
        <aside 
          className={`bg-white flex flex-col h-full shrink-0 overflow-hidden transition-all duration-200 ${
            isSidebarFullPage 
              ? 'w-full' 
              : 'w-full md:w-[380px] lg:w-[420px] border-r-4 border-deep-indigo'
          }`}
        >
          {/* Header Info */}
          <div className="p-5 border-b-4 border-deep-indigo bg-secondary/20 shrink-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <Link 
                href="/dashboard/courses"
                className="inline-flex items-center gap-1.5 text-[11px] font-heading font-bold text-deep-indigo/70 hover:text-deep-indigo uppercase transition-colors"
              >
                <ChevronLeft size={14} /> Back to My Courses
              </Link>

              <button
                onClick={() => setIsSidebarFullPage(!isSidebarFullPage)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-heading font-black uppercase tracking-wider bg-white text-deep-indigo border-2 border-deep-indigo rounded hover:bg-primary hover:text-white transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
                title={isSidebarFullPage ? "Switch to Split View" : "Cover Whole Page"}
              >
                {isSidebarFullPage ? (
                  <>
                    <Columns size={12} />
                    <span>Split View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={12} />
                    <span>Cover Whole Page</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading font-black text-deep-indigo text-lg md:text-xl uppercase tracking-tight line-clamp-2">
                  {course?.title || 'Course Materials'}
                </h2>
                <p className="text-xs font-bold text-dark-text/60 mt-1 uppercase">
                  By {course?.instructor || 'Instructor'} • {allMaterials.length} Items Uploaded
                </p>
              </div>

              {canManage && (
                <Button
                  variant="primary"
                  onClick={() => openUploadModal()}
                  className="py-1.5 px-3 text-[11px] font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-brutal-sm shrink-0"
                >
                  <Plus size={14} /> Upload
                </Button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="p-3 border-b-2 border-deep-indigo/10 flex flex-wrap gap-1.5 bg-surface-low shrink-0">
            {[
              { id: 'all', label: `All (${allMaterials.length})` },
              { id: 'video', label: `Videos (${allMaterials.filter(m => m.type === 'video').length})` },
              { id: 'ppt', label: `PPTs & Slides (${allMaterials.filter(m => m.type === 'ppt' || m.type === 'slides').length})` },
              { id: 'notes', label: `Notes (${allMaterials.filter(m => m.type === 'notes').length})` },
              { id: 'quiz', label: `Quizzes (${allMaterials.filter(m => m.type === 'quiz').length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFilter(f.id as any);
                  setSelectedMaterialIndex(0);
                }}
                className={`text-[10px] font-heading font-black uppercase tracking-wider px-2 py-1 rounded border-2 transition-all ${
                  activeFilter === f.id
                    ? 'bg-deep-indigo text-white border-deep-indigo shadow-brutal-sm'
                    : 'bg-white text-deep-indigo border-deep-indigo/30 hover:border-deep-indigo'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Materials List / Full-Page View */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
            {filteredMaterials.length === 0 ? (
              <div className={`p-8 md:p-12 text-center space-y-4 ${
                isSidebarFullPage 
                  ? 'max-w-xl mx-auto my-12 border-4 border-deep-indigo bg-white rounded-xl shadow-brutal-lg' 
                  : 'space-y-3'
              }`}>
                <div className="w-16 h-16 bg-secondary/50 border-3 border-deep-indigo rounded-full flex items-center justify-center mx-auto text-deep-indigo shadow-brutal-sm">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-1">
                  <p className="font-heading font-bold text-base text-deep-indigo uppercase">
                    No Materials Uploaded Yet
                  </p>
                  <p className="text-xs text-dark-text/60 max-w-sm mx-auto">
                    {canManage 
                      ? "As the instructor of this course, you can upload PPTs, videos, lecture slides, downloadable notes, or interactive quizzes."
                      : "The instructor has not uploaded materials in this category yet."}
                  </p>
                </div>
                {canManage && (
                  <Button 
                    variant="primary" 
                    onClick={() => openUploadModal()}
                    className="text-xs py-2.5 px-5 uppercase font-black shadow-brutal"
                  >
                    + Upload Study Material
                  </Button>
                )}
              </div>
            ) : isSidebarFullPage ? (
              /* FULL PAGE GRID VIEW */
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-heading font-black text-deep-indigo uppercase">
                    {filteredMaterials.length} Study {filteredMaterials.length === 1 ? 'Material' : 'Materials'} Available
                  </p>
                  <button
                    onClick={() => setIsSidebarFullPage(false)}
                    className="text-xs font-heading font-black text-primary hover:underline flex items-center gap-1 uppercase"
                  >
                    <Columns size={13} /> Switch to Split View
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredMaterials.map((material, idx) => (
                    <div
                      key={material._id || idx}
                      className="bg-white border-3 border-deep-indigo rounded-xl p-5 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="bg-secondary/40 text-deep-indigo border-2 border-deep-indigo text-[10px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1.5 shadow-brutal-sm">
                            {getMaterialIcon(material.type)}
                            {material.type}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {material.duration && (
                              <span className="text-[11px] font-mono text-dark-text/70 flex items-center gap-1">
                                <Clock size={12} /> {material.duration}
                              </span>
                            )}
                            {material.fileSize && (
                              <span className="text-[11px] font-mono text-dark-text/70">
                                {material.fileSize}
                              </span>
                            )}
                            {canManage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMaterial(material._id);
                                }}
                                className="p-1 rounded text-deep-indigo/40 hover:text-error hover:bg-error/10 transition-colors"
                                title="Delete Material"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="font-heading font-black text-lg text-deep-indigo leading-snug line-clamp-2">
                          {material.title}
                        </h4>

                        {material.content && (
                          <p className="text-xs text-dark-text/60 line-clamp-3 font-body">
                            {material.content}
                          </p>
                        )}
                        {material.quizQuestion && (
                          <p className="text-xs text-dark-text/70 italic line-clamp-2">
                            Q: {material.quizQuestion}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t-2 border-deep-indigo/10 flex items-center justify-between gap-2">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedMaterialIndex(idx);
                            setIsSidebarFullPage(false);
                          }}
                          className="flex-1 py-2 text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-brutal-sm"
                        >
                          <Play size={13} /> {material.type === 'quiz' ? 'Take Quiz' : material.type === 'video' ? 'Watch Video' : 'View Material'}
                        </Button>

                        {material.url && (
                          <a
                            href={material.url}
                            download={material.fileName || material.title}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border-2 border-deep-indigo rounded hover:bg-secondary/40 text-deep-indigo transition-colors"
                            title="Download"
                          >
                            <Download size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* DOCKED SIDEBAR LIST VIEW */
              <div className="space-y-2.5">
                {filteredMaterials.map((material, idx) => {
                  const isSelected = selectedMaterialIndex === idx;
                  return (
                    <div
                      key={material._id || idx}
                      className={`group relative border-3 p-3.5 rounded-lg transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-primary text-white border-deep-indigo shadow-brutal'
                          : 'bg-white text-deep-indigo border-deep-indigo hover:bg-secondary/20 hover:translate-x-0.5'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedMaterialIndex(idx)}
                        className="flex-1 text-left flex items-start gap-3 focus:outline-none"
                      >
                        <div className="mt-0.5 shrink-0">
                          {getMaterialIcon(material.type)}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-heading font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                              isSelected 
                                ? 'bg-white text-deep-indigo border-white' 
                                : 'bg-secondary/40 text-deep-indigo border-deep-indigo/40'
                            }`}>
                              {material.type}
                            </span>
                            {material.duration && (
                              <span className="text-[10px] opacity-75 font-mono">
                                {material.duration}
                              </span>
                            )}
                            {material.fileSize && (
                              <span className="text-[10px] opacity-75 font-mono">
                                {material.fileSize}
                              </span>
                            )}
                          </div>
                          <h4 className="font-heading font-bold text-sm leading-tight line-clamp-2">
                            {material.title}
                          </h4>
                        </div>
                      </button>

                      {/* Delete button for instructors */}
                      {canManage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMaterial(material._id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-error hover:text-white transition-all shrink-0 ${
                            isSelected ? 'text-white' : 'text-deep-indigo/50'
                          }`}
                          title="Delete Material"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Dock Status Bar */}
          {!isSidebarFullPage && (
            <div className="shrink-0 p-3 border-t-2 border-deep-indigo/10 bg-surface-low flex items-center justify-between text-[11px] font-bold text-deep-indigo/60 uppercase">
              <span>{filteredMaterials.length} Items</span>
              <button
                onClick={() => setIsSidebarFullPage(true)}
                className="flex items-center gap-1 text-deep-indigo hover:text-primary transition-colors font-heading font-black uppercase"
                title="Expand to cover whole page"
              >
                <Maximize2 size={12} />
                <span>Cover Whole Page</span>
              </button>
            </div>
          )}
        </aside>

        {/* MAIN VIEWER AREA: ONLY VISIBLE WHEN NOT IN FULL PAGE MODE */}
        {!isSidebarFullPage && (
          <main className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10 bg-bg-offwhite h-full">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* If NO materials exist at all */}
              {allMaterials.length === 0 ? (
                <Card className="border-4 border-deep-indigo p-10 md:p-14 bg-white shadow-brutal-lg text-center space-y-6">
                  <div className="w-20 h-20 bg-secondary/50 border-3 border-deep-indigo rounded-full flex items-center justify-center mx-auto text-deep-indigo shadow-brutal-sm">
                    <BookOpen size={36} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-heading font-black text-deep-indigo uppercase">
                      No Study Materials Uploaded Yet
                    </h2>
                    <p className="text-base text-dark-text/70 max-w-lg mx-auto">
                      {canManage 
                        ? "As the instructor of this course, you can upload PPTs, videos, lecture slides, downloadable notes, and interactive quizzes."
                        : "The instructor has not uploaded any study materials or lessons for this course yet. Please check back soon!"}
                    </p>
                  </div>

                  {canManage ? (
                    <Button 
                      variant="primary"
                      onClick={() => openUploadModal()}
                      className="py-4 px-8 text-base font-heading font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <Plus size={20} className="mr-2" /> Upload First Study Material
                    </Button>
                  ) : (
                    <Link href="/dashboard/courses">
                      <Button variant="secondary" className="py-3 px-6 text-sm uppercase font-bold">
                        ← Back to Course Library
                      </Button>
                    </Link>
                  )}
                </Card>
              ) : currentMaterial ? (
                /* ACTIVE MATERIAL VIEWER */
                <div className="space-y-6">
                  {/* Header breadcrumb & info */}
                  <header className="flex flex-wrap justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-warning text-deep-indigo border-2 border-deep-indigo px-2.5 py-0.5 text-[10px] font-heading font-black uppercase rounded shadow-brutal-sm">
                          {currentMaterial.type}
                        </span>
                        {currentMaterial.duration && (
                          <span className="text-xs font-bold text-dark-text/60 flex items-center gap-1">
                            <Clock size={12} /> {currentMaterial.duration}
                          </span>
                        )}
                        {currentMaterial.fileSize && (
                          <span className="text-xs font-bold text-dark-text/60">
                            • {currentMaterial.fileSize}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-heading font-black text-deep-indigo uppercase">
                        {currentMaterial.title}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsSidebarFullPage(true)}
                        className="bg-white border-2 border-deep-indigo px-3 py-2 rounded text-xs font-heading font-black uppercase tracking-wider text-deep-indigo shadow-brutal-sm hover:bg-secondary hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5"
                        title="Cover Whole Page"
                      >
                        <Maximize2 size={13} />
                        <span className="hidden sm:inline">Cover Whole Page</span>
                      </button>

                      {currentMaterial.url && (
                        <a 
                          href={currentMaterial.url} 
                          download={currentMaterial.fileName || currentMaterial.title}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white border-2 border-deep-indigo px-4 py-2 rounded text-xs font-heading font-black uppercase tracking-wider text-deep-indigo shadow-brutal-sm hover:bg-secondary hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
                        >
                          <Download size={14} /> Download File
                        </a>
                      )}
                    </div>
                  </header>

                {/* 1. VIDEO VIEWER */}
                {currentMaterial.type === 'video' && (
                  <div className="space-y-6">
                    <div className="aspect-video w-full bg-black border-4 border-deep-indigo rounded-xl shadow-brutal-lg overflow-hidden relative">
                      {renderVideoPlayer(currentMaterial.url)}
                    </div>

                    {currentMaterial.content && (
                      <Card className="border-3 p-6 bg-white shadow-brutal space-y-3">
                        <h3 className="font-heading font-black text-deep-indigo uppercase text-sm flex items-center gap-2">
                          <FileText size={16} /> Instructor Lecture Notes
                        </h3>
                        <p className="text-sm text-dark-text/80 whitespace-pre-line leading-relaxed font-body">
                          {currentMaterial.content}
                        </p>
                      </Card>
                    )}
                  </div>
                )}

                {/* 2. PPT OR SLIDES VIEWER */}
                {(currentMaterial.type === 'ppt' || currentMaterial.type === 'slides') && (
                  <div className="space-y-6">
                    <Card className="border-4 border-deep-indigo p-8 md:p-12 bg-white shadow-brutal-lg space-y-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-warning border-3 border-deep-indigo rounded-lg flex items-center justify-center text-deep-indigo shadow-brutal-sm">
                            <Presentation size={32} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-heading font-black uppercase tracking-widest text-primary">
                              {currentMaterial.type === 'ppt' ? 'PowerPoint Presentation' : 'Slide Deck'}
                            </span>
                            <h3 className="text-xl font-heading font-black text-deep-indigo uppercase">
                              {currentMaterial.fileName || currentMaterial.title}
                            </h3>
                            {currentMaterial.fileSize && (
                              <p className="text-xs font-mono text-dark-text/60">
                                File Size: {currentMaterial.fileSize}
                              </p>
                            )}
                          </div>
                        </div>

                        {currentMaterial.url && (
                          <a
                            href={currentMaterial.url}
                            download={currentMaterial.fileName || `${currentMaterial.title}.pptx`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="primary" className="py-3 px-6 uppercase font-black text-xs shadow-brutal flex items-center gap-2">
                              <Download size={16} /> Download {currentMaterial.type.toUpperCase()}
                            </Button>
                          </a>
                        )}
                      </div>

                      {/* Presentation notes or description if any */}
                      {currentMaterial.content && (
                        <div className="border-t-2 border-deep-indigo/10 pt-4 space-y-2">
                          <h4 className="text-xs font-heading font-black uppercase text-deep-indigo/70">
                            Slide Notes &amp; Overview
                          </h4>
                          <p className="text-sm text-dark-text/80 whitespace-pre-line leading-relaxed">
                            {currentMaterial.content}
                          </p>
                        </div>
                      )}
                    </Card>
                  </div>
                )}

                {/* 3. NOTES VIEWER */}
                {currentMaterial.type === 'notes' && (
                  <div className="space-y-6">
                    <Card className="border-4 border-deep-indigo p-8 bg-white shadow-brutal-lg space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-deep-indigo/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-secondary border-2 border-deep-indigo rounded-lg flex items-center justify-center text-deep-indigo">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h3 className="font-heading font-black text-lg text-deep-indigo uppercase">
                              {currentMaterial.title}
                            </h3>
                            {currentMaterial.fileName && (
                              <span className="text-xs font-mono opacity-60">
                                {currentMaterial.fileName} ({currentMaterial.fileSize || 'Doc'})
                              </span>
                            )}
                          </div>
                        </div>

                        {currentMaterial.url && (
                          <a
                            href={currentMaterial.url}
                            download={currentMaterial.fileName || `${currentMaterial.title}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" className="text-xs py-2 px-4 uppercase font-bold flex items-center gap-2">
                              <Download size={14} /> Download Document
                            </Button>
                          </a>
                        )}
                      </div>

                      {/* Notes Body */}
                      <div className="prose max-w-none text-dark-text leading-relaxed font-body whitespace-pre-line text-base bg-bg-offwhite/40 p-6 border-2 border-deep-indigo/20 rounded">
                        {currentMaterial.content || "No text content written for this note document. Please use the download link above to inspect the file."}
                      </div>
                    </Card>
                  </div>
                )}

                {/* 4. INTERACTIVE QUIZ VIEWER */}
                {currentMaterial.type === 'quiz' && (
                  <Card className="border-4 border-deep-indigo p-8 md:p-10 bg-white shadow-brutal-lg space-y-8">
                    <div className="space-y-2 border-b-2 border-deep-indigo/10 pb-4">
                      <div className="inline-block bg-warning border-2 border-deep-indigo px-3 py-0.5 text-xs font-heading font-black uppercase text-deep-indigo shadow-brutal-sm">
                        Interactive Knowledge Check
                      </div>
                      <h2 className="text-2xl font-heading font-black text-deep-indigo">
                        {currentMaterial.quizQuestion || currentMaterial.title}
                      </h2>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3">
                      {(currentMaterial.quizOptions || []).map((option, optIdx) => {
                        const isChosen = selectedQuizOption === optIdx;
                        const isCorrectAnswer = currentMaterial.quizCorrectAnswer === optIdx;

                        let optionStyle = 'bg-white border-deep-indigo text-deep-indigo hover:bg-secondary/30';
                        if (quizSubmitted) {
                          if (isCorrectAnswer) {
                            optionStyle = 'bg-success/20 border-success text-deep-indigo font-black';
                          } else if (isChosen && !isCorrectAnswer) {
                            optionStyle = 'bg-error/20 border-error text-error';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-primary text-white border-deep-indigo shadow-brutal';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedQuizOption(optIdx)}
                            className={`w-full text-left p-4 rounded-lg border-3 transition-all flex items-center justify-between gap-4 ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded border-2 border-deep-indigo flex items-center justify-center font-heading font-black text-xs ${
                                isChosen && !quizSubmitted ? 'bg-white text-deep-indigo' : 'bg-surface-low text-deep-indigo'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="font-heading font-bold text-base">
                                {option}
                              </span>
                            </div>

                            {quizSubmitted && isCorrectAnswer && (
                              <CheckCircle2 size={20} className="text-success shrink-0" />
                            )}
                            {quizSubmitted && isChosen && !isCorrectAnswer && (
                              <XCircle size={20} className="text-error shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit / Result Action */}
                    <div className="pt-4 border-t-2 border-deep-indigo/10 flex flex-wrap items-center justify-between gap-4">
                      {!quizSubmitted ? (
                        <Button
                          variant="primary"
                          disabled={selectedQuizOption === null}
                          onClick={() => setQuizSubmitted(true)}
                          className="py-3 px-8 uppercase font-heading font-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <div className="space-y-2 w-full">
                          <div className={`p-4 rounded-lg border-3 ${
                            selectedQuizOption === currentMaterial.quizCorrectAnswer
                              ? 'bg-success/20 border-success text-deep-indigo'
                              : 'bg-error/20 border-error text-deep-indigo'
                          }`}>
                            <p className="font-heading font-black text-sm uppercase">
                              {selectedQuizOption === currentMaterial.quizCorrectAnswer
                                ? "Correct! Excellent grasp of this concept."
                                : "Incorrect answer. Review the correct option above."}
                            </p>
                            {currentMaterial.quizExplanation && (
                              <p className="text-xs mt-1 text-dark-text/80 font-body">
                                <strong>Explanation:</strong> {currentMaterial.quizExplanation}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedQuizOption(null);
                              setQuizSubmitted(false);
                            }}
                            className="text-xs uppercase font-bold"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            ) : null}
          </div>
        </main>
      )}
      </div>

      {/* INSTRUCTOR UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-deep-indigo rounded-xl shadow-brutal-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b-3 border-deep-indigo/10 pb-4">
              <div>
                <h3 className="text-2xl font-heading font-black text-deep-indigo uppercase">
                  Upload Study Material
                </h3>
                <p className="text-xs font-bold text-dark-text/60 uppercase">
                  Attach PPTs, videos, slides, notes, or interactive quizzes
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded border-2 border-deep-indigo bg-surface-low hover:bg-error hover:text-white font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Material Type Tabs */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'video', label: 'Video', icon: <Video size={16} /> },
                { id: 'ppt', label: 'PPT', icon: <Presentation size={16} /> },
                { id: 'slides', label: 'Slides', icon: <Layers size={16} /> },
                { id: 'notes', label: 'Notes', icon: <FileText size={16} /> },
                { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={16} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setUploadType(tab.id as any)}
                  className={`py-2.5 px-2 rounded border-2 font-heading font-black text-xs uppercase flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                    uploadType === tab.id
                      ? 'bg-primary text-white border-deep-indigo shadow-brutal-sm'
                      : 'bg-white text-deep-indigo border-deep-indigo/40 hover:bg-secondary/20'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-5">
              {/* Common Title */}
              <Input
                label="Material Title"
                placeholder={
                  uploadType === 'video' ? 'e.g. Lesson 1: Full-Stack SaaS Architecture' :
                  uploadType === 'ppt' ? 'e.g. Architecture Overview Deck (.pptx)' :
                  uploadType === 'slides' ? 'e.g. Design Principles Slide Deck' :
                  uploadType === 'notes' ? 'e.g. Key Takeaways & Cheat Sheet' :
                  'e.g. Module 1 Knowledge Assessment'
                }
                value={materialForm.title}
                onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                required
              />

              {/* VIDEO FIELDS */}
              {uploadType === 'video' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Video URL (YouTube, Vimeo, or direct MP4)"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={materialForm.url}
                      onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                    />
                    <Input
                      label="Duration (optional)"
                      placeholder="e.g. 15:45"
                      value={materialForm.duration}
                      onChange={(e) => setMaterialForm({ ...materialForm, duration: e.target.value })}
                    />
                  </div>

                  {/* Or file upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Or Upload Video File (.mp4, .webm - Max 20MB)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-white border-2 border-deep-indigo px-4 py-2 text-xs font-heading font-black uppercase text-deep-indigo shadow-brutal-sm hover:bg-secondary transition-all flex items-center gap-2">
                        <Upload size={14} /> Choose Video File
                        <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                      {materialForm.fileName && (
                        <span className="text-xs font-mono font-bold text-success">
                          ✓ {materialForm.fileName} ({materialForm.fileSize})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Lecture Notes / Key Points (optional)
                    </label>
                    <textarea
                      className="w-full border-2 border-deep-indigo p-3 text-sm focus:outline-none focus:shadow-brutal bg-white min-h-[90px]"
                      placeholder="Summary, prerequisites, links..."
                      value={materialForm.content}
                      onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* PPT / SLIDES FIELDS */}
              {(uploadType === 'ppt' || uploadType === 'slides') && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Option A: Upload Presentation File (.ppt, .pptx, .pdf)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-white border-2 border-deep-indigo px-4 py-2 text-xs font-heading font-black uppercase text-deep-indigo shadow-brutal-sm hover:bg-secondary transition-all flex items-center gap-2">
                        <Upload size={14} /> Choose Presentation File
                        <input 
                          type="file" 
                          accept=".ppt,.pptx,.pdf,.key" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                      {materialForm.fileName && (
                        <span className="text-xs font-mono font-bold text-success">
                          ✓ {materialForm.fileName} ({materialForm.fileSize})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Input
                      label="Option B: Or Enter Slide Deck Web URL (Google Slides, Canva, etc.)"
                      placeholder="https://docs.google.com/presentation/..."
                      value={materialForm.url}
                      onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Slide Overview / Speaker Notes (optional)
                    </label>
                    <textarea
                      className="w-full border-2 border-deep-indigo p-3 text-sm focus:outline-none focus:shadow-brutal bg-white min-h-[80px]"
                      placeholder="Summary of presentation topics..."
                      value={materialForm.content}
                      onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* NOTES FIELDS */}
              {uploadType === 'notes' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Upload Document File (PDF, DOCX, TXT - optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-white border-2 border-deep-indigo px-4 py-2 text-xs font-heading font-black uppercase text-deep-indigo shadow-brutal-sm hover:bg-secondary transition-all flex items-center gap-2">
                        <Upload size={14} /> Choose Document
                        <input 
                          type="file" 
                          accept=".pdf,.docx,.doc,.txt,.md" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                      {materialForm.fileName && (
                        <span className="text-xs font-mono font-bold text-success">
                          ✓ {materialForm.fileName} ({materialForm.fileSize})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Written Lecture Notes &amp; Summary (Markdown / Text)
                    </label>
                    <textarea
                      className="w-full border-2 border-deep-indigo p-3 text-sm focus:outline-none focus:shadow-brutal bg-white min-h-[140px]"
                      placeholder="Type or paste comprehensive study notes, code examples, bullet points..."
                      value={materialForm.content}
                      onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* QUIZ FIELDS */}
              {uploadType === 'quiz' && (
                <div className="space-y-4">
                  <Input
                    label="Question"
                    placeholder="e.g. Which HTTP method is idempotent?"
                    value={materialForm.quizQuestion}
                    onChange={(e) => setMaterialForm({ 
                      ...materialForm, 
                      quizQuestion: e.target.value,
                      title: materialForm.title || e.target.value.slice(0, 40)
                    })}
                    required
                  />

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-deep-indigo/70">
                      Answer Choices &amp; Correct Option:
                    </label>
                    {materialForm.quizOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={materialForm.quizCorrectAnswer === i}
                            onChange={() => setMaterialForm({ ...materialForm, quizCorrectAnswer: i })}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="font-heading font-black text-xs">
                            {String.fromCharCode(65 + i)}:
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...materialForm.quizOptions];
                            newOpts[i] = e.target.value;
                            setMaterialForm({ ...materialForm, quizOptions: newOpts });
                          }}
                          className="flex-1 border-2 border-deep-indigo px-3 py-2 text-xs focus:outline-none focus:shadow-brutal"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <Input
                    label="Explanation (optional)"
                    placeholder="Explanation shown after student answers..."
                    value={materialForm.quizExplanation}
                    onChange={(e) => setMaterialForm({ ...materialForm, quizExplanation: e.target.value })}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-deep-indigo/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-xs uppercase font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submittingMaterial}
                  className="text-xs uppercase font-heading font-black py-2.5 px-6 shadow-brutal"
                >
                  {submittingMaterial ? 'Uploading...' : 'Publish Material to Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
