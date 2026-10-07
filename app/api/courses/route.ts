import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User'; 
import Course from '@/models/Course';
import { getUserFromCookies } from '@/lib/auth';
import { notifyAdmins, EVENTS } from '@/lib/pusher';

export async function GET(req: Request) {
  try {
    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("Courses DB connection error:", dbErr.message);
      return NextResponse.json([]);
    }

    const user: any = await getUserFromCookies();
    const { searchParams } = new URL(req.url);
    const myCoursesOnly = searchParams.get('myCourses') === 'true';
    
    // Default: students and visitors only see admin-approved courses
    let query: any = { status: 'approved' };
    
    if (user) {
      const mongoose = (await import('mongoose')).default;
      if (user.role === 'admin') {
        query = {};
      } else if (user.role === 'instructor' && myCoursesOnly) {
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
          enrollmentsCount: { $size: '$enrollments' },
          lessonsCount: { $size: { $ifNull: ['$lessons', []] } }
        }
      },
      {
        $project: {
          enrollments: 0,
          materials: 0,
          lessons: 0,
          quizzes: 0
        }
      }
    ]);

    // Populate instructorId manually since aggregate doesn't support populate directly
    const populatedCourses = await User.populate(courses, { path: 'instructorId', select: 'name' });

    const headers = new Headers();
    if (!myCoursesOnly && (!user || user.role === 'student')) {
      headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
    }

    return NextResponse.json(populatedCourses, { headers });
  } catch (error: any) {
    console.error("GET /api/courses error:", error.message);
    if (error.name === 'MongooseServerSelectionError' || error.message?.includes('SSL alert')) {
      return NextResponse.json([]);
    }
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
      // Every new course must be reviewed by an admin before it goes live
      status: 'pending'
    });

    await notifyAdmins(EVENTS.COURSE_SUBMITTED, {
      _id: course._id.toString(),
      title: course.title,
      category: course.category,
      price: course.price,
      instructor: instructorName,
      thumbnail: course.thumbnail && !course.thumbnail.startsWith('data:') ? course.thumbnail : undefined,
      status: course.status,
      createdAt: course.createdAt,
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

