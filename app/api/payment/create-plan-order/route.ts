import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';
import { getUserFromCookies } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user: any = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planName, amount } = await req.json();

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `plan_receipt_${Date.now()}`,
      notes: {
        planName,
        userId: user.id
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
