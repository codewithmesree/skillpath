import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import User from '@/models/User';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const user: any = await getUserFromCookies();
    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    
    // 1. Get all courses owned by this instructor
    const instructorCourses = await Course.find({ instructorId: user.id });
    const courseIds = instructorCourses.map(c => c._id);

    // 2. Get enrollments for these courses
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate({ path: 'userId', model: User, select: 'name email' })
      .populate({ path: 'courseId', model: Course, select: 'title' });

    return NextResponse.json(enrollments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
