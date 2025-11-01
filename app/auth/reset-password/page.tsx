'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { KeyRound, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate token and email
  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid or missing reset link.');
      router.push('/auth/signin');
    }
  }, [token, email, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      await api.post('/auth/reset-password', { token, email, password });
      toast.success('Password reset successfully!', { id: toastId });
      router.push('/auth/signin');
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to reset password.';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-800"
      >
        <div className="text-center mb-6">
          <KeyRound className="w-10 h-10 text-gray-800 dark:text-gray-100 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Reset Password
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
              loading
                ? 'bg-gray-400 dark:bg-neutral-700 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                Updating...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
