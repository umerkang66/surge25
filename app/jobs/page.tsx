'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import JobCard from '@/components/job-card';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.jobPosts || []);
      } catch (e) {
        console.error(e);
      }
    }

    fetchJobs();
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input
          placeholder="Search jobs"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="p-2 border rounded"
        />
        <Link href="/create-job" className="px-4 py-2 border rounded">
          Create Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}
