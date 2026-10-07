import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import { getUserFromCookies } from '@/lib/auth';
import { notifyAdmins, EVENTS } from '@/lib/pusher';

const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const course = await Course.findById(id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Unapproved courses are only visible to admins and the owning instructor
    if (course.status !== 'approved') {
      const user: any = await getUserFromCookies();
      const isOwner = user?.role === 'instructor' && course.instructorId?.toString() === user.id;
      if (user?.role !== 'admin' && !isOwner) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    }
    
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user: any = await getUserFromCookies();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    await connectDB();
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const isInstructorOwner = user.role === 'instructor' && (
      existingCourse.instructorId?.toString() === user.id ||
      existingCourse.instructor?.trim().toLowerCase() === user.name?.trim().toLowerCase() ||
      existingCourse.instructor?.toLowerCase().includes(user.name?.toLowerCase())
    );
    const isAdmin = user.role === 'admin';

    if (!isAdmin && !isInstructorOwner) {
      return NextResponse.json({ error: 'Forbidden. You can only update your own courses.' }, { status: 403 });
    }

    const data = await req.json();

    // Action: Add study material (PPT, Video, Slides, Notes, Quiz)
    if (data.action === 'addMaterial' && data.material) {
      const materialWithId = {
        ...data.material,
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
      };

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { $push: { materials: materialWithId } },
        { new: true, runValidators: false }
      );
      return NextResponse.json(updatedCourse);
    }

    // Action: Delete a study material
    if (data.action === 'removeMaterial' && data.materialId) {
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { $pull: { materials: { _id: data.materialId } } },
        { new: true }
      );
      return NextResponse.json(updatedCourse);
    }

    // Action: Add quiz
    if (data.action === 'addQuiz' && data.quiz) {
      const quizWithId = {
        ...data.quiz,
        _id: new mongoose.Types.ObjectId(),
      };
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { $push: { quizzes: quizWithId } },
        { new: true, runValidators: false }
      );
      return NextResponse.json(updatedCourse);
    }

    // Action: Remove quiz
    if (data.action === 'removeQuiz' && data.quizId) {
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { $pull: { quizzes: { _id: data.quizId } } },
        { new: true }
      );
      return NextResponse.json(updatedCourse);
    }

    // Action: Instructor resubmits a rejected course for review
    if (data.action === 'resubmit') {
      if (existingCourse.status !== 'rejected') {
        return NextResponse.json({ error: 'Only rejected courses can be resubmitted.' }, { status: 400 });
      }
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { $set: { status: 'pending' } },
        { new: true }
      );
      await notifyAdmins(EVENTS.COURSE_SUBMITTED, {
        _id: id,
        title: updatedCourse.title,
        category: updatedCourse.category,
        price: updatedCourse.price,
        instructor: updatedCourse.instructor,
        status: 'pending',
        resubmitted: true,
        createdAt: updatedCourse.createdAt,
      });
      return NextResponse.json(updatedCourse);
    }

    // Standard field updates. Never let clients reassign ownership.
    const { status, instructorId, _id, action, ...fields } = data;
    const update: Record<string, unknown> = { ...fields };

    // Only admins can approve / reject
    if (status !== undefined) {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Only admins can change course status.' }, { status: 403 });
      }
      if (!ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
      }
      update.status = status;
    }

    const course = await Course.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (status !== undefined && status !== existingCourse.status) {
      // Keeps every open admin dashboard in sync
      await notifyAdmins(EVENTS.COURSE_STATUS_UPDATED, {
        _id: id,
        title: course.title,
        status,
      });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user: any = await getUserFromCookies();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectDB();
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const isInstructorOwner = user.role === 'instructor' && (
      existingCourse.instructorId?.toString() === user.id ||
      existingCourse.instructor?.toLowerCase() === user.name?.toLowerCase()
    );
    const isAdmin = user.role === 'admin';

    if (!isAdmin && !isInstructorOwner) {
      return NextResponse.json({ error: 'Forbidden. Admins or course owner only.' }, { status: 403 });
    }

    await Course.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
