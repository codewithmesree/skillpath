import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await connectDB();
      const User = (await import('@/models/User')).default;
      
      // Get order details from Razorpay to check notes
      const order = await (await import('@/lib/razorpay')).default.orders.fetch(razorpay_order_id);
      
      if (order.notes && order.notes.planName) {
        // Handle Plan Upgrade
        await User.findByIdAndUpdate(order.notes.userId, { 
          plan: String(order.notes.planName).toLowerCase() 
        });
        return NextResponse.json({ message: "Plan upgraded successfully" });
      }

      // Handle Course Enrollment
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentStatus: 'completed', 
          transactionId: razorpay_payment_id 
        },
        { new: true }
      );

      if (payment) {
        await Enrollment.create({
          userId: payment.userId,
          courseId: payment.courseId,
          progress: 0,
        });
      }

      return NextResponse.json({ message: "Payment verified successfully" });
    } else {

      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
