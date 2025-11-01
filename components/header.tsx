'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useStore } from '@/store/use-store';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const { role, toggleRole } = useStore();

  console.log(session);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-neutral-900/70 border-b border-gray-200 dark:border-neutral-800 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-lg hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <GraduationCap className="w-6 h-6" />
          <span>CampusConnect</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/jobs"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm font-medium"
          >
            Jobs
          </Link>

          {session?.user ? (
            <>
              <button
                onClick={toggleRole}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-200"
              >
                {role}
              </button>

              <Link
                href="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>

              <Link
                href="/me"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm font-medium"
              >
                Me
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-md"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-md"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
