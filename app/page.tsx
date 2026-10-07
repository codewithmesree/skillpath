"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CourseCard } from "@/components/CourseCard";
import { 
  ArrowRight, 
  Check, 
  Zap, 
  Users, 
  Award, 
  Terminal, 
  Star, 
  Palette, 
  ChevronDown, 
  Rocket, 
  CheckCircle2, 
  Search 
} from 'lucide-react';

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHeroTab, setActiveHeroTab] = useState<'code' | 'design' | 'quiz'>('code');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'instructor' | 'admin'>('student');
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navSections = [
    { id: 'hero', label: 'Overview' },
    { id: 'advantage', label: 'Advantage' },
    { id: 'courses', label: 'Courses' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Get Started' },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCourses(data);
          } else {
            setCourses([]);
          }
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const defaultCategories = ["All", "Art", "Design", "Development", "Business", "AI & Tech"];
    const cats = new Set<string>(defaultCategories);
    courses.forEach((c) => {
      if (c.category && typeof c.category === 'string') {
        const trimmed = c.category.trim();
        if (trimmed) cats.add(trimmed);
      }
    });
    return Array.from(cats);
  }, [courses]);

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (c.category && c.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if near bottom of document
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isBottom) {
        setActiveSection(navSections[navSections.length - 1].id);
        return;
      }

      const scrollPosition = window.scrollY + 180;
      for (let i = navSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(navSections[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(navSections[i].id);
            return;
          }
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 84;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body text-dark-text selection:bg-primary selection:text-white">
      {/* Top Ticker Marquee Ribbon */}
      <div className="bg-warning border-b-3 border-deep-indigo overflow-hidden py-2 text-deep-indigo font-heading font-black text-xs uppercase tracking-widest relative z-30 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span>2026 CURRICULUM LIVE</span>
          <span>•</span>
          <span>15,000+ ENROLLED CREATORS</span>
          <span>•</span>
          <span>RAZORPAY INSTANT ENROLLMENT</span>
          <span>•</span>
          <span>VERIFIED CERTIFICATES OF MASTERY</span>
          <span>•</span>
          <span>100% HANDS-ON PROJECTS</span>
          <span>•</span>
          <span>INTERACTIVE CODE & DESIGN LABS</span>
          <span>•</span>
          <span>2026 CURRICULUM LIVE</span>
          <span>•</span>
          <span>15,000+ ENROLLED CREATORS</span>
          <span>•</span>
          <span>RAZORPAY INSTANT ENROLLMENT</span>
          <span>•</span>
          <span>VERIFIED CERTIFICATES OF MASTERY</span>
          <span>•</span>
          <span>100% HANDS-ON PROJECTS</span>
          <span>•</span>
          <span>INTERACTIVE CODE & DESIGN LABS</span>
        </div>
      </div>

      <Navbar />

      {/* Right Side Dot Navigation */}
      <nav 
        aria-label="Section navigation"
        className="fixed right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-md py-3 px-2 rounded-full border-3 border-deep-indigo shadow-brutal select-none"
      >
        {navSections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="group relative flex items-center justify-center p-2 rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              aria-label={`Jump to ${sec.label}`}
              title={sec.label}
            >
              {/* Tooltip on hover / active */}
              <span className={`absolute right-9 py-1 px-2.5 rounded border-2 border-deep-indigo text-[10px] font-heading font-black uppercase tracking-wider whitespace-nowrap shadow-brutal-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'opacity-100 translate-x-0 bg-primary text-white scale-100'
                  : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 bg-white text-deep-indigo hover:bg-secondary'
              }`}>
                {sec.label}
              </span>

              {/* Dot */}
              <span 
                className={`block rounded-full border-2 border-deep-indigo transition-all duration-200 pointer-events-none ${
                  isActive
                    ? 'w-3.5 h-3.5 bg-primary scale-125 shadow-[1px_1px_0px_#2D1B69]'
                    : 'w-2.5 h-2.5 bg-bg-offwhite hover:bg-secondary group-hover:scale-125'
                }`} 
              />
            </button>
          );
        })}
      </nav>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section id="hero" className="relative px-6 md:px-12 pt-12 md:pt-20 pb-20 max-w-7xl mx-auto overflow-hidden scroll-mt-20">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-secondary/40 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-warning/20 rounded-full blur-2xl -z-10 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero Left: Copy & CTAs */}
            <div className="flex-1 space-y-8">
              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-extrabold text-deep-indigo leading-[1.05] tracking-tight">
                Learn Skills That{" "}
                <span className="relative inline-block my-1">
                  <span className="relative z-10 bg-primary text-white px-3.5 py-1 border-3 border-deep-indigo shadow-brutal -rotate-1 inline-block">
                    Actually Matter.
                  </span>
                </span>{" "}
                Build The Future.
              </h1>

              {/* Sub-copy */}
              <p className="text-lg md:text-xl font-body text-dark-text/80 max-w-xl leading-relaxed">
                Tired of sterile video playlists and outdated theory? SkillPath brings you a tactile, 
                brutalist learning journey with production-ready projects, real-time code challenges, 
                and verified career credentials.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/courses">
                  <Button variant="primary" className="text-base md:text-lg px-8 py-4 flex items-center gap-3 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    <span>Explore Courses</span>
                    <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" className="text-base md:text-lg px-8 py-4 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Start Learning
                  </Button>
                </Link>
              </div>

              {/* Social Proof & Metrics */}
              <div className="pt-6 border-t-2 border-deep-indigo/10 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex -space-x-3 items-center">
                  {[
                    { bg: "bg-primary text-white", name: "Alex" },
                    { bg: "bg-warning text-deep-indigo", name: "Priya" },
                    { bg: "bg-secondary text-deep-indigo", name: "Gary" },
                    { bg: "bg-white text-deep-indigo", name: "Elena" }
                  ].map((avatar, idx) => (
                    <div 
                      key={idx} 
                      className={`w-11 h-11 rounded-full border-2 border-deep-indigo ${avatar.bg} flex items-center justify-center font-heading font-bold text-xs shadow-brutal-sm`}
                    >
                      {avatar.name.charAt(0)}
                    </div>
                  ))}
                  <div className="w-11 h-11 rounded-full border-2 border-deep-indigo bg-deep-indigo text-white flex items-center justify-center font-heading font-bold text-xs shadow-brutal-sm">
                    +15k
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-warning">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="currentColor" />
                    ))}
                    <span className="text-deep-indigo font-heading font-black text-sm ml-1">4.9 / 5.0</span>
                  </div>
                  <p className="text-xs font-bold text-dark-text/70 uppercase tracking-wider">
                    Loved by 15,000+ engineers & designers
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Right: Interactive Brutalist Workbench */}
            <div className="flex-1 w-full max-w-xl relative">
              {/* Floating Decorative Badges */}
              <div className="absolute -top-5 -right-3 z-20 bg-warning border-3 border-deep-indigo px-4 py-1.5 font-heading font-black text-xs uppercase tracking-wider rotate-12 shadow-brutal animate-bounce duration-1000">
                NEW 2026
              </div>
              <div className="absolute -bottom-6 -left-4 z-20 bg-primary text-white border-3 border-deep-indigo px-4 py-1.5 font-heading font-black text-xs uppercase tracking-wider -rotate-6 shadow-brutal">
                VERIFIED CERTIFICATE
              </div>

              {/* Main Interactive Card */}
              <div className="bg-white border-4 border-deep-indigo rounded-xl shadow-brutal-lg overflow-hidden transition-all duration-300">
                {/* Window Chrome Header */}
                <div className="bg-secondary/60 border-b-3 border-deep-indigo px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-error border-2 border-deep-indigo inline-block"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-warning border-2 border-deep-indigo inline-block"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-success border-2 border-deep-indigo inline-block"></span>
                    <span className="ml-2 font-heading font-bold text-xs text-deep-indigo uppercase tracking-wider">
                      skillpath_workbench.tsx
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border-2 border-deep-indigo px-2.5 py-0.5 rounded text-[10px] font-black uppercase text-deep-indigo">
                    <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
                    Interactive Lab
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b-3 border-deep-indigo bg-surface-low">
                  <button 
                    onClick={() => setActiveHeroTab('code')}
                    className={`flex-1 py-2.5 px-3 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border-r-2 border-deep-indigo ${
                      activeHeroTab === 'code' ? 'bg-white text-deep-indigo border-b-2 border-b-transparent font-black' : 'text-dark-text/60 hover:bg-secondary/30'
                    }`}
                  >
                    <Terminal size={14} /> Code Studio
                  </button>
                  <button 
                    onClick={() => setActiveHeroTab('design')}
                    className={`flex-1 py-2.5 px-3 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border-r-2 border-deep-indigo ${
                      activeHeroTab === 'design' ? 'bg-white text-deep-indigo border-b-2 border-b-transparent font-black' : 'text-dark-text/60 hover:bg-secondary/30'
                    }`}
                  >
                    <Palette size={14} /> Design System
                  </button>
                  <button 
                    onClick={() => setActiveHeroTab('quiz')}
                    className={`flex-1 py-2.5 px-3 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      activeHeroTab === 'quiz' ? 'bg-white text-deep-indigo border-b-2 border-b-transparent font-black' : 'text-dark-text/60 hover:bg-secondary/30'
                    }`}
                  >
                    <Zap size={14} /> Quick Quiz
                  </button>
                </div>

                {/* Tab Content Display */}
                <div className="p-6 min-h-[310px] flex flex-col justify-between">
                  {activeHeroTab === 'code' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-xs font-mono text-dark-text/70 border-b border-deep-indigo/10 pb-2">
                        <span>// Lesson 4.2: Brutalist Micro-Interactions</span>
                        <span className="bg-success/20 text-success border border-success/40 px-2 py-0.5 rounded font-bold text-[10px]">
                          PASSING
                        </span>
                      </div>
                      
                      <div className="bg-deep-indigo text-secondary p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border-2 border-deep-indigo">
                        <p><span className="text-warning">const</span> <span className="text-primary font-bold">learnCourse</span> = <span className="text-white">async</span> () =&gt; &#123;</p>
                        <p className="pl-4"><span className="text-white/60">// 1. Pick hands-on curriculum</span></p>
                        <p className="pl-4"><span className="text-warning">await</span> skillpath.<span className="text-warning">enroll</span>(&quot;Fullstack-Architecture&quot;);</p>
                        <p className="pl-4"><span className="text-white/60">// 2. Ship real production app</span></p>
                        <p className="pl-4"><span className="text-warning">const</span> cert = <span className="text-white">git.push</span>(&quot;main&quot;);</p>
                        <p className="pl-4"><span className="text-warning">return</span> cert.<span className="text-success font-bold">verifyCredential</span>();</p>
                        <p>&#125;;</p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-deep-indigo uppercase tracking-wider">Module Progress</span>
                          <span className="text-primary font-black">84% Complete</span>
                        </div>
                        <div className="w-full h-3 bg-secondary border-2 border-deep-indigo rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[84%] transition-all duration-500"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'design' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="text-xs font-bold text-dark-text/70">
                        SkillPath Core Design Tokens:
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-primary text-white border-2 border-deep-indigo rounded shadow-brutal-sm">
                          <div className="text-xs font-black uppercase">Primary</div>
                          <div className="text-[10px] font-mono opacity-80">#9D7BFF (Lavender)</div>
                        </div>
                        <div className="p-3 bg-secondary text-deep-indigo border-2 border-deep-indigo rounded shadow-brutal-sm">
                          <div className="text-xs font-black uppercase">Secondary</div>
                          <div className="text-[10px] font-mono opacity-80">#E6E1FF (Lilac)</div>
                        </div>
                        <div className="p-3 bg-warning text-deep-indigo border-2 border-deep-indigo rounded shadow-brutal-sm">
                          <div className="text-xs font-black uppercase">Accent Pop</div>
                          <div className="text-[10px] font-mono opacity-80">#FFB86B (Amber)</div>
                        </div>
                        <div className="p-3 bg-deep-indigo text-white border-2 border-deep-indigo rounded shadow-brutal-sm">
                          <div className="text-xs font-black uppercase">Stroke & Shadow</div>
                          <div className="text-[10px] font-mono opacity-80">#2D1B69 (Indigo)</div>
                        </div>
                      </div>

                      <div className="p-3 bg-secondary/30 border-2 border-dashed border-deep-indigo rounded text-center">
                        <p className="text-xs font-bold text-deep-indigo">
                          &quot;Stroke-First&quot; Philosophy: 3px-4px Hard Shadows & Zero Blur
                        </p>
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'quiz' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-warning border-2 border-deep-indigo flex items-center justify-center font-bold text-xs text-deep-indigo">
                          ?
                        </span>
                        <h4 className="font-heading font-bold text-sm text-deep-indigo">
                          What defines Neobrutalist web styling?
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 0, text: "Faint gradients with rounded 50px pills" },
                          { id: 1, text: "High-contrast thick borders & hard drop shadows", correct: true },
                          { id: 2, text: "Invisible buttons and transparent glass cards" }
                        ].map((choice) => (
                          <button
                            key={choice.id}
                            onClick={() => setSelectedQuizAnswer(choice.id)}
                            className={`w-full text-left p-3 text-xs font-bold border-2 border-deep-indigo rounded transition-all flex items-center justify-between ${
                              selectedQuizAnswer === choice.id
                                ? choice.correct
                                  ? 'bg-success text-white shadow-brutal-sm'
                                  : 'bg-error text-white shadow-brutal-sm'
                                : 'bg-white hover:bg-secondary/40 text-deep-indigo'
                            }`}
                          >
                            <span>{choice.text}</span>
                            {selectedQuizAnswer === choice.id && (
                              <span>{choice.correct ? 'CORRECT' : 'TRY AGAIN'}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {selectedQuizAnswer === 1 && (
                        <div className="p-2 bg-success/10 border-2 border-success text-success text-[11px] font-bold rounded flex items-center gap-2">
                          <CheckCircle2 size={14} /> +50 XP Earned! Correct answer!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Action */}
                  <div className="pt-4 border-t-2 border-deep-indigo/10 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase opacity-60">Ready to build?</span>
                    <Link href="/register" className="text-xs font-heading font-black text-primary hover:text-deep-indigo uppercase flex items-center gap-1">
                      Start Your Journey →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* WHY SKILLPATH BENTO GRID */}
        <section id="advantage" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-block bg-secondary border-2 border-deep-indigo px-4 py-1 text-xs font-heading font-black uppercase tracking-wider text-deep-indigo shadow-brutal-sm">
              The SkillPath Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-deep-indigo uppercase tracking-tight">
              Why SkillPath Hits Different
            </h2>
            <p className="text-base md:text-lg opacity-70">
              We ditched generic corporate slide-readers to build an LMS engineered for real craft, 
              practical muscle memory, and genuine career impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento Card 1: Project-First */}
            <div className="md:col-span-2 bg-white border-4 border-deep-indigo p-8 rounded-xl shadow-brutal-lg flex flex-col justify-between relative overflow-hidden group hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all">
              <div className="space-y-4 z-10">
                <div className="w-12 h-12 bg-warning border-3 border-deep-indigo flex items-center justify-center font-bold text-deep-indigo shadow-brutal">
                  <Terminal size={24} />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-deep-indigo uppercase">
                  Project-First Engineering Labs
                </h3>
                <p className="text-base opacity-75 max-w-lg leading-relaxed">
                  Every concept is reinforced with a real git-pushable repo. You will build authentic full-stack applications, 
                  design systems, and production APIs—not trivial "Hello World" toys.
                </p>

                {/* Milestone Checklist */}
                <div className="pt-2 space-y-2.5 max-w-md">
                  {[
                    "Connect Next.js 15 with MongoDB Atlas & Mongoose",
                    "Configure Role-Based Access Control (Admin / Instructor / Student)",
                    "Integrate Razorpay Webhooks & Payment Signature Verification",
                    "Ship production-ready responsive UI with clean modern layouts"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-secondary/30 p-2.5 border-2 border-deep-indigo/30 rounded text-xs font-bold text-deep-indigo">
                      <div className="w-4 h-4 rounded bg-primary text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-deep-indigo/10 flex items-center justify-between z-10">
                <span className="text-xs font-bold uppercase text-primary font-heading">
                  100% Practical • Zero Fluff
                </span>
                <Link href="/courses" className="text-xs font-black uppercase text-deep-indigo hover:text-primary flex items-center gap-1">
                  Browse Curriculum →
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Interactive Quizzes */}
            <div className="bg-primary text-white border-4 border-deep-indigo p-8 rounded-xl shadow-brutal-lg flex flex-col justify-between relative hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white text-deep-indigo border-3 border-deep-indigo flex items-center justify-center font-bold shadow-brutal">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-heading font-black uppercase">
                  Tactile Quizzes & Assessments
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Interactive knowledge checks at the end of each lesson validate your understanding immediately. 
                  Earn XP, unlock badges, and track your mastery.
                </p>

                <div className="p-4 bg-deep-indigo border-2 border-white/40 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-warning">
                    <span>Quiz Streak</span>
                    <span>7 Days Active</span>
                  </div>
                  <div className="text-xs opacity-80">
                    &quot;Immediate feedback helps lock in memory 4x faster than passive reading.&quot;
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <button className="w-full py-3 bg-white text-deep-indigo border-3 border-deep-indigo font-heading font-black text-xs uppercase shadow-brutal hover:bg-warning transition-colors">
                    Try Interactive Quiz
                  </button>
                </Link>
              </div>
            </div>

            {/* Bento Card 3: 3 Distinct Role Portals */}
            <div className="bg-white border-4 border-deep-indigo p-8 rounded-xl shadow-brutal-lg flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary border-3 border-deep-indigo flex items-center justify-center font-bold text-deep-indigo shadow-brutal">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-heading font-black text-deep-indigo uppercase">
                  3 Role Ecosystem
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Whether you are learning, instructing, or managing the platform, SkillPath provides tailored portals with specialized tools.
                </p>

                {/* Role Tabs Preview */}
                <div className="space-y-2">
                  <div className="flex gap-1 border-2 border-deep-indigo p-1 rounded bg-surface-low">
                    {(['student', 'instructor', 'admin'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setActiveRoleTab(role)}
                        className={`flex-1 py-1 text-[11px] font-heading font-black uppercase rounded ${
                          activeRoleTab === role ? 'bg-primary text-white shadow-brutal-sm' : 'text-deep-indigo/70'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-secondary/20 border-2 border-deep-indigo rounded text-xs space-y-1">
                    {activeRoleTab === 'student' && (
                      <p className="font-bold text-deep-indigo">
                        Student: Course library, lesson player, quiz arena, progress tracking, Razorpay checkout.
                      </p>
                    )}
                    {activeRoleTab === 'instructor' && (
                      <p className="font-bold text-deep-indigo">
                        Instructor: Create modules, upload lessons, build quizzes, track student enrollments & payouts.
                      </p>
                    )}
                    {activeRoleTab === 'admin' && (
                      <p className="font-bold text-deep-indigo">
                        Admin: Course approval queue, user role management, system analytics, platform oversight.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <Button variant="ghost" className="w-full text-xs uppercase font-heading font-black">
                    Join As Instructor Or Student
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Verified Certificates */}
            <div className="md:col-span-2 bg-secondary/30 border-4 border-deep-indigo p-8 rounded-xl shadow-brutal-lg flex flex-col sm:flex-row items-center gap-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all">
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 bg-success text-white border-3 border-deep-indigo flex items-center justify-center font-bold shadow-brutal">
                  <Award size={24} />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-deep-indigo uppercase">
                  Proof of Work Certificates
                </h3>
                <p className="text-sm md:text-base opacity-75 leading-relaxed">
                  Don't just add a generic bullet point to your CV. SkillPath certificates come with unique cryptographic verification codes that hiring managers can verify with one click.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-white border-2 border-deep-indigo px-3 py-1 rounded text-xs font-bold text-deep-indigo shadow-brutal-sm">
                    Shareable on LinkedIn
                  </span>
                  <span className="bg-white border-2 border-deep-indigo px-3 py-1 rounded text-xs font-bold text-deep-indigo shadow-brutal-sm">
                    Verified Repository Link
                  </span>
                  <span className="bg-white border-2 border-deep-indigo px-3 py-1 rounded text-xs font-bold text-deep-indigo shadow-brutal-sm">
                    Instant PDF Export
                  </span>
                </div>
              </div>

              {/* Certificate Graphic Illustration */}
              <div className="w-full sm:w-64 bg-white border-3 border-deep-indigo p-4 rounded shadow-brutal transform rotate-2 shrink-0">
                <div className="border-2 border-dashed border-deep-indigo p-3 text-center space-y-2">
                  <div className="text-[10px] font-black uppercase text-primary">Certificate of Mastery</div>
                  <div className="font-heading font-black text-sm text-deep-indigo">SKILLPATH CERTIFIED</div>
                  <div className="text-[9px] opacity-60">Awarded for Full-Stack Architecture</div>
                  <div className="w-12 h-12 mx-auto bg-secondary/60 border-2 border-deep-indigo rounded-full flex items-center justify-center font-bold text-xs text-deep-indigo">
                    SEAL
                  </div>
                  <div className="text-[8px] font-mono opacity-50">ID: SP-2026-9482X</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COURSES SECTION */}
        <section id="courses" className="bg-secondary/20 border-y-4 border-deep-indigo py-24 px-6 md:px-12 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-block bg-warning border-2 border-deep-indigo px-3 py-0.5 text-xs font-heading font-black uppercase tracking-wider text-deep-indigo shadow-brutal-sm">
                  Curated Catalog
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-deep-indigo uppercase">
                  Featured Courses
                </h2>
                <p className="text-base md:text-lg opacity-70">
                  Step-by-step masterclasses designed to take you from junior to lead creator.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search courses or mentors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-3 border-deep-indigo px-4 py-3 pr-10 text-sm font-bold rounded shadow-brutal focus:outline-none focus:bg-secondary/20 transition-all"
                />
                <Search size={18} className="absolute right-3.5 top-3.5 text-deep-indigo/60" />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 font-heading font-bold text-xs uppercase tracking-wider rounded border-2 border-deep-indigo transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-brutal translate-x-0.5 translate-y-0.5'
                      : 'bg-white text-deep-indigo hover:bg-secondary/40 shadow-brutal-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Course Grid */}
            {loadingCourses ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-deep-indigo border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="font-heading font-bold uppercase text-deep-indigo">Loading Course Catalog...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.slice(0, 6).map((course, idx) => (
                  <CourseCard
                    key={course._id || idx}
                    courseId={course._id}
                    title={course.title}
                    category={course.category || 'General'}
                    instructor={course.instructor || course.instructorId?.name || 'Instructor'}
                    rating={course.rating || 4.5}
                    price={course.price !== undefined ? course.price : 0}
                    lessonsCount={course.lessonsCount !== undefined ? course.lessonsCount : (course.lessons ? course.lessons.length : 0)}
                    image={course.thumbnail || course.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border-3 border-deep-indigo p-8 rounded-lg shadow-brutal">
                <p className="font-heading font-bold text-lg text-deep-indigo mb-2">
                  {courses.length === 0 ? "No courses published yet" : "No courses found matching your search"}
                </p>
                <p className="text-sm opacity-60 mb-6">
                  {courses.length === 0
                    ? "Real courses created by instructors will appear here directly from the catalog."
                    : "Try clearing filters or search terms"}
                </p>
                {(courses.length > 0 && (selectedCategory !== "All" || searchQuery)) && (
                  <Button variant="secondary" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}

            {/* View All Button */}
            <div className="text-center pt-8">
              <Link href="/courses">
                <Button variant="primary" className="text-base px-10 py-4 shadow-brutal-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Browse All Courses in Library ({courses.length}) →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-STEP ROADMAP SECTION */}
        <section id="roadmap" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <div className="inline-block bg-warning border-2 border-deep-indigo px-4 py-1 text-xs font-heading font-black uppercase tracking-wider text-deep-indigo shadow-brutal-sm">
              The Path To Mastery
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-deep-indigo uppercase tracking-tight">
              How SkillPath Works
            </h2>
            <p className="text-base md:text-lg opacity-70">
              A straightforward, no-nonsense system designed to transition you from learner to builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Pick Your Track",
                description: "Choose specialized pathways in Neobrutalist UI/UX, Full-Stack Architecture, API Security, or Indie Product Strategy.",
                badge: "Explore",
                color: "bg-secondary"
              },
              {
                step: "02",
                title: "Build Real Artifacts",
                description: "Follow tactical code-along lessons, complete interactive quizzes, and push authentic software to your personal GitHub.",
                badge: "Create",
                color: "bg-primary text-white"
              },
              {
                step: "03",
                title: "Verify & Get Hired",
                description: "Earn cryptographic certificates, showcase your project portfolio, and stand out to innovative tech companies.",
                badge: "Level Up",
                color: "bg-warning"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border-4 border-deep-indigo p-8 rounded-xl shadow-brutal-lg relative flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-5xl text-deep-indigo italic">
                      {item.step}
                    </span>
                    <span className={`px-3 py-1 border-2 border-deep-indigo text-xs font-black uppercase shadow-brutal-sm ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-deep-indigo uppercase">
                    {item.title}
                  </h3>
                  <p className="text-sm opacity-75 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t-2 border-deep-indigo/10 flex items-center text-xs font-bold text-deep-indigo uppercase">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block bg-secondary border-2 border-deep-indigo px-4 py-1 text-xs font-heading font-black uppercase tracking-wider text-deep-indigo shadow-brutal-sm">
              Got Questions?
            </div>
            <h2 className="text-4xl font-heading font-black text-deep-indigo uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-base opacity-70">
              Everything you need to know about SkillPath courses, payments, and certificates.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What makes SkillPath different from traditional LMS platforms?",
                a: "SkillPath is built around a project-first philosophy—prioritizing high tactile interactivity, real-world milestones, and immediate assessments over passive, sleepy video lectures."
              },
              {
                q: "How does Razorpay payment integration work?",
                a: "Enrolling is instantaneous. When you choose a course or subscribe to a Pro plan, Razorpay's secure checkout modal opens. You can pay via Cards, UPI, Netbanking, or Wallets with instantaneous activation."
              },
              {
                q: "Can I become an instructor and teach on SkillPath?",
                a: "Yes! During registration, select 'Instructor' as your role. You get access to the Instructor Studio to author course modules, write quizzes, and submit courses for admin review."
              },
              {
                q: "Are certificates verifiable and shareable?",
                a: "Yes. Every student who completes all lessons and passes all module quizzes receives a cryptographically numbered Certificate of Mastery that can be shared on LinkedIn and personal portfolios."
              },
              {
                q: "Do I get lifetime access to courses I purchase?",
                a: "Yes! Once enrolled, courses remain in your student dashboard permanently, including any updates or new lessons added by instructors in the future."
              }
            ].map((faq, i) => {
              const isOpen = activeFaqIndex === i;
              return (
                <div 
                  key={i} 
                  className="bg-white border-3 border-deep-indigo rounded-lg shadow-brutal-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left font-heading font-bold text-base md:text-lg text-deep-indigo uppercase flex items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={20} 
                      className={`transform transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-deep-indigo'}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-dark-text/80 leading-relaxed border-t-2 border-deep-indigo/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* HIGH IMPACT CTA SECTION */}
        <section id="cta" className="px-6 md:px-12 py-20 max-w-7xl mx-auto scroll-mt-20">
          <div className="bg-primary border-4 border-deep-indigo rounded-2xl p-10 md:p-16 shadow-brutal-lg text-white text-center space-y-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-warning rounded-full border-4 border-deep-indigo opacity-30 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary rounded-full border-4 border-deep-indigo opacity-30 pointer-events-none" />

            <Rocket size={56} className="mx-auto text-warning animate-bounce" />
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black uppercase leading-none tracking-tight max-w-3xl mx-auto">
              Ready To Stop Watching And Start Building?
            </h2>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-body">
              Join 15,000+ ambitious developers and designers leveling up with our tactile, project-first courses today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button 
                  variant="secondary" 
                  className="bg-white text-deep-indigo border-3 border-deep-indigo py-4 px-10 text-base md:text-lg font-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Create Free Account →
                </Button>
              </Link>
              <Link href="/courses">
                <Button 
                  variant="outline" 
                  className="bg-deep-indigo text-white border-3 border-white py-4 px-10 text-base md:text-lg font-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Explore Catalog
                </Button>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/80">
              <span>No credit card required to start</span>
              <span>•</span>
              <span>30-Day money-back guarantee</span>
              <span>•</span>
              <span>Verified Certificates</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-deep-indigo text-white border-t-4 border-deep-indigo pt-16 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b-2 border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary border-3 border-white flex items-center justify-center font-heading font-black text-xl italic text-white shadow-brutal-sm">
                S
              </div>
              <span className="font-heading font-black text-2xl uppercase italic tracking-tight">
                SkillPath
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              The premier modern LMS platform. Tactile, project-first, and built for creators who learn by building.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                All Systems Operational (v1.0)
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-heading font-black text-sm uppercase tracking-wider mb-4 text-warning">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70 font-bold">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Course Catalog</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">Browse Tracks</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Student Onboarding</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Instructor Portal</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-black text-sm uppercase tracking-wider mb-4 text-warning">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70 font-bold">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Design Systems Guide</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">Next.js 15 Starter</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Free Enrollment</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">Community Discord</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-warning">
              Stay In The Loop
            </h4>
            <p className="text-xs text-white/70">
              Get weekly project drops, design token templates, and exclusive course discounts.
            </p>
            {newsletterSubscribed ? (
              <div className="p-3 bg-success/20 border-2 border-success text-success text-xs font-bold rounded">
                You are on the VIP builder list!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 border-2 border-white/20 p-2.5 text-xs text-white rounded outline-none focus:border-primary placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="bg-primary text-white border-2 border-white font-heading font-black text-xs uppercase py-2.5 shadow-brutal-sm hover:bg-warning hover:text-deep-indigo transition-colors"
                >
                  Join Newsletter
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-white/40">
          <div>
            © 2026 SkillPath LMS Platform. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
