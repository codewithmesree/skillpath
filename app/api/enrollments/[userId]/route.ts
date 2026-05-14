import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const enrollments = await Enrollment.find({ userId: params.userId }).populate({
        path: 'courseId',
        model: Course
    });
    return NextResponse.json(enrollments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
