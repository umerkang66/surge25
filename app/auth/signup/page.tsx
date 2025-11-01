'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { UserPlus, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    university: '',
    major: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    const toastId = toast.loading('Creating your account...');

    try {
      const res = await api.post('/auth/signup', form);
      toast.success('Account created successfully — please sign in!', {
        id: toastId,
      });
      router.push('/auth/signin');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Signup failed. Please try again.';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center p-6 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-800 transition-colors"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <UserPlus className="w-10 h-10 text-gray-800 dark:text-gray-100" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            Create your account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Join the community — it only takes a minute
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {[
            { key: 'name', placeholder: 'Full name' },
            { key: 'email', placeholder: 'Email', type: 'email' },
            { key: 'password', placeholder: 'Password', type: 'password' },
            { key: 'university', placeholder: 'University' },
            { key: 'major', placeholder: 'Major' },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              type={type || 'text'}
              placeholder={placeholder}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 flex items-center justify-center gap-2 font-semibold rounded-lg shadow-md transition-all duration-300 ${
              loading
                ? 'bg-gray-700 dark:bg-gray-300 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/auth/signin')}
            className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </motion.div>
    </div>
  );
}
