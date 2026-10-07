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
      console.error("Register DB connection error:", dbErr);
      return NextResponse.json({ 
        error: "Database unreachable. Please ensure your current IP (49.206.9.86) or '0.0.0.0/0' is added to your MongoDB Atlas IP Access List (Network Access)." 
      }, { status: 503 });
    }

    const { name, email, password, role } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    // Public registration only allows student or instructor
    const assignedRole = role === 'instructor' ? 'instructor' : 'student';
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name, plan: user.plan });

    const response = NextResponse.json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan }
    }, { status: 201 });


    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}