import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import Course from '@/models/Course';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const admin: any = await getUserFromCookies();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const payments = await Payment.find({})
      .populate({ path: 'userId', model: User, select: 'name email' })
      .populate({ path: 'courseId', model: Course, select: 'title' })
      .sort({ createdAt: -1 });

    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
