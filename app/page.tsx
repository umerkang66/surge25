import Link from 'next/link';

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto text-center py-24">
      <h1 className="text-4xl font-bold mb-4">
        CampusConnect — University Talent Finder
      </h1>
      <p className="mb-6">
        Find collaborators, part-time gigs, startup teammates and more — within
        your campus.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/auth/signin" className="px-6 py-3 border rounded">
          Get Started
        </Link>
        <Link href="/jobs" className="px-6 py-3 border rounded">
          Browse Jobs
        </Link>
      </div>
    </section>
  );
}
