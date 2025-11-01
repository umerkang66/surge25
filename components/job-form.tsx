'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function JobForm({ initial }: { initial?: any } = {}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'INTERNSHIP',
    tags: '',
    requirements: '',
  });
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      };
      await api.post('/job-posts', payload);
      toast.success('Job created');
      router.push('/jobs');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="w-full p-3 border rounded"
      />
      <textarea
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        className="w-full p-3 border rounded h-36"
      />
      <input
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
        placeholder="tags (comma separated)"
        className="w-full p-3 border rounded"
      />
      <input
        value={form.requirements}
        onChange={e => setForm({ ...form, requirements: e.target.value })}
        placeholder="requirements (comma separated)"
        className="w-full p-3 border rounded"
      />
      <button className="px-4 py-2 bg-black text-white rounded">Publish</button>
    </form>
  );
}
