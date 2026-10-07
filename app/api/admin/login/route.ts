import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const BUILTIN_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@skillpath.dev').trim().toLowerCase();
    const BUILTIN_ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'admin123').trim();

    const inputEmail = email.trim().toLowerCase();
    const inputPassword = (password || '').trim();
    const isBuiltinMatch = (inputEmail === BUILTIN_ADMIN_EMAIL && inputPassword === BUILTIN_ADMIN_PASSWORD);

    if (isBuiltinMatch) {
      let adminId = '000000000000000000000001';
      let adminName = 'System Administrator';

      try {
        await connectDB();
        let adminUser = await User.findOne({ email: BUILTIN_ADMIN_EMAIL });
        if (!adminUser) {
          const hashedPassword = await bcrypt.hash(BUILTIN_ADMIN_PASSWORD, 12);
          adminUser = await User.create({
            name: 'System Administrator',
            email: BUILTIN_ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
            plan: 'enterprise',
          });
        } else if (adminUser.role !== 'admin') {
          adminUser.role = 'admin';
          await adminUser.save();
        }

        if (adminUser) {
          adminId = adminUser._id.toString();
          adminName = adminUser.name || 'System Administrator';
        }
      } catch (dbErr) {
        console.warn('Database note during built-in admin auth:', dbErr);
      }

      // Generate Admin JWT Token
      const token = signToken({
        id: adminId,
        email: BUILTIN_ADMIN_EMAIL,
        role: 'admin',
        name: adminName,
        plan: 'enterprise',
      });

      const response = NextResponse.json({
        message: 'Admin authorization granted',
        user: {
          id: adminId,
          name: adminName,
          email: BUILTIN_ADMIN_EMAIL,
          role: 'admin',
        }
      }, { status: 200 });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    }

    // For non-builtin accounts, verify against database
    try {
      await connectDB();
      const userRecord = await User.findOne({ email: inputEmail });
      
      if (!userRecord) {
        return NextResponse.json(
          { error: 'Admin account not recognized. Use built-in credentials: admin@skillpath.dev / admin123 (or click Autofill). Students & Instructors please log in at /login.' }, 
          { status: 401 }
        );
      }

      if (userRecord.role !== 'admin') {
        return NextResponse.json(
          { error: `Access Denied: This account is registered as '${userRecord.role}', not an administrator. Please log in at the main login page (/login).` }, 
          { status: 403 }
        );
      }

      const isPasswordValid = await bcrypt.compare(inputPassword, userRecord.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Security credentials invalid. Please check your password or use admin@skillpath.dev / admin123.' }, 
          { status: 401 }
        );
      }

      // Generate Admin JWT Token
      const token = signToken({
        id: userRecord._id,
        email: userRecord.email,
        role: 'admin',
        name: userRecord.name || 'System Admin',
        plan: userRecord.plan || 'enterprise',
      });

      const response = NextResponse.json({
        message: 'Admin authorization granted',
        user: {
          id: userRecord._id,
          name: userRecord.name,
          email: userRecord.email,
          role: 'admin',
        }
      }, { status: 200 });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    } catch {
      return NextResponse.json(
        { error: 'Unauthorized: Security credentials invalid or non-admin account.' }, 
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}
