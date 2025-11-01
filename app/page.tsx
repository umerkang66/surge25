'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 text-center px-6 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto"
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
          CampusConnect — University Talent Finder
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
          Find collaborators, part-time gigs, and startup teammates — all within
          your campus community.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold shadow-md hover:shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Users className="w-5 h-5" />
            Get Started
          </Link>

          <Link
            href="/jobs"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Briefcase className="w-5 h-5" />
            Browse Jobs
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
