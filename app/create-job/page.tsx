'use client';
import JobForm from '@/components/job-form';

export default function CreateJob() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">Create Job / Opportunity</h2>
      <JobForm />
    </div>
  );
}
