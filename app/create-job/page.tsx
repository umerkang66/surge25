'use client';

import JobForm from '@/components/job-form';
import { motion } from 'framer-motion';

export default function CreateJob() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Create Job / Opportunity
        </h1>

        <JobForm />
      </motion.div>
    </div>
  );
}
