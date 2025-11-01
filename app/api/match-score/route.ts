import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import JobPost from '@/models/post';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { jobPostId } = await req.json();

    const user = await User.findById(session.user.id);
    const job = await JobPost.findById(jobPostId);

    if (!user || !job) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const score = calculateMatchScore(user, job);

    return NextResponse.json({ score });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate match score' },
      { status: 500 }
    );
  }
}

function calculateMatchScore(user: any, job: any): number {
  let score = 0;
  let totalWeight = 0;

  // Skills matching (40% weight)
  const skillsWeight = 40;
  const userSkills = user.skills.map((s: string) => s.toLowerCase());
  const jobTags = job.tags.map((t: string) => t.toLowerCase());
  const jobRequirements = job.requirements.map((r: string) => r.toLowerCase());

  const allJobSkills = [...new Set([...jobTags, ...jobRequirements])];

  if (allJobSkills.length > 0) {
    const matchedSkills = userSkills.filter((skill: string) =>
      allJobSkills.some(
        jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );
    score += (matchedSkills.length / allJobSkills.length) * skillsWeight;
  }
  totalWeight += skillsWeight;

  // Interests matching (30% weight)
  const interestsWeight = 30;
  const userInterests = user.interests.map((i: string) => i.toLowerCase());

  if (jobTags.length > 0 && userInterests.length > 0) {
    const matchedInterests = userInterests.filter((interest: string) =>
      jobTags.some(
        (tag: any) => tag.includes(interest) || interest.includes(tag)
      )
    );
    score +=
      (matchedInterests.length /
        Math.max(jobTags.length, userInterests.length)) *
      interestsWeight;
  }
  totalWeight += interestsWeight;

  // Profile completeness (20% weight)
  const completenessWeight = 20;
  let completeness = 0;
  if (user.bio) completeness += 0.25;
  if (user.skills.length > 0) completeness += 0.25;
  if (user.interests.length > 0) completeness += 0.25;
  if (user.resume) completeness += 0.25;
  score += completeness * completenessWeight;
  totalWeight += completenessWeight;

  // University/major relevance (10% weight)
  const universityWeight = 10;
  if (user.university || user.major) {
    score += universityWeight;
  }
  totalWeight += universityWeight;

  return Math.min(Math.round((score / totalWeight) * 100), 100);
}
