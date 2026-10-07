import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("Login DB connection error:", dbErr);
      return NextResponse.json({ 
        error: "Database unreachable. Please ensure your current IP (49.206.9.86) or '0.0.0.0/0' is added to your MongoDB Atlas IP Access List (Network Access)." 
      }, { status: 503 });
    }

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name, plan: user.plan });

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan }
    }, { status: 200 });


    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error.name === 'MongooseServerSelectionError' || error.message?.includes('SSL alert') || error.message?.includes('whitelist')) {
      return NextResponse.json({ 
        error: "Database connection rejected: Your current IP (49.206.9.86) is not whitelisted in MongoDB Atlas. Please go to MongoDB Atlas -> Network Access and add 49.206.9.86 or '0.0.0.0/0'." 
      }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
