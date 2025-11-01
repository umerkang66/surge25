'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import JobCard from '@/components/job-card';
import { motion } from 'framer-motion';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.jobs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <input
          placeholder="Search jobs"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
          disabled={loading}
        />
        <Link
          href="/create-job"
          className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-center"
        >
          Create Job
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-12">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">No jobs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map(job => (
            <motion.div
              key={job._id}
              whileHover={{ scale: 1.02 }}
              className="transition-transform"
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
