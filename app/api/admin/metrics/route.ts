import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const user: any = await getUserFromCookies();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Calculate metrics
    const payments = await Payment.find({ paymentStatus: 'completed' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const activeStudents = await User.countDocuments({ role: 'student' });
    
    const courseCompletions = await Enrollment.countDocuments(); // Simplification: counting all enrollments for now

    return NextResponse.json({
      revenue: totalRevenue,
      students: activeStudents,
      completions: courseCompletions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
