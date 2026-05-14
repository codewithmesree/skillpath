import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';
import { getUserFromCookies } from '@/lib/auth';
import Payment from '@/models/Payment';

export async function POST(req: Request) {
  try {
    const user: any = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();

    await connectDB();
    const Course = (await import('@/models/Course')).default;
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const amount = course.price;

    // CHECK IF USER HAS PAID PLAN
    if (user.plan === 'pro' || user.plan === 'enterprise') {
      // Direct enrollment
      const Enrollment = (await import('@/models/Enrollment')).default;
      const existing = await Enrollment.findOne({ userId: user.id, courseId });
      
      if (!existing) {
        await Enrollment.create({
          userId: user.id,
          courseId,
          progress: 0
        });
      }
      
      return NextResponse.json({ free: true, message: 'Enrolled for free via your plan!' });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);


    await Payment.create({
      userId: user.id,
      courseId,
      amount,
      orderId: order.id,
      paymentStatus: 'pending',
    });


    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
