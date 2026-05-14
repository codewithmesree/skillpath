"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';

export default function CourseDetails() {
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!params || !params.id) return;
    
    const fetchData = async () => {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;

      try {
        // Fetch course
        const courseRes = await fetch(`/api/courses/${id}`);
        const courseData = await courseRes.json();
        if (courseData) setCourse(courseData);

        // Fetch user & enrollment status
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();
        
        if (userData.user) {
          setUser(userData.user);
          const enrollRes = await fetch(`/api/enrollments/${userData.user.id}`);
          const enrollments = await enrollRes.json();
          if (Array.isArray(enrollments)) {
            const enrolled = enrollments.some((e: any) => 
              e.courseId && (e.courseId._id || e.courseId) === id
            );
            setIsEnrolled(enrolled);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);


  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isEnrolled) {
      router.push(`/dashboard/learn/${course._id}`);
      return;
    }

    // Logic for Pro/Enterprise users (Free Enrollment)
    if (user.plan === 'pro' || user.plan === 'enterprise') {
      setEnrolling(true);
      try {
        const res = await fetch('/api/enrollments/free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: course._id }),
        });
        
        if (res.ok) {
          setIsEnrolled(true);
          router.push(`/dashboard/learn/${course._id}`);
        } else {
          const data = await res.json();
          throw new Error(data.error || 'Enrollment failed');
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        setEnrolling(false);
      }
      return;
    }

    setEnrolling(true);
    try {
      // 1. Create order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id, amount: course.price }),
      });
      const order = await orderRes.json();

      if (!orderRes.ok) throw new Error(order.error || 'Failed to create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SkillPath",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            setIsEnrolled(true);
            router.push(`/dashboard/learn/${course._id}`);
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#9D7BFF",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20">Loading Course...</div>
  if (!course) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center">Course not found.</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <main className="flex-grow">
        {/* Course Hero */}
        <section className="bg-primary py-16 md:py-24 px-6 md:px-12 border-b-3 border-deep-indigo">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
               <span className="bg-white border-2 border-deep-indigo rounded-lg px-4 py-1.5 font-bold text-deep-indigo uppercase tracking-wider text-sm shadow-brutal">{course.category}</span>
               <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">{course.title}</h1>
               <p className="text-xl text-white opacity-90 max-w-xl">{course.description}</p>
               
               <div className="flex items-center gap-6 pt-4">
                 <div className="flex items-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-secondary border-2 border-white"></div>
                   <span className="font-bold text-white">{course.instructor}</span>
                 </div>
                 <div className="flex items-center gap-1 text-white">
                   <span className="text-warning">★</span>
                   <span className="font-bold">{course.rating} (Live Data)</span>
                 </div>
               </div>
            </div>
            
            <div className="w-full md:w-[400px]">
               <Card className="border-3 p-8 space-y-6 bg-white shadow-brutal-lg">
                  <div className="text-4xl font-heading font-bold text-deep-indigo">${course.price}</div>
                  <div className="space-y-4">
                    <Button 
                variant="primary" 
                className="w-full py-5 text-xl font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 
                 isEnrolled ? 'Go to Course' :
                 (user?.plan === 'pro' || user?.plan === 'enterprise' ? 'Enroll for Free (Pro)' : `Enroll Now — ₹${course.price}`)}
              </Button>
                    <Button variant="secondary" className="w-full py-4 text-lg">Add to Wishlist</Button>
                  </div>
                  <p className="text-center text-xs opacity-50 font-bold uppercase tracking-widest">30-Day Money-Back Guarantee</p>
               </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-bold text-deep-indigo uppercase">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Core principles", "Mastering tools", "Custom components", "Clashing colors", "Impact & Readability"].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-dark-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-bold text-deep-indigo uppercase">Syllabus</h2>
              <div className="space-y-3">
                {course.lessons?.map((lesson: any, i: number) => (
                  <div key={i} className="bg-white border-2 border-deep-indigo p-4 rounded-md flex justify-between items-center hover:bg-secondary/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-secondary border-2 border-deep-indigo flex items-center justify-center font-bold text-sm">{i + 1}</span>
                      <span className="font-bold text-deep-indigo">{lesson.title}</span>
                    </div>
                    <span className="text-sm opacity-50 group-hover:opacity-100 font-bold">{lesson.duration || '15:00'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructor Sidebar */}
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-bold text-deep-indigo uppercase">Instructor</h2>
            <Card className="bg-secondary/20">
               <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-24 h-24 rounded-full bg-primary border-3 border-deep-indigo shadow-brutal"></div>
                 <div className="space-y-1">
                   <h3 className="font-heading font-bold text-xl">{course.instructor}</h3>
                   <p className="text-sm opacity-70">Senior Product Designer & Artist</p>
                 </div>
                 <p className="text-sm">{course.instructor} has spent years breaking the rules of traditional design to create unique digital experiences.</p>
               </div>
            </Card>
          </div>
        </section>
      </main>
      <footer className="bg-deep-indigo text-white py-12 px-6 text-center border-t-4 border-primary">
        <p className="font-heading font-bold uppercase tracking-widest opacity-50 text-xs">SkillPath © 2026 — Designed for impact</p>
      </footer>
    </div>
  );
}

