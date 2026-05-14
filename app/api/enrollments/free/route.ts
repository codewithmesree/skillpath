import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import { getUserFromCookies } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const user: any = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required.' }, { status: 400 });
    }

    await connectDB();

    // Re-verify plan from DB to be safe
    const dbUser = await User.findById(user.id);
    if (!dbUser || (dbUser.plan !== 'pro' && dbUser.plan !== 'enterprise')) {
      return NextResponse.json({ error: 'This feature requires a Pro or Enterprise plan.' }, { status: 403 });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId: user.id, courseId });
    if (existing) {
      return NextResponse.json({ message: 'Already enrolled.' });
    }

    // Create Enrollment
    const enrollment = await Enrollment.create({
      userId: user.id,
      courseId,
      progress: 0,
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    console.error("Free Enrollment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
