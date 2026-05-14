import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import Link from 'next/link';

interface CourseCardProps {
  courseId: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  image?: string;
  progress?: number;
}

export const CourseCard = ({ courseId, title, category, instructor, rating, image, progress }: CourseCardProps) => {
  return (
    <Card hover className="w-full max-w-[340px] flex flex-col gap-4 border-3 border-deep-indigo bg-white group">
      <div className="w-full h-[180px] bg-secondary border-b-3 border-deep-indigo rounded-t-sm flex items-center justify-center overflow-hidden relative">
         <img 
           src={image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
           alt={title}
           className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
         />
         <div className="absolute top-2 right-2 bg-white border-2 border-deep-indigo px-2 py-0.5 text-[10px] font-bold uppercase">
           {category}
         </div>
      </div>
      
      <div className="px-2 flex flex-col gap-2">
        <h3 className="font-heading font-bold text-xl leading-tight text-deep-indigo line-clamp-1">{title}</h3>
        <p className="text-xs font-bold opacity-60 uppercase tracking-widest">by {instructor}</p>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="text-warning">★</span>
          <span className="font-bold text-sm">{rating}</span>
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
             <Link href={`/dashboard/learn/${courseId}`}>
               <Button variant="primary" className="w-full py-2.5 text-xs font-black uppercase tracking-tighter shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                 Continue Learning
               </Button>
             </Link>
          </div>
        ) : (
          <Link href={`/courses/${courseId}`}>
            <Button variant="primary" className="w-full py-2.5 text-xs font-black uppercase tracking-tighter shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
              Enroll Now
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

