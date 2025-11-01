'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, Github, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading('Signing you in...');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      // Handle error from credentials provider
      if (!res || res.error) {
        toast.error(res?.error || 'Invalid email or password.', {
          id: toastId,
        });
      } else {
        toast.success('Signed in successfully!', { id: toastId });
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Catch any unexpected runtime or network error
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubSignIn() {
    const toastId = toast.loading('Redirecting to GitHub...');
    try {
      await signIn('github', { callbackUrl: '/dashboard' });
    } catch {
      toast.error('GitHub sign-in failed. Please try again.', { id: toastId });
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
            <LogIn className="w-10 h-10 text-gray-800 dark:text-gray-100" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <p
            onClick={() => router.push('/auth/reset-request')}
            className="text-sm text-gray-700 dark:text-gray-300 hover:underline cursor-pointer text-right"
          >
            Forgot your password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full py-3 flex items-center justify-center gap-2 font-semibold rounded-lg shadow-md transition-all duration-300 ${
              loading
                ? 'bg-gray-700 dark:bg-gray-300 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mt-6">
          <div className="border-t border-gray-300 dark:border-neutral-700 w-full" />
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">
            or
          </span>
          <div className="border-t border-gray-300 dark:border-neutral-700 w-full" />
        </div>

        {/* GitHub Sign-in */}
        <button
          onClick={handleGithubSignIn}
          disabled={loading}
          className="cursor-pointer w-full py-3 mt-5 flex items-center justify-center gap-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 disabled:opacity-60"
        >
          <Github className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          <span className="text-gray-800 dark:text-gray-100 font-medium">
            Sign in with GitHub
          </span>
        </button>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          Don’t have an account?{' '}
          <span
            onClick={() => router.push('/auth/signup')}
            className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
