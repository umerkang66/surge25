'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import api from '@/lib/api';
import { KeyRound, User } from 'lucide-react';

export default function MePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // ✅ Show loading screen while session is fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 text-gray-900 dark:text-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="w-10 h-10 border-4 border-gray-400 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // ✅ If user is not logged in
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 text-gray-900 dark:text-gray-100">
        <p className="text-lg">Please sign in to view your profile.</p>
      </div>
    );
  }

  const { user }: any = session;

  // ✅ Handle password change
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        email: user.email,
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success('Password updated successfully');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-gray-100"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={90}
              height={90}
              className="rounded-full border border-gray-300 dark:border-neutral-700 shadow-md mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 mb-4">
              <User className="w-10 h-10 text-gray-600 dark:text-gray-300" />
            </div>
          )}

          <h2 className="text-2xl font-semibold tracking-tight">
            {user.name || 'Unnamed User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-neutral-800 mb-6"></div>

        {/* User Info */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              User ID
            </span>
            <span className="font-mono">{user.id}</span>
          </div>
        </div>

        {!user.image && (
          <>
            {/* Change Password Section */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <KeyRound className="w-5 h-5" />
                Change Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.oldPassword}
                  onChange={e =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={e =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 outline-none focus:border-gray-900 dark:focus:border-gray-300 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200"
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
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
