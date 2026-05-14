import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import { getUserFromCookies } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const user: any = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, lessonId, progress } = await req.json();

    await connectDB();
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: user.id, courseId },
      { 
        $addToSet: { completedLessons: lessonId },
        $set: { progress: progress }
      },
      { new: true }
    );

    return NextResponse.json(enrollment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
