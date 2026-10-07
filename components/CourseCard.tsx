import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface CourseCardProps {
  courseId?: string;
  _id?: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  image?: string;
  thumbnail?: string;
  price?: number;
  lessons?: any[];
  lessonsCount?: number;
  progress?: number;
}

export const CourseCard = ({ 
  courseId, 
  _id, 
  title, 
  category, 
  instructor, 
  rating, 
  image, 
  thumbnail, 
  price, 
  lessons, 
  lessonsCount, 
  progress 
}: CourseCardProps) => {
  const targetId = courseId || _id || 'featured';
  const displayImage = image || thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
  const countOfLessons = lessonsCount !== undefined ? lessonsCount : (lessons ? lessons.length : undefined);

  return (
    <Card hover className="w-full flex flex-col gap-4 border-3 border-deep-indigo bg-white group shadow-brutal hover:shadow-[6px_6px_0px_#2D1B69] transition-all">
      <div className="w-full h-[180px] bg-secondary border-b-3 border-deep-indigo rounded-t-sm flex items-center justify-center overflow-hidden relative">
         <img 
           src={displayImage} 
           alt={title || "Course thumbnail"}
           loading="lazy"
           decoding="async"
           width={400}
           height={225}
           className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
         />
         <div className="absolute top-2 right-2 bg-white border-2 border-deep-indigo px-2 py-0.5 text-[10px] font-bold uppercase shadow-brutal-sm">
           {category}
         </div>
         {price !== undefined && (
           <div className="absolute bottom-2 left-2 bg-warning border-2 border-deep-indigo px-2 py-0.5 text-xs font-black uppercase text-deep-indigo shadow-brutal-sm">
             {price === 0 ? 'FREE' : `₹${price}`}
           </div>
         )}
      </div>
      
      <div className="px-2 flex flex-col gap-2">
        <h3 className="font-heading font-bold text-xl leading-tight text-deep-indigo line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs font-bold opacity-60 uppercase tracking-widest">by {instructor}</p>
        
        <div className="flex items-center justify-between mt-1 text-xs font-bold">
          <div className="flex items-center gap-1">
            <Star size={13} fill="currentColor" className="text-warning" />
            <span className="font-bold text-sm text-deep-indigo">{rating || 4.8}</span>
          </div>
          {countOfLessons !== undefined && (
            <span className="text-[11px] opacity-70 bg-secondary/50 px-2 py-0.5 border border-deep-indigo/30 rounded">
              {countOfLessons} Lessons
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto px-2 pb-2">
        {progress !== undefined ? (
          <div className="space-y-4">
             <div className="space-y-1.5">
               <div className="w-full h-3 bg-secondary border-2 border-deep-indigo rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${progress}%` }}
                  />
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase opacity-50">{progress}% Complete</span>
                 <span className="text-[10px] font-bold uppercase text-primary">Resume</span>
               </div>
             </div>
             <Link href={`/dashboard/learn/${targetId}`}>
               <Button variant="primary" className="w-full py-2.5 text-xs font-black uppercase tracking-tighter shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                 Continue Learning
               </Button>
             </Link>
          </div>
        ) : (
          <Link href={`/courses/${targetId}`}>
            <Button variant="primary" className="w-full py-2.5 text-xs font-black uppercase tracking-tighter shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
              Enroll Now
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

