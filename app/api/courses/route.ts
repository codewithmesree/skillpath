import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User'; 
import Course from '@/models/Course';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const user: any = await getUserFromCookies();
    
    let query: any = { status: 'approved' };
    
    if (user) {
      const mongoose = (await import('mongoose')).default;
      if (user.role === 'admin') {
        query = {};
      } else if (user.role === 'instructor') {
        query = { instructorId: new mongoose.Types.ObjectId(user.id) };
      }
    }

    const courses = await Course.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'courseId',
          as: 'enrollments'
        }
      },
      {
        $addFields: {
          enrollmentsCount: { $size: '$enrollments' }
        }
      },
      { $project: { enrollments: 0 } }
    ]);

    // Populate instructorId manually since aggregate doesn't support populate directly
    const populatedCourses = await User.populate(courses, { path: 'instructorId', select: 'name' });

    return NextResponse.json(populatedCourses);
  } catch (error: any) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user: any = await getUserFromCookies();
    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'Only instructors can create courses.' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();
    
    // Auto-fill instructor name if not provided
    const instructorName = data.instructor || user.name || 'Unknown Instructor';

    const course = await Course.create({
      ...data,
      instructor: instructorName,
      instructorId: user.id,
      status: user.role === 'admin' ? 'approved' : 'pending'
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

