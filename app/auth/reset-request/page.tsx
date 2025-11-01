'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function ResetRequestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Sending reset link...');
    try {
      await api.post('/auth/reset-request', { email });
      toast.success('Reset link sent to your email!', { id: toastId });
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send reset link', {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-800"
      >
        <div className="text-center mb-6">
          <Mail className="w-10 h-10 mx-auto text-gray-800 dark:text-gray-100 mb-2" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Reset your password
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your registered email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 ${
              loading
                ? 'bg-gray-400 dark:bg-neutral-700 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p
          onClick={() => router.push('/auth/signin')}
          className="text-sm text-center text-gray-700 dark:text-gray-300 hover:underline cursor-pointer mt-4"
        >
          Back to Sign In
        </p>
      </motion.div>
    </div>
  );
}
