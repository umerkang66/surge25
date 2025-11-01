'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ChatWindow from '@/components/chat-window';

export default function JobDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await api.get(`/job-posts/${id}`);
        setJob(res.data.jobPost);
      } catch (e) {
        console.error(e);
      }
    }

    if (id) fetchJob();
  }, [id]);

  async function apply() {
    try {
      await api.post('/applications', {
        jobPostId: id,
        coverLetter: "Hi, I'm interested",
      });
      toast.success('Applied');
    } catch (err: any) {
      toast.error(err.message || 'Apply failed');
    }
  }

  async function calcMatch() {
    try {
      const res = await api.post('/match-score', { jobPostId: id });
      toast.success(`Match: ${res.data.score}%`);
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    }
  }

  if (!job) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="mt-2">{job.description}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={apply} className="px-4 py-2 border rounded">
          Apply
        </button>
        <button onClick={calcMatch} className="px-4 py-2 border rounded">
          Calculate Match
        </button>
      </div>

      <section className="mt-8">
        <h3 className="font-semibold">Chat with poster</h3>
        <ChatWindow otherUserId={job.creatorId} />
      </section>
    </div>
  );
}
