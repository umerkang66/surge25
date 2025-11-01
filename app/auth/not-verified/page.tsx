'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MailWarning } from 'lucide-react';

export default function NotVerifiedPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);

  async function resendVerification() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success('Verification email sent successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 p-6 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-800 text-center"
      >
        <div className="flex justify-center mb-4">
          <MailWarning className="w-12 h-12 text-yellow-500" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Email Not Verified
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          Your email <strong>{email}</strong> is not verified. Please verify to
          continue.
        </p>

        <button
          onClick={resendVerification}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            loading
              ? 'bg-gray-700 dark:bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </button>

        <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
          Didn’t receive an email? Check your spam folder or click the button
          above to resend.
        </p>
      </motion.div>
    </div>
  );
}
