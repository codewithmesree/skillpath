import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import { getUserFromCookies } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user: any = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, quizId, score, total } = await req.json();

    await connectDB();
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: user.id, courseId },
      { 
        $push: { quizScores: { quizId, score, total } }
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Quiz submitted successfully', enrollment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
