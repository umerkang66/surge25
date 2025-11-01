'use client';
import Link from 'next/link';

export default function JobCard({ job }: { job: any }) {
  return (
    <article className="border p-4 rounded">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm mt-2 line-clamp-3">{job.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">{job.type}</div>
        <Link
          href={`/jobs/${job._id}`}
          className="text-sm px-3 py-1 border rounded"
        >
          View
        </Link>
      </div>
    </article>
  );
}
