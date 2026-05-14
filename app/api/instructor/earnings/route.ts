import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Course from '@/models/Course';
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

    const payments = await Payment.find({ 
      courseId: { $in: courseIds },
      paymentStatus: 'completed'
    }).populate({ path: 'courseId', model: Course, select: 'title price' });

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const platformFee = totalRevenue * 0.2; // 20% platform fee
    const netEarnings = totalRevenue - platformFee;

    return NextResponse.json({
      totalRevenue,
      platformFee,
      netEarnings,
      transactions: payments
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
