'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useStore } from '@/store/use-store';

export default function Dashboard() {
  const { data: session } = useSession();
  const { role } = useStore();

  if (!session) return <div>Please sign in</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl">Welcome, {session.user?.name}</h2>
      <p>Mode: {role}</p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {role === 'FINDER' ? (
          <>
            <Link href="/create-job" className="p-4 border rounded">
              Create Job
            </Link>
            <Link href="/dashboard/applicants" className="p-4 border rounded">
              Applicants
            </Link>
          </>
        ) : (
          <>
            <Link href="/jobs" className="p-4 border rounded">
              Browse Jobs
            </Link>
            <Link href="/dashboard/saved" className="p-4 border rounded">
              Saved Jobs
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
