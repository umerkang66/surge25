import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import SavedJob from '@/models/saved-job';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const savedJobs = await SavedJob.find({ userId: session.user.id })
      .populate({
        path: 'jobPostId',
        populate: { path: 'creatorId', select: 'name email image' },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { jobPostId } = await req.json();

    const savedJob = await SavedJob.create({
      userId: session.user.id,
      jobPostId,
    });

    return NextResponse.json({ savedJob }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Job already saved' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { jobPostId } = await req.json();

    await SavedJob.findOneAndDelete({
      userId: session.user.id,
      jobPostId,
    });

    return NextResponse.json({ message: 'Job removed from saved' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove saved job' },
      { status: 500 }
    );
  }
}
